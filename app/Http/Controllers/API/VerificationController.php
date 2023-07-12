<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ImmapVerification;
use App\Traits\iMMAPerTrait;

class VerificationController extends Controller
{
    use VerifiesEmails, iMMAPerTrait;

    /**
     * @SWG\Get(
     *   path="/api/email/verify/{id}",
     *   tags={"Verification"},
     *   summary="Verify email address",
     *   description="File: app\Http\Controllers\API\VerificationController@verify",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="User id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Already verified"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function verify(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->hasVerifiedEmail()) {
            return response()->error(__('verification.error.resend'), 401);
        } else if ($user->markEmailAsVerified()) {
            event(new Verified($user));
            return response()->success(__('verification.success.verify'));
        }

        return response()->error(__('verification.error.verify'), 422);
    }

    /**
     * @SWG\Post(
     *   path="/api/email/resend",
     *   tags={"Verification"},
     *   summary="Resend email verification link",
     *   description="File: app\Http\Controllers\API\VerificationController@resend",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="resend",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"user_id"},
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=1)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function resend(Request $request)
    {
        $validatedData = $this->validate($request, ['user_id' => 'required|integer']);

        $user = User::findOrFail($validatedData['user_id']);

        if ($user->hasVerifiedEmail()) {
            return response()->error(__('verification.error.resend'), 422);
        }

        $user->sendEmailVerificationNotification();

        return response()->success(__('verification.success.resend'), 200);
    }

    /**
     * @SWG\Get(
     *   path="/api/immap-email/verify/{id}",
     *   tags={"Verification"},
     *   summary="Verify iMMAP email address",
     *   description="File: app\Http\Controllers\API\VerificationController@verifyImmapEmail",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="User id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=401, description="Already verified"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function verifyImmapEmail(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if($this->checkVerifiedIMMAPerFromSelectedUser($user)) {
            return response()->error(__('verification.error.alreadyVerifiedImmapEmail'), 401);
        }

        if ($this->checkUnverifiedIMMAPerFromSelectedUser($user)) {
            $user->profile->fill(['verified_immaper' => 1])->save();
            $user->fill(['immap_email' => $user->profile->immap_email])->save();

            return response()->success(__('verification.success.verifyImmapEmail'));
        }


        return response()->error(__('verification.error.verifyImmapEmail'), 422);
    }

    /**
     * @SWG\Post(
     *   path="/api/immap-email/resend",
     *   tags={"Verification"},
     *   summary="Resend iMMAP email verification link",
     *   description="File: app\Http\Controllers\API\VerificationController@resendImmapEmail",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="resendImmapEmail",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"user_id"},
     *          @SWG\Property(property="user_id", type="integer", description="User id", example=1)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function resendImmapEmail(Request $request)
    {
        $validatedData = $this->validate($request, ['user_id' => 'required|integer']);
        $profile = User::findOrFail($validatedData['user_id'])->profile;

        if(empty($profile)) {
            return response()->error(__('verification.error.resendImmapEmail'), 422);
        }

        if($this->checkVerifiedIMMAPerFromSelectedProfile($profile)) {
            return response()->error(__('verification.error.alreadyVerifiedImmapEmail'), 422);
        }

        if ($this->checkUnverifiedIMMAPerFromSelectedProfile($profile)) {
            Mail::to($profile->immap_email)->send(new ImmapVerification($profile->user->full_name, $profile->user->id));

            return response()->success(__('verification.success.resendImmapEmail'), 200);
        }

        return response()->success(__('verification.error.resendImmapEmail'), 422);
    }

}
