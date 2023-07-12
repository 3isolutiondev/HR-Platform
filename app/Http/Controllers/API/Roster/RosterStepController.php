<?php

namespace App\Http\Controllers\API\Roster;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class RosterStepController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Roster\RosterStep';
    const SINGULAR = 'roster step';

    const FILLABLE = [ 'order', 'step', 'default_step', 'last_step', 'has_quiz', 'has_im_test', 'has_skype_call','has_interview','has_reference_check','set_rejected', 'roster_process_id', 'quiz_template_id'];

    const RULES = [
        'order' => 'required|integer',
        'step' => 'required|string',
        'default_step' => 'required|boolean',
        'last_step' => 'required|boolean',
        // 'has_quiz' => 'required|boolean',
        'has_im_test' => 'required|boolean',
        'has_skype_call' => 'required|boolean',
        'has_interview' => 'required|boolean',
        'has_reference_check' => 'required|boolean',
        'set_rejected'  => 'required|boolean',
        'roster_process_id' => 'required|integer',
        // 'quiz_template_id' => 'required|integer',
        'quiz_template' => 'sometimes|nullable|required_if:has_quiz,1',
        'quiz_template.value' => 'sometimes|nullable|required_if:has_quiz,1|integer'
    ];

    public function show($id)
    {
        $record = $this->model::with(['quiz_template' => function($query) {
            $query->select('id', 'id as value', 'title as label');
        }])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster-steps",
     *   tags={"Roster", "Roster Step"},
     *   summary="Store roster step data",
     *   description="File: app\Http\Controllers\API\RosterStepController@store, permission:Add Roster Step|Add Roster Process",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="RosterStep",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"order", "step", "default_step", "last_step", "has_im_test",
     *                  "has_skype_call", "has_interview", "has_reference_check", "set_rejected",
     *                  "roster_process_id"},
     *              @SWG\Property(property="order", type="integer", description="Step order", example=0),
     *              @SWG\Property(property="step", type="string", description="Step name", example="Interview"),
     *              @SWG\Property(property="default_step", type="integer", enum={0,1}, description="Set default step, when people applied to roster, this is the default step", example=1),
     *              @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set last step, the last step when people are accepted as roster", example=0),
     *              @SWG\Property(property="has_im_test", type="integer", enum={0,1}, description="Set step to have IM Test", example=0),
     *              @SWG\Property(property="has_skype_call", type="integer", enum={0,1}, description="Set step to have skype call", example=0),
     *              @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Set step to have interview", example=0),
     *              @SWG\Property(property="has_reference_check", type="integer", enum={0,1}, description="Set step to have reference_check", example=0),
     *              @SWG\Property(property="set_rejected", type="integer", enum={0,1}, description="Set step to for rejected profile", example=0),
     *              @SWG\Property(property="roster_process_id", type="integer", description="Roster process id", example=1),
     *              @SWG\Property(
     *                  property="quiz_template",
     *                  type="object",
     *                  description="required if has_quiz == 1, needed if we have quiz builder",
     *                  @SWG\Property(property="value", type="string", description="Quiz template id"),
     *              )
     *           )
     *         )
     *       )
     *    )
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
	    if(empty($validatedData['has_quiz'])) {
	        $validatedData['has_quiz'] = 0;
        }
        // For future if we develop quiz
        //if($validatedData['has_quiz'] == 1) {
         //   $validatedData['quiz_template_id'] = $validatedData['quiz_template']['value'];
        //}
        // unset($validateData['quiz_template'])

        $record = $this->model::create($validatedData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/roster-steps/{id}",
     *   tags={"Roster", "Roster Step"},
     *   summary="Update roster step data",
     *   description="File: app\Http\Controllers\API\RosterStepController@update, permission:Edit Roster Step|Edit Roster Process",
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
     *       description="Roster step id"
     *   ),
     *   @SWG\Parameter(
     *       name="RosterStep",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "order", "step", "default_step", "last_step", "has_im_test",
     *                  "has_skype_call", "has_interview", "has_reference_check", "set_rejected",
     *                  "roster_process_id"},
     *              @SWG\Property(
     *                  property="_method", type="string", enum={"PUT"}, example="PUT"
     *              ),
     *              @SWG\Property(property="order", type="integer", description="Step order", example=0),
     *              @SWG\Property(property="step", type="string", description="Step name", example="Interview"),
     *              @SWG\Property(property="default_step", type="integer", enum={0,1}, description="Set default step, when people applied to roster, this is the default step", example=1),
     *              @SWG\Property(property="last_step", type="integer", enum={0,1}, description="Set last step, the last step when people are accepted as roster", example=0),
     *              @SWG\Property(property="has_im_test", type="integer", enum={0,1}, description="Set step to have IM Test", example=0),
     *              @SWG\Property(property="has_skype_call", type="integer", enum={0,1}, description="Set step to have skype call", example=0),
     *              @SWG\Property(property="has_interview", type="integer", enum={0,1}, description="Set step to have interview", example=0),
     *              @SWG\Property(property="has_reference_check", type="integer", enum={0,1}, description="Set step to have reference_check", example=0),
     *              @SWG\Property(property="set_rejected", type="integer", enum={0,1}, description="Set step to for rejected profile", example=0),
     *              @SWG\Property(property="roster_process_id", type="integer", description="Roster process id", example=1),
     *              @SWG\Property(
     *                  property="quiz_template",
     *                  type="object",
     *                  description="required if has_quiz == 1, needed if we have quiz builder",
     *                  @SWG\Property(property="value", type="string", description="Quiz template id"),
     *              )
     *           )
     *         ),
     *
     *       )
     *    )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        // For future if we develop quiz
        // if($validatedData['has_quiz'] == 1) {
        //     $validatedData['quiz_template_id'] = $validatedData['quiz_template']['value'];
        // }

        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        $record->fill($validatedData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $record->save();

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/roster-steps/{id}",
     *   tags={"Roster", "Roster Step"},
     *   summary="Delete roster-steps",
     *   description="File: app\Http\Controllers\API\RosterStepController@destroy, permission:Delete Roster Step|Delete Roster Process",
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
     *       description="Roster step id"
     *   )
     * )
     *
     */

}
