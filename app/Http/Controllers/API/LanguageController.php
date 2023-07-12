<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class LanguageController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Language';
    const SINGULAR = 'Language';

    const FILLABLE = [
        'name', 'slug'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        // 'slug' => 'required|string|max:255'
    ];

    /**
     * @SWG\Get(
     *   path="/api/languages/all-options",
     *   tags={"Language"},
     *   summary="Get all language data in {value: 1, label: English} format",
     *   description="File: app\Http\Controllers\API\LanguageController@all, Permission: Index Language|Index HR Job Category",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function all() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->orderBy('name','asc')->get());
    }

    /**
     * @SWG\Get(
     *   path="/api/languages",
     *   tags={"Language"},
     *   summary="Get all language data",
     *   description="File: app\Http\Controllers\API\LanguageController@index, Permission: Index Language",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/languages/{id}",
     *   tags={"Language"},
     *   summary="Get specific language data",
     *   description="File: app\Http\Controllers\API\LanguageController@show, Permission: Show Language",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="language id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/languages",
     *   tags={"Language"},
     *   summary="Store language data",
     *   description="File: app\Http\Controllers\API\LanguageController@store, Permission: Add Language",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="language",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"name"},
     *              @SWG\Property(property="name", type="string", description="language name", example="English")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/languages/{id}",
     *   tags={"Language"},
     *   summary="Update language data",
     *   description="File: app\Http\Controllers\API\LanguageController@update, Permission: Edit Language",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="language id"),
     *   @SWG\Parameter(
     *          name="language",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "name"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="name", type="string", description="language name", example="English")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/languages/{id}",
     *   tags={"Language"},
     *   summary="Delete language data",
     *   description="File: app\Http\Controllers\API\LanguageController@update, Permission: Delete Language",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="language id"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
}
