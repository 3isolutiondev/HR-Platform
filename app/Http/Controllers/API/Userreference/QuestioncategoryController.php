<?php

namespace App\Http\Controllers\API\Userreference;

use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

// Reference check questions set
class QuestioncategoryController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Userreference\Questioncategory';

    const SINGULAR = 'question category';

    const FILLABLE = ['name', 'is_default', ];

    const RULES = [
        'name' => 'required|string'
    ];

    const UPDATEx_RULES = [
        'name' => 'required|string'
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
            'singular' => 'questionreference.category.singular.default',
            'capital' => 'questionreference.category.singular.capital'
        ]
    ];

    /**
     * @SWG\GET(
     *   path="/api/reference-question-category",
     *   tags={"Reference Check Question Sets"},
     *   summary="Get all reference check questions sets data",
     *   description="File: app\Http\Controllers\API\QuestioncategoryController@index, permission:Index Reference Question Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/reference-question-category/{id}",
     *   tags={"Reference Check Question Sets"},
     *   summary="Get specific reference check questions sets data",
     *   description="File: app\Http\Controllers\API\QuestioncategoryController@show, permission:Show Reference Question Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Reference check id (category_question_reference table id)"
     *    ),
     * )
     *
     */

    /**
     * @SWG\POST(
     *   path="/api/reference-question-category",
     *   tags={"Reference Check Question Sets"},
     *   summary="Store reference check questions sets data",
     *   description="File: app\Http\Controllers\API\QuestioncategoryController@store, permission:Reference Question Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="referenceCheck",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Reference check question sets name",
     *                  example="Reference check v1"
     *              )
     *      )
     *   )
     *
     * )
     *
     */

    /**
     * @SWG\POST(
     *   path="/api/reference-question-category/{id}",
     *   tags={"Reference Check Question Sets"},
     *   summary="Update reference check questions sets data",
     *   description="File: app\Http\Controllers\API\QuestioncategoryController@update, permission:Edit Reference Question Category",
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
     *       description="Reference check id (category_question_reference table id)"
     *   ),
     *   @SWG\Parameter(
     *       name="question",
     *       in="body",
     *       @SWG\Schema(
     *              required={"_method", "name"},
     *              @SWG\Property(
     *                  property="_method", type="string", enum={"PUT"}, example="PUT"
     *              ),
     *              @SWG\Property(
     *                  property="name",
     *                  type="string",
     *                  description="Reference check question sets name",
     *                  example="Reference check v1"
     *              )
     *      )
     *   )
     * )
     *
     */

    // Either this is old version or for future development
    // public function allOptions() {
    //     return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')
    //     ->orderBy('created_at','desc')->get());
    // }

    /**
     * @SWG\Delete(
     *   path="/api/reference-question-category/{id}",
     *   tags={"Reference Check Question Sets"},
     *   summary="Delete reference check questions sets data",
     *   description="File: app\Http\Controllers\API\QuestioncategoryController@destroy, permission:Delete Reference Question Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Reference check id (category_question_reference table id)"
     *    ),
     * )
     *
     */
}
