<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class LanguageLevelController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\LanguageLevel';
    const SINGULAR = 'Language Level';

    const FILLABLE = [
        'name', 'slug', 'order'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
    ];

     /**
     * @SWG\GET(
     *   path="/api/language-levels/all-options",
     *   tags={"Language Level"},
     *   summary="Get list of language level data in { value: 3, label: Basic } format",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@all, permission:Index Language Level|P11 Access|Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function all() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label', 'order')->orderBy('order','asc')->get());
    }

    // first version
    // public function index() {
    //     return response()->success(__('crud.success.default'), $this->model::orderBy('order','asc')->get());
    // }

    /**
     * @SWG\GET(
     *   path="/api/language-levels/{id}",
     *   tags={"Language Level"},
     *   summary="Get  specific language levels",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@show, permission:Show Language Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Language level id"
     *    )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/language-levels",
     *   tags={"Language Level"},
     *   summary="store language-levels",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@store, permission:Add Language Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="languageLevel",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"name"},
     *              @SWG\Property(property="name", type="string", description="Language level name", example="Basic")
     *       )
     *   )
     * )
     *
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $languageLevel = $request->only($this->fillable);
        $languageLevelCount = $this->model::get()->count();
        $languageLevel['order'] = ($languageLevelCount > 0) ? $languageLevelCount : 0;
        $record = $this->model::create($languageLevel);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/language-levels/{id}",
     *   tags={"Language Level"},
     *   summary="Update language level",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@update, permission:Edit Language Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="languageLevel",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "name"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="Language level name", example="Basic")
     *       )
     *   ),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Language level id"
     *   )
     *
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/language-levels/change-order",
     *   tags={"Language Level"},
     *   summary="Change language level order",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@changeOrder, permission:Edit Language Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="languageLevel",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"name"},
     *          @SWG\Property(property="name", type="string", description="Language level name", example="Basic")
     *       )
     *   )
     * )
     *
     */
    public function changeOrder(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        foreach($validatedData['languageLevels'] as $key => $languageLevel) {
            // dd($languageLevel);
            $record = $this->model::findOrFail($languageLevel['value']);
            $record->order = $key;
            $record->save();
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]));
    }

    /**
     * @SWG\Delete(
     *   path="/api/language-levels/{id}",
     *   tags={"Language Level"},
     *   summary="Delete language level",
     *   description="File: app\Http\Controllers\API\LanguageLevelController@destroy, permission:Delete Language Level",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Language level id"
     *    ),
     * )
     *
     */
}
