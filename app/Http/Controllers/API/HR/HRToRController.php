<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\iMMAPerTrait;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\DegreeLevel;
use App\Models\LanguageLevel;
use App\Models\Role;
use App\Models\HR\HRJobCategory;
use App\Models\HR\HRJobStandard;
use PDF;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

// TURN ON ALLOW_URL_FOPEN PHP.INI
class HRToRController extends Controller
{
    use CRUDTrait, iMMAPerTrait;

    const MODEL = 'App\Models\HR\HRToR';
    const SINGULAR = 'tor';

    const RECOMMENDATION_PAGINATE = 30;

    const FILLABLE = [
        'title', 'slug', 'duty_station', 'contract_start', 'contract_end',
        'duty_station', 'country_id', 'relationship', 'job_standard_id',
        'job_level_id', 'skillset', 'cluster', 'cluster_seconded', 'contract_length',
        'organization', 'mailing_address', 'duration_id', 'program_title', 'min_salary', 'max_salary',
        'is_immap_inc', 'is_immap_france', 'immap_office_id', 'is_international', 'status', 'is_shared', 'hq_us', 'hq_france', 'with_template', 'created_by_id'
    ];

    const RULES = [
        'job_standard_id' => 'required|integer|exists:hr_job_standards,id',
        'job_category_id' => 'required|integer',
        'job_level_id' => 'required|integer',
        'title' => 'required|string|max:255',
        'duty_station' => 'sometimes|nullable',
        'country_id' => 'sometimes|nullable|integer|exists:countries,id',
        'immap_office_id' => 'sometimes|nullable|integer|exists:immap_offices,id',
        'contract_start' => 'sometimes|nullable|date',
        'contract_end' => 'sometimes|nullable|date',
        'contract_length' => 'required|integer',
        'relationship' => 'required|string',
        'organization' => 'sometimes|nullable|in:iMMAP,UNICEF,WHO,WFP,FAO,IOM,UNOCHA,UNDP,UNFPA,UNHCR,UN WOMEN,MERCY CORPS',
        'mailing_address' => 'required|string',
        'program_title' => 'required|string',
        'duration_id' => 'required|integer',
        'min_salary' => 'sometimes|nullable|integer',
        'max_salary' => 'sometimes|nullable|integer',
        'is_immap_inc' => 'required|boolean',
        'is_immap_france' => 'required|boolean',
        'is_international' => 'required|boolean',
        'sub_sections' => 'required|array',
        'sub_sections.*.sub_section' => 'required|string',
        'sub_sections.*.sub_section_content' => 'required|string',
        'matching_requirements' => 'required|array',
        'matching_requirements.*.requirement' => 'required|string',
        'matching_requirements.*.requirement_value' => 'required|array',
        'cluster_seconded' => 'sometimes|nullable|string',

        'matching_requirements.*.requirement_value.skill.value' => 'required_if:matching_requirements.*.requirement,skill|integer',
        'matching_requirements.*.requirement_value.proficiency' => 'required_if:matching_requirements.*.requirement,skill|integer',

        'matching_requirements.*.requirement_value.sector.value' => 'required_if:matching_requirements.*.requirement,sector|integer',


        'matching_requirements.*.requirement_value.language.value' => 'required_if:matching_requirements.*.requirement,language|integer',
        'matching_requirements.*.requirement_value.language_level.value' => 'required_if:matching_requirements.*.requirement,language|integer',
        'matching_requirements.*.requirement_value.is_mother_tongue' => 'required_if:matching_requirements.*.requirement,language|boolean',

        'matching_requirements.*.requirement_value.degree_level.value' => 'required_if:matching_requirements.*.requirement,degree_level|integer',
        'matching_requirements.*.requirement_value.study' => 'sometimes|nullable|string',
        'matching_requirements.*.requirement_value.degree' => 'sometimes|nullable|string',

        'matching_requirements.*.component' => 'required|string|in:ParameterSector,ParameterSkill,ParameterLanguage,ParameterDegreeLevel',
        'status' => 'nullable',
        'is_shared' => 'required|boolean',
        'hq_us' => 'sometimes|nullable|required_if:is_shared,1|integer',
        'hq_france' => 'sometimes|nullable|required_if:is_shared,1|integer',
        'other_category' => 'sometimes|nullable|required_if:job_category_id,0|string',
        'cluster' => 'sometimes|nullable|string'

    ];

    const FILTER_RULES = [
        'choosen_country' => 'sometimes|nullable|array',
        'choosen_immap_office' => 'sometimes|nullable|array',
        'search' => 'sometimes|nullable|string',
        'contract_length_min' => 'required|integer',
        'contract_length_max' => 'required|integer',
        'tabValue' => 'required|integer',
    ];

    protected $user_country_office;

    public function __construct()
    {
        $immap_offices = [];
        if (!empty(auth()->user())) {
            $role_id = auth()->user()->roles->first()->id;
            $immap_offices = Role::findOrFail($role_id)->immap_offices->pluck('id')->toArray();
        }

        $this->user_country_office = $immap_offices;
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/with-requirements/{id}",
     *   tags={"ToR"},
     *   summary="with requirements",
     *   description="File: app\Http\Controllers\API\HRToRController@withRequirements, Permission: Index ToR|Add Job|Edit Job|Show Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id"),
     * )
     *
     **/
    public function withRequirements($id)
    {
        $record = $this->model::with([
            'sub_sections' => function ($query) {
                $query->select('id', 'hr_tor_id', 'level', 'sub_section', 'sub_section_content')->orderBy('level');
            },
            'country' => function ($query) {
                $query->select('id', 'countries.id as value', 'countries.name as label');
            },
            'immap_office',
            'immap_office.country',
            'matching_requirements'
        ])->findOrFail($id);
        $languages = [];

        foreach ($record->matching_requirements as $matching_requirement) {
            if ($matching_requirement['requirement'] === "language") {
                array_push($languages, $matching_requirement['requirement_value']->language);
            }
        }
        $record->languages = $languages;

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/all-options",
     *   tags={"ToR"},
     *   summary="list of ToR in {value: 1, label: IMO Officer} format",
     *   description="File: app\Http\Controllers\API\HRToRController@allOptions, Permission: Index ToR|Add Job|Edit Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     **/
    public function allOptions()
    {
        $tor = $this->model::select(
            'hr_tor.id as value',
            'hr_tor.title as label',
            'hr_job_standards.under_sbp_program as under_sbp_program',
            'hr_job_standards.sbp_recruitment_campaign as sbp_recruitment_campaign',
        )->join('hr_job_standards', 'hr_tor.job_standard_id', '=', 'hr_job_standards.id');

        if (!empty($this->user_country_office)) {
            $tor = $tor->whereIn('immap_office_id', $this->user_country_office)->orWhereNull('immap_office_id');
        }

        return response()->success(__('crud.success.default'), $tor->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/{id}/view-tor",
     *   tags={"ToR"},
     *   summary="View ToR in PDF Format",
     *   description="File: app\Http\Controllers\API\HRToRController@viewToR, Permission: Show ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     **/
    public function viewToR(int $id)
    {
        $record = $this->model::with('country', 'duration', 'sub_sections')->findOrFail($id);
        $pdf = PDF::loadView('pdf', ['tor' => $record]);

        return $pdf->stream('document.pdf');
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/{id}/all",
     *   tags={"ToR"},
     *   summary="List of ToR",
     *   description="File: app\Http\Controllers\API\HRToRController@index, Permission: Index ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job standard id")
     * )
     *
     */
    public function index(Request $request, $jobStandardId)
    {

        $validatedData = $this->validate($request, self::FILTER_RULES);

        if (!empty($this->user_country_office)) {
            $tors = $this->model::where('job_standard_id', $jobStandardId)->where( function($query) {
                $query->whereIn('immap_office_id', $this->user_country_office)->orWhereNull('immap_office_id');
            });
        } else {
            $tors = $this->model::where('job_standard_id', $jobStandardId);
        }

        // search filter
        if (!empty($validatedData['search'])) {
            $tors = $tors->where('title', 'like', '%' . $validatedData['search'] . '%');
        }

        // max contract filter
        if (!empty($validatedData['contract_length_max'])) {
            $tors = $tors->where('contract_length', '<=', $validatedData['contract_length_max']);
        }

        // min contract filter
        if (!empty($validatedData['contract_length_min'])) {
            $tors = $tors->where('contract_length', '>=', $validatedData['contract_length_min']);
        }

        // country filter
        if (!empty($validatedData['choosen_country'])) {
            $tors = $tors->whereIn('country_id', $validatedData['choosen_country']);
        }

        // immap office
        if (!empty($validatedData['choosen_immap_office'])) {
            $tors = $tors->whereIn('immap_office_id', $validatedData['choosen_immap_office']);
        }

        $tors = $tors->orderBy('created_at', 'desc')->with('country', 'created_by_immaper')->get();
    
        return response()->success(__('crud.success.default'), $tors);
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/{id}",
     *   tags={"ToR"},
     *   summary="Get specific ToR",
     *   description="File: app\Http\Controllers\API\HRToRController@show, Permission: Show ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     **/

    public function show($id)
    {
        $record = $this->model::with([
            'country',
            'immap_office',
            'immap_office.country',
            'job_standard',
            'job_category',
            'job_level',
            'matching_requirements',
            'sub_sections',
            'duration' => function ($query) {
                $query->select('id', 'id as value', 'name as label');
            }
        ])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/tor",
     *   tags={"ToR"},
     *   summary="Store ToR",
     *   description="File: app\Http\Controllers\API\HRToRController@store, Permission: Add ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="ToR",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={
     *              "job_standard_id", "job_category_id", "job_level_id", "title",
     *              "relationship", "mailing_address", "program_title", "duration_id",
     *              "is_immap_inc", "is_immap_france", "is_international", "sub_sections", "matching_requirements",
     *              "is_shared"
     *          },
     *          @SWG\Property(property="job_standard_id", type="integer", description="Job standard id", example=1),
     *          @SWG\Property(property="job_category_id", type="integer", description="Job category id", example=1),
     *          @SWG\Property(property="job_level_id", type="integer", description="Job level id", example=1),
     *          @SWG\Property(property="title", type="string", description="Title", example="IMO Officer"),
     *          @SWG\Property(property="duty_station", type="string", description="Duty Station", example="Washington"),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP Office id", example=1),
     *          @SWG\Property(property="contract_start", format="date", type="string", description="Date of the contract start", example="2020-01-01"),
     *          @SWG\Property(property="contract_end", format="date", type="string", description="Date of the contract end", example="2020-12-31"),
     *          @SWG\Property(
     *              property="relationship",
     *              type="string",
     *              enum={"International Consultant", "HQ Employee", "National Employee", "National Consultant", "Intern", "Volunteer"},
     *              description="Relationshop on the table, but Status in ToR Form",
     *              example="International Consultant"
     *          ),
     *          @SWG\Property(property="organization", type="string", description="Organization", example="International Consultant"),
     *          @SWG\Property(property="cluster_seconded", type="string", description="cluster_seconded", example="CCCM"),
     *          @SWG\Property(property="cluster", type="string", description="cluster", example="Cluster 1"),
     *          @SWG\Property(property="mailing_address", type="string", description="Mailing Address", example="RRB / ITC, 1300 Pennsylvania Avenue NW, Suite 470, Washington, DC 20004 USA"),
     *          @SWG\Property(property="program_title", type="string", description="Program Title", example="Title of the program"),
     *          @SWG\Property(property="duration_id", type="integer", description="Duration id, Type in ToR Form", example=1),
     *          @SWG\Property(property="min_salary", type="integer", description="Minimum Salary Range", example=100),
     *          @SWG\Property(property="max_salary", type="integer", description="Maximum Salary Range", example=1000),
     *          @SWG\Property(property="is_immap_inc", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, iMMAP US HQ == 1", example=1),
     *          @SWG\Property(property="is_immap_france", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, iMMAP France HQ == 1", example=0),
     *          @SWG\Property(property="is_international", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, International Contract == 1", example=1),
     *          @SWG\Property(property="sub_sections", type="array", description="List of sub sections",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="sub_section", type="string", description="Sub Section Title, REQUIRED", example="Description of Duties"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="Sub Section Content, REQUIRED", example="The Description of the Duties"),
     *              )
     *          ),
     *          @SWG\Property(property="matching_requirements", type="array", description="List of matching requirements needed for ToR",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="requirement", type="string", enum={"language", "skill", "sector", "degree_level"}, description="type of requirement (see the enum list)", example="skill"),
     *                  @SWG\Property(property="requirement_value", type="object", description="requirement value",
     *                      @SWG\Property(property="skill", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'skill' and it should be exists in skills table")
     *                      ),
     *                      @SWG\Property(property="proficiency", type="integer", description="Required if requirement == 'skill'", example=5),
     *                      @SWG\Property(property="sector", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'sector' and it should be exists in sectors table")
     *                      ),
     *                      @SWG\Property(property="language", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'language' and it should be exists in languages table")
     *                      ),
     *                      @SWG\Property(property="language_level", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'language'")
     *                      ),
     *                      @SWG\Property(property="is_mother_tongue", type="integer", enum={1,0}, description="Required if requirement == 'language'", example=0),
     *                      @SWG\Property(property="degree_level", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'degree_level' and it should be exists in degree_levels table")
     *                      ),
     *                      @SWG\Property(property="study", type="string", description="It can be null, if it's not empty the requirement == 'degree_level'"),
     *                      @SWG\Property(property="degree", type="string", description="It can be null, if it's not empty the requirement == 'degree_level'"),
     *                  ),
     *                  @SWG\Property(property="component", type="string", enum={"ParameterSkill", "ParameterSector", "ParameterLanguage", "ParameterDegreeLevel"},
     *                      description="Component name to be called in ToR Form",
     *                      example="ParameterSkill"
     *                  ),
     *              )
     *          ),
     *          @SWG\Property(property="is_shared", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, budget shared between hq == 1", example=1),
     *          @SWG\Property(property="hq_us", type="integer", description="Required if, is_shared == 1, The amount of cost percentage between the HQ (US)", example=75),
     *          @SWG\Property(property="hq_france", type="integer", description="Required if, is_shared == 1, The amount of cost percentage between the HQ (France)", example=25),
     *          @SWG\Property(property="other_category", type="string", description="Required if, job_category == 0, Other category that wanted to be added if it's not exists in job_category options", example="New Job Category"),
     *      )
     *   )
     *  )
     *
     **/
    public function store(Request $request)
    {
        $rules = $this->skillsetRule($this->rules);
        $validatedData = $this->validate($request, $rules);
        $currentUser = auth()->user();
        $request['created_by_id'] = $currentUser->id;

        $hrJobStandard = HRJobStandard::where('id', $validatedData['job_standard_id'])->first();

        if (!$hrJobStandard) {
            return response()->not_found();
        }

        if ((empty($validatedData['skillset']) || is_null($validatedData['skillset'])) && $hrJobStandard->sbp_roster_recruitment == "yes") {
            return response()->error(__('tor.error.skillset'), 422);
        }

        $record = $this->model::create($request->only($this->fillable));
        if ($validatedData['job_category_id'] == 0) {
            $job_category_slug = Str::slug($validatedData['other_category']);
            $isExist = HRJobCategory::where('slug', $job_category_slug)->first();
            if (empty($isExist)) {
                $job_category = HRJobCategory::create([
                    'name' => $validatedData['other_category'],
                    'is_approved' => 0
                ]);
            }

            $record->fill(['other_category' => $validatedData['other_category'], 'job_category_id' => NULL])->save();
        } else {
            $record->fill(['other_category' => $validatedData['other_category'], 'job_category_id' => $validatedData['job_category_id']])->save();
        }

        if (!empty($validatedData['sub_sections'])) {
            $record->sub_sections()->createMany($validatedData['sub_sections']);
        }

        foreach ($request->matching_requirements as $key => $requirement) {
            $record->matching_requirements()->create([
                'requirement' => $requirement['requirement'],
                'component' => $requirement["component"],
                'requirement_value' => json_encode($requirement['requirement_value'])
            ]);
        }

        $this->torPdf($record->id);
        $this->torWord($record->id);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/tor/{id}",
     *   tags={"ToR"},
     *   summary="Update ToR",
     *   description="File: app\Http\Controllers\API\HRToRController@update, Permission: Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id"),
     *   @SWG\Parameter(
     *      name="ToR",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={
     *              "job_standard_id", "job_category_id", "job_level_id", "title", "immap_office_id",
     *               "relationship", "mailing_address", "program_title", "duration_id",
     *               "is_immap_inc", "is_immap_france", "is_international", "sub_sections", "matching_requirements",
     *              "is_shared"
     *          },
     *          @SWG\Property(property="job_standard_id", type="integer", description="Job standard id", example=1),
     *          @SWG\Property(property="job_category_id", type="integer", description="Job category id", example=1),
     *          @SWG\Property(property="job_level_id", type="integer", description="Job level id", example=1),
     *          @SWG\Property(property="title", type="string", description="Title", example="IMO Officer"),
     *          @SWG\Property(property="duty_station", type="string", description="Duty Station", example="Washington"),
     *          @SWG\Property(property="immap_office_id", type="integer", description="iMMAP Office id", example=1),
     *          @SWG\Property(property="contract_start", format="date", type="string", description="Date of the contract start", example="2020-01-01"),
     *          @SWG\Property(property="contract_end", format="date", type="string", description="Date of the contract end", example="2020-12-31"),
     *          @SWG\Property(
     *              property="relationship",
     *              type="string",
     *              enum={"International Consultant", "HQ Employee", "National Employee", "National Consultant", "Intern", "Volunteer"},
     *              description="Relationshop on the table, but Status in ToR Form",
     *              example="International Consultant"
     *          ),
     *          @SWG\Property(property="organization", type="string", description="Organization", example="International Consultant"),
     *          @SWG\Property(property="cluster_seconded", type="string", description="cluster_seconded", example="Cluster 1"),
     *          @SWG\Property(property="cluster", type="string", description="cluster", example="Cluster 1"),
     *          @SWG\Property(property="mailing_address", type="string", description="Mailing Address", example="RRB / ITC, 1300 Pennsylvania Avenue NW, Suite 470, Washington, DC 20004 USA"),
     *          @SWG\Property(property="program_title", type="string", description="Program Title", example="Title of the program"),
     *          @SWG\Property(property="duration_id", type="integer", description="Duration id, Type in ToR Form", example=1),
     *          @SWG\Property(property="min_salary", type="integer", description="Minimum Salary Range", example=100),
     *          @SWG\Property(property="max_salary", type="integer", description="Maximum Salary Range", example=1000),
     *          @SWG\Property(property="is_immap_inc", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, iMMAP US HQ == 1", example=1),
     *          @SWG\Property(property="is_immap_france", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, iMMAP France HQ == 1", example=0),
     *          @SWG\Property(property="is_international", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, International Contract == 1", example=1),
     *          @SWG\Property(property="sub_sections", type="array", description="List of sub sections",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="sub_section", type="string", description="Sub Section Title, REQUIRED", example="Description of Duties"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="Sub Section Content, REQUIRED", example="The Description of the Duties"),
     *              )
     *          ),
     *          @SWG\Property(property="matching_requirements", type="array", description="List of matching requirements needed for ToR",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="requirement", type="string", enum={"language", "skill", "sector", "degree_level"}, description="type of requirement (see the enum list)", example="skill"),
     *                  @SWG\Property(property="requirement_value", type="object", description="requirement value",
     *                      @SWG\Property(property="skill", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'skill' and it should be exists in skills table")
     *                      ),
     *                      @SWG\Property(property="proficiency", type="integer", description="Required if requirement == 'skill'", example=5),
     *                      @SWG\Property(property="sector", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'sector' and it should be exists in sectors table")
     *                      ),
     *                      @SWG\Property(property="language", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'language' and it should be exists in languages table")
     *                      ),
     *                      @SWG\Property(property="language_level", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'language'")
     *                      ),
     *                      @SWG\Property(property="is_mother_tongue", type="integer", enum={1,0}, description="Required if requirement == 'language'", example=0),
     *                      @SWG\Property(property="degree_level", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Required if requirement == 'degree_level' and it should be exists in degree_levels table")
     *                      ),
     *                      @SWG\Property(property="study", type="string", description="It can be null, if it's not empty the requirement == 'degree_level'"),
     *                      @SWG\Property(property="degree", type="string", description="It can be null, if it's not empty the requirement == 'degree_level'"),
     *                  ),
     *                  @SWG\Property(property="component", type="string", enum={"ParameterSkill", "ParameterSector", "ParameterLanguage", "ParameterDegreeLevel"},
     *                      description="Component name to be called in ToR Form",
     *                      example="ParameterSkill"
     *                  ),
     *              )
     *          ),
     *          @SWG\Property(property="is_shared", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false, budget shared between hq == 1", example=1),
     *          @SWG\Property(property="hq_us", type="integer", description="Required if, is_shared == 1, The amount of cost percentage between the HQ (US)", example=75),
     *          @SWG\Property(property="hq_france", type="integer", description="Required if, is_shared == 1, The amount of cost percentage between the HQ (France)", example=25),
     *          @SWG\Property(property="other_category", type="string", description="Required if, job_category == 0, Other category that wanted to be added if it's not exists in job_category options", example="New Job Category"),
     *      )
     *  )
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $newRules = $this->skillsetRule($this->rules);
        $newRules['organization'] = $newRules['organization'].','.json_decode($request->getContent())->organization;
        $validatedData = $this->validate($request, $newRules);

        $hrJobStandard = HRJobStandard::where('id', $validatedData['job_standard_id'])->first();

        if (!$hrJobStandard) {
            return response()->not_found();
        }

        if ((empty($validatedData['skillset']) || is_null($validatedData['skillset'])) && $hrJobStandard->sbp_roster_recruitment == "yes") {
            return response()->error(__('tor.error.skillset'), 422);
        }

        $record = $this->model::findOrFail($id);

        if ($validatedData['job_category_id'] == 0) {
            $job_category_slug = Str::slug($validatedData['other_category']);
            $isExist = HRJobCategory::where('slug', $job_category_slug)->first();
            if (empty($isExist)) {
                $job_category = HRJobCategory::create([
                    'name' => $validatedData['other_category'],
                    'is_approved' => 0
                ]);
            }

            $record->fill(['other_category' => $validatedData['other_category'], 'job_category_id' => NULL])->save();
        } else {
            $record->fill(['other_category' => $validatedData['other_category'], 'job_category_id' => $validatedData['job_category_id']])->save();
        }

        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $record->matching_requirements()->delete();
        foreach ($request->matching_requirements as $key => $requirement) {
            $record->matching_requirements()->create([
                'requirement' => $requirement['requirement'],
                'component' => $requirement["component"],
                'requirement_value' => json_encode($requirement['requirement_value'])
            ]);
        }

        if (!empty($validatedData['sub_sections'])) {
            $record->sub_sections()->delete();
            $record->sub_sections()->createMany($validatedData['sub_sections']);
        }

        $pdf = $record->getMedia('tor_pdf');
        $word = $record->getMedia('tor_word');

        if (!empty($pdf)) {
            if (count($pdf)) {
                $pdf[0]->delete();
            }
        }

        if (!empty($word)) {
            if (count($word)) {
                $word[0]->delete();
            }
        }

        $this->torPdf($record->id);
        $this->torWord($record->id);



        if ($record) {
            $record = $this->model::findOrFail($id);
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/tor/{id}",
     *   tags={"ToR"},
     *   summary="Delete tor",
     *   description="File: app\Http\Controllers\API\HRToRController@destroy, Permission: Delete ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id, should be exists in hr_tor table"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);

        foreach ($record->job as $job) {
            $job->users()->detach();
            $job->languages()->detach();
            $job->sub_sections()->delete();
            $job->delete();
        }

        $record->sub_sections()->delete();
        $record->matching_requirements()->delete();

        $pdf = $record->getMedia('tor_pdf');
        $word = $record->getMedia('tor_word');

        if (!empty($pdf)) {
            if (count($pdf)) {
                $pdf[0]->delete();
            }
        }

        if (!empty($word)) {
            if (count($word)) {
                $word[0]->delete();
            }
        }

        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/{id}/pdf",
     *   tags={"ToR"},
     *   summary="Get ToR in PDF format",
     *   description="File: app\Http\Controllers\API\HRToRController@getPDFToR, Permission: Show ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     */
    public function getPDFToR($id)
    {
        $record = $this->model::findOrFail($id);
        $pdf = $record->getMedia('tor_pdf');
        return response()->success(__('crud.success.default'), $pdf[0]->getFullUrlFromS3());
    }


    /**
     * @SWG\GET(
     *   path="/api/tor/{id}/word",
     *   tags={"ToR"},
     *   summary="Get ToR in WORD format",
     *   description="File: app\Http\Controllers\API\HRToRController@getPDFToR, Permission: Show ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     */
    public function getWORDToR($id)
    {
        $record = $this->model::findOrFail($id);
        $word = $record->getMedia('tor_word');
        return response()->success(__('crud.success.default'), $word[0]->getFullUrlFromS3());
    }

    /**
     * @SWG\Post(
     *   path="/api/tor/{id}/recommendations",
     *   tags={"ToR"},
     *   summary="Get profile recommendation based on ToR requirement",
     *   description="File: app\Http\Controllers\API\HRToRController@getRecommendations, Permission: Index ToR|Show ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id"),
     *   @SWG\Parameter(
     *      name="ToR",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          @SWG\Property(property="chosen_sector", type="array", description="List of chosen sector",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Sector id, it can be empty or null", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Experience (years) working on specific sector, it can be empty or null", example=1),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_skill", type="array", description="List of chosen skill",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Skill id, it can be empty or null", example=1),
     *                  @SWG\Property(property="years", type="integer", description="Experience (years) working on specific skill, it can be empty or null", example=1),
     *                  @SWG\Property(property="rating", type="integer", description="Skill (rating / proficiency), it can be empty or null", example=4),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_language", type="array", description="List of chosen language",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Language id, it can be empty or null", example=1),
     *                  @SWG\Property(property="is_mother_tongue", type="integer", enum={1,0}, description="Boolean with 1 as true and 0 as false", example=1),
     *                  @SWG\Property(property="language_level", type="object",
     *                      @SWG\Property(property="value", type="integer", description="Language level id", example=1)
     *                  ),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_degree_level", type="array", description="List of chosen degree level",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Degree Level id, it can be empty or null", example=1),
     *                  @SWG\Property(property="degree", type="integer", description="Degree obtained, it can be empty or null", example="Bachelor of Something"),
     *                  @SWG\Property(property="study", type="integer", description="Main Study), it can be empty or null", example="Informatics"),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_field_of_work", type="array", description="List of chosen area of expertise",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Area of expertise id, it can be empty or null", example=1),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_nationality", type="array", description="List of chosen nationality (use country id)",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Country id, it can be empty or null", example=1),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_country", type="array", description="List of chosen country which the profile has working experience (use country id)",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Country id, it can be empty or null", example=1),
     *              )
     *          ),
     *          @SWG\Property(property="chosen_country_of_residence", type="array", description="List of chosen country of residence (use country id)",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="id", type="integer", description="Country id, it can be empty or null", example=1),
     *              )
     *          ),
     *          @SWG\Property(property="search", type="string", description="Search name", example="John Doe"),
     *          @SWG\Property(property="experience", type="integer", description="Minimum working experience", example=8),
     *          @SWG\Property(property="immaper_status", type="array", description="iMMAPer or Not iMMAPer or both or empty",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"is_immaper", "not_immaper"}
     *              )
     *          ),
     *         @SWG\Property(
     *              property="select_gender",
     *              type="array",
     *              description="Selected gender for filter the applicants",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"male","female","do_not_want_specify", "other"},
     *                  description="it can be male or female or Do not want to specify or other"
     *              )
     *          ),
     *          @SWG\Property(property="is_available", type="array", description="Available or Not Available or both or empty",
     *              @SWG\Items(
     *                  type="string",
     *                  enum={"available", "not_available"}
     *              )
     *          ),
     *      )
     *  )
     * )
     *
     **/
    public function getRecommendations(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'chosen_sector' => 'sometimes|nullable|array',
            'chosen_sector.*.id' => 'sometimes|nullable|integer',
            'chosen_sector.*.years' => 'sometimes|nullable|integer',
            'chosen_skill' => 'sometimes|nullable|array',
            'chosen_skill.*.id' => 'sometimes|nullable|integer|exists:skills,id',
            'chosen_skill.*.years' => 'sometimes|nullable|integer',
            'chosen_skill.*.rating' => 'sometimes|nullable|integer',
            'chosen_language' => 'sometimes|nullable|array',
            'chosen_language.*.id' => 'sometimes|nullable|integer|exists:languages,id',
            'chosen_language.*.is_mother_tongue' => 'sometimes|nullable|boolean',
            'chosen_language.*.language_level.value' => 'sometimes|nullable|integer',
            'chosen_degree_level' => 'sometimes|nullable|array',
            'chosen_degree_level.*.id' => 'sometimes|nullable|integer|exists:degree_levels,id',
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
            'immaper_status.*' => 'sometimes|nullable|in:is_immaper,not_immaper',
            'select_gender' => 'sometimes|nullable|array',
            'select_gender.*' => 'sometimes|nullable|in:male,female,do_not_want_specify,other,both',
            'is_available' => 'sometimes|nullable|array',
            'is_available.*' => 'sometimes|nullable|in:available,not_available,both'
        ]);

        $tor = $this->model::findOrFail($id);
        $profiles = Profile::select('*')->whereHas('user', function ($query) {
            $query->where('p11Completed', 1)->whereIn('status', ['Active', 'Inactive'])->where('archived_user', 'no');
        });

        foreach ($tor->matching_requirements as $matching_requirement) {
            switch ($matching_requirement['requirement']) {
                case "skill":
                    $profiles = $profiles->whereHas('skills', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "skill")) {
                            $query->where('skill_id', $matching_requirement['requirement_value']->skill->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "proficiency")) {
                            $query = $this->minParameter('proficiency', $matching_requirement['requirement_value']->proficiency, $query);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;
                case "language":
                    $profiles = $profiles->whereHas('p11_languages', function ($query) use ($matching_requirement) {
                        $query->where('language_id', $matching_requirement['requirement_value']->language->value);
                        if (property_exists($matching_requirement['requirement_value'], "language_level")) {
                            $language_level = LanguageLevel::findOrFail($matching_requirement['requirement_value']->language_level->value);
                        }
                        $language_levels = LanguageLevel::select('id')->where('order', '>=', $language_level->order)->orderBy('order', 'asc')->get();
                        $language_levels = $language_levels->pluck('id');

                        foreach ($language_levels as $key => $language_id) {
                            if ($key == 0) {
                                $query->where('language_level_id', $language_id);
                            } else {
                                $query->orWhere('language_level_id', $language_id);
                            }
                        }

                        $query = $this->languageParameter($matching_requirement['requirement_value'], $query);
                    });
                    break;
                case "sector":
                    $profiles = $profiles->whereHas('sectors', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "sector")) {
                            $query->where('sector_id', $matching_requirement['requirement_value']->sector->value);
                        }
                        if (property_exists($matching_requirement['requirement_value'], "experience")) {
                            $query = $this->minParameter('years', $matching_requirement['requirement_value']->experience, $query);
                        }
                    });
                    break;
                case "degree_level":
                    $profiles = $profiles->whereHas('p11_education_universities', function ($query) use ($matching_requirement) {
                        if (property_exists($matching_requirement['requirement_value'], "degree_level")) {
                            $degree_level = DegreeLevel::findOrFail($matching_requirement['requirement_value']->degree_level->value);
                        }
                        $degree_levels = DegreeLevel::select('id')->where('order', '>=', $degree_level->order)->orderBy('order', 'asc')->get();
                        $degree_levels = $degree_levels->pluck('id');

                        foreach ($degree_levels as $key => $degree_id) {
                            if ($key == 0) {
                                $query->where('degree_level_id', $degree_id);
                            } else {
                                $query->orWhere('degree_level_id', $degree_id);
                            }
                        }

                        if (!empty($matching_requirement['requirement_value']->study)) {
                            $query = $this->textParameter('study', $matching_requirement['requirement_value']->study, $query);
                        }
                        if (!empty($matching_requirement['requirement_value']->degree)) {
                            $query = $this->textParameter('degree', $matching_requirement['requirement_value']->degree, $query);
                        }
                    });
                    break;
                default:
            }
        }

        if (!empty($validatedData['search'])) {
            $profiles = $profiles->whereHas('user', function ($query) use ($request) {
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

        $profiles = $profiles->with('user')->paginate(self::RECOMMENDATION_PAGINATE);

        return response()->success(__('crud.success.default'), ['title' => $tor->title, 'country' => $tor->country->name, 'profiles' => $profiles]);
    }

    protected function languageParameter($param, $query)
    {
        if ($param->is_mother_tongue == 1) {
            $query = $query->where('is_mother_tongue', $param->is_mother_tongue);
        }

        return $query;
    }

    protected function rangeParameter($field, $parameter_value, $query)
    {
        $param = json_decode($parameter_value);
        return $query->where($field, '>=', $param->min)->where($field, '<=', $param->max);
    }

    protected function minParameter($field, $parameter_value, $query)
    {
        return $query->where($field, '>=', $parameter_value);
    }

    protected function maxParameter($field, $parameter_value, $query)
    {
        return $query->where($field, '<=', $parameter_value);
    }

    protected function numberParameter($field, $parameter_value, $query)
    {
        return $query->where($field, $parameter_value);
    }

    protected function textParameter($field, $parameter_value, $query)
    {
        return $query->where($field, 'like', '%' . $parameter_value . '%');
    }

    public function torPdf($id)
    {

        $tor = $this->model::with([
            'country',
            'job_standard',
            'job_category',
            'job_level',
            'matching_requirements',
            'sub_sections',
            'duration'
        ])->findOrFail($id);

        $data = ['tor' => $tor];
        $footerData = [
            'mailingAddress' => $tor->mailing_address,
            'sharedCost' => $tor->is_shared
        ];


        if (!empty($tor)) {
            $header = view('tor.tor-header')->render();
            $footer = view('tor.tor-footer', $footerData)->render();
            $date = date("Y-m-d");
            $slug = Str::slug($tor->title);
            $name = $tor->country ? $tor->country->name : 'surge-roster-recruitment-campaign';
            $path = storage_path("app/public/tors/ToR-{$tor->id}-{$slug}-{$name}.pdf");

            if (is_file($path)) {
                unlink($path);
            }

            $view = view('tor.tor', $data)->render();

            $pdf = PDF::loadHTML($view)
                ->setPaper('a4')
                ->setOption('margin-top', '38.1mm')
                ->setOption('margin-bottom', '27.4mm')
                ->setOption('margin-left', '25.4mm')
                ->setOption('margin-right', '25.4mm')
                ->setOption('footer-html', $footer)
                ->setOption('header-html', $header);

            $pdf->save($path);

            $tor->addMedia($path)->toMediaCollection('tor_pdf', 's3');
        }
    }

     /**
     * Generate ToR in the Word format
     *
     * @param integer $id :: The id of the ToR to be generated
     *
     *
     */

    public function torWord($id)
    {

        $tor = $this->model::with([
            'country',
            'job_standard',
            'job_category',
            'job_level',
            'matching_requirements',
            'sub_sections',
            'duration'
        ])->findOrFail($id);

        $data = ['tor' => $tor];
        $footerData = [
            'mailingAddress' => $tor->mailing_address,
            'sharedCost' => $tor->is_shared
        ];

        if (!empty($tor)) {
            // $header = view('tor.WordTor-header')->render();
            // $footer = view('tor.tor-footer')->render();
            $date = date("Y-m-d");
            $slug = Str::slug($tor->title);
            $country = $tor->country ? $tor->country->name : 'no-country';
            $fileName = "ToR-{$tor->id}-{$slug}-{$country}";
            $storagePath = storage_path("app/public/tors/ToR-{$tor->id}-{$slug}-{$country}.doc");
            $view = view('tor.WordTor', $data)->render();

            include_once 'WordGeneretor.class.php';
            $htd = new \HTML_TO_DOC();

            $htd->createDoc($view, $storagePath, false, $footerData);

            $tor->addMedia($storagePath)->toMediaCollection('tor_word', 's3');

        }

    }

    /**
     * skillsetRule is a function to set skillset rule for tor form
     *
     */
    function skillsetRule(array $rules): array
    {
        $skillsetRules = implode(',', Arr::pluck(config('roster.SBP_ROSTER_SKILLSET'), 'value'));
        if (!empty($skillsetRules)) {
            $rules['skillset'] = 'sometimes|nullable|string|in:' . $skillsetRules;
        }

        return $rules;
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/jobstandard",
     *   tags={"ToR"},
     *   summary="Get all  job standard",
     *   description="File: app\Http\Controllers\API\HRToRController@getJobstandard, Permission: Show ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     **/

    public function getJobstandard() {
        $jobStandards = HRJobStandard::all();
        $formatData = [];

        foreach($jobStandards as $key => $jobStandard) {
            $item = [
                'id' => $key,
                'name' => $jobStandard->name,
                'slug' => str_slug($jobStandard->name),
                'job_standard_id' =>  $jobStandard->id,
                'under_sbp_program' => $jobStandard->under_sbp_program,
                'sbp_recruitment_campaign' => $jobStandard->sbp_recruitment_campaign
            ];

            array_push($formatData, $item);
        }

        return response()->success(__('crud.success.default'), $formatData);
    }

    /**
     * @SWG\GET(
     *   path="/api/tor/{id}/duplicate",
     *   tags={"ToR"},
     *   summary="To duplicate the existing ToR",
     *   description="File: app\Http\Controllers\API\HRToRController@duplicateToR, Permission: Show ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="ToR id")
     * )
     *
     */
    public function duplicateToR(int $id)
    {
        $tor = $this->model::findOrFail($id);
        $currentUser = auth()->user();

        $newTor  = $tor->replicate();
        $newTor->save();
        $newTor->created_by_id = $currentUser->id;
        $newTor->save();

        if ($tor->sub_sections->count() != 0) {
            $subSections = $tor->sub_sections->toArray();
            $newTor->sub_sections()->createMany($subSections);
        }

        foreach ($tor->matching_requirements as $key => $requirement) {
            $newTor->matching_requirements()->create([
                'requirement' => $requirement['requirement'],
                'component' => $requirement["component"],
                'requirement_value' => json_encode($requirement['requirement_value'])
            ]);
        }

        $this->torPdf($newTor->id);
        $this->torWord($newTor->id);

        return response()->success(__('crud.success.default'), $newTor);
    }
}
