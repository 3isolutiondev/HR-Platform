<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class P11FieldOfWorkController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11FieldOfWork';
    const SINGULAR = 'p11_field_of_work';

    const FILLABLE = [ 'field_of_work_id', 'profile_id' ];

    const RULES = [
        'field_of_work_id' => 'required|integer',
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-field-of-works",
     *   tags={"P11 areas of expertise / Area of expertise related to a profile"},
     *   summary="Get list of all p11 areas of expertise data",
     *   description="File: app\Http\Controllers\API\P11FieldOfWorkController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-field-of-works/{id}",
     *   tags={"P11 areas of expertise / Area of expertise related to a profile"},
     *   summary="Get specific p11 areas of expertise data",
     *   description="File: app\Http\Controllers\API\P11FieldOfWorkController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 area of expertise id"
     *   )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/p11-field-of-works",
     *   tags={"P11 areas of expertise / Area of expertise related to a profile"},
     *   summary="Store p11 areas of expertise data",
     *   description="File: app\Http\Controllers\API\P11FieldOfWorkController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11FieldOfWork",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"field_of_work_id"},
     *          @SWG\Property(property="field_of_work_id", type="integer", description="Area of expertise id", example=20)
     *      )
     *   )
     *
     * )
     *
     **/
    public function store(Request $request) {
        $validatedData = $this->validate($request, $this->rules);
        $storeData = $request->only($this->fillable);
        $storeData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($storeData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->success(_('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-field-of-works/{id}",
     *   tags={"P11 areas of expertise / Area of expertise related to a profile"},
     *   summary="Update p11 areas of expertise data",
     *   description="File: app\Http\Controllers\API\P11FieldOfWorkController@update, permission:P11 Access",
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
     *       description="P11 area of expertise id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11FieldOfWork",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "field_of_work_id"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="field_of_work_id", type="integer", description="Area of expertise id", example=20)
     *      )
     *   )
     *
     * )
     *
     **/

    /**
     * @SWG\Delete(
     *   path="/api/p11-field-of-works/{id}",
     *   tags={"P11 areas of expertise / Area of expertise related to a profile"},
     *   summary="Delete p11 areas of expertise data",
     *   description="File: app\Http\Controllers\API\P11FieldOfWorkController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 area of expertise id"
     *    )
     * )
     *
     */

}
