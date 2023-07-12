<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class JobStatusController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\JobStatus';
    const SINGULAR = 'Job Status';

    const FILLABLE = [
        'status', 'slug', 'default_status', 'order', 'last_step', 'is_interview',
        'set_as_shortlist', 'set_as_rejected', 'under_sbp_program', 'status_under_sbp_program', 'has_reference_check',
        'set_as_first_test', 'set_as_second_test', 'set_as_test'
    ];

    const RULES = [
        'status' => 'required|string|max:255',
        'default_status' => 'required|boolean',
        'last_step' => 'required|boolean',
        'is_interview' => 'required|boolean',
        'set_as_shortlist' => 'required|boolean',
        'set_as_rejected' => 'required|boolean',
        'under_sbp_program' => 'required|string|in:yes,no',
        'status_under_sbp_program' => 'sometimes|nullable|required_if:under_sbp_program,yes|string',
        'set_as_first_test' => 'required|boolean',
        'set_as_second_test' => 'required|boolean',
        'set_as_test' => 'required|boolean'
    ];

    protected function setDefault($record_id)
    {
        $this->model::where('id','<>',$record_id)->update(['default_status' => 0]);
    }

    protected function setLastStep($record_id)
    {
        $this->model::where('id','<>',$record_id)->update(['last_step' => 0]);
    }

    protected function setIsInterview($record_id)
    {
        $this->model::where('id', '<>', $record_id)->update(['is_interview' => 0]);
    }

    protected function setAsShortlist($record_id)
    {
        $this->model::where('id', '<>', $record_id)->update(['set_as_shortlist' => 0]);
    }

    protected function setAsRejected($record_id)
    {
        $this->model::where('id', '<>', $record_id)->update(['set_as_rejected' => 0]);
    }

    protected function setAsFirstTest($record_id)
    {
        $this->model::where('id', '<>', $record_id)->update(['set_as_first_test' => 0]);
    }

    protected function setAsSecondTest($record_id)
    {
        $this->model::where('id', '<>', $record_id)->update(['set_as_second_test' => 0]);
    }

    /**
     * @SWG\GET(
     *   path="/api/job-status",
     *   tags={"Job Status"},
     *   summary="Get list of job status in { value: 2, label: Accepted } format",
     *   description="File: app\Http\Controllers\API\JobStatusController@all, permission:Index Job Status|Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function all() {
        $isAdmin = auth()->user()->hasRole('Admin');
        $isNationalHr = auth()->user()->hasRole('Nationals HR');
        $canViewReferenceCheck  = $isAdmin || $isNationalHr;
        $statuses = $this->model::select(
            'id as value',
            'status as label',
            'default_status as status',
            'last_step',
            'is_interview',
            'under_sbp_program',
            'has_reference_check',
            'set_as_first_test',
            'set_as_second_test',
            'set_as_test',
            'order'
        );
        return response()->success(__('crud.success.default'),$statuses->orderBy('order','asc')->get()
        );
    }

    /**
     * @SWG\GET(
     *   path="/api/job-status/under-sbp",
     *   tags={"Job Status"},
     *   summary="Get list of job status under sbp program in { value: 2, label: Accepted } format",
     *   description="File: app\Http\Controllers\API\JobStatusController@getJobStatusUnderSbp, permission:Index Job Status|Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getJobStatusUnderSbp() {
        $statuses = $this->model::select(
            'id as value',
            'status_under_sbp_program as label',
            'default_status as status',
            'last_step',
            'is_interview',
            'under_sbp_program',
            'has_reference_check'
        )->where('under_sbp_program', 'yes');

        $isAdmin = auth()->user()->hasRole('Admin');
        $isNationalHr = auth()->user()->hasRole('Nationals HR');
        $canViewReferenceCheck  = $isAdmin || $isNationalHr;
        if(!$canViewReferenceCheck) {
            $statuses->where('has_reference_check', 0);
        }

        return response()->success(
            __('crud.success.default'),
            $statuses->orderBy('order','asc')->get()
        );
    }

    /**
     * @SWG\GET(
     *   path="/api/job-status/{id}",
     *   tags={"Job Status"},
     *   summary="get specific job status data",
     *   description="File: app\Http\Controllers\API\JobStatusController@show, permission:Show Job Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job status id"
     *    ),
     * )
     *
     */

    /**
     * @SWG\POST(
     *   path="/api/job-status",
     *   tags={"Job Status"},
     *   summary="Store jobs status",
     *   description="File: app\Http\Controllers\API\JobStatusController@store, permission:Add Job Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="jobStatus",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"status", "default_status", "last_step", "is_interview"},
     *          @SWG\Property(property="status", type="string", description="Status name", example="CV Checking"),
     *          @SWG\Property(property="default_status", type="integer", enum={0,1}, description="Set as default status when someone apply job", example=0),
     *          @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set as last status / step in recruitment process (usually accepted)", example=1),
     *          @SWG\Property(property="is_interview", type="integer", enum={0,1}, description="Set the step to has interview", example=0)
     *       )
     *    )
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $jobStatus = $request->only($this->fillable);
        $jobStatusCount = $this->model::get()->count();
        $jobStatus['order'] = ($jobStatusCount > 0) ? $jobStatusCount : 0;
        $record = $this->model::create($jobStatus);

        if($validatedData['default_status'] === 1) {
            $this->setDefault($record->id);
        }

        if($validatedData['last_step'] === 1) {
            $this->setLastStep($record->id);
        }

        if($validatedData['is_interview'] === 1) {
            $this->setIsInterview($record->id);
        }

        if($validatedData['set_as_shortlist'] === 1) {
            $this->setAsShortlist($record->id);
        }

        if($validatedData['set_as_rejected'] === 1) {
            $this->setAsRejected($record->id);
        }

        if($validatedData['set_as_first_test'] === 1) {
            $this->setAsFirstTest($record->id);
        }

        if($validatedData['set_as_second_test'] === 1) {
            $this->setAsSecondTest($record->id);
        }

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\POST(
     *   path="/api/job-status/{id}",
     *   tags={"Job Status"},
     *   summary="Update jobs status",
     *   description="File: app\Http\Controllers\API\JobStatusController@update, permission:Edit Job Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="jobStatus",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"_method", "status", "default_status", "last_step", "is_interview"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="status", type="string", description="Status name", example="CV Checking"),
     *          @SWG\Property(property="default_status", type="integer", enum={0,1}, description="Set as default status when someone apply job", example=0),
     *          @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set as last status / step in recruitment process (usually accepted)", example=1),
     *          @SWG\Property(property="is_interview", type="integer", enum={0,1}, description="Set the step to has interview", example=0)
     *
     *       )
     *    ),
     *    @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job status id"
     *    )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::findOrFail($id);
        $record->fill($validatedData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if($validatedData['default_status'] === 1) {
            $this->setDefault($record->id);
        }

        if($validatedData['last_step'] === 1) {
            $this->setLastStep($record->id);
        }

        if($validatedData['is_interview'] === 1) {
            $this->setIsInterview($record->id);
        }

        if($validatedData['set_as_shortlist'] === 1) {
            $this->setAsShortlist($record->id);
        }

        if($validatedData['set_as_rejected'] === 1) {
            $this->setAsRejected($record->id);
        }

        if($validatedData['set_as_first_test'] === 1) {
            $this->setAsFirstTest($record->id);
        }

        if($validatedData['set_as_second_test'] === 1) {
            $this->setAsSecondTest($record->id);
        }

        if ($record) {
            return response()->success(__('crud.success.update',['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/job-status/change-order",
     *   tags={"Job Status"},
     *   summary="change status order ",
     *   description="File: app\Http\Controllers\API\JobStatusController@changeOrder, permission:Edit Job Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="jobStatus",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          @SWG\Property(property="jobStatuses", type="array", description="Array / list of jobStatus in correct order sent from frontend",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="value", type="integer", description="Job status id", example=1)
     *              )
     *          )
     *      )
     *    )
     * )
     *
     */
    public function changeOrder(Request $request)
    {
        $validatedData = $this->validate($request, ["jobStatuses" => 'required|array']);
        foreach($validatedData['jobStatuses'] as $key => $jobStatus) {
            $record = $this->model::findOrFail($jobStatus['value']);
            $record->order = $key;
            $record->save();
        }

        return response()->success(__('job_status.success.change_order', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\GET(
     *   path="/api/job-status/default",
     *   tags={"Job Status"},
     *   summary="Get default job status",
     *   description="File: app\Http\Controllers\API\JobStatusController@default, permission:Index Job Status|Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function default()
    {
        $defaultID = $this->model::where('default_status',1)->first();
        return response()->success(__('crud.success.default'), $defaultID->order);
    }

    /**
     * @SWG\Delete(
     *   path="/api/job-status/{id}",
     *   tags={"Job Status"},
     *   summary="Delete jobs status",
     *   description="File: app\Http\Controllers\API\JobStatusController@destroy, permission:Delete Job Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job status id"
     *    )
     * )
     *
     */
}
