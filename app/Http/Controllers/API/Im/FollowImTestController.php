<?php

namespace App\Http\Controllers\API\Im;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;

class FollowImTestController extends Controller
{

    public $authUser, $authProfile;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
    }

    /**
     * NEED EVALUATION
     * @@SWG\GET(
     *   path="/api/follow-imtest/{id}",
     *   tags={"follow imtest"},
     *   summary="list of follow im test",
     *   description="File: app\Http\Controllers\API\FollowImTestController@show, permission: Follow Im Test",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer"
     *    ),
     * )
     *
     */
    // function show($profileID)
    // {

    //     //        $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
    //     //            return $q->with(['qmchoice'=>function($q){
    //     //                return $q->with(['mchoice'=>function($q){
    //     //                    return $q->with('u_answer');
    //     //                }]);
    //     //            }]);
    //     //        }])->get();

    //     //        Project::with(['clients', 'tasks' => function($q) use($value) {
    //     //            // Query the name field in status table
    //     //            $q->where('status_id', '!=', '2');
    //     //        }])->whereUserId(Auth::user()->id)->get();

    //     //        $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
    //     //            return $q->with(['qmchoice'=>function($q){
    //     //                return $q->where('id',37)->with(['q_answer'=>function($q){
    //     //                    return $q->with('u_answer');
    //     //                }]);
    //     //            }]);
    //     //        }])->get();

    //     // $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
    //     //     return $q->with(['user_answer_many_question'=>function($q){
    //     //         return $q->with(['has_many_choice'=>function($q){
    //     //             return $q->with('hasoneanswer');
    //     //         }]);
    //     //     }]);
    //     // }])->get();
    //     //'id', 'first_name', 'middle_name', 'family_name'

    //     // $data= \App\Models\Profile::select('id', 'first_name', 'middle_name', 'family_name')
    //     //     ->where('id', $profileID)
    //     //     ->with(['follow_im_test'=>function($q){
    //     //         return $q;//->with('answer');
    //     //     }])
    //     //     ->get();

    //     $data = \App\Models\Imtest\Follow_im_test::select('*')
    //         ->where('id', $profileID)
    //         // ->with(['belonging_profil'=>function($q){
    //         //     return $q;//->with('answer');
    //         // }])
    //         ->with('follow_im_test_answer', 'follow_im_test_answer.im_test_answer')
    //         ->get();

    //     if ($data->count() == 0) {
    //         return response()->not_found();
    //     }

    //     return response()->success(__('crud.success.default'), $data);
    // }

    /**
     * NEED EVALUATION
     */
    // function steps($templateID, $step)
    // {

    //     $getData = \App\Models\Imtest\IMTestTemplate::select('id', 'name', 'slug', 'is_default')
    //         ->with(['imtes' => function ($query) use ($step) {
    //             return $query->where('steps', $step)
    //                 ->with(['belonging_profil' => function ($q) {
    //                     return $q->select(
    //                         'profiles.id',
    //                         'profiles.first_name',
    //                         'profiles.middle_name',
    //                         'profiles.family_name'
    //                     )
    //                         ->with('answer_im_test_question');
    //                 }])
    //                 ->with('questions', 'questions.answer');
    //         }])
    //         ->where('id', $templateID);

    //     // ->with('belonging_profil')
    //     // ->findOrFail($templateID);

    //     // $imteswithimg = [];
    //     //
    //     // foreach ($getData->imtes as $key => &$imtes) {
    //     //     $oriimtes = $imtes->toArray();
    //     //
    //     //     $imtestID=$imtes->id;
    //     //     $imtes = array_merge($oriimtes, $this->getmedia($imtes->file_dataset1,
    //     //         $imtes->file_dataset2, $imtes->file_dataset3));
    //     //
    //     //     $imteswithimg[$key] = array_merge($imtes, $this->followimtes($imtestID));
    //     // }
    //     //
    //     // $getData->unsetRelation('imtes');
    //     // $getData->imtes = $imteswithimg;

    //     return response()->success(__('crud.success.default'), $getData->get());
    // }

    function getmedia($file1, $file2, $file3)
    {

        $adddata = array();

        if (!empty($file1)) {
            $media = \App\Models\Attachment::findorfail($file1);
            if (count($media->getMedia('file_dataset1')) > 0) {
                $adddata['file_dataset1'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset1')[0]->id . '/' . $media->getMedia('file_dataset1')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset1')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset1')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset1')[0]->model_id
                );
            }
        }

        if (!empty($file2)) {
            $media = \App\Models\Attachment::findorfail($file2);
            if (count($media->getMedia('file_dataset2')) > 0) {
                $adddata['file_dataset2'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset2')[0]->id . '/' . $media->getMedia('file_dataset2')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset2')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset2')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset2')[0]->model_id
                );
            }
        }

        if (!empty($file3)) {
            $media = \App\Models\Attachment::findorfail($file3);
            if (count($media->getMedia('file_dataset3')) > 0) {
                $adddata['file_dataset2'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset3')[0]->id . '/' . $media->getMedia('file_dataset3')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset3')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset3')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset3')[0]->model_id
                );
            }
        }

        return $adddata;
    }

    /**
     * @SWG\Post(
     *   path="/api/follow-imtest",
     *   tags={"Take IM Test"},
     *   summary="follow imtest",
     *   description="File: app\Http\Controllers\API\FollowImTestController@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *
     *   @SWG\Parameter(
     *       name="file1",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file2",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file3",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file4",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="answer1",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer2",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer3",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer4",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="userTextInput1",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="userTextInput1",
     *              type="string"
     *          )
     *      )
     *    ),
     *    @SWG\Parameter(
     *       name="userTextInput2",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="userTextInput2",
     *              type="string"
     *          )
     *      )
     *    ),
     *
     * )
     *
     **/
    function store(Request $request) {
        $profilauthID = \App\Models\Profile::select('id')->where('user_id', \Auth::id())->first()->id;

        $dd = $request->get('data');

        $save = false;

        if (!empty($dd['file1'])) {
            $step2 = [
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $dd['im_test_templates_id'],
                'im_test_id' => $dd['im_test_id_step_2'],
                'file1' => $dd['file1']
            ];
            $q21 = [
                'profil_id' => $profilauthID,
                'im_test_id' => $dd['im_test_id_step_2'],
                'question_im_test_id' => $dd['answer1']['question_im_test_id'],
                'multiple_choice_im_test_id' => $dd['answer1']['multiple_choice_im_test_id']
            ];
            $q22 = [
                'profil_id' => $profilauthID,
                'im_test_id' => $dd['im_test_id_step_2'],
                'question_im_test_id' => $dd['answer2']['question_im_test_id'],
                'multiple_choice_im_test_id' => $dd['answer2']['multiple_choice_im_test_id']
            ];
            $q23 = [
                'profil_id' => $profilauthID,
                'im_test_id' => $dd['im_test_id_step_2'],
                'question_im_test_id' => $dd['answer3']['question_im_test_id'],
                'multiple_choice_im_test_id' => $dd['answer3']['multiple_choice_im_test_id']
            ];

            \App\Models\Imtest\Follow_im_test::create($step2);

            \App\Models\Imtest\Answer_im_test::create($q21);
            \App\Models\Imtest\Answer_im_test::create($q22);
            \App\Models\Imtest\Answer_im_test::create($q23);

            $save = true;
        }

        if (!empty($dd['file2']) && !empty($dd['file3']) && !empty($dd['file4'])) {
            $step3 = [
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $dd['im_test_templates_id'],
                'im_test_id' => $dd['im_test_id_step_3'],
                'file1' => $dd['file2'],
                'file2' => $dd['file3'],
                'file3' => $dd['file4']
            ];
            $q3 = [
                'profil_id' => $profilauthID,
                'im_test_id' => $dd['im_test_id_step_3'],
                'question_im_test_id' => $dd['answer4']['question_im_test_id'],
                'multiple_choice_im_test_id' => $dd['answer4']['multiple_choice_im_test_id']
            ];

            \App\Models\Imtest\Follow_im_test::create($step3);
            \App\Models\Imtest\Answer_im_test::create($q3);
            $save = true;
        }

        if (!empty($dd['userTextInput1'])) {
            $step4 = [
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $dd['im_test_templates_id'],
                'im_test_id' => $dd['im_test_id_step_4'],
                'text1' => $dd['userTextInput1']
            ];
            \App\Models\Imtest\Follow_im_test::create($step4);
            $save = true;
        }

        if (!empty($dd['userTextInput2'])) {
            $step5 = [
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $dd['im_test_templates_id'],
                'im_test_id' => $dd['im_test_id_step_5'],
                'text1' => $dd['userTextInput2']
            ];
            \App\Models\Imtest\Follow_im_test::create($step5);
            $save = true;
        }

        $processes = DB::table('profile_roster_processes')->select('id')->where('im_test_invitation_done', 1)
            ->where('im_test_template_id', $dd['im_test_templates_id'])
            ->where('im_test_done', 0)
            ->where('profile_id', $profilauthID)
            ->whereNotNull('im_test_submit_date')
            ->first();

        DB::table('profile_roster_processes')
            ->where('id', $processes->id)
            ->update(['im_test_done' => 1, 'im_test_end_time' => Carbon::now()->toDateTimeString()]);

        if ($save == true) {
            return response()->success(__('successfully saved'));
        }

    }

    /**
     * @SWG\GET(
     *   path="/api/im-test/{id}/user/{userid}",
     *   tags={"Take IM Test"},
     *   summary="result of imtest",
     *   description="File: app\Http\Controllers\API\FollowImTestController@result",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer"
     *   ),
     *   @SWG\Parameter(
     *       name="userid",
     *       in="path",
     *       required=true,
     *       type="integer"
     *    ),
     * )
     *
     */
    function result($templateID, $profilauthID) {

        $processes = DB::table('profile_roster_processes')->select('id')
            ->where('im_test_done', 1)
            ->where('profile_id', $profilauthID)
            ->first();

        if (empty($processes)) {
            return response()->error(__(''), 404);
        }

        $getData = \App\Models\Imtest\IMTestTemplate::select(
            'id',
            'name',
            'slug',
            'is_default',
            'limit_time_hour',
            'limit_time_minutes',
            'created_at'
        )
            ->with(['imtes' => function ($query) {
                return $query;
            }])
            ->findOrFail($templateID);

        $imteswithimg = [];

        foreach ($getData->imtes as $key => &$imtes) {
            $oriimtes = $imtes->toArray();

            $imtes = array_merge($oriimtes, $this->getmedia(
                $imtes->file_dataset1,
                $imtes->file_dataset2,
                $imtes->file_dataset3
            ));

            $question = array_merge($imtes, $this->question($imtes['id'], $profilauthID));
            $followimtes = array_merge($question, $this->followimtes($imtes['id'], $profilauthID));
            $imteswithimg[$key] = $followimtes;
        }

        $getData->unsetRelation('imtes');
        $getData->imtes = $imteswithimg;

        return response()->success(__('crud.success.default'), $getData);
    }

    function followimtes($imtesID, $profilID = NULL) {
        $adddata = array();
        $getData = \App\Models\Imtest\Follow_im_test::select('*')->where('im_test_id', $imtesID)
            ->where('profil_id', $profilID);

        foreach ($getData->get() as $key => $q) {
            $adddata[$key] = array(
                'id' => $q->id,
                'text1' => $q->text1,
                'text2' => $q->text2,
                'text3' => $q->text3,
                'im_test_id' => $q->im_test_id,
                'profil_id' => $q->profil_id,
                'file1' => $this->getmediafile($q->file1, 'file_datasetuser_1'),
                'file2' => $this->getmediafile($q->file2, 'file_datasetuser_2'),
                'file3' => $this->getmediafile($q->file3, 'file_datasetuser_3')
            );
        }
        return array(
            'follow-imtes' => $adddata
        );
    }

    function question($imtesID, $profilauthID) {

        $adddata = array();
        $getData = \App\Models\Imtest\Question_im_test::select('*')->where('im_test_id', $imtesID)
            ->with(['im_test_q_answer' => function ($q) use ($profilauthID) {
                return $q
                    ->where('profil_id', $profilauthID);
            }]);

        foreach ($getData->get() as $key => $q) {

            $adddata[$key] = array(
                'questionID' => $q->id,
                'question' => $q->question,
                'user-answer' => $q->im_test_q_answer,
                'answer' => $this->getmultiplechoice($q->id)
            );
        }

        return array(
            'questions' => $adddata
        );
    }

    function getmultiplechoice($questionID) {
        $getData = \App\Models\Imtest\Multiple_choice::select('*')->where('question_im_test_id', $questionID);

        return $getData->get()->toArray();
    }

    // NEED EVALUATION
    // function getuseranswer($imtesID, $questionID) {
    //     $adddata = array();

    //     $getData = \App\Models\Imtest\Question_im_test::select('*')->where('im_test_id', $imtesID);

    //     // foreach($questions as $oo) {
    //     //     $adddata['user-answer-'.$oo['id']] = array(
    //     //         'ppp' => $oo['question']
    //     //     );
    //     // }

    //     return $adddata;
    // }

    function getmediafile($file, $nm) {
        $adddata = array();
        if (!empty($file)) {
            $media = \App\Models\Attachment::findorfail($file);

            if (count($media->getMedia($nm)) > 0) {
                return array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia($nm)[0]->id . '/' .
                        $media->getMedia($nm)[0]->file_name,
                    'filename' => $media->getMedia($nm)[0]->file_name,
                    'mime' => $media->getMedia($nm)[0]->mime_type,
                    'model_id' => $media->getMedia($nm)[0]->model_id
                );
            }
        } else {
            return $adddata;
        }

    }

    // NEED EVALUATION
    // function store1(Request $request, $step)
    // {
    //     $profilauthID = \App\Models\Profile::select('id')->where('user_id', \Auth::id())->first()->id;

    //     switch ($step) {
    //         case 1:
    //         case 2:
    //             $validatedData = $request->validate([
    //                 'im_test_templates_id' => 'required|integer',
    //                 'im_test_id' => 'required|integer',
    //                 // 'file1' => 'required|integer',
    //                 // 'file2' => 'required|integer',
    //                 // 'answer1' => 'required',
    //                 // 'answer2' => 'required',
    //                 // 'answer3' => 'required'
    //             ]);
    //             $st = $this->savestep2($validatedData, $profilauthID);
    //             if (!$st) {
    //                 return response()->error(__('please complete the data'), 404);
    //             }
    //             return response()->success(__('successfully saved'));
    //             break;

    //         case 3:
    //             $validatedData = $request->validate([
    //                 'im_test_templates_id' => 'required|integer',
    //                 'im_test_id' => 'required|integer',
    //                 // 'file1' => 'required|integer',
    //                 // 'file2' => 'required|integer',
    //                 // 'answer1' => 'required'
    //             ]);
    //             $st = $this->savestep3($validatedData, $profilauthID);
    //             if (!$st) {
    //                 return response()->error(__('please complete the data'), 404);
    //             }
    //             return response()->success(__('successfully saved'));
    //             break;

    //         case 4:
    //             $validatedData = $request->validate([
    //                 'im_test_templates_id' => 'required|integer',
    //                 'im_test_id' => 'required|integer',
    //                 // 'text1' => 'required|string'
    //             ]);
    //             $st = $this->savestep4($validatedData, $profilauthID);
    //             if (!$st) {
    //                 return response()->error(__('please complete the data'), 404);
    //             }
    //             return response()->success(__('successfully saved'));
    //             break;

    //         case 5:
    //             $validatedData = $request->validate([
    //                 'im_test_templates_id' => 'required|integer',
    //                 'im_test_id' => 'required|integer',
    //                 // 'text1' => 'required|string'
    //             ]);
    //             $st = $this->savestep4($validatedData, $profilauthID);
    //             if (!$st) {
    //                 return response()->error(__('please complete the data'), 404);
    //             }
    //             return response()->success(__('successfully saved'));
    //             break;

    //         default:
    //             return response()->error(__('please enter steps correctly'), 404);
    //     }
    // }

    // NEED EVALUATION
    /**
     * @SWG\Post(
     *   path="/api/follow-imtest/{id}/steps/{step}",
     *   tags={"Take IM Test"},
     *   summary="follow imtest",
     *   description="File: app\Http\Controllers\API\FollowImTestController@update",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer"
     *    ),
     *    @SWG\Parameter(
     *       name="_method",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *       )
     *    ),
     *   @SWG\Parameter(
     *       name="file1",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file2",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file3",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="file4",
     *       in="formData",
     *       type="file"
     *   ),
     *   @SWG\Parameter(
     *       name="answer1",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer2",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer3",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="answer4",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="question_im_test_id",
     *              type="integer"
     *          ),
     *          @SWG\Property(
     *              property="multiple_choice_im_test_id",
     *              type="integer"
     *          )
     *      )
     *   ),
     *   @SWG\Parameter(
     *       name="userTextInput1",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="userTextInput1",
     *              type="string"
     *          )
     *      )
     *    ),
     *    @SWG\Parameter(
     *       name="userTextInput2",
     *       in="body",
     *       @SWG\Schema(
     *          type="object",
     *          @SWG\Property(
     *              property="userTextInput2",
     *              type="string"
     *          )
     *      )
     *    ),
     *
     * )
     *
     **/
    function update(Request $request, $id, $step)
    {
        $profilauthID = \App\Models\Profile::select('id')->where('user_id', \Auth::id())->first()->id;

        switch ($step) {
            case 1:
            case 2:
                $validatedData = $request->validate([
                    'im_test_templates_id' => 'required|integer',
                    'im_test_id' => 'required|integer',
                    'file1' => 'required|integer',
                    'file2' => 'required|integer',
                    'answer1' => 'required|string',
                    'answer2' => 'required|string',
                    'answer3' => 'required|string'
                ]);
                $st = $this->savestep2($validatedData, $profilauthID, $id);
                if (!$st) {
                    return response()->error(__('please complete the data'), 404);
                }
                return response()->success(__('successfully saved'));
                break;

            case 3:
                $validatedData = $request->validate([
                    'im_test_templates_id' => 'required|integer',
                    'im_test_id' => 'required|integer',
                    'file1' => 'required|integer',
                    'file2' => 'required|integer',
                    'answer1' => 'required|string'

                ]);
                $st = $this->savestep3($validatedData, $profilauthID, $id);
                if (!$st) {
                    return response()->error(__('please complete the data'), 404);
                }
                return response()->success(__('successfully saved'));
                break;

            case 4:
                $validatedData = $request->validate([
                    'im_test_templates_id' => 'required|integer',
                    'im_test_id' => 'required|integer',
                    'text1' => 'required|string'
                ]);
                $st = $this->savestep4($validatedData, $profilauthID, $id);
                if (!$st) {
                    return response()->error(__('please complete the data'), 404);
                }
                return response()->success(__('successfully saved'));
                break;

            case 5:
                $validatedData = $request->validate([
                    'im_test_templates_id' => 'required|integer',
                    'im_test_id' => 'required|integer',
                    'text1' => 'required|string'
                ]);
                $st = $this->savestep4($validatedData, $profilauthID, $id);
                if (!$st) {
                    return response()->error(__('please complete the data'), 404);
                }
                return response()->success(__('successfully saved'));
                break;

            default:
                return response()->error(__('please enter steps correctly'), 404);
        }
    }

    function savestep2($data, $profilauthID, $id = NULL)
    {

        if ($id) {
            \App\Models\Imtest\Follow_im_test::where('id', '=', $id)->update(
                array(
                    "file1" => $data['file1']
                )
            );
        } else {
            \App\Models\Imtest\Follow_im_test::create([
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $data['im_test_templates_id'],
                'im_test_id' => $data['im_test_id'],
                'file1' => $data['file1']
            ]);
        }

        $answer1 = $data['answer1'];
        $answer2 = $data['answer2'];
        $answer3 = $data['answer3'];

        if (
            array_key_exists('question_im_test_id', $answer1) &&
            array_key_exists('multiple_choice_im_test_id', $answer1)
        ) {

            if (array_key_exists('id', $answer1)) {
                \App\Models\Imtest\Answer_im_test::where('id', '=', $answer1['id'])->update(
                    array(
                        "multiple_choice_im_test_id" => $answer1['multiple_choice_im_test_id']
                    )
                );
            } else {
                \App\Models\Imtest\Answer_im_test::create([
                    'profil_id' => $profilauthID,
                    'im_test_id' => $data['im_test_id'],
                    'question_im_test_id' => $answer1['question_im_test_id'],
                    'multiple_choice_im_test_id' => $answer1['multiple_choice_im_test_id']
                ]);
            }
        } else {
            return false;
        }

        if (
            array_key_exists('question_im_test_id', $answer2) &&
            array_key_exists('multiple_choice_im_test_id', $answer2)
        ) {

            if (array_key_exists('id', $answer2)) {
                \App\Models\Imtest\Answer_im_test::where('id', '=', $answer2['id'])->update(
                    array(
                        "multiple_choice_im_test_id" => $answer2['multiple_choice_im_test_id']
                    )
                );
            } else {
                \App\Models\Imtest\Answer_im_test::create([
                    'profil_id' => $profilauthID,
                    'im_test_id' => $data['im_test_id'],
                    'question_im_test_id' => $answer2['question_im_test_id'],
                    'multiple_choice_im_test_id' => $answer2['multiple_choice_im_test_id']
                ]);
            }
        } else {
            return false;
        }

        if (
            array_key_exists('question_im_test_id', $answer3) &&
            array_key_exists('multiple_choice_im_test_id', $answer3)
        ) {

            if (array_key_exists('id', $answer3)) {
                \App\Models\Imtest\Answer_im_test::where('id', '=', $answer3['id'])->update(
                    array(
                        "multiple_choice_im_test_id" => $answer3['multiple_choice_im_test_id']
                    )
                );
            } else {
                \App\Models\Imtest\Answer_im_test::create([
                    'profil_id' => $profilauthID,
                    'im_test_id' => $data['im_test_id'],
                    'question_im_test_id' => $answer3['question_im_test_id'],
                    'multiple_choice_im_test_id' => $answer3['multiple_choice_im_test_id']
                ]);
            }
        } else {
            return false;
        }
        return true;
    }

    function savestep3($data, $profilauthID, $id = NULL)
    {

        if ($id) {
            \App\Models\Imtest\Follow_im_test::where('id', '=', $id)->update(
                array(
                    "file1" => $data['file1'],
                    "file2" => $data['file2'],
                    "file3" => $data['file3']
                )
            );
        } else {
            \App\Models\Imtest\Follow_im_test::create([
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $data['im_test_templates_id'],
                'im_test_id' => $data['im_test_id'],
                'file1' => $data['file1'],
                'file2' => $data['file2'],
                'file3' => $data['file3']
            ]);
        }

        $answer1 = $data['answer1'];

        if (
            array_key_exists('question_im_test_id', $answer1) &&
            array_key_exists('multiple_choice_im_test_id', $answer1)
        ) {

            if (array_key_exists('id', $answer1)) {
                \App\Models\Imtest\Answer_im_test::where('id', '=', $answer1->id)->update(
                    array(
                        "multiple_choice_im_test_id" => $answer1->multiple_choice_im_test_id
                    )
                );
            } else {
                \App\Models\Imtest\Answer_im_test::create([
                    'profil_id' => $profilauthID,
                    'im_test_id' => $data['im_test_id'],
                    'question_im_test_id' => $answer1->question_im_test_id,
                    'multiple_choice_im_test_id' => $answer1->multiple_choice_im_test_id
                ]);
            }
        } else {
            return false;
        }

        return true;
    }

    function savestep4($data, $profilauthID, $id = NULL)
    {

        if ($id) {
            \App\Models\Imtest\Follow_im_test::where('id', '=', $id)->update(
                array(
                    "text1" => $data['text1']
                )
            );
        } else {
            \App\Models\Imtest\Follow_im_test::create([
                'profil_id' => $profilauthID,
                'im_test_templates_id' => $data['im_test_templates_id'],
                'im_test_id' => $data['im_test_id'],
                'text1' => $data['text1']
            ]);
        }

        return true;
    }

    // NEED EVALUATION
    // public function saveQuestion($answer, $idimtest)
    // {
    //     $profilauthID = \App\Models\Profile::select('id')->where('user_id', \Auth::id())->first()->id;
    //     \App\Models\Imtest\Answer_im_test::create([
    //         'profil_id' => $profilauthID,
    //         'im_test_id' => $idimtest,
    //         'question_im_test_id' => $idimtest,
    //         'multiple_choice_im_test_id' => $answer
    //     ]);
    // }
}
