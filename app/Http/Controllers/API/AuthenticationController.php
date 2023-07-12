<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Role;
use App\Models\Profile;
use App\Models\PasswordReset;
use Illuminate\Notifications\Notifiable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\OneTimeTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Support\Facades\Password;
use App\Notifications\ResetPassword;
use Illuminate\Support\Carbon;
use Illuminate\Support\Arr;
use App\Traits\UserTrait;
use App\Traits\ValidationTrait;
use App\Traits\iMMAPerTrait;
use App\Traits\SBPMemberTrait;
use App\Rules\NotImmap;
use App\Rules\StrongPassword;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticationController extends Controller
{

    use SendsPasswordResetEmails, Notifiable, ValidationTrait, iMMAPerTrait, UserTrait, SBPMemberTrait;

    protected function generateUserData(User $user, Array $immap_offices, $rememberMe = false) {
        $expiredAt = new \DateTime();
        $expiredAtRemember = new \DateTime();
        $minutesToAdd = config('jwt.cookie_token_time');
        $minutesToAddRefresh = $rememberMe ? config('jwt.cookie_refresh_token_long_time') : config('jwt.cookie_refresh_token_time');
        $expiredAt->modify("+" . $minutesToAdd ." minutes");
        $expiredAt->setTimeZone(new \DateTimeZone('UTC'));
        $expiredAt = $expiredAt->format('Y-m-d H:i:s');

        $expiredAtRemember->modify("+" . $minutesToAddRefresh ." minutes");
        $expiredAtRemember->setTimeZone(new \DateTimeZone('UTC'));
        $expiredAtRemember = $expiredAtRemember->format('Y-m-d H:i:s');

        $isIMMAPER = $this->checkIMMAPerFromSelectedUser($user);
        return [
            'data' => $user,
            'permissions' => $user->getPermissionsViaRoles()->unique('name')->pluck('name'),
            'isVerified' => ($user->hasVerifiedEmail()) ? true : false,
            'p11Completed' => ($user->p11Completed == 1) ? true : false,
            'isIMMAPER' => $isIMMAPER,
            'isSbpRosterMember' => $this->isAcceptedSbpRosterMemberFromSelectedUser($user),
            'iMMAPFamily' => $this->checkPartOfIMMAPFromSelectedUser($user),
            'isLineManager' => $isIMMAPER && count($user->staff) > 0,
            'offices' => $immap_offices,
            'expiredAt' => $expiredAt,
            'expiredAtRemember' => $expiredAtRemember,
            'isUnderSurgeProgram' => $user->profile->under_sbp_program == 1 ? true : false,
        ];
    }

    protected function generateTokenData(User $user) {
        return [
            'data' => [
                'id' => $user->id,
                'email' => $user->email,
                'fullname' => $user->fullname
                ]
            ];
    }

    protected function generateRefreshTokenData(User $user) {
        return [
            'data' => [
                'id' => $user->id,
                ]
            ];
    }

    protected function setUpImmapOfficesForToken(User $user) {
        $role_id = $user->roles->first()->id;
        return Role::findOrFail($role_id)->immap_offices->pluck('id')->toArray();
    }

    /**
     * @SWG\Post(
     *   path="/api/login",
     *   tags={"Auth"},
     *   summary="Login",
     *   description="File: app\Http\Controllers\API\AuthenticationController@login",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="login",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"email", "password"},
     *          @SWG\Property(property="email", type="string", format="email", description="User email", example="johndoe@mail.com"),
     *          @SWG\Property(property="password", type="string", description="User password", example="Pass-123!"),
     *          @SWG\Property(property="remember", type="integer", enum={0,1}, description="Remember me / not", example=0)
     *      )
     *   )
     * )
     */
    public function login(Request $request)
    {
        $validatedData = $this->validate($request, [
            'email' => 'required|string|email',
            'password' => [
                'required',
                'string',
                'min:8'
            ],
            'remember' => 'sometimes|nullable|boolean'
        ]);

        $user = User::where('email', $request->email)->first();

        if (empty($user)) {
            return response()->not_found();
        }

        if ($user->status == 'Hidden') {
            return response()->not_found();
        }

        $user->timestamps = false;
        $user->fill(['last_login_at' => date('Y-m-d H:i:s')])->save();
        $user->timestamps = true;


        $userData = $this->generateUserData($user, $this->setUpImmapOfficesForToken($user), $request->remember);
        $tokenData = $this->generateTokenData($user);
        $refreshTokenData = $this->generateRefreshTokenData($user);

        if ($user && Hash::check($request->password, $user->password)) {
            $cookieTime = config('jwt.cookie_token_time');
            $token = auth()->setTTL($cookieTime)->claims($tokenData)->attempt($request->only('email', 'password'));
            if(!$token) {
                return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
            }
            if ($request->remember) {
                if (!$refreshToken = auth()->setTTL(config('jwt.cookie_refresh_token_long_time'))->claims($refreshTokenData)->attempt($request->only('email', 'password'))) {
                    return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
                }
            } else {
                if (!$refreshToken = auth()->setTTL(config('jwt.cookie_refresh_token_time'))->claims($refreshTokenData)->attempt($request->only('email', 'password')))
                {
                    return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => __('auth.success.login'),
                'data' => $userData,
                'refreshToken' => $refreshToken,
            ])->withCookie(cookie('token', $token, $cookieTime));
        }

        return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
    }

        /**
     * @SWG\Post(
     *   path="/api/refresh",
     *   tags={"Auth"},
     *   summary="Refresh token",
     *   description="File: app\Http\Controllers\API\AuthenticationController@login",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="login",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"email", "password"},
     *          @SWG\Property(property="email", type="string", format="email", description="User email", example="johndoe@mail.com"),
     *          @SWG\Property(property="password", type="string", description="User password", example="Pass-123!"),
     *          @SWG\Property(property="remember", type="integer", enum={0,1}, description="Remember me / not", example=0)
     *      )
     *   )
     * )
     */
    public function refresh(Request $request)
    {
        $validatedData = $this->validate($request, [
            'refreshToken' => 'required|string',
        ]);

        try {
            JWTAuth::setToken($validatedData['refreshToken']);
            $parsedToken = JWTAuth::getPayload($validatedData['refreshToken'])->toArray();
            $user = User::where('id', $parsedToken['data']->id)->first();
            $user->fill(['last_login_at' => date('Y-m-d H:i:s')])->save();
            $userData = $this->generateUserData($user, $this->setUpImmapOfficesForToken($user), $request->remember);
            $token = auth()->login($user);
            $cookieTime = config('jwt.cookie_token_time');
            $refreshIatDate = Carbon::createFromTimestamp($parsedToken['iat']);
            $refreshToken = $validatedData['refreshToken'];
            if($refreshIatDate->diffInDays(Carbon::now()) > 14) {
                $refreshToken = auth()->setTTL(config('jwt.cookie_refresh_token_time'))->claims($this->generateRefreshTokenData($user))->refresh($refreshToken);
            }

            return response()->json([
                'status' => 'success',
                'message' => __('auth.success.login'),
                'data' => $userData,
                'refreshToken' => $refreshToken,
            ])->withCookie(cookie('token', $token, $cookieTime));
        } catch(Exception $e) {
            return response()->error(__('auth.error.unauthorized'), 403, __('auth.error.unauthorized'));
        }
        return response()->error(__('auth.error.unauthorized'), 403, __('auth.error.unauthorized'));
    }

    /**
     * @SWG\Post(
     *   path="/api/register",
     *   tags={"Auth"},
     *   summary="Register",
     *   description="File: app\Http\Controllers\API\AuthenticationController@register",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Unauthorized"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="register",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"email", "password", "password_confirmation", "first_name", "family_name"},
     *          @SWG\Property(property="email", type="string", format="email", description="User email", example="johndoe@mail.com"),
     *          @SWG\Property(property="password", type="string", description="User password", example="Pass-123!"),
     *          @SWG\Property(property="password_confirmation", type="string", description="Password confirmation", example="Pass-123!"),
     *          @SWG\Property(property="first_name", type="string", description="User first name", example="John"),
     *          @SWG\Property(property="middle_name", type="string", description="User middle name", example="Michael"),
     *          @SWG\Property(property="family_name", type="string", description="User family name", example="Doe")
     *      )
     *   )
     * )
     */
    public function register(Request $request)
    {
        $validatedEmail = $this->validate($request, [
            'email' => [
                'required',
                'email',
                new NotImmap
            ],
            'password' => [
                'required',
                'confirmed',
                'min:8',
                new StrongPassword
            ],
        ]);

        if ($validatedEmail) {
            $checkUser = User::where('email', $validatedEmail['email'])->first();
            if (!is_null($checkUser)) {
                if ($checkUser->status !== 'Hidden') {
                    return response()->error(__('auth.error.alreadyRegistered'), 422);
                }

                if ($checkUser->status == 'Hidden') {
                    $currentDate = date('Y-m-d H:i:s');
                    $checkUser->status = 'Active';
                    $checkUser->last_login_at = $currentDate;
                    $checkUser->password = Hash::make($request->password);
                    $checkUser->delete_account_request = 'not yet';
                    $checkUser->delete_account_request_time = NULL;
                    $checkUser->delete_account_token = NULL;
                    $checkUser->delete_account_token_expired_at = NULL;
                    $checkUser->schedule_deletion_date = NULL;
                    $checkUser->save();

                    $checkProfile = $checkUser->profile;
                    $checkProfile->updated_at = $currentDate;
                    $checkProfile->save();

                    $responseData = $this->generateUserData($checkUser, $this->setUpImmapOfficesForToken($checkUser));
                    $tokenData = $this->generateTokenData($checkUser);

                    $token = auth()->setTTL(config('jwt.cookie_token_time'))->claims($tokenData)->attempt($request->only(['email', 'password']));

                    return response()->json([
                        'status' => 'success',
                        'message' => __('auth.success.hiddenUserRegister'),
                        'data' => [
                            'data' => $responseData,
                            'activeFromHidden' => true
                        ]
                    ])->withCookie(cookie('token', $token, config('jwt.cookie_token_time')));
                }
            }
        }

        $validatedData = $this->validate($request, [
            'email' => 'unique:users',
            'first_name' => 'required|string',
            'middle_name' => 'sometimes|nullable|string',
            'family_name' => 'required|string',
        ]);

        $userData = [
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'family_name' => $request->family_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'p11Status' => '{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0}',
            'last_login_at' => date('Y-m-d H:i:s')
        ];

        $userData = $this->getFullName($userData);
        $user = User::create($userData);

        if (!$user) {
            return response()->error(__('auth.error.register'), 500);
        }

        $user->assignRole('User');

        $profileData = [
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'family_name' => $user->family_name,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'user_id' => $user->id,
            'gender' => 2,
            'selected_roster_process' => json_encode([])
        ];

        $profile = Profile::create($profileData);

        if (!$profile) {
            return response()->error(__('auth.error.register'), 500);
        }

        if ($user) {
            $responseData = $this->generateUserData($user, $this->setUpImmapOfficesForToken($user));
            $tokenData = $this->generateTokenData($user);

            $token = auth()->setTTL(config('jwt.cookie_token_time'))->claims($tokenData)->attempt($request->only(['email', 'password']));
            $user->sendEmailVerificationNotification();
            return response()->json([
                'status' => 'success',
                'message' => __('auth.success.register'),
                'data' => $responseData
            ])->withCookie(cookie('token', $token, config('jwt.cookie_token_time')));
        }

        return response()->error(__('auth.error.register'), 401);
    }

    /**
     * @SWG\GET(
     *   path="/api/logout",
     *   tags={"Auth"},
     *   summary="Logout",
     *   description="File: app\Http\Controllers\API\AuthenticationController@logout",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success")
     * )
     */
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'status' => 'success',
            'message' => __('auth.success.logout'),
            'data' => []
        ])->withCookie(cookie('token', 'none', 1/10)); // ~ expired in 6 seconds
    }

    /**
     * @SWG\Post(
     *   path="/api/reset-password",
     *   tags={"Auth"},
     *   summary="Reset Email",
     *   description="File: app\Http\Controllers\API\AuthenticationController@reset",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="reset",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"email"},
     *          @SWG\Property(property="email", type="string", format="email", description="Registered user email", example="johndoe@mail.com")
     *      )
     *   )
     * )
     */
    public function reset(Request $request)
    {
        $validatedData = $this->validate($request, [
            'email' => 'required|email'
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (empty($user)) {
            return response()->not_found();
        }

        $passwordReset = PasswordReset::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => str_random(60)
            ]
        );

        if ($user && $passwordReset)
            $user->notify(
                new ResetPassword($passwordReset->token)
            );

        return response()->success(__('auth.success.reset'));
    }

    /**
     * @SWG\Post(
     *   path="/api/reset-password-form",
     *   tags={"Auth"},
     *   summary="Reset password email",
     *   description="File: app\Http\Controllers\API\AuthenticationController@resetPassword, signed url",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="resetPassword",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"password", "password_confirmation"},
     *          @SWG\Property(property="password", type="string", description="New Password", example="Pass-234!")
     *      )
     *   )
     * )
     *
     */
    public function resetPassword(Request $request)
    {
        $validatedData = $this->validate($request, [
            'password' => [
                'required',
                'confirmed',
                'min:8',
                new StrongPassword
            ]
        ]);

        $uriData = $request->query();

        if (!Arr::exists($uriData, 'token')) {
            return response()->not_found(__('auth.error.resetTokenNotFound'), 404);
        }

        $passwordReset = PasswordReset::where('token', $uriData['token'])->first();

        if (!$passwordReset) {
            return response()->not_found(__('auth.error.resetTokenInvalid'));
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(60)->isPast()) {
            $passwordReset->delete();
            return response()->not_found(__('auth.error.resetTokenInvalid'));
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user)
            return response()->not_found(__('auth.error.userNotFound'));

        $user->password = Hash::make($validatedData['password']);
        $user->save();

        $passwordReset->delete();

        if ($user) {
            return response()->success(__('auth.success.resetPassword'), $user);
        }

        return response()->error(__('auth.error.resetPassword'), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/check-verified",
     *   tags={"Auth"},
     *   summary="Check verified",
     *   description="File: app\Http\Controllers\API\AuthenticationController@checkVerified",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success")
     * )
     */
    public function checkVerified()
    {
        $isVerified = auth()->user()->hasVerifiedEmail() ? true : false;

        return response()->success(__('crud.success.default'), ['isVerified' => $isVerified]);
    }

      /**
     * @SWG\GET(
     *   path="/api/generate-one-time-token",
     *   tags={"Auth"},
     *   summary="Generate one time token",
     *   description="File: app\Http\Controllers\API\AuthenticationController@generateOneTimeToken",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success")
     * )
     */
    public function generateOneTimeToken()
    {
        $user = auth()->user();
        $token = $random_string = md5(microtime());

        $oneTimeToken = new OneTimeTokens();
        $oneTimeToken->user_id = $user->id;
        $oneTimeToken->token = $token;
        $oneTimeToken->save();

       return response()->json([
        'status' => 'success',
        'data' => [
            'user_id' => $user->id,
            'token' =>  $oneTimeToken->token,
            'roster_deployment_link' => env('ROSTER_DEPLOYMENT_LINK')
        ]
       ]);
    }
}
