<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class HRJobStandardController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\HR\HRJobStandard';
    const SINGULAR = 'job standard';

    const FILLABLE = [ 'name', 'slug', 'under_sbp_program', 'sbp_recruitment_campaign' ];

    const RULES = [
        'name' => 'required|string|max:255',
        'job_categories' => 'required|array',
        'job_categories.*' => 'required|integer',
        'under_sbp_program' => 'required|string|in:yes,no',
        'sbp_recruitment_campaign' => 'required|string|in:yes,no'
    ];

    /**
     * @SWG\GET(
     *   path="/api/hr-job-standards",
     *   tags={"Job Standard"},
     *   summary="List of Job Standard",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@index, Permission: Index HR Job Standard",
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
     *   path="/api/hr-job-standards/tor-options/{id}",
     *   tags={"Job Standard"},
     *   summary="List of Job Category based on selected job standard id for showing job category in tor form",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@torOptions, Permission: Index ToR|Index HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="Job Standard id, should be exists in hr_job_standards table"),
     * )
     *
     */
    public function torOptions($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with([
            'job_categories' => function($query) use ($id) {
                return $query->select('hr_job_categories.id as value', 'hr_job_categories.name as label')->where('hr_job_categories.is_approved', 1);
            }
        ])->orderBy('created_at','desc')->findOrFail($id)->job_categories);
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-standards/all-options",
     *   tags={"Job Standard"},
     *   summary="List of Job Standard in value label format",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@allOptions, Permission: Index HR Job Standard|Index ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label', 'under_sbp_program', 'sbp_recruitment_campaign')->orderBy('created_at','desc')->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-job-standards/{id}",
     *   tags={"Job Standard"},
     *   summary="Get specific Job Standard",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@show, Permission: Show HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer")
     * )
     *
     */
    public function show($id)
    {
        return response()->success(__('crud.success.default'), $this->model::with('job_categories')->findOrFail($id));
    }

    /**
     * @SWG\Post(
     *   path="/api/hr-job-standards",
     *   tags={"Job Standard"},
     *   summary="Store Job Standard",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@store, Permission: Add HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="JobStandard",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "job_categories"},
     *          @SWG\Property(property="name", type="string", description="Job standard name", example="Job standard name"),
     *          @SWG\Property(property="under_sbp_program", type="string", enum={"yes","no"}, description="Job standard as surge roster alert", example="yes"),
     *          @SWG\Property(property="sbp_recruitment_campaign", type="string", enum={"yes","no"}, description="Job standard as surge roster recruitment campaign", example="no"),
     *          @SWG\Property(property="job_categories", type="array", description="List of job category to be included inside job standard",
     *              @SWG\Items(
     *                  type="integer",
     *                  description="Job category id, required and should be exists in hr_job_categories table"
     *              )
     *          ),
     *      )
     *   )
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        if ($validatedData['under_sbp_program'] == "yes") {
            if (!$this->deactivateUnderSbpOnOtherJobStandard()) {
                return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
            }

            if ($validatedData['sbp_recruitment_campaign'] == "yes") {
                return response()->error(__('job_standard.pickBetweenCampaignAndAlert'), 422);
            }
        }

        if ($validatedData['sbp_recruitment_campaign'] == "yes") {
            if (!$this->deactivateSbpRecruitmentCampaignOnOtherJobStandard()) {
                return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
            }
        }

        $record = $this->model::create($request->only($this->fillable));

        $record->job_categories()->attach($request->job_categories);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' =>$this->singular]), 500);
    }


    /**
     * @SWG\Post(
     *   path="/api/hr-job-standards/{id}",
     *   tags={"Job Standard"},
     *   summary="Update Job Standard",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@update, Permission: Edit HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer"),
     *   @SWG\Parameter(
     *      name="JobStandard",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "name", "job_categories"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="Job standard name", example="Job standard name"),
     *          @SWG\Property(property="under_sbp_program", type="string", enum={"yes","no"}, description="Job standard as surge roster alert", example="yes"),
     *          @SWG\Property(property="sbp_recruitment_campaign", type="string", enum={"yes","no"}, description="Job standard as surge roster recruitment campaign", example="no"),
     *          @SWG\Property(property="job_categories", type="array", description="List of job category to be included inside job standard",
     *              @SWG\Items(
     *                  type="integer",
     *                  description="Job category id, required and should be exists in hr_job_categories table"
     *              )
     *          ),
     *      )
     *   )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        if ($validatedData['under_sbp_program'] == "yes") {
            if (!$this->deactivateUnderSbpOnOtherJobStandard($id)) {
                return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
            }

            if ($validatedData['sbp_recruitment_campaign'] == "yes") {
                return response()->error(__('job_standard.pickBetweenCampaignAndAlert'), 422);
            }
        }

        if ($validatedData['sbp_recruitment_campaign'] == "yes") {
            if (!$this->deactivateSbpRecruitmentCampaignOnOtherJobStandard()) {
                return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
            }
        }

        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
        }

        $record->job_categories()->sync($request->job_categories);

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/hr-job-standards/{id}",
     *   tags={"Job Standard"},
     *   summary="Delete Job Standard",
     *   description="File: app\Http\Controllers\API\HRJobStandardController@destroy, Permission: Delete HR Job Standard",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->job_categories()->detach();
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    // deactivate other job standard to have relation under sbp program, under_sbp_program value to "no" for other job standard besides selected id
    protected function deactivateUnderSbpOnOtherJobStandard(?int $id = null): bool
    {
        $updateQuery = $this->model::where('under_sbp_program', 'yes');

        if (!is_null($id)) {
            // update
            $updateQuery = $updateQuery->where('id', '<>', $id);
        }

        // set other job standard to not under sbp program
        $count = $updateQuery->update(['under_sbp_program' => 'no']);

        if (!is_int($count)) {
            return false;
        }

        if ($count < 0) {
            return false;
        }

        return true;
    }

    // deactivate other job standard from surge roster recruitment campaign, sbp_recruitment_campaign value to "no" for other job standard besides selected id
    function deactivateSbpRecruitmentCampaignOnOtherJobStandard(?int $id = null): bool
    {
        $updateQuery = $this->model::where('sbp_recruitment_campaign', 'yes');

        if (!is_null($id)) {
            // update
            $updateQuery = $updateQuery->where('id', '<>', $id);
        }

        // unset other job standard from surge roster recruitment campaign
        $count = $updateQuery->update(['sbp_recruitment_campaign' => 'no']);

        if (!is_int($count)) {
            return false;
        }

        if ($count < 0) {
            return false;
        }

        return true;
    }
}
