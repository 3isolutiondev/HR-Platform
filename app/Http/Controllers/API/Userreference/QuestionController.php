<?php

namespace App\Http\Controllers\API\Userreference;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class QuestionController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Userreference\Question';

    const SINGULAR = 'question';

    const FILLABLE = ['is_default', 'question', 'category_question_reference_id'];

    const RULES = [
        'question' => 'string',
        'category_question_reference_id' => 'required|integer'
    ];

    const UPDATEx_RULES = [
        'question' => 'string',
        'category_question_reference_id' => 'required|integer'
    ];

    const TRANSLATION = [
        'success' => [
            'default' => 'crud.success.default',
            'store' => 'crud.success.store',
            'update' => 'crud.success.update',
            'delete' => 'crud.success.delete'
        ],
        'error' => [
            'default' => 'crud.error.default',
            'store' => 'crud.error.store',
            'update_not_clean' => 'crud.error.update_not_clean',
            'update' => 'crud.error.update',
            'delete' => 'crud.error.delete'
        ],
        'model' => [
            'singular' => 'questionreference.question.singular.default',
            'capital' => 'questionreference.question.singular.capital'
        ]
    ];

    /**
     * @SWG\GET(
     *   path="/api/reference-question",
     *   tags={"Reference Check Question"},
     *   summary="Get all reference check question inside table",
     *   description="File: app\Http\Controllers\API\Userreference\QuestionController@index, permission:Index Reference Question",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    function index(){
        $dt= \App\Models\Userreference\Question::with(['belongscategory'=>function($q){
            return $q->select('id', 'name');
        }])->get();

        return response()->success(__('crud.success.default'), $dt);
    }

    /**
     * @SWG\GET(
     *   path="/api/reference-question/{id}",
     *   tags={"Reference Check Question"},
     *   summary="Get specific reference check question",
     *   description="File: app\Http\Controllers\API\QuestionController@show, permission:Show Reference Question",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Question id"
     *   ),
     * )
     *
     */
    function show($id){
        $dt= \App\Models\Userreference\Question::where('id', $id)->with(['belongscategory'=>function($q){
            return $q->select('id', 'name');
        }])->get();

        return response()->success(__('crud.success.default'), $dt);
    }

     /**
     * @SWG\POST(
     *   path="/api/reference-question",
     *   tags={"Reference Check Question"},
     *   summary="Store reference check question",
     *   description="File: app\Http\Controllers\API\Userreference\QuestionController@store, permission:Reference Question",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="question",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"category_question_reference_id", "question"},
     *              @SWG\Property(
     *                  property="category_question_reference_id",
     *                  type="integer",
     *                  description="Reference check id, (category_question_reference table id)",
     *                  example=1
     *              ),
     *              @SWG\Property(
     *                  property="question",
     *                  type="string",
     *                  description="Question",
     *                  example="What do you think about candidate personality?"
     *              )
     *      )
     *   )
     * )
     *
     */

    /**
     * @SWG\POST(
     *   path="/api/reference-question/{id}",
     *   tags={"Reference Check Question"},
     *   summary="Update reference check question",
     *   description="File: app\Http\Controllers\API\Userreference\QuestionController@update, permission:Edit Reference Question",
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
     *       description="Question id"
     *   ),
     *   @SWG\Parameter(
     *       name="question",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "category_question_reference_id", "category"},
     *              @SWG\Property(
     *                  property="_method", type="string", enum={"PUT"}, example="PUT"
     *              ),
     *              @SWG\Property(
     *                  property="category_question_reference_id",
     *                  type="integer",
     *                  description="Reference check id, (category_question_reference table id)",
     *                  example=1
     *              ),
     *              @SWG\Property(
     *                  property="question",
     *                  type="string",
     *                  description="Question",
     *                  example="What do you think about candidate personality?"
     *              )
     *      )
     *   )
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/reference-question/{id}",
     *   tags={"Reference Check Question"},
     *   summary="Delete reference check question",
     *   description="File: app\Http\Controllers\API\Userreference\QuestionController@destroy, Permission: Delete Reference Question",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Question id"
     *    ),
     * )
     *
     */
}
