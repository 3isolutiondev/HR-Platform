<?php

namespace App\Http\Controllers\API\Userreference;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ReferencecheckController extends Controller {

    /**
     * @SWG\GET(
     *   path="/api/reference-check",
     *   tags={"Reference Check"},
     *   summary="Get all reference check",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@index, permission:Show Reference Check",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    function index(){
        $dt= \App\Models\Userreference\Questioncategory::select('id', 'name', 'is_default')->get();

        return response()->success(__('crud.success.default'), $dt);

    }

    /**
     * @SWG\GET(
     *   path="/api/reference-check/{id}",
     *   tags={"Reference Check"},
     *   summary="get reference check",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@show, permission:Show Reference Check",
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
    function show($id) {
        $dt= \App\Models\Userreference\Questioncategory::select('id', 'name', 'is_default')->where('id', $id)
            ->with('hasquestion')->get();

        return response()->success(__('crud.success.default'), $dt);

    }

    /**
     * @SWG\Post(
     *   path="/api/reference-check",
     *   tags={"Reference Check"},
     *   summary="store reference check",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@store, permission:Add Reference Check",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="reference",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"name", "question"},
     *          @SWG\Property(
     *             property="name",
     *             type="string"
     *          ),
     *          @SWG\Property(
     *             property="question",
     *             type="array",
     *             @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="question",
     *                      type="string",
     *                      example="xxx ?"
     *                  ),
     *                  @SWG\Property(
     *                      property="category_question_reference_id",
     *                      type="integer",
     *                      example=1
     *                  )
     *              )
     *          )
     *      )
     *   )
     *
     * )
     *
     */
    function store(Request $request) {
        $dd=$request->input('question');
        $is_default=$request->input('is_default');

        $validatedData = $this->validate(
            $request,
            [
                'name' => 'required|string',
                // 'question.*' => 'required|string'
            ]
        );

        $cat= \App\Models\Userreference\Questioncategory::create([
            'name' => $validatedData['name'],
            'is_default' => $is_default
        ]);

        for($i=0;$i<count($dd);$i++) {
            \App\Models\Userreference\Question::create([
                'question' => $dd[$i],
                'category_question_reference_id' => $cat->id
            ]);
        }
        return response()->success(__('crud.success.default'));
    }


    /**
     * @SWG\Post(
     *   path="/api/reference-check/{id}",
     *   tags={"Reference Check"},
     *   summary="update reference check",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@update, permission:Edit Reference Check",
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
     *       name="reference",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"_method", "name", "question"},
     *          @SWG\Property(
     *              property="_method", type="string", enum={"PUT"}
     *          ),
     *          @SWG\Property(
     *             property="name",
     *             type="string"
     *          ),
     *          @SWG\Property(
     *             property="question",
     *             type="array",
     *             @SWG\Items(
     *                  type="object",
     *                  @SWG\Property(
     *                      property="question",
     *                      type="string",
     *                      example="xxx ?"
     *                  ),
     *                  @SWG\Property(
     *                      property="category_question_reference_id",
     *                      type="integer",
     *                      example=1
     *                  )
     *              )
     *          )
     *      )
     *   ),
     * )
     *
     */
    function update(Request $request, $id) {
        $name=$request->input('name');
        $is_default=$request->input('is_default');

        $im = \App\Models\Userreference\Questioncategory::find($id);
        $im->name = $name;
        $im->is_default = $is_default;
        $im->save();

        $dd=$request->input('quest');

        for($j=0;$j<count($dd);$j++) {
            if(is_array($dd[$j])) {

                \App\Models\Userreference\Question::updateOrCreate([
                    "id" => $dd[$j]['id']
                ], [
                    "question" => $dd[$j]['question'],
                    'category_question_reference_id' => $dd[$j]['category_question_reference_id']
                ]);

            } else {

                \App\Models\Userreference\Question::create([
                    'question' => $dd[$j],
                    'category_question_reference_id' => $im->id
                ]);

            }
        }
        return response()->success(__('crud.success.default'));

    }

    /**
     * @SWG\Delete(
     *   path="/api/reference-check/{id}",
     *   tags={"Reference Check"},
     *   summary="Delete reference check",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@destroy, permission:Delete Reference Check",
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
    function destroy($id) {
        $q = \App\Models\Userreference\Questioncategory::findOrFail($id);

        if (!$q) {
            return response()->error(__('crud.error.not_found'), 404);
        } else {
            $q->delete();
        }

        return response()->success(__('Question successfully deleted'));
    }

    function destroyquestion($id) {
        $q = \App\Models\Userreference\Question::findOrFail($id);

        if (!$q) {
            return response()->error(__('crud.error.not_found'), 404);
        } else {
            $q->delete();
        }

        return response()->success(__('Question successfully deleted'));
    }

    /**
     * @SWG\GET(
     *   path="/api/reference-question-category/all-options",
     *   tags={"Reference Check"},
     *   summary="get reference question category",
     *   description="File: app\Http\Controllers\API\ReferencecheckController@allOptions, permission:Show Reference Check",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions() {
        return response()->success(__('crud.success.default'),
            \App\Models\Userreference\Questioncategory::select('id as value', 'name as label')
            ->orderBy('created_at','desc')->get());
    }
}
