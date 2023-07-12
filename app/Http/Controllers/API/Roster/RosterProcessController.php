<?php

namespace App\Http\Controllers\API\Roster;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class RosterProcessController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Roster\RosterProcess';
    const SINGULAR = 'roster process';

    const FILLABLE = [
        'name', 'description', 'is_default', 'hr_job_category_id', 'read_more_text', 'under_sbp_program',
        'campaign_is_open', 'campaign_open_at_quarter', 'campaign_open_at_year', 'skillset'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'read_more_text' => 'required|string',
        'is_default' => 'required|boolean',
        'under_sbp_program' => 'sometimes|nullable|string|in:yes,no',
        'skillset' => 'sometimes|nullable|string|required_if:under_sbp_program,yes',
        'campaign_is_open' => 'sometimes|nullable|string|in:yes,no',
        'campaign_open_at_quarter' => 'sometimes|nullable|string|in:Q1,Q2,Q3,Q4',
        'campaign_open_at_year' => 'sometimes|nullable|date_format:Y',
        'roster_steps' => 'required|array',
        'roster_steps.*.order' => 'required|integer',
        'roster_steps.*.step' => 'required|string',
        'roster_steps.*.default_step' => 'required|boolean',
        'roster_steps.*.last_step' => 'required|boolean',
        'roster_steps.*.has_im_test' => 'required|boolean',
        'roster_steps.*.has_skype_call' => 'required|boolean',
        'roster_steps.*.has_interview' => 'required|boolean',
        'roster_steps.*.has_reference_check' => 'required|boolean',
        'roster_steps.*.set_rejected' => 'required|boolean',
    ];

    /**
     * sbpSkillSetAvailable is a function to check if roster skillset has been used or not
     */
    protected function sbpSkillSetAvailable(string $skillset = '') {
        if (empty($skillset)) return false;

        $roster = $this->model::where('under_sbp_program', 'yes')->where('skillset', $skillset)->get();

        return $roster->count() > 0 ? false : true;
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes",
     *   tags={"Roster Process"},
     *   summary="Get list of all roster processes data",
     *   description="File: app\Http\Controllers\API\RosterProcessController@index, permission:Index Roster Process",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/all-options",
     *   tags={"Roster Process"},
     *   summary="Get list of all roster processes data in {value: 1, label: Roster Process} format",
     *   description="File: app\Http\Controllers\API\RosterProcessController@allOptions, permission:P11 Access|Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions() {
        return response()->success(trans('crud.success.default'),
            $this->model::select('id as value', 'name as label', 'campaign_is_open', 'skillset')->where('under_sbp_program', "yes")
                ->orderBy('id', 'desc')->get()
            );
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/{id}",
     *   tags={"Roster Process"},
     *   summary="Get specific roster processes data",
     *   description="File: app\Http\Controllers\API\RosterProcessController@show, permission:Show Roster Process|P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Roster process id"
     *    )
     * )
     *
     */
    public function show($id): JsonResponse
    {
        $record = $this->model::with([
            'roster_steps' => function($query) {
                $query->with(['quiz_template' => function($query) {
                    $query->select('id', 'id as value', 'title as label');
                }])->orderBy('order', 'ASC');
            },
            'interview_questions',
        ])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster-processes",
     *   tags={"Roster Process"},
     *   summary="Store roster processes data",
     *   description="File: app\Http\Controllers\API\RosterProcessController@store, Permission: Add Roster Process",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="RosterProcess",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "description", "is_default", "roster_steps"},
     *          @SWG\Property(property="name", type="string", description="Roster process name", example="SBP Roster"),
     *          @SWG\Property(property="description", type="string", description="Roster process description", example="SBP Roster is a program..."),
     *          @SWG\Property(property="is_default", type="integer", enum={0,1}, description="Set roster process as default (1 == default, 0 == no)", example=0),
     *          @SWG\Property(
     *              property="roster_steps", type="array",
     *              @SWG\Items(
     *                  @SWG\Property(property="order", type="integer", description="Step order", example=0),
     *                  @SWG\Property(property="step", type="string", description="Step name", example="Interview"),
     *                  @SWG\Property(property="default_step", type="integer", enum={0,1}, description="Set default step, when people applied to roster, this is the default step", example=1),
     *                  @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set last step, the last step when people are accepted as roster", example=0),
     *                  @SWG\Property(property="has_im_test", type="integer", enum={0,1}, description="Set step to have IM Test", example=0),
     *                  @SWG\Property(property="has_skype_call", type="integer", enum={0,1}, description="Set step to have skype call", example=0),
     *                  @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Set step to have interview", example=0),
     *                  @SWG\Property(property="has_reference_check", type="integer", enum={0,1}, description="Set step to have reference_check", example=0),
     *                  @SWG\Property(property="set_rejected", type="integer", enum={0,1}, description="Set step to for rejected profile", example=0)
     *              )
     *          )
     *      )
     *   )
     * )
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $rosterProcessData = $request->only($this->fillable);

        $record = $this->model::create($rosterProcessData);

        if (!$record) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        foreach($validatedData['roster_steps'] as $key => &$roster_step) {
            if(empty($roster_step['has_quiz'])) {
                $roster_step['has_quiz'] = 0;
            }
        }

        $record->roster_steps()->createMany($validatedData['roster_steps']);

        if ($record->is_default == 1) {
            $this->model::where('is_default',1)->where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);

    }

    /**
     * @SWG\Post(
     *   path="/api/roster-processes/{id}",
     *   tags={"Roster Process"},
     *   summary="Update roster processes data",
     *   description="File: app\Http\Controllers\API\RosterProcessController@update, permission:Edit Roster Process",
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
     *   ),
     *   @SWG\Parameter(
     *       name="RosterProcess",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "name", "description", "is_default","roster_steps"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="name", type="string", description="Roster process name", example="SBP Roster"),
     *              @SWG\Property(property="description", type="string", description="Roster process description", example="SBP Roster is a program..."),
     *              @SWG\Property(property="is_default", type="integer", enum={0,1}, description="Set roster process as default (1 == default, 0 == no)", example=0),
     *              @SWG\Property(
     *                  property="roster_steps", type="array",
     *                  @SWG\Items(
     *                      @SWG\Property(property="order", type="integer", description="Step order", example=0),
     *                      @SWG\Property(property="step", type="string", description="Step name", example="Interview"),
     *                      @SWG\Property(property="default_step", type="integer", enum={0,1}, description="Set default step, when people applied to roster, this is the default step", example=1),
     *                      @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set last step, the last step when people are accepted as roster", example=0),
     *                      @SWG\Property(property="has_im_test", type="integer", enum={0,1}, description="Set step to have IM Test", example=0),
     *                      @SWG\Property(property="has_skype_call", type="integer", enum={0,1}, description="Set step to have skype call", example=0),
     *                      @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Set step to have interview", example=0),
     *                      @SWG\Property(property="has_reference_check", type="integer", enum={0,1}, description="Set step to have reference_check", example=0),
     *                      @SWG\Property(property="set_rejected", type="integer", enum={0,1}, description="Set step to for rejected profile", example=0),
     *                  )
     *              )
     *          )
     *    ),
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

        $rosterProcessData = $request->only($this->fillable);

        $record->fill($rosterProcessData)->save();

        if (!$record) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        foreach($validatedData['roster_steps'] as $step) {
            if(empty($step['id'])) {
                $record->roster_steps()->create($step);
            } else {
                $record->roster_steps()->where('id', $step['id'])->update(['order' => $step['order']]);
            }
        }

        if ($record->is_default == 1) {
            $this->model::where('is_default',1)->where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Delete(
     *   path="/api/roster-processes/{id}",
     *   tags={"Roster Process"},
     *   summary="Delete roster processes data",
     *   description="File: app\Http\Controllers\API\RosterProcessController@destroy, permission:Delete Roster Process",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
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
    public function destroy($id)
    {
        $record = $this->model::find($id);
        if (!$record) {
            return response()->error(__('crud.error.not_found'), 404);
        }

        $record->roster_steps()->delete();

        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }

    // other function besides CRUD

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/default",
     *   tags={"Roster Process"},
     *   summary="Get default roster process",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getDefault, permission:Index Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function getDefault()
    {
        $records = $this->model::where('is_default', 1)->with([
            'roster_steps' => function($query) {
                $query->orderBy('order','asc');
            }
        ])->first();
        unset($records['name']);
        unset($records['slug']);
        unset($records['is_default']);
        unset($records['id']);

        return response()->success(__('crud.success.default'), $records);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/{id}/roster-steps",
     *   tags={"Roster Process"},
     *   summary="Get all roster steps from a roster process",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getRosterSteps, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
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
    public function getRosterSteps($id)
    {
        $records = $this->model::with(['roster_steps' => function($query) {
            $query->orderBy('order','asc');
        }])->findOrFail($id);

        return response()->success(__('crud.success.default'), [
            'campaign_is_open' => $records->campaign_is_open,
            'campaign_open_at_quarter' => $records->campaign_open_at_quarter,
            'campaign_open_at_year' => $records->campaign_open_at_year,
            'roster_steps' => $records->roster_steps
        ]);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/{id}/roster-campaign-data",
     *   tags={"Roster", "Roster Process"},
     *   summary="Get campaign_is_open data for selected roster process",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getRosterCampaignData, permission:Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
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
    public function getRosterCampaignData(int $id)
    {
        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), $record->campaign_is_open);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster-processes/{id}/update-campaign-data",
     *   tags={"Roster", "Roster Process"},
     *   summary="Update campaign_is_open data for selected roster process",
     *   description="File: app\Http\Controllers\API\RosterProcessController@updateRosterCampaignData, Permission: Index Roster|Approve Roster",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Roster process id"
     *   ),
     *   @SWG\Parameter(
     *      name="RosterProcess",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"isOpen"},
     *          @SWG\Property(property="isOpen", type="boolean", description="Open / Close Campaign", example="true"),
     *          @SWG\Property(property="campaign_open_at_quarter", type="string", description="Next Schedule Campaign (quarter)", example="Q2"),
     *          @SWG\Property(property="campaign_open_at_year", type="string", description="Next Schedule Campaign (year)", example="2022"),
     *      )
     *   )
     * )
     */
    public function updateRosterCampaignData(Request $request, int $id)
    {
        $validatedData = $this->validate($request, [
            'isOpen' => 'required|boolean',
            'campaign_open_at_quarter' => 'required_if:isOpen,false|in:Q1,Q2,Q3,Q4',
            'campaign_open_at_year' => 'required_if:isOpen,false|date_format:Y',
        ]);
        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        $record->campaign_is_open = $validatedData['isOpen'] == true ? "yes" : "no";
        if ($validatedData['isOpen'] == false) {
            $record->campaign_open_at_quarter = $validatedData['campaign_open_at_quarter'];
            $record->campaign_open_at_year = $validatedData['campaign_open_at_year'];
        } else {
            $record->campaign_open_at_quarter = NULL;
            $record->campaign_open_at_year = NULL;
        }
        $record->save();

        return response()->success(__('crud.success.default'), [
            'campaign_is_open' => $record->campaign_is_open,
            'campaign_open_at_quarter' => $record->campaign_open_at_quarter,
            'campaign_open_at_year' => $record->campaign_open_at_year,
        ]);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/sbp",
     *   tags={"Roster Process"},
     *   summary="Get roster process data who is assigned as sbp program",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getSbpRosterProcess",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getSbpRosterProcess()
    {
        $sbpRoster = $this->model::select('name','slug','under_sbp_program','skillset')->where('under_sbp_program', 'yes')->first();

        if (!$sbpRoster) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), $sbpRoster);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/sbp-skillsets",
     *   tags={"Roster Process"},
     *   summary="Get skillset for roster process under sbp program",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getSbpSkillSets, Permission:Set as Admin|Add Roster Process|Edit Roster Process",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="skillset",
     *      in="path",
     *      required=true,
     *      type="string",
     *      description="Skill set value"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getSbpSkillSets(Request $request)
    {
        $skillsets = config('roster.SBP_ROSTER_SKILLSET');
        $skillsetValues = Arr::pluck($skillsets, 'value');
        $skillset = $request->skillset;

        if (!in_array($skillset, $skillsetValues)) {
            $skillset = '';
        }

        $rosters = $this->model::whereIn('skillset', $skillsetValues)->where('under_sbp_program', 'yes')->get();

        if ($rosters->count() > 0) {
            $pickedSkillsets = $rosters->pluck('skillset')->all();
            $skillsets = array_values(array_filter($skillsets, function($value) use ($pickedSkillsets, $skillset) {
                return !in_array($value['value'], $pickedSkillsets) || $value['value'] == $skillset;
            }));
        }

        return response()->success(__('crud.success.default'), $skillsets);
    }

    /**
     * @SWG\GET(
     *   path="/api/roster-processes/sbp-skillsets/all",
     *   tags={"Roster Process"},
     *   summary="Get all skillset for roster process under sbp program or tor for recruitment campaign",
     *   description="File: app\Http\Controllers\API\RosterProcessController@getAllSbpSkillSets, Permission:Set as Admin|Add Roster Process|Edit Roster Process|Add ToR|Edit ToR",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getAllSbpSkillSets()
    {
        return response()->success(__('crud.success.default'), config('roster.SBP_ROSTER_SKILLSET'));
    }
}
