<?php

namespace App\Http\Controllers\API\Im;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Imtest\Imtest;
use App\Models\Imtest\IMTestTemplate;
use App\Models\Attachment;
// use Validator;
use Illuminate\Support\Carbon;

class IMTestController extends Controller
{
    public $authUser, $authProfile;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
    }

    protected function getProfile($id)
    {
        $exists = $this->authProfile->whereHas('roster_processes', function ($query) use ($id) {
            $query->where('im_test_invitation_done', 1)->where('im_test_template_id', $id)->where('im_test_done', 0)
                ->where('im_test_submit_date_on_server', '>=', Carbon::now()->toDateTimeString());
            // ->whereDate('im_test_submit_date_on_server', '>=', Carbon::now()->toDateString())
            // ->whereTime('im_test_submit_date_on_server', '<=', Carbon::now()->toTimeString());
        })
            ->with([
                'profile_roster_processes' => function ($query) use ($id) {
                    $query->select(
                        'id',
                        'profile_id',
                        'im_test_template_id',
                        'im_test_timezone',
                        'im_test_submit_date',
                        'im_test_submit_date_on_server',
                        'im_test_invitation_done',
                        'im_test_start_time',
                        'im_test_end_time',
                        'im_test_done'
                    )
                        ->where('im_test_template_id', $id)->where('im_test_done', 0)->where('im_test_invitation_done', 1)
                        ->where('im_test_submit_date_on_server', '>=', Carbon::now()->toDateTimeString());
                    // ->whereDate('im_test_submit_date_on_server', '>=', Carbon::now()->toDateString())
                    // ->whereTime('im_test_submit_date_on_server', '<=', Carbon::now()->toTimeString());
                }
            ])->first();

        return [
            'is_exists' => !empty($exists) ? true : false,
            'profile' => $exists
        ];
    }

    /**
     * @SWG\Get(
     *   path="/api/im-test/{id}/check-user",
     *   tags={"Take IM Test"},
     *   summary="Check user is eligible for take the IM Test",
     *   description="File: app\Http\Controllers\API\IMTestController@checkUser",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="IMTestTemplate id")
     * )
     */
    public function checkUser($id)
    {
        $im_test = IMTestTemplate::findOrFail($id);
        $profile = $this->getProfile($id);

        $start = '';
        if ($profile['is_exists']) {
            foreach ($profile['profile']->profile_roster_processes as $profileRosterProcess) {
                if (!is_null($profileRosterProcess->im_test_start_time)) {
                    $start = $profileRosterProcess->im_test_start_time;
                }
            }
        }

        return response()->success(__('crud.success.default'), [
            'im_test_start_time' => $start,
            'is_exists' => $profile['is_exists'],
            'limit_time_hour' => $im_test->limit_time_hour,
            'limit_time_minutes' => $im_test->limit_time_minutes
        ]);
    }

    /**
     * @SWG\Get(
     *   path="/api/im-test/{id}/start-test",
     *   tags={"Take IM Test"},
     *   summary="Start the IM Test",
     *   description="File: app\Http\Controllers\API\IMTestController@startTest",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="IMTestTemplate id")
     * )
     */
    public function startTest($id)
    {
        $profile = $this->getProfile($id);

        $start = '';
        if ($profile['is_exists']) {
            foreach ($profile['profile']->profile_roster_processes as $profileRosterProcess) {
                if (is_null($profileRosterProcess->im_test_start_time)) {
                    $start = Carbon::now()->toDateTimeString();
                    $profileRosterProcess->im_test_start_time = $start;
                    $profileRosterProcess->save();
                } else {
                    $start = $profileRosterProcess->im_test_start_time;
                }
            }
        }

        return response()->success(__('crud.success.default'), ['im_test_start_time' => $start]);
    }
}
