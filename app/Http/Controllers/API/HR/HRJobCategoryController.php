<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\HR\HRJobRequirement;

class HRJobCategoryController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\HR\HRJobCategory';
    const SINGULAR = 'job category';

    const FILLABLE = [ 'name', 'slug', 'is_approved' ];

    const RULES = [
        'name' => 'required|string|max:255',
        'matching_requirements' => 'sometimes|nullable|array',
        'matching_requirements.*.requirement' => 'sometimes|nullable|string',
        'matching_requirements.*.requirement_value' => 'sometimes|nullable|array',

        'matching_requirements.*.requirement_value.skill.value' => 'required_if:matching_requirements.*.requirement,skill|integer',
        // 'matching_requirements.*.requirement_value.experience' => 'required_if:matching_requirements.*.requirement,skill|required_if:matching_requirements.*.requirement,sector|integer',
        'matching_requirements.*.requirement_value.proficiency' => 'required_if:matching_requirements.*.requirement,skill|integer',

        'matching_requirements.*.requirement_value.sector.value' => 'required_if:matching_requirements.*.requirement,sector|integer',


        'matching_requirements.*.requirement_value.language.value' => 'required_if:matching_requirements.*.requirement,language|integer',
        'matching_requirements.*.requirement_value.language_level.value' => 'required_if:matching_requirements.*.requirement,language|integer',
        'matching_requirements.*.requirement_value.is_mother_tongue' => 'required_if:matching_requirements.*.requirement,language|boolean',

        'matching_requirements.*.requirement_value.degree_level.value' => 'required_if:matching_requirements.*.requirement,degree_level|integer',
        // 'matching_requirements.*.requirement_value.study' => 'required_if:matching_requirements.*.requirement,degree_level|n',
        // 'matching_requirements.*.requirement_value.degree' => 'required_if:matching_requirements.*.requirement,degree_level|integer',
        'matching_requirements.*.requirement_value.study' => 'sometimes|nullable|string',
        'matching_requirements.*.requirement_value.degree' => 'sometimes|nullable|string',

        'matching_requirements.*.component' => 'sometimes|nullable|string|in:ParameterSector,ParameterSkill,ParameterLanguage,ParameterDegreeLevel',
        'sub_sections' => 'sometimes|nullable|array',
        'sub_sections.*.sub_section' => 'sometimes|nullable|string',
        'sub_sections.*.sub_section_content' => 'sometimes|nullable|string',
        'is_approved' => 'required|boolean'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;


    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-categories",
     *   tags={"Job Category"},
     *   summary="list of job category",
     *   description="File: app\Http\Controllers\API\HR\HRJobCategoryController@index, Permission: Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/hr-job-categories/tor-parameters/{id}",
     *   tags={"Job Category"},
     *   summary="Get matching requirements and sub sections of job category",
     *   description="File: app\Http\Controllers\API\HR\HRJobCategoryController@torParameters, Permission: Index HR Job Standard|Index ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job category id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function torParameters($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with([
            'matching_requirements',
            'sub_sections'
            ])->findOrFail($id));
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-categories/all-options",
     *   tags={"Job Category"},
     *   summary="list of job category in {value: 1, label: Administration} format",
     *   description="File: app\Http\Controllers\API\HR\HRJobCategoryController@allOptions, Permission: Index HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->where('is_approved', 1)->orderBy('created_at','desc')->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-categories/{id}",
     *   tags={"Job Category"},
     *   summary="Get specific job category data",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@show, Permission: Show HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="job category id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with([
            'matching_requirements',
            'sub_sections' => function($query) {
                $query->orderBy('level','asc');
        }])->findOrFail($id);
        return response()->success(__('crud.success.default'), json_decode($record));
    }

    /**
     * @SWG\Post(
     *   path="/api/hr-job-categories",
     *   tags={"Job Category"},
     *   summary="store job category data",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@store, Permission: Add HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="JobCategory",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "is_approved"},
     *          @SWG\Property(property="name", type="string", description="Job category Name", example="Job category name"),
     *          @SWG\Property(property="is_approved", type="integer", enum={0,1}, description="Set is approve or not, if approve it will shown on ToR Form", example=1),
     *          @SWG\Property(property="matching_requirements", type="array", description="Matching requirement data",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="component", type="string", enum={"ParameterSkill", "ParameterSector", "ParameterLanguage", "ParameterDegreeLevel"},
     *                      description="Component name to be called in ToR / Job Category Form"
     *                  ),
     *                  @SWG\Property(property="requirement", type="string", enum={"skill", "sector", "language", "degree_level"}, description="requirement needed for the ToR", example="degree_level"),
     *                  @SWG\Property(property="requirement_value", type="object",
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
     *              )
     *          ),
     *          @SWG\Property(property="sub_sections", type="array", description="Sub section for default job category or ToR",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="sub_section", type="string", description="It can be null or empty, if it's not empty it became sub section title"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="It can be null or empty, if it's not empty it became sub section content")
     *              )
     *          )
     *      )
     *    )
     * )
     */
    public function store(Request $request) {
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::create($request->only($this->fillable));
        if (!empty($validatedData['sub_sections'])) {
            $record->sub_sections()->createMany($validatedData['sub_sections']);
        }
        foreach($request->matching_requirements as $key => $requirement) {

            $record->matching_requirements()->create([
                'requirement' => $requirement['requirement'],
                'component' => $requirement["component"],
                'requirement_value' => json_encode($requirement['requirement_value'])
            ]);

        }

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

     /**
     * @SWG\Post(
     *   path="/api/hr-job-categories/{id}",
     *   tags={"Job Category"},
     *   summary="Update job category data",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@update, Permission: Edit HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="JobCategory",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "name", "is_approved"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="Job category Name", example="Job category name"),
     *          @SWG\Property(property="is_approved", type="integer", enum={0,1}, description="Set is approve or not, if approve it will shown on ToR Form", example=1),
     *          @SWG\Property(property="matching_requirements", type="array", description="Matching requirement data",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="component", type="string", enum={"ParameterSkill", "ParameterSector", "ParameterLanguage", "ParameterDegreeLevel"},
     *                      description="Component name to be called in ToR / Job Category Form"
     *                  ),
     *                  @SWG\Property(property="requirement", type="string", enum={"skill", "sector", "language", "degree_level"}, description="requirement needed for the ToR", example="degree_level"),
     *                  @SWG\Property(property="requirement_value", type="object",
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
     *              )
     *          ),
     *          @SWG\Property(property="sub_sections", type="array", description="Sub section for default job category or ToR",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="sub_section", type="string", description="It can be null or empty, if it's not empty it became sub section title"),
     *                  @SWG\Property(property="sub_section_content", type="string", description="It can be null or empty, if it's not empty it became sub section content")
     *              )
     *          )
     *      )
     *    )
     * )
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);
        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $record->matching_requirements()->delete();
        foreach($request->matching_requirements as $key => $requirement) {
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

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/hr-job-categories/{id}",
     *   tags={"Job Category"},
     *   summary="Delete hr job categories",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@destroy, Permission: Delete HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer")
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->matching_requirements()->delete();
        $record->sub_sections()->delete();
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]));
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Post(
     *   path="/api/hr-job-categories/approve",
     *   tags={"Job Category"},
     *   summary="Approve or Disapprove Job Category to shown in ToR Form",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@approveCategory, Permission: Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="JobCategory",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id", "is_approved"},
     *          @SWG\Property(property="id", type="integer", description="Job category id", example=1),
     *          @SWG\Property(property="is_approved", type="integer", enum={1,0}, description="approve or not", example=0)
     *      )
     *   )
     * )
     *
     */
    public function approveCategory(Request $request)
    {
        $validatedData = $this->validate($request, [
            'id' => 'required|integer|exists:hr_job_categories,id',
            'is_approved' => 'required|boolean'
        ]);

        $record = $this->model::findOrFail($validatedData['id']);

        $record->fill(['is_approved' => $validatedData['is_approved']])->save();

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-categories-approved",
     *   tags={"Job Category"},
     *   summary="Get approved category",
     *   description="File: app\Http\Controllers\API\HRJobCategoryController@getApprovedCategory, Permission: Index HR Job Category|Index HR Job Standard|Index ToR|Show ToR|Edit ToR|Add ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *
     * )
     *
     */
    public function getApprovedCategory() {
        return response()->success(__('crud.success.default'), $this->model::where('is_approved', 1)->orderBy('created_at','desc')->get());
    }

}
