<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Skill;
use App\Models\Sector;
use App\Models\P11\P11CountryExperience;
use Illuminate\Support\Str;
use DateTime;
use App\Rules\SkillValue;

class P11EmploymentRecordController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11EmploymentRecord';
    const SINGULAR = 'employment record';

    const FILLABLE = [
        'employer_name', 'employer_address', 'from', 'to', 'job_title',
        'job_description', 'business_type', 'supervisor_name',
        'number_of_employees_supervised', 'kind_of_employees_supervised',
        'reason_for_leaving', 'profile_id', 'country_id', 'untilNow',
        // 'starting_salary', 'final_salary',
    ];

    const RULES = [
        'employer_name' => 'required|string|max:255',
        // 'employer_address' => 'required|string',
        'untilNow' => 'required|boolean',
        'from' => 'required|date',
        'to' => 'required_if:untilNow,0|date',
        // 'starting_salary' => 'required|integer',
        // 'final_salary' => 'required|integer',
        'job_title' => 'required|string|max:255',
        'job_description' => 'required|string',
        'business_type' => 'required|string|max:255',
        // 'supervisor_name' => 'required|string|max:255',
        'number_of_employees_supervised' => 'sometimes|nullable|integer',
        // 'kind_of_employees_supervised' => 'sometimes|nullable|string',
        // 'reason_for_leaving' => 'sometimes|nullable|max:255',
        'country_id' => 'required|integer',
        'skills' => 'required|array',
        // 'skills.*.value' => ['required',new SkillValue],
        'skills.*.label' => 'required|string',
        // 'skills.*.from' => 'sometimes|nullable|in:others',
        // 'skills.*.value' => 'required|'
        'sectors' => 'sometimes|nullable|array'
    ];

    protected $authUser, $authProfile, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    protected function updateSingleProfileSkill($skillId, $proficiency)
    {
        $p11_employment_records_skills = $this->authProfile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skillId) {
            $query->where('skill_id', $skillId);
        })->first();

        if (!empty($p11_employment_records_skills)) {
            $from = new DateTime($p11_employment_records_skills['min_from']);
            $to = new DateTime($p11_employment_records_skills['max_to']);
            $interval = $to->diff($from);

            $profile_skill = $this->authProfile->p11_skills()->where('skill_id', $skillId)->first();
            if (!empty($profile_skill)) {
                $proficiency = $profile_skill->proficiency >= $proficiency ? $profile_skill->proficiency : $proficiency;
                $profile_skill->fill([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'proficiency' => $proficiency
                ])->save();
            } else {
                $this->authProfile->p11_skills()->create([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'skill_id' => $skillId,
                    'proficiency' => $proficiency
                ]);
            }
        }
    }

    protected function saveSkills($record, $skills)
    {
        $proficiency = 0;
        if(isset($skill['proficiency'])){
            $proficiency = $skill['proficiency'];
        }
        $record->employment_skills()->detach();
        foreach ($skills as $skill) {
            if (array_key_exists('addedBy', $skill)) {
                if ($skill['addedBy'] === "others") {
                    $skillSlug = Str::slug($skill['label'], '-');
                    $isExistSkill = Skill::where('slug', $skillSlug)->first();
                    if (!empty($isExistSkill)) {
                        $record->employment_skills()->attach($isExistSkill->id, ['proficiency' => $proficiency]);
                        $this->updateSingleProfileSkill($isExistSkill->id, $proficiency);
                    } else {
                        $newSkill = Skill::create([
                            'skill' => $skill['label'],
                            'slug' => Str::slug($skill['label'], '-'),
                            'addedBy' => $skill['addedBy'],
                        ]);
                        $record->employment_skills()->attach($newSkill->id, ['proficiency' => $proficiency]);
                        $this->updateSingleProfileSkill($newSkill->id, $proficiency);
                    }
                }
            } elseif (is_int((int) $skill['value'])) {
                $record->employment_skills()->attach($skill['value'], ['proficiency' => $proficiency]);
                $this->updateSingleProfileSkill($skill['value'], $proficiency);
            }
        }
    }

    protected function updateSingleProfileSector($sectorId)
    {
        $p11_employment_records_sectors = $this->authProfile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sectorId) {
            $query->where('sector_id', $sectorId);
        })->first();

        if (!empty($p11_employment_records_sectors)) {
            $from = new DateTime($p11_employment_records_sectors['min_from']);
            $to = new DateTime($p11_employment_records_sectors['max_to']);
            $interval = $to->diff($from);

            $profile_sector = $this->authProfile->p11_sectors()->where('sector_id', $sectorId)->first();
            if (!empty($profile_sector)) {
                $profile_sector->fill([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y
                ])->save();
            } else {
                $this->authProfile->p11_sectors()->create([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'sector_id' => $sectorId,
                ]);
            }
        }
    }

    protected function saveSectors($record, $sectors)
    {
        $record->employment_sectors()->detach();
        foreach ($sectors as $sector) {
            if (array_key_exists('addedBy', $sector)) {
                if ($sector['addedBy'] === "others") {
                    $sectorSlug = Str::slug($sector['label'], '-');
                    $isExistSector = Sector::where('slug', $sectorSlug)->first();
                    if (!empty($isExistSector)) {
                        $record->employment_sectors()->attach($isExistSector->id);
                        $this->updateSingleProfileSector($isExistSector->id);
                    } else {
                        $newSector = Sector::create([
                            'name' => $sector['label'],
                            'slug' => Str::slug($sector['label'], '-'),
                            'addedBy' => $sector['addedBy'],
                        ]);
                        $record->employment_sectors()->attach($newSector->id);
                        $this->updateSingleProfileSector($newSector->id);
                    }
                }
            } elseif (is_int((int) $sector['value'])) {
                $record->employment_sectors()->attach($sector['value']);
                $this->updateSingleProfileSector((int) $sector['value']);
            }
        }
    }

    protected function updateProfileSkill($profile, $slugs)
    {
        foreach ($slugs as $slug) {
            $skill = Skill::where('slug', $slug)->first();

            $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill) {
                $query->where('skill_id', $skill->id);
            })->first();

            if (!empty($p11_employment_records_skills)) {
                $from = new DateTime($p11_employment_records_skills['min_from']);
                $to = new DateTime($p11_employment_records_skills['max_to']);
                $interval = $to->diff($from);

                $profile_skill = $profile->p11_skills()->where('skill_id', $skill->id)->first();
                if (!empty($profile_skill)) {
                    $profile_skill->fill([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y
                    ])->save();
                } else {
                    $profile->p11_skills()->create([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y,
                        'skill_id' => $skill->id,
                    ]);
                }
            }
        }
    }

    protected function destroyProfileSkill($profile)
    {
        $profile_skills = $profile->skills;
        foreach ($profile_skills->pluck('id') as $skill_id) {
            $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill_id) {
                $query->where('skill_id', $skill_id);
            })->first();

            if (!empty($p11_employment_records_skills)) {
                $from = new DateTime($p11_employment_records_skills['min_from']);
                $to = new DateTime($p11_employment_records_skills['max_to']);
                $interval = $to->diff($from);

                $profile_skill = $profile->p11_skills()->where('skill_id', $skill_id)->first();
                if (!empty($profile_skill)) {
                    $profile_skill->fill([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y
                    ])->save();
                } else {
                    $profile->p11_skills()->create([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y,
                        'skill_id' => $skill_id
                    ]);
                }
            }
        }
    }

    protected function updateProfileSector($profile, $sectorIds)
    {
        foreach ($sectorIds as $sectorId) {

            $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sectorId) {
                $query->where('sector_id', $sectorId);
            })->first();

            if (!empty($p11_employment_records_sectors)) {
                $from = new DateTime($p11_employment_records_sectors['min_from']);
                $to = new DateTime($p11_employment_records_sectors['max_to']);
                $interval = $to->diff($from);

                $profile_sector = $profile->p11_sectors()->where('sector_id', $sectorId)->first();
                if (!empty($profile_sector)) {
                    $profile_sector->fill([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y
                    ])->save();
                } else {
                    $profile->p11_sectors()->create([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y, 'sector_id' => $sectorId
                    ]);
                }
            }
        }
    }

    protected function destroyProfileSector($profile)
    {
        $sectors = $profile->sectors;
        foreach ($sectors->pluck('id') as $sector_id) {
            $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sector_id) {
                $query->where('sector_id', $sector_id);
            })->first();

            if (!empty($p11_employment_records_sectors)) {
                $from = new DateTime($p11_employment_records_sectors['min_from']);
                $to = new DateTime($p11_employment_records_sectors['max_to']);
                $interval = $to->diff($from);

                $profile_sector = $profile->p11_sectors()->where('sector_id', $sector_id)->first();
                if (!empty($profile_sector)) {
                    $profile_sector->fill([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y
                    ])->save();
                } else {
                    $profile->p11_sectors()->create([
                        'days' => $interval->days,
                        'months' => $interval->m,
                        'years' => $interval->y,
                        'sector_id' => $sector_id
                    ]);
                }
            }
        }
    }

    protected function saveWorkExperience($profile)
    {
        $min_from = '';
        $max_to = '';
        $employment_records = $profile->p11_employment_records;
        if ($employment_records->count() > 0) {
            foreach ($employment_records as $key => $employment_record) {
                if ($key == 0) {
                    $min_from = new DateTime($employment_record->from);
                    $max_to = new DateTime($employment_record->to);
                } else {
                    $current_min = new DateTime($employment_record->from);
                    $current_max = new DateTime($employment_record->to);
                    if ($min_from > $current_min) {
                        $min_from = $current_min;
                    } elseif ($max_to < $current_max) {
                        $max_to = $current_max;
                    }
                }
            }
            $experience = $max_to->diff($min_from);
            $updated = $profile->fill([
                'work_experience_years' => $experience->y,
                'work_experience_months' => $experience->m,
                'work_experience_days' => $experience->days,
            ])->save();
        } else {
            $updated = $profile->fill([
                'work_experience_years' => 0,
                'work_experience_months' => 0,
                'work_experience_days' => 0,
            ])->save();
        }
    }

    protected function saveWorkExperienceEachCountry()
    {
        $profile = $this->authProfile;
        $country_ids = $profile->p11_employment_records->pluck('country_id')->toArray();

        if (count($country_ids) > 0) {
            $countryList = array_unique($country_ids);
            foreach($countryList as $country_id) {
                $record_in_countries = $profile->p11_employment_records()->where('country_id', $country_id)->get();

                $exp_years = 0;
                $exp_months = 0;
                $exp_days = 0;

                if (count($record_in_countries) > 0) {
                    foreach($record_in_countries as $expRecord) {
                        $from = date_create($expRecord->from);
                        $to = date_create($expRecord->to);
                        $interval = date_diff($to, $from);

                        $exp_years = $exp_years + $interval->y;
                        $exp_months = $exp_months + ($interval->m + ( $interval->y * 12 ));
                        $exp_days = $exp_days + $interval->days;
                    }

                    $p11_country_experiences = $profile->whereHas('p11_country_of_works', function($query) use ($profile, $country_id) {
                        $query->where('profile_id', $profile->id)->where('country_id', $country_id);
                    })->get();

                    if (count($p11_country_experiences) == 0) {
                        $p11_country_experience_saved = $profile->country_of_works()->attach($country_id, [
                            'years' => $exp_years,
                            'months' => $exp_months,
                            'days' => $exp_days
                        ]);
                    } else {
                        $p11_country_experience_updated = $profile->country_of_works()->updateExistingPivot($country_id, [
                            'years' => $exp_years,
                            'months' => $exp_months,
                            'days' => $exp_days
                        ]);
                    }
                }

            }
            $country_exp = $profile->p11_country_of_works->pluck('country_id')->toArray();
            $country_diff = array_diff($country_exp, $countryList);
            if (count($country_diff) > 0) {
                $profile->country_of_works()->detach($country_diff);
            }
        } else {
            $profile->country_of_works()->detach();
        }
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-employment-records",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Get list of all p11 employment records",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */


    /**
     * @SWG\GET(
     *   path="/api/p11-employment-records/{id}",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Show specific p11 employment records data",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 employment record id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with([
            'country', 'skills' => function ($query) {
                $query->select('skills.id as value', 'skill as label', 'category');
            }, //'sectors'
            'sectors' => function ($query) {
                $query->select('sectors.id as value', 'name as label');
            }
        ])->findOrFail($id);
        $record->sectors = $record->sectors->forget('pivot');
        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-employment-records",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Store p11 employment records data",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11EmploymentRecord",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"employer_name", "untilNow", "from", "job_title", "job_description",
     *          "business_type", "country_id", "skills"},
     *          @SWG\Property(property="employer_name", type="string", description="Name of Employer", example="iMMAP"),
     *          @SWG\Property(property="untilNow", type="integer", enum={0,1}, description="Current / still in the position", example=1),
     *          @SWG\Property(property="from", type="string", format="date", description="Work from [format date: Y-m-d]", example="2015-01-29"),
     *          @SWG\Property(property="to", type="string", format="date", description="Work unitl [format date: Y-m-d] required if until untilNow == 0", example="2017-12-31"),
     *          @SWG\Property(property="job_title", type="string", description="Exact title of the position", example="Communication Manager"),
     *          @SWG\Property(property="job_description", type="string", description="Describe of your duties", example="Manage communication between iMMAP and Partner"),
     *          @SWG\Property(property="business_type", type="string", description="Type of business", example="Nof-for-profit organization"),
     *          @SWG\Property(property="number_of_employees_supervised", type="integer", description="Number of employees supervised by you", example=10),
     *          @SWG\Property(property="country_id", type="integer", description="country where you work form [country id]", example=2),
     *          @SWG\Property(
     *              property="skills",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="label", type="string", description="label of the skills", example="Adobe Lightroom"),
     *                  @SWG\Property(property="value", type="string", description="value of the skill; for the existing skill use skill id, for new skill not on database -> put 'others-' string in the first 7 characters", example="others-2021-01-12,11:01:03"),
     *                  @SWG\Property(property="addedBy", type="string", enum={"others"}, description="it can be empty / or null, for new skill not on database", example="others")
     *              )
     *          ),
     *          @SWG\Property(
     *              property="sectors",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="label", type="string", description="label of the sectors", example="Development"),
     *                  @SWG\Property(property="value", type="string", description="value of the sector; for the existing sector use sector id, for new sector not on database -> put 'others-' string in the first 7 characters", example="others-2021-01-12,11:01:03"),
     *                  @SWG\Property(property="addedBy", type="string", enum={"others"}, description="it can be empty / or null, for new sector not on database", example="others")
     *              )
     *          )
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $rules = $this->rules;
        $rules['skills.*.value'] = ['required', new SkillValue];
        $validatedData = $this->validate($request, $rules);

        $employmentRecordData = $request->only($this->fillable);
        $employmentRecordData['profile_id'] = $this->authProfileId;

        if ($employmentRecordData['untilNow'] == 1) {
            $employmentRecordData['to'] = date('Y-m-d');
            $this->model::where('untilNow', 1)->where('profile_id', $this->authProfileId)->update(['untilNow' => 0]);
        }

        $record = $this->model::create($employmentRecordData);

        if (!$record) {
            return response()->not_found();
        }

        if (count($validatedData['skills'])) {
            $this->saveSkills($record, $validatedData['skills']);
        }

        if (!empty($validatedData['sectors'])) {
            $this->saveSectors($record, $validatedData['sectors']);
        }

        $this->saveWorkExperienceEachCountry();

        $this->saveWorkExperience($record->profile);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/p11-employment-records/{id}",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Update specific p11 employment records data",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@update, permission:P11 Access",
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
     *       description="P11 employment record id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11EmploymentRecord",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "employer_name", "untilNow", "from", "job_title", "job_description",
     *          "business_type", "country_id", "skills"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="employer_name", type="string", description="Name of Employer", example="iMMAP"),
     *          @SWG\Property(property="untilNow", type="integer", enum={0,1}, description="Current / still in the position", example=1),
     *          @SWG\Property(property="from", type="string", format="date", description="Work from [format date: Y-m-d]", example="2015-01-29"),
     *          @SWG\Property(property="to", type="string", format="date", description="Work unitl [format date: Y-m-d] required if until untilNow == 0", example="2017-12-31"),
     *          @SWG\Property(property="job_title", type="string", description="Exact title of the position", example="Communication Manager"),
     *          @SWG\Property(property="job_description", type="string", description="Describe of your duties", example="Manage communication between iMMAP and Partner"),
     *          @SWG\Property(property="business_type", type="string", description="Type of business", example="Nof-for-profit organization"),
     *          @SWG\Property(property="number_of_employees_supervised", type="integer", description="Number of employees supervised by you", example=10),
     *          @SWG\Property(property="country_id", type="integer", description="country where you work form [country id]", example=2),
     *          @SWG\Property(
     *              property="skills",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="label", type="string", description="label of the skills", example="Adobe Lightroom"),
     *                  @SWG\Property(property="value", type="string", description="value of the skill; for the existing skill use skill id, for new skill not on database -> put 'others-' string in the first 7 characters", example="others-2021-01-12,11:01:03"),
     *                  @SWG\Property(property="addedBy", type="string", enum={"others"}, description="it can be empty / or null, for new skill not on database", example="others")
     *              )
     *          ),
     *          @SWG\Property(
     *              property="sectors",
     *              type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="label", type="string", description="label of the sectors", example="Development"),
     *                  @SWG\Property(property="value", type="string", description="value of the sector; for the existing sector use sector id, for new sector not on database -> put 'others-' string in the first 7 characters", example="others-2021-01-12,11:01:03"),
     *                  @SWG\Property(property="addedBy", type="string", enum={"others"}, description="it can be empty / or null, for new sector not on database", example="others")
     *              )
     *          )
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $rules = $this->rules;
        $rules['skills.*.value'] = ['required', new SkillValue];
        $validatedData = $this->validate($request, $rules);

        $employmentRecordData = $request->only($this->fillable);
        if ($employmentRecordData['untilNow'] == 1) {
            $employmentRecordData['to'] = date('Y-m-d');
            $this->model::where('untilNow', 1)->where('profile_id', $this->authProfileId)->update(['untilNow' => 0]);
        }
        $record = $this->model::findOrFail($id);
        $this->destroyProfileSkill($record->profile);

        $updated = $record->fill($employmentRecordData)->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if (count($validatedData['skills'])) {
            $this->saveSkills($record, $validatedData['skills']);
        }

        if (!empty($validatedData['sectors'])) {
            $this->saveSectors($record, $validatedData['sectors']);

            // $this->updateProfileSector($record->profile, $validatedData['sectors']);
        }

        $this->saveWorkExperienceEachCountry();

        $this->saveWorkExperience($record->profile);

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-employment-records/lists",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Get list of all p11 employment records related to the profile",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@lists, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::with('country')->where('profile_id', $this->authProfileId)->orderBy('to', 'DESC')->orderBy('untilNow', 'DESC')->get());
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-employment-records/{id}",
     *   tags={"P11 Employment Records / Employment Records"},
     *   summary="Delete p11-employment-records",
     *   description="File: app\Http\Controllers\API\P11EmploymentRecordController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 employment record id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);

        $profile = $record->profile;
        $record->employment_skills()->detach();
        $record->sectors()->detach();
        $record->delete();
        $this->saveWorkExperienceEachCountry();
        $this->destroyProfileSkill($profile);
        $this->destroyProfileSector($profile);
        $this->saveWorkExperience($profile);


        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }
}
