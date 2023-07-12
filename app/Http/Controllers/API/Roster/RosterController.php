<?php

namespace App\Http\Controllers\API\Roster;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\JobInterviewScoreController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Mail;
use App\Models\Profile;
use App\Models\DegreeLevel;
use App\Models\LanguageLevel;
use App\Models\Roster\RosterStep;
use App\Models\Roster\RosterProcess;
use App\Models\P11\P11Reference;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\ReferenceHistory;
use App\Models\Userreference\Questioncategory as ReferenceCheck;
use App\Models\Media;
use App\Mail\SkypeInvitation;
use App\Mail\IMTestInvitation;
use App\Mail\RosterInterviewInvitation;
use App\Mail\ThreeHeadsInvitation;
use App\Mail\RosterInterviewPhysical;
use App\Mail\ReferenceCheckMail;
use App\Mail\RosterAccepted;
use App\Mail\RosterRejected;
use Illuminate\Support\Carbon;
use App\Exports\RosterExport;
use App\Exports\ProfileExport;
use App\Exports\RosterProfileExport;
use App\Models\OneTimeTokens;
use App\Models\User;
use App\Mail\ApplicantMoveToNewStatusRosterProcess;
use App\Mail\ApplicantRosterRejected;
use Excel;
use Illuminate\Support\Facades\DB;
use SebastianBergmann\Environment\Console;
use App\Traits\iMMAPerTrait;
use App\Traits\UserStatusTrait;
use Illuminate\Support\Facades\Hash;
use App\Traits\RosterTrait;
use App\Services\CalendarService;
use App\Services\SurgePingService;
use App\Services\WordService;
use Illuminate\Http\Response;

class RosterController extends Controller
{
    use iMMAPerTrait, UserStatusTrait, RosterTrait;

    const PAGINATE = 15;

    public function __construct()
    {
        $user = auth()->user();
        $this->authUser = ($user) ? $user : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/roster",
     *   tags={"Roster"},
     *   summary="list of profile who are agree to become roster but still not selected as iMMAP roster",
     *   description="File: app\Http\Controllers\API\RosterController@index, permission:Index Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function index()
    {
        return response()->success(__('crud.success.default'), Profile::with('user')->where('become_roster', 1)->where('validated_roster', 0)->orderBy('created_at', 'desc')->paginate(self::PAGINATE));
    }

    /**
     * @SWG\GET(
     *   path="/api/roster/download-statistics/{id}",
     *   tags={"Roster"},
     *   summary="Download statistics data based on selected roster process",
     *   description="File: app\Http\Controllers\API\RosterController@downloadStatistics, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster process id"
     *    ),
     * )
     *
     */
    public function downloadStatistics($id)
    {
        $validatedData = $this->validate(new Request(['id' => $id]), ['id' => 'required|integer|exists:roster_processes,id']);

        $roster_process = RosterProcess::with(['roster_steps' => function($q) { $q->orderBy('order','ASC'); }])->findOrFail($validatedData['id']);
        $roster_steps = $roster_process->roster_steps;
        $reports = [
            'total' => 0
        ];

        foreach ($roster_steps as $roster_step) {
            $roster = ProfileRosterProcess::where('roster_process_id', $roster_process->id)->where('current_step', $roster_step->order)->get();
            $reports['total'] = $reports['total'] + count($roster);
            $reports[$roster_step->step] = count($roster) > 0 ? count($roster) : '0';
        }

        $reports = new RosterExport($reports, $roster_process->name, $roster_steps);
        ob_end_clean(); // this
        ob_start(); // and this
        return Excel::download($reports, 'roster.xlsx');
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/profiles",
     *   tags={"Roster"},
     *   summary="Get list of profile for selected roster process",
     *   description="File: app\Http\Controllers\API\RosterController@getProfileList, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="current_step", type="integer", description="Roster step order [range: 0 - (max of roster step that the roster process has - 1)]", example=0),
     *              @SWG\Property(property="download", type="integer", enum={0,1}, description="Download the profiles or not [0 = show profiles, 1 = download profiles]", example=0),
     *              @SWG\Property(
     *                  property="chosen_sector",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Sector id", example=12),
     *                      @SWG\Property(property="years", type="integer", description="Experience working in this sector (years)", example=10),
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_skill",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Skill id", example=109),
     *                      @SWG\Property(property="years", type="integer", description="Experience working in this skill (years)", example=3),
     *                      @SWG\Property(property="rating", type="integer", description="Skill rating / proficiency", example=4),
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_language",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Language id", example=33),
     *                      @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Is this language is native language", example=1),
     *                      @SWG\Property(
     *                          property="language_level",
     *                          type="object",
     *                          @SWG\Property(property="value", type="integer", description="Language level id", example=1),
     *                      ),
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_degree_level",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Degree level id", example=20),
     *                      @SWG\Property(property="degree", type="string", description="Degree or academic obtained", example="Bachelor of "),
     *                      @SWG\Property(property="study", type="string", description="Main course of the study", example="IT"),
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_field_of_work",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="Area of expertise id", example=28)
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_nationality",
     *                  type="array",
     *                  description="It can be empty or null, filter based on nationality",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="country id", example=12),
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_country",
     *                  type="array",
     *                  description="It can be empty or null, filter based on working experience (years) in specific country",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="country id", example=23),
     *                      @SWG\Property(property="years", type="integer", description="years", example=10)
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="chosen_country_of_residence",
     *                  type="array",
     *                  description="It can be empty or null, filter based on country of residence",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="country id", example=14)
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="search",
     *                  type="string",
     *                  description="It can be empty or null, profile name",
     *                  example="John"
     *              ),
     *              @SWG\Property(
     *                  property="experience",
     *                  type="integer",
     *                  description="It can be empty or null, minimum working experience",
     *                  example=3
     *              ),
     *              @SWG\Property(
     *                  property="immaper_status",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="string",
     *                      enum={"is_immaper", "not_immaper"},
     *                      description="iMMAPer Status",
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="is_available",
     *                  type="array",
     *                  description="It can be empty or null",
     *                  @SWG\Items(
     *                      type="string",
     *                      enum={"available", "not_available"},
     *                      description="Available or not",
     *                  )
     *              )
     *           )
     *         ),
     *       )
     *    )
     * )
     *
     */
    public function getProfileList(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'download' => 'sometimes|nullable|boolean',
            'showAllRejected' => 'sometimes|nullable|boolean',

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
            'chosen_degree_level.*.id' => 'sometimes|nullable|integer',
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
            'is_available' => 'sometimes|nullable|array',
            'is_available.*' => 'sometimes|nullable|in:available,not_available,both'
        ]);

        $is_last_step = false;
        $is_set_rejected = false;

        $rosterStep = RosterStep::where('roster_process_id', $validatedData['roster_process']['value'])->where('order', $validatedData['current_step'])->first();

        if (!empty($rosterStep)) {
            if ($rosterStep->last_step == 1) {
                $is_last_step = true;
            }

            if ($rosterStep->set_rejected == 1) {
                $is_set_rejected = true;
            }
        }

        $profiles = Profile::select('id', 'user_id')->where('become_roster', 1)->orderBy('created_at', 'desc')->whereHas('roster_processes', function (Builder $query) use ($validatedData, $is_last_step, $is_set_rejected) {
            $query->where('profile_roster_processes.roster_process_id', $validatedData['roster_process']['value'])->where('profile_roster_processes.current_step', $validatedData['current_step']); //->where('profile_roster_processes.set_as_current_process',1);
            if ($is_last_step) {
                $query->where('profile_roster_processes.is_completed', 1)->where('profile_roster_processes.is_rejected', 0);
            } elseif ($is_set_rejected) {
                $query->where('profile_roster_processes.is_completed', 0)->where('profile_roster_processes.is_rejected', 1);
                if (!$validatedData['showAllRejected']) {
                    $query->whereYear('profile_roster_processes.updated_at', '>=', date('Y'));
                }
            } elseif (!$is_set_rejected && !$is_last_step) {
                $query->where('profile_roster_processes.is_completed', 0)->where('profile_roster_processes.is_rejected', 0);
            } else {
            }
        });

        $profiles = $profiles->whereHas('user', function (Builder $query) {
            $query->where('p11Completed', 1)->whereIn('users.status', ['Active', 'Inactive']);
            if (!auth()->user()->hasPermissionTo('Set as Admin')) {
                $query->where('archived_user', 'no');
            }
        });

        if (!empty($validatedData['search'])) {
            $profiles = $profiles->whereHas('user', function (Builder $query) use ($request) {
                $query->search($request->search);
            });
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

        if (!empty($validatedData['is_available'])) {
            if (count($validatedData['is_available']) == 1 && in_array("available", $validatedData['is_available'])) {
                $profiles = $profiles->whereDoesntHave('p11_employment_records', function (Builder $query) {
                    $query->where('untilNow', 1);
                });
            }

            if (count($validatedData['is_available']) == 1 && in_array("not_available", $validatedData['is_available'])) {
                $profiles = $profiles->whereHas('p11_employment_records', function (Builder $query) {
                    $query->where('untilNow', 1);
                });
            }
        }

        if (!empty($validatedData['chosen_country_of_residence'])) {
            $profiles = $profiles->where('country_residence_id', $validatedData['chosen_country_of_residence']['value']);
        }

        if (!empty($validatedData['chosen_language'])) {
            $profiles = $profiles->whereHas('p11_languages', function (Builder $query) use ($validatedData) {
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

            $profiles = $profiles->whereHas('p11_education_universities', function (Builder $query) use ($degree_levels) {
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
            $profiles = $profiles->whereHas('p11_sectors', function (Builder $query) use ($validatedData) {
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
            $profiles = $profiles->whereHas('p11_country_of_works', function (Builder $query) use ($validatedData) {
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
            $profiles = $profiles->whereHas('p11_field_of_works', function (Builder $query) use ($validatedData) {
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
            $profiles = $profiles->whereHas('present_nationalities', function (Builder $query) use ($validatedData) {
                foreach ($validatedData['chosen_nationality'] as $key => $nationality) {
                    if ($key == 0) {
                            $query->where('country_id', '=', $nationality['id']);
                    } else {
                            $query->orWhere('country_id', '=', $nationality['id']);
                    }
                }
            });
        }

        if (!empty($validatedData['download'])) {
            if ($validatedData['download']) {
                $profiles = $profiles->select('id', 'skype', 'is_immaper', 'verified_immaper', 'immap_email', 'user_id')->get();
                $roster_profiles = [];
                foreach ($profiles as $key => &$profile) {
                    $roster_profile = new \stdClass;
                    $roster_profile->fullname = $profile->user->full_name;
                    $roster_profile->status = $rosterStep->step;
                    $roster_profile->email = $profile->user->email;
                    $roster_profile->is_immaper = ($this->checkIMMAPerFromSelectedProfile($profile)) ? 'iMMAPer' : 'Not iMMAPer';
                    $roster_profile->immap_email = $profile->immap_email;
                    $roster_profile->skype = $profile->skype;
                    if (!empty($profile->sectors)) {
                        $roster_profile->sectors = $profile->sectors()->pluck('name')->implode(', ');
                    }
                    if (!empty($profile->skills)) {
                        $roster_profile->skills = $profile->skills()->pluck('skill')->implode(', ');
                    }
                    if (!empty($profile->languages)) {
                        $roster_profile->languages = $profile->languages()->pluck('name')->implode(', ');
                    }
                    if (!empty($profile->field_of_works)) {
                        $roster_profile->field_of_works = $profile->field_of_works()->pluck('field')->implode(', ');
                    }
                    if (!empty($profile->present_nationalities)) {
                        $roster_profile->nationalities = $profile->present_nationalities()->pluck('name')->implode(', ');
                    }
                    array_push($roster_profiles, $roster_profile);
                }

                $roster_profiles = collect($roster_profiles);

                $roster_profiles = new RosterExport($roster_profiles);
                ob_end_clean(); // this
                ob_start(); // and this
                return Excel::download($roster_profiles, 'roster.csv');
            }
        }
        $id = $validatedData['roster_process']['value'];
        $profiles = $profiles->with([
            'user' => function ($query) {
                $query->select('id', 'full_name', 'archived_user');
            },
            'p11_education_universities' => function ($query) {
                $query->orderBy('attended_to', 'desc');
            },
            'p11_references' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'p11_references.attachment',
            'p11_references.referenceHistories' => function ($query) use ($id) {
                $query->where('roster_process_id', $id);
            },
            'p11_references.referenceHistories.attachment',
            'p11_education_universities.degree_level',
            'profile_roster_processes.job_interview_scores',
            'profile_roster_processes.job_interview_global_impression',
            'profile_roster_processes.job_interview_scores.interviewQuestion',
            'profile_roster_processes' => function ($query) use($validatedData, $is_last_step, $is_set_rejected) {
                $query->select(
                        'profile_roster_processes.id',
                        'profile_roster_processes.is_rejected',
                        'profile_roster_processes.profile_id',
                        'profile_roster_processes.interview_invitation_done',
                        'profile_roster_processes.interview_date',
                        'profile_roster_processes.interview_timezone',
                        'profile_roster_processes.interview_invitation_done',
                        'profile_roster_processes.im_test_sharepoint_link',
                        'profile_roster_processes.im_test_score',
                        'jobs.title',
                        'users.first_name',
                        'users.full_name',
                        'users.family_name',
                        'users.middle_name',
                        'moved_date',
                        'is_completed'
                    )
                    ->where('profile_roster_processes.roster_process_id', $validatedData['roster_process']['value'])
                    ->leftJoin('users', 'users.id', '=', 'profile_roster_processes.mover_id')
                    ->leftJoin('jobs', 'jobs.id', '=', 'profile_roster_processes.coming_from_job_id')
                    ->where('profile_roster_processes.current_step', $validatedData['current_step']);

                if ($is_last_step) {
                    $query->where('profile_roster_processes.is_completed', 1)->where('profile_roster_processes.is_rejected', 0);
                }

                if ($is_set_rejected) {
                    $query->where('profile_roster_processes.is_completed', 0)->where('profile_roster_processes.is_rejected', 1);
                }

                if (!$is_set_rejected && !$is_last_step) {
                    $query->where('profile_roster_processes.is_completed', 0)->where('profile_roster_processes.is_rejected', 0);
                }
            },
            'roster_processes.interview_questions' => function ($query) {
                $query->select('interview_questions.*')->join('profile_roster_processes', 'interview_questions.roster_profile_id', '=', 'profile_roster_processes.id');
            },
            'profile_roster_processes.interview_questions',
            'roster_processes' => function ($query) use ($validatedData, $is_last_step, $is_set_rejected) {
                $query->select('roster_processes.id', 'roster_processes.name')->wherePivot('roster_process_id', $validatedData['roster_process']['value'])->wherePivot('current_step', $validatedData['current_step']);

                if ($is_last_step) {
                    $query->wherePivot('is_completed', 1)->wherePivot('is_rejected', 0);
                }

                if ($is_set_rejected) {
                    $query->wherePivot('is_completed', 0)->wherePivot('is_rejected', 1);
                }

                if (!$is_set_rejected && !$is_last_step) {
                    $query->wherePivot('is_completed', 0)->wherePivot('is_rejected', 0);
                }
            }
        ])->paginate(self::PAGINATE);


        $profiles->each(function ($profile) {
                $profile->p11_references->each(function ($reference) {
                if(isset($reference->referenceHistories) && isset($reference->referenceHistories[0])) {
                    $attachment = $reference->referenceHistories[0]->attachment;
                    if (isset($attachment) && $attachment !== null) {
                        $media = Media::where('model_id', $attachment->id)->where('collection_name', 'p11_references')->where('disk', 's3')->where('model_type', 'App\Models\Attachment')->latest('id')->first();
                        if($media) {
                               $reference->reference_file = collect([
                                 'url' => '/storage/'.$media->id.'/'.$media->file_name,
                                 'mime_type' => $media->mime_type,
                                 'file_name' => $media->file_name,
                               ]);
                               $reference->setHidden(['media', 'attachment']);
                        }
                     }
                }
            });
            $profile->references = $profile->p11_references;
            unset($profile->p11_references);
        });

        return response()->success(__('crud.success.default'), $profiles);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/change-step",
     *   tags={"Roster"},
     *   summary="Change profile roster step status",
     *   description="File: app\Http\Controllers\API\RosterController@changeStep, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "profile_id","new_step"},
     *              @SWG\Property(property="roster_process", type="integer", description="Roster process id, should be exists on roster_processes table", example=5),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=145),
     *              @SWG\Property(property="new_step", type="integer", description="Roster step id", example=3)
     *           )
     *         )
     *       )
     *    )
     * )
     *
     */
    public function changeStep(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required|integer|exists:roster_processes,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'new_step' => 'required|integer',
            'current_step' => 'required|integer|exists:roster_steps,id'
        ]);

        $profile = Profile::with('user')->findOrFail($validatedData['profile_id']);
        $roster_step = RosterStep::findOrFail($validatedData['new_step']);
        $current_step = RosterStep::findOrFail($validatedData['current_step']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']);

        $last_process = ProfileRosterProcess::where('roster_process_id', $validatedData['roster_process'])->where('profile_id', $validatedData['profile_id']);
        if ($current_step->set_rejected == 1) {
            $checkRejectedProcess = ProfileRosterProcess::where('roster_process_id', $validatedData['roster_process'])->where('profile_id', $validatedData['profile_id'])->where('set_as_current_process', 1)->where('is_completed', 0)->first();
            if (!empty($checkRejectedProcess)) {
                $activeStep = RosterStep::where('roster_process_id', $checkRejectedProcess->roster_process_id)->where('order', $checkRejectedProcess->current_step)->first();
                $errorMessage = !empty($activeStep) ? __('roster.error.hasActiveWithStep', ['step' => $activeStep->step]) : __('roster.error.hasActive');
                return response()->error($errorMessage, 500);
            } else {
                $alreadyAccepted = ProfileRosterProcess::where('roster_process_id', $validatedData['roster_process'])->where('profile_id', $validatedData['profile_id'])->where('is_completed', 1)->first();
                if (!empty($alreadyAccepted)) {
                    return response()->error(__('roster.error.alreadyAccepted'), 500);
                } else {
                    $last_process = $last_process->where('set_as_current_process', 0)->where('is_completed', 0);
                }
            }
        } elseif ($current_step->last_step == 1) {
            $last_process = $last_process->where('is_completed', 1);
        } else {
            $last_process = $last_process->where('set_as_current_process', 1);
        }
        $last_process = $last_process->orderBy('created_at','desc')->first();

        if ($roster_step->set_rejected == 1) {
            $saved = $last_process->fill(['current_step' => $roster_step->order, 'is_rejected' => 1, 'is_completed' => 0, 'set_as_current_process' => 0, 'mover_id' => auth()->user()->id, 'moved_date' => Carbon::now()->toDateString()])->save();
            if ($saved) {
                Mail::to($profile->user->email)->send(new ApplicantRosterRejected($profile->user->full_name, $roster_process->name));
            }
        } elseif ($roster_step->last_step == 1) {
            $saved = $last_process->fill(['current_step' => $roster_step->order, 'is_rejected' => 0, 'is_completed' => 1, 'set_as_current_process' => 0, 'mover_id' => auth()->user()->id, 'moved_date' => Carbon::now()->toDateString()])->save();
            if ($saved) {
                Mail::to($profile->user->email)->send(new RosterAccepted($profile->user->full_name, auth()->user()->immap_email, $roster_process->name));
                $surgePing = new SurgePingService();
                $surgePing->Ping();
            }
        } else {
            $saved = $last_process->fill(['current_step' => $roster_step->order, 'is_rejected' => 0, 'is_completed' => 0, 'set_as_current_process' => 1, 'mover_id' => auth()->user()->id, 'moved_date' => Carbon::now()->toDateString()])->save();
            if ($saved) {
                Mail::to($profile->user->email)->send(new ApplicantMoveToNewStatusRosterProcess($profile->user->full_name, $roster_step->step, $roster_process->name, $roster_process->id));
            }
        }

        if ($saved && $profile) {
            $this->changeUserStatusBasedOnNewRosterStep($profile, $roster_process);
            return response()->success(__('roster.success.next_step', ['step' => $roster_step->step]));
        }

        return response()->error(__('roster.error.next_step', ['step' => $roster_step->step]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/skype-call-invitation",
     *   tags={"Roster"},
     *   summary="Sent skype call invitation to profile, called when Send Invitation button is clicked",
     *   description="File: app\Http\Controllers\API\RosterController@skypeInvitation, permission:Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step", "roster_step_id", "profile_id", "has_skype_call", "skype", "skype_date", "skype_timezone"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and roster_processes", example=0),
     *              @SWG\Property(property="roster_step_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="has_skype_call", type="integer", enum={0,1}, description="Check if current step has_skype_call == 1, if true send invitation", example=1),
     *              @SWG\Property(property="skype", type="string", description="Skype id for interview", example="live:immapmanager"),
     *              @SWG\Property(property="skype_date", type="string", description="Skype call date and time [date_format:Y-m-d H:i:s]", example="2020-11-14 10:30:00"),
     *              @SWG\Property(property="skype_timezone", type="string", description="Skype call timezone", example="Asia/Jakarta")
     *           )
     *         )
     *       )
     *    )
     * )
     *
     */
    public function skypeInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'roster_step_id' => 'required|integer|exists:roster_steps,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'has_skype_call' => 'required|boolean',
            'skype' => 'required|string',
            'skype_date' => 'required|date_format:Y-m-d H:i:s',
            'skype_timezone' => 'required|in:' . implode(",", config('timezone'))
        ]);

        $profile = Profile::findOrFail($validatedData['profile_id']);
        $roster_step = RosterStep::findOrFail($validatedData['roster_step_id']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']['value']);

        if ($roster_step->has_skype_call == 1 && $validatedData['has_skype_call'] == 1) {
            Mail::to($profile->user->email)->send(
                new SkypeInvitation(
                    $roster_process->name,
                    $profile->user->full_name,
                    date('l, d F Y, H:i', strtotime($validatedData['skype_date'])),
                    $validatedData['skype_timezone'],
                    $validatedData['skype'],
                    auth()->user(),
                    $roster_step,
                    $roster_process->under_sbp_program == "yes" ? true : false
                ));

            $saved = $profile->roster_processes()
                ->where('become_roster', 1)
                ->wherePivot('current_step', $validatedData['current_step'])
                ->updateExistingPivot($roster_process->id, [
                    'skype' => $validatedData['skype'],
                    'skype_date' => $validatedData['skype_date'],
                    'skype_timezone' => $validatedData['skype_timezone'],
                    'skype_invitation_done' => 1
                ]);

            if ($saved && $profile) {
                return response()->success(__('roster.success.skype_invite'));
            }

            return response()->error(__('crud.error.default'), 500);
        }

        return response()->error(__('roster.error.not_skype'), 404);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/im-test-invitation",
     *   tags={"Roster"},
     *   summary="Sent IM Test invitation to profile, called when Send IM Test button is clicked",
     *   description="File: app\Http\Controllers\API\RosterController@imTestInvitation, permission:Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step", "roster_step_id", "profile_id", "has_im_test", "im_test_template_id", "im_test_submit_date", "im_test_timezone"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and roster_processes", example=0),
     *              @SWG\Property(property="roster_step_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="has_im_test", type="integer", enum={0,1}, description="Check if current step has_im_test == 1, if true send invitation", example=1),
     *              @SWG\Property(property="im_test_template_id", type="integer", description="IM test template id", example=1),
     *              @SWG\Property(property="im_test_submit_date", type="string", description="IM Test date and time [date_format:Y-m-d H:i:s]", example="2020-11-14 10:30:00"),
     *              @SWG\Property(property="im_test_timezone", type="string", description="Skype call timezone", example="Asia/Jakarta")
     *           )
     *         ),
     *
     *       )
     *    )
     *
     * )
     *
     **/
    public function imTestInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'roster_step_id' => 'required|integer|exists:roster_steps,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'has_im_test' => 'required|boolean',
            'im_test_template_id' => 'required|integer|exists:im_test_templates,id',
            'im_test_submit_date' => 'required|date_format:Y-m-d H:i:s',
            'im_test_timezone' => 'required|in:' . implode(",", config('timezone'))
        ]);

        $profile = Profile::findOrFail($validatedData['profile_id']);
        $roster_step = RosterStep::findOrFail($validatedData['roster_step_id']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']['value']);

        $hr_manager = auth()->user();

        if ($roster_step->has_im_test == 1 && $validatedData['has_im_test'] == 1) {
            Mail::to($profile->user->email)->send(new IMTestInvitation($profile->user->full_name, date('l, d F Y, H:i:s', strtotime($validatedData['im_test_submit_date'])), $validatedData['im_test_timezone'], $validatedData['im_test_template_id'],$hr_manager['immap_email']));

            $saved = $profile->roster_processes()
                ->where('become_roster', 1)
                ->wherePivot('current_step', $validatedData['current_step'])
                ->wherePivot('roster_process_id', $validatedData['roster_process']['value'])
                ->updateExistingPivot($roster_process->id, [
                    'im_test_template_id' => $validatedData['im_test_template_id'],
                    'im_test_submit_date' => $validatedData['im_test_submit_date'],
                    'im_test_submit_date_on_server' => Carbon::createFromFormat('Y-m-d H:i:s', $validatedData['im_test_submit_date'], $validatedData['im_test_timezone'])->setTimezone(config('app.timezone')),
                    'im_test_timezone' => $validatedData['im_test_timezone'],
                    'im_test_invitation_done' => 1
                ]);

            if ($saved && $profile) {
                return response()->success(__('roster.success.im_test_invite'));
            }

            return response()->error(__('crud.error.default'), 500);
        }

        return response()->error(__('roster.error.not_im_test'), 404);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/interview-invitation",
     *   tags={"Roster"},
     *   summary="Sent interview invitation to a profile, called when Send Invitation button is clicked",
     *   description="File: app\Http\Controllers\API\RosterController@interviewInvitation, permission:Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step", "roster_step_id", "profile_id", "has_interview", "panel_interview", "immaper", "interview_skype", "interview_date", "interview_timezone", "interview_type"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and roster_processes", example=0),
     *              @SWG\Property(property="roster_step_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Check if current step has_interview == 1, if true send invitation", example=1),
     *              @SWG\Property(
     *                  property="panel_interview",
     *                  type="array",
     *                  description="List of panel interview, consist of iMMAPer List",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="User id, should be exists on users table", example=3),
     *                      @SWG\Property(property="label", type="string", description="iMMAPer label in select field", example="jdoe@organization.org - (John Doe)"),
     *                      @SWG\Property(property="value", type="string", description="iMMAPer email", example="jdoe@organization.org")
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="immaper",
     *                  type="array",
     *                  description="List of bcc list, consist of iMMAPer List (Same with panel_interview), redundant to accomodate old system and new recruitment",
     *                  @SWG\Items(
     *                      type="string",
     *                      description="Contain iMMAPer email address"
     *                  )
     *              ),
     *              @SWG\Property(property="interview_skype", type="string", description="Skype id for interview", example="live:immapmanager"),
     *              @SWG\Property(property="interview_date", type="string", description="Interview date and time [date_format:Y-m-d H:i:s]", example="2020-11-14 10:30:00"),
     *              @SWG\Property(property="interview_timezone", type="string", description="Interview timezone", example="Asia/Jakarta"),
     *              @SWG\Property(property="interview_type", type="integer", enum={0,1}, description="Interview type (Physical == 1 or Call == 0)", example=0),
     *              @SWG\Property(property="interview_address", type="string", description="Interview physical address", example="Baker Street 221B")
     *           )
     *         ),
     *       )
     *    )
     *
     * )
     *
     **/
    public function interviewInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'roster_step_id' => 'required|integer|exists:roster_steps,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'has_interview' => 'required|boolean',
            'panel_interview' => 'sometimes|required_if:is3Heads,0|array',
            'immaper' => 'sometimes|required_if:is3Heads,0|array',
            'interview_date' => 'required|date_format:Y-m-d H:i:s',
            'interview_timezone' => 'required|in:' . implode(",", config('timezone')),
            'interview_type' => 'required|boolean',
            "interview_address" => 'sometimes|nullable|required_if:interview_type,1|string',
            'microsoft_access_token' => 'sometimes|nullable|string',
            'microsoft_refresh_token' => 'sometimes|nullable|string',
            'microsoft_token_expire' => 'sometimes|nullable|string',
            'commentText' => 'sometimes|nullable|string',
            "immaper_invite" => 'sometimes|required_if:is3Heads,0|array',
            "is3Heads" => 'sometimes|nullable|boolean',
            "profile_roster_id" => 'sometimes|nullable|integer',
        ]);

        $bcc = $validatedData['immaper'];
        $profile = Profile::findOrFail($validatedData['profile_id']);
        $roster_step = RosterStep::findOrFail($validatedData['roster_step_id']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']['value']);
        $user = $profile->user;

        if (($roster_step->has_interview == 1 && $validatedData['has_interview'] == 1) || $validatedData['is3Heads'] === 1) {
            // Physical Interview
            //if interview_type == 1 sent email with another template because interview_adress
            // if($validatedData['interview_type']==1) {
            //     Mail::to($profile->user->email)->bcc($bcc)->
            //         send(new RosterInterviewPhysical(
            //             $profile->user->full_name,
            //             date('l, d F Y, H:i', strtotime($validatedData['interview_date'])),
            //             $validatedData['interview_timezone'],
            //             $validatedData['interview_skype'],
            //             auth()->user()->immap_email,
            //             auth()->user()->full_name,
            //             $validatedData['interview_address']));
            // } else {
            // }

            $calendarService = new CalendarService();

            if(empty($validatedData['microsoft_access_token'])) {
                return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            $hr_profile = auth()->user()->profile;

            $graphKeys = [];
            $graphKeys['microsoft_access_token'] = $validatedData['microsoft_access_token'];
            $graphKeys['microsoft_refresh_token'] = $validatedData['microsoft_refresh_token'];
            $graphKeys['microsoft_token_expire'] = $validatedData['microsoft_token_expire'];

            $event = [];
            $event['eventSubject'] = $roster_process->name;
            $event['eventAttendees'] = array_merge($validatedData['immaper_invite'], [$hr_profile->immap_email, $profile->user->email]);
            if($validatedData['is3Heads'] !== 1) {
                $event['eventEnd'] = Carbon::parse($validatedData['interview_date'])->addHour(1)->format('l, d F Y, H:i');
            } else {
                $event['eventEnd'] = Carbon::parse($validatedData['interview_date'])->addMinutes(30)->format('l, d F Y, H:i');
            }
            $event['eventStart'] = date('l, d F Y, H:i', strtotime($validatedData['interview_date']));
            $event['timezone'] = $validatedData['interview_timezone'];
            $eventBody = '';
            if($validatedData['is3Heads'] !== 1) {
                $eventBody = '<p style="font-size:16px;color:#74787e;line-height:1.4"><span style="color:black;font-weight:bold;">Dear '.$user->full_name.'</span>,<br /><br />Congratulations, your profile was selected as a match for the <strong>'.$roster_process->name.'</strong> position.<br /><br />We would like to invite you for an online interview using the link from below (Microsoft Teams).<br />
                Proposed date: <strong>'.date('l, d F Y, H:i', strtotime($validatedData['interview_date'])).' '.$validatedData['interview_timezone'].' time</strong>.<br /><br />
                Please confirm the scheduled interview by accepting this online meeting invite. Alternatively, please reply to '.$hr_profile->immap_email.' with your suggested date and time.<br /><br />
                <span style="padding-top: 10px;padding-bottom: 10px;font-size:16px;color:#74787e;line-height:1.4"><b>Additional Comments</b></br><i>'.nl2br($validatedData['commentText']).'</i></span><br /><br />
                Thank you and best regards,<br />
                iMMAP Careers</p>';
            } else {
                $eventBody='<p style="font-size:16px;color:#74787e;line-height:1.4"><span style="color:black;font-weight:bold;">Dear '.$user->full_name.'</span>,<br /><br />iMMAP is pleased to inform you that your profile has been selected to participate in the iMMAP <strong>'.$roster_process->name.'</strong> selection process.<br /><br />we would like to invite you for an online introductory call using the link from below (Microsoft Teams).<br />
                Proposed date: <strong>'.date('l, d F Y, H:i', strtotime($validatedData['interview_date'])).' '.$validatedData['interview_timezone'].' time</strong>.<br /><br />
                Please confirm the scheduled interview by accepting this online meeting invite. Alternatively, please reply to '.$hr_profile->immap_email.' with your suggested date and time.<br /><br />
                <span style="padding-top: 10px;padding-bottom: 10px;font-size:16px;color:#74787e;line-height:1.4"><b>Additional Comments</b></br><i>'.nl2br($validatedData['commentText']).'</i></span><br /><br />
                Thank you and best regards,<br />
                iMMAP Careers</p>';
            }
            $event['eventBody'] = $eventBody;
            $event['isOnline'] = true;

            $result = $calendarService->createNewEvent((object) $event, (object) $graphKeys);

            if(empty($result)) {
                return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            $saved = 1;
            if(!$validatedData['is3Heads']) {
                Mail::to($profile->user->email)->bcc($bcc)->send(new RosterInterviewInvitation($profile->user->full_name, date('l, d F Y, H:i', strtotime($validatedData['interview_date'])), $validatedData['interview_timezone'], '', auth()->user()->immap_email, auth()->user()->full_name, $hr_profile->job_title, $roster_process, $validatedData['commentText']));
                $saved = $profile->roster_processes()
                ->where('become_roster', 1)
                ->wherePivot('current_step', $validatedData['current_step'])
                // ->wherePivot('interview_invitation_done', 0)
                ->updateExistingPivot($roster_process->id, [
                    'interview_date' => $validatedData['interview_date'],
                    'interview_type' => $validatedData['interview_type'],
                    'interview_address' => $validatedData['interview_address'],
                    'interview_timezone' => $validatedData['interview_timezone'],
                    'interview_invitation_done' => 1,
                    'panel_interview' => json_encode($validatedData['panel_interview'])
                ]);
                if(isset($validatedData["profile_roster_id"])) (new JobInterviewScoreController)->setRosterFinalScore($validatedData['roster_process']['value'], $validatedData["profile_roster_id"]);
            } else  {
                Mail::to($profile->user->email)->bcc($bcc)->send(new ThreeHeadsInvitation($profile->user->full_name, date('l, d F Y, H:i', strtotime($validatedData['interview_date'])), $validatedData['interview_timezone'], '', auth()->user()->immap_email, auth()->user()->full_name, $hr_profile->job_title, $roster_process, $validatedData['commentText']));
                $saved = $profile->roster_processes()
                ->where('become_roster', 1)
                ->wherePivot('current_step', $validatedData['current_step'])
                ->updateExistingPivot($roster_process->id, [
                    'skype_date' => $validatedData['interview_date'],
                    'skype_timezone' => $validatedData['interview_timezone'],
                    'skype_invitation_done' => 1
                ]);
            }
                if ($saved && $profile) {
                return response()->success(__('roster.success.interview_invite'));
            }

            return response()->error(__('crud.error.default'), 500);
        }

        return response()->error(__('roster.error.not_interview'), 404);
    }

    /**
     * Generate Reference in the Word format
     *
     * @param object data
     * @param object reference
     *
     *
     */
    public function referenceWordFile($data, $reference, $referenceHistory, $profile_roster_process_id)
    {
        $date = date("Y-m-d");
        $fileName = "Reference-{$reference->id}";
        $rosterName = preg_replace('/[^A-Za-z0-9\-]/', '-', $data['roster_process']->name);
        $storagePath = storage_path("app/public/references/Reference-{$data['user']->full_name}-{$rosterName}.docx");
        $templatePath = resource_path("views/reference-check/reference-check.docx");

        $data['reference'] = $reference;

        $values = [
            'applicant' => $data['user']->full_name,
            'position_name' => $data['roster_process']->name,
            'referee' => $reference->full_name,
        ];

        WordService::fromTemplate($storagePath, $templatePath, $values);
        $referenceHistory->addMedia($storagePath)->toMediaCollection('reference_file'.$reference->id.$data['roster_process']->name.$profile_roster_process_id, 's3');
    }

    /**
     * send reference invite
     *
     * @param object referenceId
     * @param object rosterProcess
     * @param object profile
     *
     */
    public function sendReferenceCheckInvitation($referenceId, $roster_process, $profile, $code, $validatedData, $hr_manager) {
        $reference = P11Reference::where('id', $referenceId)->first();
        $referenceHistory = ReferenceHistory::where('reference_id', $referenceId)->where('roster_process_id', $roster_process->id)->first();
        if($referenceHistory) {
            $referenceHistory->code = $code;
            $referenceHistory->save();
        } else {
            ReferenceHistory::create([
                'reference_id' => $referenceId,
                'roster_process_id' => $roster_process->id,
                'code' => $code,
                'reference_sender_id' => $hr_manager->id,
            ]);
        }
        $referenceHistory = ReferenceHistory::where('reference_id', $referenceId)->where('roster_process_id', $roster_process->id)->first();

        $file = $referenceHistory->getMedia('reference_file'.$referenceId.$roster_process->title.$validatedData['profile_roster_process_id'])->first();
        if(!isset($file)) {
            $this->referenceWordFile(['roster_process' => $roster_process, 'user' => $profile->user, 'profile' => $profile], $reference, $referenceHistory, $validatedData['profile_roster_process_id']);
            $file = ReferenceHistory::where('reference_id', $referenceId)->where('roster_process_id', $roster_process->id)->first()->getMedia('reference_file'.$referenceId.$roster_process->name.$validatedData['profile_roster_process_id'])->first();
        }
        Mail::to($reference->email)->send(new ReferenceCheckMail($reference->full_name, $profile->user->full_name, $validatedData["profile_roster_process_id"], $referenceHistory->id, $hr_manager->immap_email, $reference->organization, $code, $file->getPathFromS3(), 'roster', $roster_process->name));
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/reference-check-invitation",
     *   tags={"Roster"},
     *   summary="Send invitation to fill reference form for everey reference listed in profile",
     *   description="File: app\Http\Controllers\API\RosterController@referenceCheckInvitation, permission:Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step", "roster_step_id", "profile_id", "has_reference_check", "reference_check_id"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and roster_processes", example=0),
     *              @SWG\Property(property="roster_step_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="has_reference_check", type="integer", enum={0,1}, description="Check if current step has_reference_check == 1, if true send invitation", example=1),
     *              @SWG\Property(property="reference_check_id", type="integer", description="category_question_reference table id", example=3)
     *           )
     *         ),
     *
     *       )
     *    )
     * )
     *
     **/
    public function referenceCheckInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'roster_step_id' => 'required|integer|exists:roster_steps,id',
            'profile_id' => 'required|integer|exists:profiles,id',
            'has_reference_check' => 'required|boolean',
            'reference_check_id' => 'required|integer|exists:category_question_reference,id',
            'profile_roster_process_id' => 'required|integer',
            'p11_reference_id' => 'sometimes|integer',
        ]);

        $profile = Profile::with('user')->findOrFail($validatedData['profile_id']);
        $roster_step = RosterStep::findOrFail($validatedData['roster_step_id']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']['value']);
        $referenceCheck = ReferenceCheck::findOrFail($validatedData['reference_check_id']);

        $hr_manager = auth()->user();

        if ($roster_step->has_reference_check == 1 && $validatedData['has_reference_check'] == 1) {
            foreach ($profile->p11_references as $reference) {
                $code = rand(1231,7879);
                if(isset($validatedData["p11_reference_id"]) && $validatedData["p11_reference_id"] == $reference->id) {
                    $this->sendReferenceCheckInvitation($reference->id, $roster_process, $profile, $code, $validatedData, $hr_manager);
                    break;
                } else if(!isset($validatedData["p11_reference_id"])) {
                    $this->sendReferenceCheckInvitation($reference->id, $roster_process, $profile, $code, $validatedData, $hr_manager);
                }
            }
            // Email notification to the profile
            // Mail::to($profile->user->email)->send(new ReferenceCheckMail($profile->user->full_name, date('l, d F Y, H:i',strtotime($validatedData['interview_date'])), $validatedData['interview_timezone'], $validatedData['interview_skype'], auth()->user()->immap_email ,auth()->user()->full_name));

            $saved = $profile->roster_processes()
                ->where('become_roster', 1)
                ->wherePivot('current_step', $validatedData['current_step'])
                ->updateExistingPivot($roster_process->id, [
                    'reference_check_id' => $validatedData['reference_check_id']
                ]);

            if ($saved && $profile) {
                return response()->success(__('roster.success.reference_check_invite'));
            }

            return response()->error(__('crud.error.default'), 500);
        }

        return response()->error(__('roster.error.not_reference_check'), 404);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/reference-check-verify",
     *   tags={"Roster"},
     *   summary="Verify reference check invitation link",
     *   description="File: app\Http\Controllers\API\RosterController@referenceCheckVerifyCode",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"profile_id", "code", "reference_id"},
     *              @SWG\Property(property="profile_id", type="integer", description="Profile id", example=578),
     *              @SWG\Property(property="code", type="integer", description="code to verify link", example=0),
     *              @SWG\Property(property="reference_id", type="integer", description="Reference Id", example=2),
     *            )
     *         ),
     *
     *       )
     *    )
     * )
     *
     **/
    public function referenceCheckVerifyCode(Request $request)
    {
        $validatedData = $this->validate($request, [
            'reference_id' => 'required|integer',
            'profile_roster_id' => 'required|integer',
            'code' => 'required|string',
        ]);
        $profileRoster = ProfileRosterProcess::with(['profile', 'profile.user', 'roster_process'])->findOrFail($validatedData['profile_roster_id']);
        if(!$profileRoster) {
            return response()->error(__('roster.error.not_found'), 404);
        }
        $existingReference = ReferenceHistory::where('id', $validatedData['reference_id'])->where('roster_process_id', $profileRoster->roster_process_id )->where('code', $validatedData['code'])->whereNotNull('code')->get()->first();
        if($existingReference) return response()->success(__('roster.success.interview_invite'), $profileRoster);
        return response()->error(__('roster.error.not_reference_check'), 404);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/{id}/count",
     *   tags={"Roster"},
     *   summary="Get total number of profiles in each roster step",
     *   description="File: app\Http\Controllers\API\RosterController@getRosterCountByStep, permission:Index Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster process id"
     *    ),
     * )
     *
     **/
    public function getRosterCountByStep($id) {
        $userPerStep = ProfileRosterProcess::where('roster_process_id', $id)
                        ->whereHas('profile', function(Builder $query) {
                            $query->where('profiles.become_roster', 1);
                        })
                        ->whereHas('profile.user', function(Builder $query) {
                            $query->where('users.p11Completed', 1)->whereIn('users.status', ['Active', 'Inactive']);
                            // for a user who don't have access to archive feature
                            if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile'])) {
                                $query->where('users.archived_user', "no");
                            }
                        })
                        ->select('current_step', DB::raw("count(profile_id) as total"))
                        ->groupBy('current_step')
                        ->get();

        $userRejected = ProfileRosterProcess::where('roster_process_id', $id)
                        ->whereHas('profile.user', function(Builder $query) {
                            $query->where('users.p11Completed', 1)->whereIn('users.status', ['Active', 'Inactive']);
                            // for a user who don't have access to archive feature
                            if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile'])) {
                                $query->where('users.archived_user', "no");
                            }
                        })
                        ->whereYear('profile_roster_processes.updated_at', '>=', date('Y'))
                        ->where('profile_roster_processes.is_completed', 0)->where('profile_roster_processes.is_rejected', 1)
                        ->count();

        $perStep['rejectedThisYear'] = $userRejected;
        $perStep['steps'] = $userPerStep;

        return response()->success(__('crud.success.default'), $perStep);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster/download-roster-profiles/{id}/{step}",
     *   tags={"Roster"},
     *   summary="Download profiles data based on selected roster process and current step",
     *   description="File: app\Http\Controllers\API\RosterController@downloadRosterProfiles, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster process id"
     *    ),
     * @SWG\Parameter(
     *       name="step",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster process step id"
     *    ),
     * )
     *
     */
    public function downloadRosterProfiles(int $id, int $roster_step_id )
    {
        $validatedData = $this->validate( new Request(['id' => $id, 'roster_step_id' => $roster_step_id]),[
            'id' => 'required|integer|exists:roster_processes,id',
            'roster_step_id' => 'required|integer|exists:roster_steps,id'
        ]);

        $roster_process = RosterProcess::findOrFail($validatedData['id']);
        $roster_step = RosterStep::where('id', $validatedData['roster_step_id'])->where('roster_process_id', $roster_process->id)->first();

        $rosterProfiles = ProfileRosterProcess::with(['profile'])
                           ->where('roster_process_id', $roster_process->id)
                           ->where('current_step', $roster_step->order)
                           ->whereHas('profile', function(Builder $query) {
                                $query->where('profiles.become_roster', 1);
                            })
                           ->whereHas('profile.user', function(Builder $query) {
                                $query->where('users.p11Completed', 1)->whereIn('users.status', ['Active', 'Inactive']);
                                // for a user who don't have access to archive feature
                                if (!$this->authUser->hasAnyPermission(['Set as Admin', 'Can Archive a Profile'])) {
                                    $query->where('users.archived_user', "no");
                                }
                            })
                           ->get();
        $profiles = [];

        foreach($rosterProfiles as $rosterProfile) {
            $data['name'] = $rosterProfile->profile->user->full_name;
            $data['email'] = $rosterProfile->profile->user->email;
            $data['degree'] = count($rosterProfile->profile->p11_education_universities) != 0 ? $rosterProfile->profile->p11_education_universities[0]->degree_level->name : '-';
            $data['Education'] = count($rosterProfile->profile->p11_education_universities) != 0 ? $rosterProfile->profile->p11_education_universities[0]->degree : '-';
            $data['nationality'] = count($rosterProfile->profile->birth_nationalities) != 0 ? $rosterProfile->profile->birth_nationalities[0]->nationality : '-' ;
            $data['present_country'] =  count($rosterProfile->profile->birth_nationalities) != 0 ? $rosterProfile->profile->present_nationalities[0]->name : '-' ;
            $data['applied_date'] =   count($rosterProfile->profile->roster_processes) != 0  ? $rosterProfile->profile->roster_processes[count($rosterProfile->profile->roster_processes) - 1]->pivot->created_at->format('d/m/Y, H:i') : '-';
            array_push($profiles, $data);
        }

        $profiles = new RosterProfileExport($profiles, $roster_process->name, $roster_step->step);
        ob_end_clean(); // this
        ob_start(); // and this
        return Excel::download($profiles, 'profiles.xlsx');
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-recruitment-eligibility-check",
     *   tags={"Roster"},
     *   summary="Check if the user eligible to apply to roster recruiment campaign",
     *   description="File: app\Http\Controllers\API\RosterController@downloadRosterProfiles",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="skillset",
     *       in="query",
     *       type="string",
     *       description="Roster skillset"
     *    ),
     * )
     */
    function rosterRecruitmentEligibilityCheck(Request $request)
    {
        // validate the skillset
        $validatedData = $this->validate($request, ['skillset' => $this->rosterSkillsetValidationRule()]);

        // check for the logged in user
        $user = auth()->user();
        if (empty($user)) {
            return response()->success(__('crud.success.default'), false);
        }

        // check if there user has active roster recruitment or already accepted
        $activeRosterProcess = ProfileRosterProcess::where('profile_id', $user->profile->id)
            ->where('is_rejected', 0)
            ->whereHas('roster_process', function($query) use ($validatedData) {
                $query->where('under_sbp_program', 'yes')->where('skillset', $validatedData['skillset']);
            })->get();

        if ($activeRosterProcess->count() == 0) {
            return response()->success(__('crud.success.default'), true);
        }

        return response()->success(__('crud.success.default'), false);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster/save-im-test-score/{id}",
     *   tags={"Roster"},
     *   summary="Roster - Save IM Test Score",
     *   description="File: app\Http\Controllers\API\RosterController@saveIMTestScore, Permission: Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="profile roster process id"),
     *   @SWG\Parameter(
     *          name="roster",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "im_test_sharepoint_link", "im_test_score"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="im_test_sharepoint_link", type="string", description="IM/M&E/GIS test result link on sharepoint"),
     *              @SWG\Property(property="im_test_score", type="integer", minimum=0, maximum=0, description="IM/M&E/GIS test score in (%)", example="75"),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function saveIMTestScore(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'im_test_sharepoint_link' => 'required|url',
            'im_test_score' => 'required|integer|min:0|max:100'
        ]);

        $profileRosterProcess = ProfileRosterProcess::find($id);

        if (!$profileRosterProcess) {
            return response()->not_found();
        }

        $profileRosterProcess->im_test_sharepoint_link = $validatedData['im_test_sharepoint_link'];
        $profileRosterProcess->im_test_score = $validatedData['im_test_score'];
        $profileRosterProcess->save();

        return response()->success(__('crud.success.default'));
    }

     /**
     * @SWG\GET(
     *   path="/api/roster-deployement-file/{userId}/{token}",
     *   tags={"Roster"},
     *   summary="Get Roster Deployement File",
     *   description="File: app\Http\Controllers\API\RosterController@getRosterDeployementFile",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User Id"
     *    ),
     *      @SWG\Parameter(
     *       name="token",
     *       in="path",
     *       required=true,
     *       type="string",
     *       description="On time token"
     *    )
     * )
     */
    public function getRosterDeployementFile(int $userId, string $token)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
        }

        $token = OneTimeTokens::where('user_id', $user->id)->where('token', $token)->first();
        if (!$token) {
            return response()->error(__('auth.error.unauthorized'), 401, __('auth.error.unauthorized'));
        } else {
            $token->delete();
            $file = storage_path('app/public/roster-files/surge_matrix.xlsx');
            return response()->download($file);
        }
    }

     /**
     * @SWG\Post(
     *   path="/api/roster/send-group-invitations",
     *   tags={"Roster"},
     *   summary="Send group invitation to a profile, called when Send Invitation button is clicked",
     *   description="File: app\Http\Controllers\API\RosterController@interviewInvitation, permission:Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="roster",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"roster_process", "current_step", "roster_step_id", "profiles", "has_interview", "interview_date", "interview_timezone"},
     *              @SWG\Property(property="roster_process", type="object",
     *                  @SWG\Property(property="value", type="integer", description="Roster process id", example=5),
     *              ),
     *              @SWG\Property(property="profiles", type="array", description="Profile IDs",
     *                    @SWG\Items(
     *                  type="integer",
     *                  description="Profile id",
     *                  example=1,
     *              )
     *              ),
     *              @SWG\Property(property="current_step", type="integer", description="Current step (step order), saved inside pivot table between profiles and roster_processes", example=0),
     *              @SWG\Property(property="roster_step_id", type="integer", description="Roster step id", example=2),
     *              @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Check if current step has_interview == 1, if true send invitation", example=1),
     *              @SWG\Property(property="interview_date", type="string", description="Interview date and time [date_format:Y-m-d H:i:s]", example="2020-11-14 10:30:00"),
     *              @SWG\Property(property="interview_timezone", type="string", description="Interview timezone", example="Asia/Jakarta"),
     *           )
     *         ),
     *       )
     *    )
     *
     * )
     *
     **/
    public function sendInvitationsGroup(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process' => 'required',
            'roster_process.value' => 'required|integer|exists:roster_processes,id',
            'current_step' => 'required|integer',
            'roster_step_id' => 'required|integer|exists:roster_steps,id',
            'profiles' => 'required|array',
            'has_interview' => 'required|boolean',
            'interview_date' => 'required|date_format:Y-m-d H:i:s',
            'interview_timezone' => 'required|in:' . implode(",", config('timezone')),
            'microsoft_access_token' => 'sometimes|nullable|string',
            'microsoft_refresh_token' => 'sometimes|nullable|string',
            'microsoft_token_expire' => 'sometimes|nullable|string',
            'commentText' => 'sometimes|nullable|string',
        ]);

        $profiles = Profile::whereIn('id', $validatedData['profiles'])->get();
        $applicantEmails = $profiles->pluck('email')->toArray();

        $roster_step = RosterStep::findOrFail($validatedData['roster_step_id']);
        $roster_process = RosterProcess::findOrFail($validatedData['roster_process']['value']);
        $calendarService = new CalendarService();

        if(empty($validatedData['microsoft_access_token'])) {
            return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $hr_profile = auth()->user()->profile;

        $graphKeys = [];
        $graphKeys['microsoft_access_token'] = $validatedData['microsoft_access_token'];
        $graphKeys['microsoft_refresh_token'] = $validatedData['microsoft_refresh_token'];
        $graphKeys['microsoft_token_expire'] = $validatedData['microsoft_token_expire'];

        $event = [];
        $event['eventSubject'] = $roster_process->name;
        $event['eventAttendees'] = array_merge($applicantEmails, [$hr_profile->immap_email]);
        $event['eventEnd'] = Carbon::parse($validatedData['interview_date'])->addMinutes(45)->format('l, d F Y, H:i');
        $event['eventStart'] = date('l, d F Y, H:i', strtotime($validatedData['interview_date']));
        $event['timezone'] = $validatedData['interview_timezone'];
        $eventBody='<p style="font-size:16px;color:#74787e;line-height:1.4"><span style="color:black;font-weight:bold;">Dear applicant </span>,<br /><br />You have applied to join the iMMAP Surge Roster. We invite you to attend the "iMMAP Surge Overview" presentation at the proposed
             <strong>'.date('l, d F Y, H:i', strtotime($validatedData['interview_date'])).' '.$validatedData['interview_timezone'].' time</strong>.<br /><br />
             The presentation itself will last 30 minutes and you will have the opportunity to ask questions at the end of the presentation. Here is the content of the presentation:<br />
                <ul style="font-size:16px;color:#74787e;line-height:1.4">
                    <li>iMMAP: international not-for-profit organization that provides information management services to humanitarian and development organizations.</li>
                    <li>iMMAP Global Surge Team.</li>
                    <li>Standby Partnership Programme and the deployment mechanisms.</li>
                    <li>The iMMAP Global Surge Roster and the steps to become member.</li>
                    <li>What iMMAP offers once you are deployed through the SBP Programme.</li>
                </ul>
            <span style="font-size:16px;color:#74787e;line-height:1.4"><a href="https://immap.sharepoint.com/:p:/s/GlobalSurge/EZa0o1_8YTpIjB8sBu5W0UwBuNdr-oUge9hje8mARg1CXw?rtime=pwoSocnX2kg">Link</a>  to iMMAP Global Surge Presentation</span><br /><br />
            <span style="font-size:16px;color:#74787e;line-height:1.4"><a href="https://immap.sharepoint.com/:w:/s/GlobalSurge/ETENvD7zGHhMhw0WfFkIvF0BafGHuQDsi3Rc7gDOz72ZPg?e=qWfhAQ">Link</a> to Q&A Roster Process</span><br /><br />
            <span style="font-size:16px;color:#74787e;line-height:1.4"><a href="https://mywebsite.org/global-surge-program/">Link</a> to Global Surge website</span><br /><br />
            <span style="font-size:16px;color:#74787e;line-height:1.4">iMMAP website: <a href="https://mywebsite.org"> immap.org</a></span><br /><br /><br />
            <span style="padding-top: 10px;padding-bottom: 10px;font-size:16px;color:#74787e;line-height:1.4"><b>Additional Comments</b></br><i>'.nl2br($validatedData['commentText']).'</i></span><br /><br />
            <span style="font-size:16px;color:#74787e;line-height:1.4">Please acknowledge receipt by validating your presence.</span><br />
            <span style="font-size:16px;color:#74787e;line-height:1.4">
            Thank you and best regards,<br />
            iMMAP Careers
            </span>
            </p>';

        $event['eventBody'] = $eventBody;
        $event['isOnline'] = true;

        $result = $calendarService->createNewEvent((object) $event, (object) $graphKeys);

        if(empty($result)) {
            return response()->error(config('microsoft_graph.URL_AUTHORIZE'), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        $saved = 1;

        Mail::to('surge@organization.org')->bcc($applicantEmails)->send(new ThreeHeadsInvitation('applicant', date('l, d F Y, H:i', strtotime($validatedData['interview_date'])), $validatedData['interview_timezone'], '', auth()->user()->immap_email, auth()->user()->full_name, $hr_profile->job_title, $roster_process, $validatedData['commentText']));

        foreach ($validatedData['profiles'] as $profile) {
            $profile = Profile::findOrFail($profile);

            $saved = $profile->roster_processes()
            ->where('become_roster', 1)
            ->wherePivot('current_step', $validatedData['current_step'])
            ->updateExistingPivot($roster_process->id, [
                'skype_date' => $validatedData['interview_date'],
                'skype_timezone' => $validatedData['interview_timezone'],
                'skype_invitation_done' => 1
            ]);
        }

        if ($saved) {
          return response()->success(__('roster.success.interview_invite'));
        }

        return response()->error(__('crud.error.default'), 500);
    }
}
