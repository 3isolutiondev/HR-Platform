<?php

namespace App\Http\Controllers\API\Im;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * We can safely delete this file
 */

class ApplicantController extends Controller {

    function show($id) {

//        $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
//            return $q->with(['qmchoice'=>function($q){
//                return $q->with(['mchoice'=>function($q){
//                    return $q->with('u_answer');
//                }]);
//            }]);
//        }])->get();

//        Project::with(['clients', 'tasks' => function($q) use($value) {
//            // Query the name field in status table
//            $q->where('status_id', '!=', '2');
//        }])->whereUserId(Auth::user()->id)->get();

//        $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
//            return $q->with(['qmchoice'=>function($q){
//                return $q->where('id',37)->with(['q_answer'=>function($q){
//                    return $q->with('u_answer');
//                }]);
//            }]);
//        }])->get();

        $ct= \App\Models\User::select('id', 'full_name')->where('id', $id)->with(['applicant'=>function($q){
            return $q->with(['user_answer_many_question'=>function($q){
                return $q->with(['has_many_choice'=>function($q){
                    return $q->with('hasoneanswer');
                }]);
            }]);
        }])->get();

        if($ct->count()==0) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), $ct);
    }

    function store(Request $request) {

        $validatedData = $this->validate($request,
            [
                'user_id' => 'required|integer',
                'im_test_id' => 'required|integer',
                'text1' => 'string',
                'text2' => 'string',
                'text3' => 'string',
                'file_answers1' => 'mimes:pdf,docx,doc',
                'file_answers2' => 'mimes:pdf,docx,doc',
                'file_answers3' => 'mimes:pdf,docx,doc'
            ]
        );

        $app = new \App\Models\Imtest\Applicant;
        $app->user_id= $validatedData['user_id'];
        $app->im_evaluation_id= $validatedData['im_test_id'];

        if(isset($validatedData['text1'])) {
            $app->text1= $validatedData['text1'];
        }
        if(isset($validatedData['text2'])) {
            $app->text2= $validatedData['text2'];
        }

        if(isset($validatedData['text3'])) {
            $app->text3= $validatedData['text3'];
        }

        if (!empty($request->file('file_answers1'))) {
            $app->addMedia($validatedData['file_answers1'])->toMediaCollection('file_answers1');
        }

        if (!empty($request->file('file_answers2'))) {
            $app->addMedia($validatedData['file_answers2'])->toMediaCollection('file_answers2');
        }

        if (!empty($request->file('file_answers3'))) {
            $app->addMedia($validatedData['file_answers3'])->toMediaCollection('file_answers3');
        }

        $app->save();

        if(!empty($request->get('answer'))) {

            $dd= \GuzzleHttp\json_decode($request->get('answer'));

            \App\Models\Imtest\user_answer::create([
                "user_id"=>$validatedData['user_id'],
                "q_mchoice_id"=>$dd->answer->{"0"}->q_mchoice_id,
                "mchoice_id"=>$dd->answer->{"0"}->mchoice_id
            ]);

            \App\Models\Imtest\user_answer::create([
                "user_id"=>$validatedData['user_id'],
                "q_mchoice_id"=>$dd->answer->{"1"}->q_mchoice_id,
                "mchoice_id"=>$dd->answer->{"1"}->mchoice_id
            ]);

            \App\Models\Imtest\user_answer::create([
                "user_id"=>$validatedData['user_id'],
                "q_mchoice_id"=>$dd->answer->{"2"}->q_mchoice_id,
                "mchoice_id"=>$dd->answer->{"2"}->mchoice_id
            ]);
        }

        $ct=\App\Models\User::select('id', 'full_name')->where('id', $validatedData['user_id'])->with(['applicant'=>function($q){
            return $q->with(['user_answer_many_question'=>function($q){
                return $q->with(['has_many_choice'=>function($q){
                    return $q->with('hasoneanswer');
                }]);
            }]);
        }])->get();

        return response()->success(__('crud.success.default'), $ct);

    }

    function update(Request $request, $id) {

        $validatedData = $this->validate($request,
            [
                'user_id' => 'required|integer',
                'im_evaluation_id' => 'required|integer',
                'text1' => 'string',
                'text2' => 'string',
                'text3' => 'string',
                'file_answers1' => 'mimes:pdf,docx,doc',
                'file_answers2' => 'mimes:pdf,docx,doc',
                'file_answers3' => 'mimes:pdf,docx,doc'
            ]
        );

        $app = \App\Models\Imtest\Applicant::find($id);

        $app->user_id= $validatedData['user_id'];
        $app->im_evaluation_id= $validatedData['im_evaluation_id'];

        if(isset($validatedData['text1'])) {
            $app->text1= $validatedData['text1'];
        }

        if(isset($validatedData['text2'])) {
            $app->text2= $validatedData['text2'];
        }

        if(isset($validatedData['text3'])) {
            $app->text3= $validatedData['text3'];
        }

        if(!empty($request->file('file_answers1'))) {

            $app->getMedia('file_answers1')->first()->delete();

            $file_answers1 = $request->file('file_answers1')->getClientOriginalName();
            $app->addMedia($validatedData['file_answers1'])->toMediaCollection('file_answers1');

            $app->file_answers1= $file_answers1;

        }

        if(!empty($request->file('file_answers2'))) {

            $app->getMedia('file_answers2')->first()->delete();

            $file_answers2 = $request->file('file_answers2')->getClientOriginalName();
            $app->addMedia($validatedData['file_answers2'])->toMediaCollection('file_answers2');

            $app->file_answers2= $file_answers2;

        }

        if(!empty($request->file('file_answers3'))) {

            $app->getMedia('file_answers3')->first()->delete();

            $file_answers3 = $request->file('file_answers3')->getClientOriginalName();
            $app->addMedia($validatedData['file_answers3'])->toMediaCollection('file_answers3');

            $app->file_answers3= $file_answers3;

        }

        $app->save();

        if(!empty($request->get('answer'))) {

            $dd= \GuzzleHttp\json_decode($request->get('answer'));

            $ans1 = \App\Models\Imtest\user_answer_quiz::find($dd->answer->{"0"}->id);
            $ans1->q_mchoice_id= $dd->answer->{"0"}->q_mchoice_id;
            $ans1->mchoice_id= $dd->answer->{"0"}->mchoice_id;
            $ans1->save();

            $ans2 = \App\Models\Imtest\user_answer_quiz::find($dd->answer->{"1"}->id);
            $ans2->q_mchoice_id= $dd->answer->{"1"}->q_mchoice_id;
            $ans2->mchoice_id= $dd->answer->{"1"}->mchoice_id;
            $ans2->save();

            $ans3 = \App\Models\Imtest\user_answer_quiz::find($dd->answer->{"2"}->id);
            $ans3->q_mchoice_id= $dd->answer->{"2"}->q_mchoice_id;
            $ans3->mchoice_id= $dd->answer->{"2"}->mchoice_id;
            $ans3->save();

        }

        $ct=\App\Models\User::select('id', 'full_name')->where('id', $validatedData['user_id'])->with(['applicant'=>function($q){
            return $q->with(['user_answer_many_question'=>function($q){
                return $q->with(['has_many_choice'=>function($q){
                    return $q->with('hasoneanswer');
                }]);
            }]);
        }])->get();

        return response()->success(__('crud.success.default'), $ct);

    }

}
