<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Profile;

class P11LanguageController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Language';
    const SINGULAR = 'Language';

    const FILLABLE = [
        'language_id', 'language_level_id', 'profile_id', 'is_mother_tongue'
    ];

    const RULES = [
        'language.value' => 'required|exists:languages,id',
        'language_level.value' => 'required|exists:language_levels,id',
        'is_mother_tongue' => 'sometimes|nullable|boolean'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    protected function setMotherTongue($profile_id, $record_id)
    {
        $profile = Profile::find($profile_id);

        if (!$profile) {
            return false;
        }

        $p11_languages = $profile->p11_languages->where('is_mother_tongue', 1)->count();

        if ($p11_languages <= 1) {
            return false;
        } else {
            return true;
        }
    }

    protected function getLists()
    {
        return $this->model::with(['language', 'language_level'])->where('profile_id', $this->authProfileId)->get();
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-languages",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Get list of all p11 languages / profile languages (not related with specific profile)",
     *   description="File: app\Http\Controllers\API\P11LanguageController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/p11-languages/{id}",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Get list of specific p11 language / profile language",
     *   description="File: app\Http\Controllers\API\P11LanguageController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 language id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with(['language', 'language_level'])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-languages",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Store p11 languages / profile language",
     *   description="File: app\Http\Controllers\API\P11LanguageController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Language",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"language", "language_level", "is_mother_tongue"},
     *          @SWG\Property(
     *              property="language",
     *              type="object",
     *              @SWG\Property(property="value", type="integer", description="Language id", example=1),
     *          ),
     *          @SWG\Property(
     *              property="language_level",
     *              type="object",
     *              @SWG\Property(property="value", type="integer", description="Language level id", example=2),
     *          ),
     *          @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Boolean, 1 = true, 0 = false, set language as native language", example=0)
     *      )
     *   )
     *
     * )
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $languageData = $request->only($this->fillable);
        $languageData['language_id'] = $validatedData['language']['value'];
        $languageData['language_level_id'] = $validatedData['language_level']['value'];
        $languageData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($languageData);

        if (!$record) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
    }


    /**
     * @SWG\Post(
     *   path="/api/p11-languages/{id}",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Update p11 languages / profile language",
     *   description="File: app\Http\Controllers\API\P11LanguageController@update, permission:P11 Access",
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
     *       description="P11 language id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Language",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "language", "language_level", "is_mother_tongue"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(
     *              property="language",
     *              type="object",
     *              @SWG\Property(property="value", type="integer", description="Language id", example=1),
     *          ),
     *          @SWG\Property(
     *              property="language_level",
     *              type="object",
     *              @SWG\Property(property="value", type="integer", description="Language level id", example=2),
     *          ),
     *          @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Boolean, 1 = true, 0 = false, set language as native language", example=0)
     *      )
     *   )
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);

        $updateData = $request->only($this->fillable);
        $updateData['language_id'] = $validatedData['language']['value'];
        $updateData['language_level_id'] = $validatedData['language_level']['value'];
        $record->fill($updateData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($validatedData['is_mother_tongue'] == 1) {
            $updateMotherTongue = $this->setMotherTongue($record->profile_id, $record->id);

            if (!$updateMotherTongue) {
                return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
            }
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-languages/update-mother-tongue",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Update native language",
     *   description="File: app\Http\Controllers\API\P11LanguageController@updateMotherTongue, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Language",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "language", "language_level", "is_mother_tongue"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="id", type="integer", description="P11 Language id", example=2),
     *          @SWG\Property(property="is_mother_tongue", type="integer", enum={0,1}, description="Boolean, 1 = true, 0 = false, set language as native language", example=0)
     *      )
     *   )
     * )
     *
     **/
    public function updateMotherTongue(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer', 'is_mother_tongue' => 'required|boolean']);
        $record = $this->model::findOrFail($validatedData['id']);

        if ($request['is_mother_tongue'] == 0) {
            $updateMotherTongue = $this->setMotherTongue($record->profile_id, $record->id);

            if (!$updateMotherTongue) {
                return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
            }
        }


        $record->is_mother_tongue = $request['is_mother_tongue'];
        $saved = $record->save();

        if (!$saved) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $this->getLists());
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-languages/lists",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Get list of all p11 languages / profile languages (specific for logged in user)",
     *   description="File: app\Http\Controllers\API\P11LanguageController@lists, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->getLists());
    }


     /**
     * @SWG\Delete(
     *   path="/api/p11-languages/{id}",
     *   tags={"P11 Languages / Profile Languages"},
     *   summary="Delete p11 languages data",
     *   description="File: app\Http\Controllers\API\P11LanguageController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 Language id"
     *    ),
     * )
     *
     */
}
