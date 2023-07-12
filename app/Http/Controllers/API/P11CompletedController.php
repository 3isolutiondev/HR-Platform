<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use App\Models\Profile;
use App\Models\Job;
use App\Models\JobStatus;
use App\Models\User;
use App\Models\UserArchiveHistory;
use App\Models\UserStarHistory;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\ProfileRosterProcess;
use App\Mail\CompletedProfileJobSendInvitation;
use App\Mail\CompletedProfileRosterSendInvitation;
use App\Models\Roster\RosterInvitation;
use App\Mail\JobSendConfirmationMail;
use App\Mail\RosterSendConfirmationMail;
use App\Models\JobManager;
use Illuminate\Support\Carbon;
use DateTime;
use Illuminate\Support\Facades\Mail;
use App\Mail\ImmapVerification;
use App\Traits\iMMAPerTrait;

class P11CompletedController extends Controller {

    use iMMAPerTrait;

    const PAGINATE = 10;

    /**
     * @SWG\GET(
     *   path="/api/get-p11completed",
     *   tags={"P11 Completed"},
     *   summary="List of users who have completed p11",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getP11Completed, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    public function getP11Completed() {

        $user = User::where('p11Completed', 1)->get();
        return response()->success(__('crud.success.default'), $user);
    }

    /**
     * @SWG\GET(
     *   path="/api/get-available-job",
     *   tags={"P11 Completed"},
     *   summary="Get list of available job in {value: 4, label: IMO } format",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getavailableJob, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getavailableJob() {
        $job = Job::select('id as value', 'title as label')->where('opening_date','<=', date('Y-m-d'))->where('closing_date','>=', date('Y-m-d'))->where('status',1)->get();

        return response()->success(__('crud.success.default'), $job);
    }

    /**
     * @SWG\GET(
     *   path="/api/get-roster-process",
     *   tags={"Roster Process"},
     *   summary="Get all list of roster proccess data in {value: 6, label: CV Checking} format",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getRosterProcess, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getRosterProcess() {
        $roster_process = RosterProcess::select('id as value', 'name as label', 'under_sbp_program')->get();
        return response()->success(__('crud.success.default'), $roster_process);
    }

    /**
     * @SWG\GET(
     *   path="/api/get-immaper",
     *   tags={"P11 Completed"},
     *   summary="Get list of all immaper",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getImmaper, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getImmaper() {
        $profile = Profile::where('is_immaper',1)->get();
        return response()->success(__('crud.success.default'), $profile);
    }

    /**
     * @SWG\GET(
     *   path="/api/get-verified-immaper",
     *   tags={"P11 Completed"},
     *   summary="Get list of all verified immaper",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getverifiedImmaper, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getverifiedImmaper() {
        $profile = $this->iMMAPerFromProfileQuery(Profile::select('*'))->get();
        return response()->success(__('crud.success.default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/completed-profiles",
     *   tags={"P11 Completed"},
     *   summary="Get list of users who have completed p11",
     *   description="File: app\Http\Controllers\API\P11CompletedController@getCompleteProfiles, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="completeProfileFilter",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          @SWG\Property(property="search", type="string", description="Keyword for searching profile name", example="John"),
     *          @SWG\Property(property="experience", type="integer", description="Work experience (in years)", example=2),
     *          @SWG\Property(
     *             property="choosen_language",
     *             type="array",
     *             description="Selected language data for filter the applicants",
     *             @SWG\Items(
     *                 type="object",
     *                 @SWG\Property(property="id", type="integer", description="Language id", example=1),
     *                 @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Is the language should be native language? (0 = no, 1 = yes)", example=0),
     *                 @SWG\Property(property="language_level", type="object", description="Language level for filter the applicants",
     *                      @SWG\Property(property="value", type="integer", description="Language level id", example=1)
     *                 )
     *              )
     *          ),
     *          @SWG\Property(
     *              property="choosen_country",
     *              type="array",
     *              description="Selected country data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Country id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific country (year)", example=2)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_sector",
     *              type="array",
     *              description="Selected sector data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Sector id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific sector (year)", example=2)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_skill",
     *              type="array",
     *              description="Selected skill data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Skill id", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Working experience in specific skill (year)", example=1),
     *                  @SWG\Property(property="rating", type="integer", description="Minimum rating / proficiency for this skill", example=3),
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_degree_level",
     *              type="array",
     *              description="Selected degree level data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Degree level id", example=1),
     *                  @SWG\Property(property="degree", type="string", description="Degree obtained", example="Bachelor of ..."),
     *                  @SWG\Property(property="study", type="string", description="Study", example="Computer science")
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_field_of_work",
     *              type="array",
     *              description="Selected area of expertise data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Area of expertise id", example=1)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_nationality",
     *              type="array",
     *              description="Selected nationality data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="id", type="integer", description="Country id", example=1)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="chosen_country_of_residence",
     *              type="array",
     *              description="Selected country of residence data for filter the applicants",
     *              @SWG\Items(
     *                  @SWG\Property(property="value", type="integer", description="Country id", example=1)
     *              )
     *          ),
     *          @SWG\Property(
     *              property="immaper_status",
     *              type="array",
     *              description="Selected immaper status for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"is_immaper","not_immaper"},
     *                  description="it can be is_immaper or not_immaper"
     *              )
     *          ),
     *          ),
     *          @SWG\Property(
     *              property="select_gender",
     *              type="array",
     *              description="Selected gender for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"male","female","do_not_want_specify", "other"},
     *                  description="it can be male or female or Do not want to specify or other"
     *              )
     *          ),
     *          @SWG\Property(
     *              property="is_available",
     *              type="array",
     *              description="Selected available or not for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"available","not_available"},
     *                  description="it can be available or not_available"
     *              )
     *          ),
     *          @SWG\Property(property="filterType", type="string", description="Tab value [completed-profiles / archived]", example="archived"),
     *      )
     *  )
     * )
     *
     */
    public function getCompleteProfiles(Request $request)
    {
        $validatedData = $this->validate($request, [
            // Filter
            'chosen_sector' => 'sometimes|nullable|array',
            'chosen_sector.*.id' => 'sometimes|nullable|integer',
            'chosen_sector.*.years' => 'sometimes|nullable|integer',
            'chosen_skill' => 'sometimes|nullable|array',
            'chosen_skill.*.id' => 'sometimes|nullable|integer',
            'chosen_skill.*.years' => 'sometimes|nullable|integer',
            'chosen_skill.*.rating' => 'sometimes|nullable|integer',
            'chosen_language' => 'sometimes|nullable|array',
            'chosen_language.*.id' => 'sometimes|nullable|integer',
            'chosen_language.*.is_mother_tongue' => 'sometimes|nullable|boolean',
            'chosen_language.*.language_level.value' => 'sometimes|nullable|integer',
            'chosen_degree_level' => 'sometimes|nullable|array',
            'chosen_degree_level.*.degree' => 'sometimes|nullable|string',
            'chosen_degree_level.*.study' => 'sometimes|nullable|string',
            'chosen_field_of_work' => 'sometimes|nullable|array',
            'chosen_field_of_work.*.id' => 'sometimes|nullable|integer|exists:field_of_works,id',
            'chosen_nationality' => 'sometimes|nullable|array',
            'chosen_nationality.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country' => 'sometimes|nullable|array',
            'chosen_country.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country.*.years' => 'sometimes|nullable|integer',
            'chosen_country_of_residence' => 'sometimes|nullable|array',
            'chosen_country_of_residence.*.value' => 'sometimes|nullable|integer|exists:countries,id',
            'search' => 'sometimes|nullable|string',
            'experience' => 'sometimes|nullable|integer|min:0|max:10',
            'immaper_status' => 'sometimes|nullable|array',
            'immaper_status.*' => 'sometimes|nullable|in:is_immaper,not_immaper,both',
            'select_gender' => 'sometimes|nullable|array',
            'select_gender.*' => 'sometimes|nullable|in:male,female,do_not_want_specify,other,both',
            'is_available' => 'sometimes|nullable|array',
            'is_available.*' => 'sometimes|nullable|in:available,not_available,both',
            'filterType' => 'required|string|in:talent-pool,archived',
            'show_starred_only' => 'sometimes|nullable|string|in:yes,no'
        ]);

        $profiles = Profile::selectRaw('profiles.id, user_id, MATCH(users.full_name, users.first_name, users.middle_name, users.family_name) AGAINST(?) as relevance_score', [$validatedData['search']])->whereHas('user', function ($query) use ($validatedData) {
            $query->where('p11Completed', 1)->whereIn('status', ['Active', 'Inactive'])->where('archived_user', $validatedData['filterType'] == 'archived' ? 'yes' : 'no' );
            if (!empty($validatedData['show_starred_only'])) {
                if ($validatedData['show_starred_only'] == 'yes') {
                    $query->where('starred_user', 'yes');
                }
            }
        })->join('users', 'users.id', '=', 'profiles.user_id');

        if (is_numeric($validatedData['search'])) {

            $profiles = $profiles->whereHas('user', function ($query) use ($request) {
                $query->where('profiles.id', [$request->search]);
            })->orderBy('relevance_score', 'desc');

        }else if (!empty($validatedData['search'])) {
            $profiles = $profiles->whereHas('user', function ($query) use ($validatedData) {
                $query->search($validatedData['search']);
            })->orderBy('relevance_score', 'desc');
        } else {
            $profiles = $profiles->orderBy('profiles.created_at', 'desc');
        }

        if ($validatedData['experience'] > 0) {
            $profiles = $profiles->where('work_experience_years', '>=', $validatedData['experience']);
        }

        if (!empty($validatedData['immaper_status'])) {
            if (count($validatedData['immaper_status']) < 2) {

                foreach ($validatedData['immaper_status'] as $immaper) {
                    if ($immaper == "is_immaper") {
                        $profiles = $this->iMMAPerFromProfileQuery($profiles);
                    } else if ($immaper == "not_immaper") {
                        $profiles = $this->nonIMMAPerFromProfileQuery($profiles);
                    }
                }
            }
        }
        
        if (!empty($validatedData['select_gender'])) {

                $profiles = $profiles->where(function($query) use ($validatedData) {
                    foreach($validatedData['select_gender'] as $key => $gender) {
                        if ($key == 0) {
                            if ($gender == 'male') {
                                $query->where(function($male_gender) use ($gender) {
                                    $male_gender->where('gender', 1);
                                });
                            }elseif ($gender == 'female') {
                                $query->where(function($female_gender) use ($gender) {
                                    $female_gender->where('gender', 0);
                                });
                            }elseif ($gender == 'do_not_want_specify') {
                                $query->where(function($specify_gender) use ($gender) {
                                    $specify_gender->where('gender', 2);
                                });
                            }elseif ($gender == 'other') {
                                $query->where(function($other) use ($gender) {
                                    $other->where('gender', 3);
                                });
                            }
                        }else {
                            if ($gender == 'male') {
                                $query->orWhere(function($male_gender) use ($gender) {
                                    $male_gender->where('gender', 1);
                                });
                            }elseif ($gender == 'female') {
                                $query->orWhere(function($female_gender) use ($gender) {
                                    $female_gender->where('gender', 0);
                                });
                            }elseif ($gender == 'do_not_want_specify') {
                                $query->orWhere(function($specify_gender) use ($gender) {
                                    $specify_gender->where('gender', 2);
                                });
                            }elseif ($gender == 'other') {
                                $query->orWhere(function($other) use ($gender) {
                                    $other->where('gender', 3);
                                });
                            }
                        }
                    }
                });
        }

        if (!empty($validatedData['is_available'])) {
            if (count($validatedData['is_available']) == 1 && in_array("available", $validatedData['is_available'])) {
                $profiles = $profiles->whereDoesntHave('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }

            if (count($validatedData['is_available']) == 1 && in_array("not_available", $validatedData['is_available'])) {
                $profiles = $profiles->whereHas('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }
        }

        if (!empty($validatedData['chosen_country_of_residence'])) {
            $profiles = $profiles->where('country_residence_id', $validatedData['chosen_country_of_residence']['value']);
        }

        if (!empty($validatedData['chosen_language'])) {
            $profiles = $profiles->whereHas('p11_languages', function ($query) use ($validatedData) {
                foreach($validatedData['chosen_language'] as $key => $language) {
                    $whereRaw = '( language_id = ' . $language['id'];

                    if ($language['is_mother_tongue'] == 1) {
                        $whereRaw = $whereRaw . " AND " . 'is_mother_tongue = ' . $language['is_mother_tongue'];
                    }

                    if (!empty($language['language_level']['value'])) {
                        $whereRaw = $whereRaw . " AND " . 'language_level_id >= ' . $language['language_level']['value'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_degree_level'])) {
            $degree_levels = $validatedData['chosen_degree_level'];
            $profiles = $profiles->whereHas('p11_education_universities', function ($query) use ($degree_levels) {
                foreach($degree_levels as $key => $degree_level) {
                    $whereRaw = '( degree_level_id = ' . $degree_level['id'];

                    if (!empty($degree_level['degree'])) {
                        $whereRaw = $whereRaw . " AND " . '`degree` LIKE "%' . $degree_level['degree'] . '%" ';
                    }

                    if (!empty($degree_level['study'])) {
                        $whereRaw = $whereRaw . " AND " . '`study` LIKE "%' . $degree_level['study'] . '%" ';
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                       $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }

            });
        }

        if (!empty($validatedData['chosen_sector'])) {
            $profiles = $profiles->whereHas('p11_sectors', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_sector'] as $key => $sector) {
                    $whereRaw = '( sector_id = ' . $sector['id'];

                    if ($sector['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $sector['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_country'])) {
            $profiles = $profiles->whereHas('p11_country_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_country'] as $key => $country) {
                    $whereRaw = '( country_id = ' . $country['id'];

                    if ($country['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $country['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });

        }

        if (!empty($validatedData['chosen_skill'])) {
            foreach ($validatedData['chosen_skill'] as $key => $skill) {
            $profiles = $profiles->whereHas('p11_skills', function ($query) use ($validatedData, $skill) {
                    $whereRaw = '( skill_id = ' . $skill['id'];

                    if ($skill['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $skill['years'];
                    }

                    if ($skill['rating'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'proficiency >= ' . $skill['rating'];
                    }

                    $whereRaw = $whereRaw . ' )';
                    $query->whereRaw($whereRaw);
                });
            }

        }

        if (!empty($validatedData['chosen_field_of_work'])) {
            $profiles = $profiles->whereHas('p11_field_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_field_of_work'] as $key => $field_of_work) {
                    if ($key == 0) {
                        $query->where('field_of_work_id', '=', $field_of_work['id']);
                    } else {
                        $query->orWhere('field_of_work_id', '=', $field_of_work['id']);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_nationality'])) {
            $profiles = $profiles->whereHas('present_nationalities', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_nationality'] as $key => $nationality) {
                    if ($key == 0) {
                            $query->where('country_id', '=', $nationality['id']);
                    } else {
                            $query->orWhere('country_id', '=', $nationality['id']);
                    }
                }
            });
        }

        return response()->success(__('crud.success.default'), $profiles->with([
            'user' => function ($query) {
                $query->select('id', 'full_name', 'starred_user');
            }
        ])->paginate(self::PAGINATE));
    }

    /**
     * @SWG\Post(
     *   path="/api/send-invitation-complete-profile",
     *   tags={"P11 Completed"},
     *   summary="Send invitation to a specific complete profile user",
     *   description="File: app\Http\Controllers\API\P11CompletedController@sendInvitation, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="sendInvitation",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"profile_id", "invitation_type"},
     *              @SWG\Property(
     *                  property="profile_id",
     *                  type="integer",
     *                  description="Profile id (Person that we want to send the invitation)",
     *                  example=7
     *              ),
     *              @SWG\Property(property="invitation_type", type="integer", enum={0,1}, description="Invitation type can be for job posting or roster invitation (0 = job, 1 = roster)", example=0),
     *              @SWG\Property(property="chosen_job_id", type="integer", description="Required if invitation_type == 0, it contain job id", example=53),
     *              @SWG\Property(property="chosen_roster_id", type="integer", description="Required if invitation_type == 1, it contain roster process id", example=5)
     *           )
     *         ),
     *
     *       )
     *    )
     *
     * )
     *
     */
    public function sendInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'profile_id' => 'required|integer|exists:profiles,id',
            'invitation_type' => 'required|boolean',
            'chosen_job_id' => 'sometimes|nullable|required_if:invitation_type,0|exists:jobs,id',
            'chosen_roster_id' => 'sometimes|nullable|required_if:invitation_type,1|exists:roster_processes,id'
        ]);
        $profile = Profile::findOrFail($validatedData['profile_id']);

        $hr_manager = auth()->user();

        if ($validatedData['invitation_type'] == 0) {
            $job = Job::findOrFail($validatedData['chosen_job_id']);
            Mail::to($profile->user->email)->send(new CompletedProfileJobSendInvitation($profile->user->full_name, $job->id, $job->title, $hr_manager['immap_email']));
            if (Mail::failures()) {
                return response()->error(__('crud.error.default'), 500);
            }

            Mail::to($hr_manager['immap_email'])->send(
                new JobSendConfirmationMail($profile->user->full_name, $job->id, $job->title, $hr_manager['full_name'])
            );


            return response()->success(__('crud.success.default'));
        }

        if ($validatedData['invitation_type'] == 1) {
            $roster = RosterProcess::findOrFail($validatedData['chosen_roster_id']);
            
            $alreadyAccepted = ProfileRosterProcess::where('roster_process_id', $validatedData['chosen_roster_id'])->where('profile_id', $validatedData['profile_id'])->where('is_completed', 1)->first();
            if (!empty($alreadyAccepted)) {
                return response()->error(__('roster.error.alreadyActiveInRosterCampaign'), 500);
            }

            $last_process = ProfileRosterProcess::where('roster_process_id', $validatedData['chosen_roster_id'])
                            ->where('profile_id', $validatedData['profile_id'])
                            ->where('is_completed', 0)
                            ->where('is_rejected', 0);
            $last_process = $last_process->orderBy('created_at','desc')->first();

            $activeRosterInvitation = RosterInvitation::where('profile_id', $validatedData['profile_id'])
            ->where('roster_process_id', $validatedData['chosen_roster_id'])
            ->where('active', 1)
            ->first();
            if(empty($activeRosterInvitation)) {
                $roster_invitation = RosterInvitation::create([
                    'profile_id' => $validatedData['profile_id'],
                    'roster_process_id' => $validatedData['chosen_roster_id'],
                    'invited_by_profile_id' => $hr_manager->profile->id,
                ]);
            }
            

            if (empty($last_process)) {
                Mail::to($profile->user->email)->send(new CompletedProfileRosterSendInvitation($profile->user->full_name, $roster->id, $roster->name, $hr_manager['immap_email']));
                if (Mail::failures()) {
                    return response()->error(__('crud.error.default'), 500);
                }

                Mail::to($hr_manager['immap_email'])->send(
                    new RosterSendConfirmationMail($profile->user->full_name, $roster->id, $roster->name,
                        $hr_manager['full_name'])
                );

                return response()->success(__('crud.success.default'));
            } else {
                return response()->error(__('roster.error.alreadyActiveInRosterCampaign'), 500);
            }
        }

        return response()->error(__('crud.error.default'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/complete-profiles/archive",
     *   tags={"P11 Completed"},
     *   summary="Archive / Unarchive completed profiles",
     *   description="File: app\Http\Controllers\API\P11CompletedController@toggleArchiveCompleteProfiles, permission:See Completed Profiles",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="toggleArchiveCompletedProfile",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"user_id"},
     *              @SWG\Property(property="user_id", type="integer", description="User id (Person that we want to toggle it's archive status)", example=7)
     *           )
     *         )
     *       )
     *    )
     * )
     */
    public function toggleArchiveCompleteProfiles(Request $request)
    {
        $validatedData = $this->validate($request, ['user_id' => 'required|integer|exists:users,id']);

        $user = User::findOrFail($validatedData['user_id']);

        // check if the user already submit his profile
        if ($user->p11Completed == 0) { return response()->error(__('completedprofile.error.archive_not_complete', ['name' => $user->full_name]), 422); }

        // check if the user is in recruitment process or roster recruitment campaign (if in the step besides CV Checking and Rejecter)
        if ($user->archived_user == "no") {
            $jobStatus = JobStatus::where('set_as_rejected', 0)->where('default_status', 0)->where('last_step', 0)->get();

            $rosterProcess = RosterProcess::all();
            $rosterProcessData = [];
            foreach($rosterProcess as $roster) {
                array_push($rosterProcessData, [
                    'roster_process_id' => $roster->id,
                    'roster_steps' => $roster->roster_steps()->select('id','order','roster_process_id')->get()->pluck('order')->all()
                ]);
            }

            if ($jobStatus->count() > 0 || count($rosterProcessData)) {
                // check active job recruitment
                $jobRecruitmentProcess = Job::select('id','title')->where('status', 1)->whereHas('job_user', function($query) use ($jobStatus, $user) {
                    return $query->whereIn('job_user.job_status_id', $jobStatus->pluck('id')->toArray())->where('job_user.user_id', $user->id);
                })->whereHas('tor.job_standard', function($query) {
                    return $query->where('under_sbp_program', "no");
                })->with([
                    'first_job_user' => function($query) use ($user) {
                        $query->select('job_user.id','job_user.job_id','job_user.user_id','job_user.job_status_id')->where('job_user.user_id', $user->id);
                    },
                    'first_job_user.first_job_status:id,status,order'
                ])->get();

                // check active surge alert recruitment
                $surgeAlertRecruitmentProcess = Job::select('id','title')->where('status', 1)->whereHas('job_user', function($query) use ($jobStatus, $user) {
                    return $query->whereIn('job_user.job_status_id', $jobStatus->pluck('id')->toArray())->where('job_user.user_id', $user->id);
                })->whereHas('tor.job_standard', function($query) {
                    return $query->where('under_sbp_program', "yes");
                })->with([
                    'first_job_user' => function($query) use ($user) {
                        $query->select('job_user.id','job_user.job_id','job_user.user_id','job_user.job_status_id')->where('job_user.user_id', $user->id);
                    },
                    'first_job_user.first_job_status:id,order,status_under_sbp_program as status'
                ])->get();

                // check active roster recruitment
                $rosterRecruitmentProcess = ProfileRosterProcess::whereHas('profile', function($query) use ($rosterProcessData, $user) {
                    $query->whereHas('user', function($subQuery) use ($user) {
                        $subQuery->where('users.id', $user->id);
                    })->where(function($subQuery) use ($rosterProcessData) {
                        foreach($rosterProcessData as $key => $rosterData) {
                            if ($key == 0) {
                                return $subQuery->where(function($subSubQuery) use ($rosterProcessData, $rosterData) {
                                    $subSubQuery->where('roster_process_id', $rosterData['roster_process_id'])->whereIn('current_step', $rosterData['roster_steps']);
                                });
                            }
                            return $subQuery->orWhere(function($subSubQuery) use ($rosterProcessData, $rosterData) {
                                $subSubQuery->where('roster_process_id', $rosterData['roster_process_id'])->whereIn('current_step', $rosterData['roster_steps']);
                            });
                        }
                    });
                })->where('is_completed', 0)->where('set_as_current_process',1)->get();

                $rosterRecruitmentData = [];

                if ($rosterRecruitmentProcess->count() > 0) {
                    foreach($rosterRecruitmentProcess as $process) {
                        $rosterStep = $process->roster_process->roster_steps()->select('id','step','order','roster_process_id')->where('order', $process->current_step)->first();
                        array_push($rosterRecruitmentData, [
                            'roster_name' => $process->roster_process->name,
                            'roster_step' => $rosterStep->step
                        ]);
                    }
                }

                if ($jobRecruitmentProcess->count() > 0 || $surgeAlertRecruitmentProcess->count() > 0 || count($rosterRecruitmentData) > 0) {
                    return response()->success(__('completedprofile.error.archive_has_active_recruitment'), [
                        'cannotArchive' => true,
                        'jobRecruitmentProcess' => $jobRecruitmentProcess,
                        'rosterRecruitmentProcess' => $rosterRecruitmentData,
                        'surgeAlertRecruitmentProcess' => $surgeAlertRecruitmentProcess
                    ], 200);
                }
            }

        }

        $newStatus = $user->archived_user == "no" ? "yes" : "no";
        $updated = $user->fill(['archived_user' => $newStatus])->save();

        if (!$updated) {
            return response()->error(__('completedprofile.error.archive_server'), 500);
        }

        UserArchiveHistory::create(['user_id' => $user->id, 'user_who_moved_the_user' => auth()->user()->id, 'state' => $newStatus]);
        $lang = $newStatus == 'yes' ? 'completedprofile.success.archive' : 'completedprofile.success.unarchive';
        return response()->success(__($lang, ['name' => $user->full_name]));
    }

    /**
     * @SWG\Post(
     *   path="/api/complete-profiles/star",
     *   tags={"P11 Completed"},
     *   summary="Star / Unstar completed profiles",
     *   description="File: app\Http\Controllers\API\P11CompletedController@toggleStarCompleteProfiles, permission:See Completed Profiles",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="toggleStarCompletedProfile",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"user_id"},
     *              @SWG\Property(property="user_id", type="integer", description="User id (Person that we want to toggle it's archive status)", example=7)
     *           )
     *         )
     *       )
     *    )
     * )
     */
    public function toggleStarCompleteProfiles(Request $request)
    {
        $validatedData = $this->validate($request, ['user_id' => 'required|integer|exists:users,id']);

        $user = User::findOrFail($validatedData['user_id']);

        if ($user->p11Completed == 0) { return response()->error(__('completedprofile.error.archive_not_complete', ['name' => $user->full_name]), 422); }
        $newStatus = $user->starred_user == "no" ? "yes" : "no";
        $updated = $user->fill(['starred_user' => $newStatus])->save();

        if (!$updated) {
            return response()->error(__('completedprofile.error.archive_server'), 500);
        }

        UserStarHistory::create(['user_id' => $user->id, 'user_who_moved_the_user' => auth()->user()->id, 'state' => $newStatus]);
        $lang = $newStatus == 'yes' ? 'completedprofile.success.star' : 'completedprofile.success.unstar';

        return response()->success(__($lang, ['name' => $user->full_name]));
    }
}
