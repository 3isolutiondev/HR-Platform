<?php

namespace App\Http\Controllers\API\Userreference;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class AnswerController extends Controller
{
    // use CRUDTrait;

    // const MODEL = 'App\Models\Userreference\Answer';

    // const SINGULAR = 'answer';

    // const FILLABLE = ['email_reference', 'question_reference_id', 'answer', 'user_id', ];

    // const RULES = [
    //     'answer' => 'required|string',
    //     'email_reference' => 'required|string',
    //     'question_reference_id' => 'required|integer',
    //     'user_id' => 'required|integer'
    // ];

    // const UPDATEx_RULES = [
    //     'answer' => 'required|string',
    //     'email_reference' => 'required|string',
    //     'question_reference_id' => 'required|integer',
    //     'user_id' => 'required|integer'
    // ];

    // const TRANSLATION = [
    //     'success' => [
    //         'default' => 'crud.success.default',
    //         'store' => 'crud.success.store',
    //         'update' => 'crud.success.update',
    //         'delete' => 'crud.success.delete'
    //     ],
    //     'error' => [
    //         'default' => 'crud.error.default',
    //         'store' => 'crud.error.store',
    //         'update_not_clean' => 'crud.error.update_not_clean',
    //         'update' => 'crud.error.update',
    //         'delete' => 'crud.error.delete'
    //     ],
    //     'model' => [
    //         'singular' => 'questionreference.answer.singular.default',
    //         'capital' => 'questionreference.answer.singular.capital'
    //     ]
    // ];


    // function countdata($categoryId, $profilID){
    //     $jregistered= \App\Models\P11\P11Reference::where('profil_id', $profilID)
    //     ->count();

    //     $jpengisi= \App\Models\Userreference\Answer::where('profil_id', $profilID)
    //         ->where('category_question_reference_id', $categoryId)
    //         ->count();

    //     return response()->success(__('crud.success.default'), ['jumlahterdaftar'=>$jregistered, 'jumlahpengisi'=>$jpengisi]);
    // }

    // function checkdata($categoryId, $profilID){
    //     $jpengisi= \App\Models\Userreference\Answer::where('profil_id', $profilID)
    //         ->where('category_question_reference_id', $categoryId)
    //         ->count();

    //     return response()->success(__('crud.success.default'), $jpengisi);
    // }

    /**
     * @SWG\Get(
     *   path="/api/reference-questions/list-data/{categoryId}/profile/{profilID}",
     *   tags={"Reference Check"},
     *   summary="Get reference check result",
     *   description="File: app\Http\Controllers\API\Userreference\AnswerController@listdata",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="categoryId",
     *      in="path",
     *      type="integer",
     *      required=true,
     *      description="Reference check id (category_question_reference table id)"
     *   ),
     *   @SWG\Parameter(
     *      name="profilID",
     *      in="path",
     *      type="integer",
     *      required=true,
     *      description="Profile id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function listdata($categoryId, $profilID){

        $data=\App\Models\P11\P11Reference::select('id', 'full_name', 'profile_id', 'email')
            ->where('profile_id', $profilID)
            // ->wherePivot('category_question_reference_id', $categoryId)
            // ->with('question')
            ->whereHas('question', function ($q) use ($categoryId) {
                return $q->where('user_answer_question_reference.category_question_reference_id', $categoryId);
            })
            ->with('question')
            // ->with(['question'=>function($q) use ($categoryId){
            //     return $q->wherePivot('category_question_reference_id', $categoryId);
            // }])
            ->get();

        return response()->success(__('crud.success.default'), $data);
    }

    /**
     * @SWG\Post(
     *   path="/api/work-reference/validate-email",
     *   tags={"Reference Check"},
     *   summary="Validate email before filling the reference check",
     *   description="File: app\Http\Controllers\API\Userreference\AnswerController@validateemail",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="categoryId",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"email", "profilID"},
     *          @SWG\Property(property="email", type="string", description="Email address registered as reference check", example="johndoe@mail.com"),
     *          @SWG\Property(property="profilID", type="integer", description="Profile id", example=145),
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function validateemail(Request $request){
        $validatedData = $this->validate(
            $request,
            [
                'email' => 'required|email',
                'profilID' => 'required|integer'
            ]
        );
        $filled=0;$preference_id=0;
        // $is_registered_data= \App\Models\Profile::select('profiles.id')
        //     ->join('p11_references', function($q) use($validatedData){
        //         $q->on('profiles.id', '=', 'p11_references.profile_id')
        //     ->where('p11_references.email', $validatedData['email']);
        // })
        // ->where('profiles.id', $validatedData['id'])
        // ->count();

        $q= \App\Models\P11\P11Reference::select('id')
        ->where('profile_id', $validatedData['profilID'])->where('email', $validatedData['email']);

        $is_registered_data=$q->count();

        if($is_registered_data>0) {

            $preference_id=$q->get()[0]->id;
            $filled=\App\Models\Userreference\Answer::select('profil_id')->where('p11_references_id', $q->get()[0]->id)
                ->where('profil_id', $validatedData['profilID'])
                ->count();

        }
        return response()->success(__('crud.success.default'), ['existdata'=>$is_registered_data,
            'filled'=>$filled, 'preference_id'=>$preference_id]);

    }

    function checkexist($id) {
        // $existdata= \App\Models\Userreference\Answer::where('profil_id', $id)
        //             ->count();

        // return response()->success(__('crud.success.default'), $existdata);
    }

    /**
     * @SWG\GET(
     *   path="/api/work-reference/get-question/{id}/{profilID}",
     *   tags={"Reference Check"},
     *   summary="Get reference check questions",
     *   description="File: app\Http\Controllers\API\Userreference\AnswerController@getquestion",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Reference check question id, (category_question_reference table id)"
     *   ),
     *   @SWG\Parameter(
     *      name="profilID",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Profile id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    function getquestion($categoryID, $profilID) {
//        $q= \App\Models\Userreference\Question::where('category_question_reference_id', $id)->with(['belongscategory'=>function($q){
//            return $q->select('id', 'title');
//        }])->leftJoin('user_answer_question_reference', 'user_answer_question_reference.question_reference_id', '=', 'question_reference.id')
//          ->where("user_id", "=",35)->get();

//        $q= \App\Models\Userreference\Question::select('question_reference.id', 'question', 'category_question_reference_id',
//                'user_answer_question_reference.id as id_answer', 'answer', 'user_answer_question_reference.user_id', 'user_answer_question_reference.email_reference')
//            ->where('category_question_reference_id', $id)->with(['belongscategory'=>function($q){
//            return $q->select('id', 'title');
//        }])->leftJoin('user_answer_question_reference', function($q){
//            $q->on('user_answer_question_reference.question_reference_id','=','question_reference.id')->where('user_id','=',39);
//        })
//        ->get();

        // $q= \App\Models\Userreference\Question::select('question_reference.id', 'question',
        //         'user_answer_question_reference.id as id_answer', 'answer',
        //         'user_answer_question_reference.profil_id',
        //         'user_answer_question_reference.email_reference')
        //         ->where('category_question_reference_id','=',$categoryID)
        //     ->leftJoin('user_answer_question_reference', function($q) use($profilID) {
        //             $q->on('user_answer_question_reference.question_reference_id','=','question_reference.id')
        //             ->where('profil_id','=',$profilID)
        //             ;
        //         }
        //     )
        //     ->get();
        $q= \App\Models\Userreference\Question::where('category_question_reference_id','=',$categoryID)
            ->get();
        return response()->success(__('crud.success.default'), $q);
    }

    /**
     * @SWG\Post(
     *   path="/api/work-reference",
     *   tags={"Reference Check"},
     *   summary="Save reference check answers",
     *   description="File: app\Http\Controllers\API\Userreference\AnswerController@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="answer",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"data", "category_id", "profile_id", "preference_id"},
     *          @SWG\Property(property="data", type="array",
     *              @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(property="answer", type="string", description="Answer of reference check question", example="<p>The person are qualified for this position</p>")
     *              )
     *          ),
     *          @SWG\Property(property="category_id", type="integer", description="Reference check question id, (category_question_reference table id)", example=1),
     *          @SWG\Property(property="profil_id", type="integer", description="Profile id", example=145),
     *          @SWG\Property(property="preference_id", type="integer", description="P11Reference table id", example=34)
     *      )
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function store (Request $request){
        $dd=$request->input('data');
        $category_id=$request->input('category_id');
        $profil_id=$request->input('profil_id');
        $preference_id=$request->input('preference_id');

        $this->validate($request, [
            'data.*.answer' => 'required|string'
        ]);

        for($i=0;$i<count($dd);$i++) {
            if(!empty($dd[$i]['id_answer'])) {

                \App\Models\Userreference\Answer::where('id', '=', $dd[$i]['id_answer'])
                    ->update(
                        array(
                            "profil_id" => $profil_id,
                            "p11_references_id" => $preference_id,
                            "answer" => $dd[$i]['answer'],
                            "question_reference_id" => $dd[$i]['id'],
                            'category_question_reference_id'=>$category_id
                        )
                    );

            } else {
                \App\Models\Userreference\Answer::create([
                    "profil_id" => $profil_id,
                    "p11_references_id" => $preference_id,
                    "answer" => $dd[$i]['answer'],
                    "question_reference_id" => $dd[$i]['id'],
                    'category_question_reference_id'=>$category_id
                ]);
            }

        }

        return response()->success(__('crud.success.default'));
    }

}
