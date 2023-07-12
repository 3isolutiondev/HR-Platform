<?php

namespace App\Http\Controllers\API\Contract;

//use App\Models\Contract\Templatecontract;
//use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class ContracttemplateController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Contract\Templatecontract';

    const SINGULAR = 'contract template';

    const FILLABLE = ['title', 'position', 'name_of_ceo', 'position_of_ceo', 'template'];

    const RULES = [
        'title' => 'required|string|max:100',
        'position' => 'required|string|max:50',
        'name_of_ceo' => 'required|string',
        'position_of_ceo' => 'required|string',
        'template' => 'required|string'
    ];

    const UPDATEx_RULES = [
        'title' => 'string|max:100',
        'position' => 'string|max:20',
        'name_of_ceo' => 'string',
        'position_of_ceo' => 'string',
        'template' => 'string'
    ];
//
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
            'singular' => 'contract.contract.singular.default',
            'capital' => 'contract.contract.singular.capital'
        ]
    ];

    /**
     * @SWG\GET(
     *   path="/api/contract-template",
     *   tags={"Contract Template"},
     *   summary="Get all contract template data",
     *   description="File: app\Http\Controllers\API\ContracttemplateController@index, permission:Show Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/contract-template/{id}",
     *   tags={"Contract Template"},
     *   summary="Get specific contract template",
     *   description="File: app\Http\Controllers\API\ContracttemplateController@show, permission:Show Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer")
     * )
     *
     */

     /**
     * @SWG\POST(
     *   path="/api/contract-template",
     *   tags={"Contract Template"},
     *   summary="Store contract template",
     *   description="File: app\Http\Controllers\API\ContracttemplateController@store, permission:Add Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="contract",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"title", "position", "name_of_ceo", "position_of_ceo", "template"},
     *              @SWG\Property(property="title", type="string", description="Contract template title", example="Consultant"),
     *              @SWG\Property(property="position", type="string", description="Contract template position", example="Web Developer"),
     *              @SWG\Property(property="name_of_ceo", type="string", description="CEO name (signature section)", example="William Barron"),
     *              @SWG\Property(property="position_of_ceo", type="string", description="Position below ceo name (signature section)", example="Chief Executive Officer"),
     *              @SWG\Property(property="template", type="string", description="Text of the contract", example="<p>Template of the contract</p>"),
     *       )
     *    ),
     * )
     *
     */

     /**
     * @SWG\POST(
     *   path="/api/contract-template/{id}",
     *   tags={"Contract Template"},
     *   summary="update contract template",
     *   description="File: app\Http\Controllers\API\ContracttemplateController@update, permission:Edit Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="Contract template id"),
     *   @SWG\Parameter(
     *      name="contract",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method","title", "position", "name_of_ceo", "position_of_ceo", "template"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="title", type="string", description="Contract template title", example="Consultant"),
     *          @SWG\Property(property="position", type="string", description="Contract template position", example="Web Developer"),
     *          @SWG\Property(property="name_of_ceo", type="string", description="CEO name (signature section)", example="William Barron"),
     *          @SWG\Property(property="position_of_ceo", type="string", description="Position below ceo name (signature section)", example="Chief Executive Officer"),
     *          @SWG\Property(property="template", type="string", description="Text of the contract", example="<p>Template of the contract</p>"),
     *       )
     *    ),
     * )
     *
     */

     /**
     * @SWG\Delete(
     *   path="/api/contract-template/{id}",
     *   tags={"Contract Template"},
     *   summary="Delete contract template",
     *   description="File: app\Http\Controllers\API\ContracttemplateController@destroy, permission:Delete Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="Contract template id"),
     * )
     *
     */

//    public function store(Request $request) {
//
//        $validatedData = $this->validate($request,
//            [
//                'title' => 'required|string|max:100',
//                'position' => 'required|string|max:50',
//                'name_of_ceo' => 'required|string',
//                'position_of_ceo' => 'required|string',
//                'signature' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048',
//                'template' => 'required|string'
//            ]
//        );
//
//        $template = new Templatecontract;
//        $template->title = $validatedData['title'];
//        $template->position = $validatedData['position'];
//        $template->name_of_ceo = $validatedData['name_of_ceo'];
//        $template->position_of_ceo = $validatedData['position_of_ceo'];
//        $template->template = $validatedData['template'];
//
//        $file = $request->file('signature');
//
//        $path = $file->store('public/signature');
//
//        \Storage::url($path);
//
//        $nm=$path.time()."_".$file->getClientOriginalName();
//
//        $template->signature = $nm;
//
//        $template->save();
//
//        return response()->success('contract template successfully created');
//    }
//
//    public function update(Request $request, int $id) {
//
//        $validatedData = $this->validate($request,
//            [
//                'title' => 'required|string|max:100',
//                'position' => 'required|string|max:50',
//                'name_of_ceo' => 'required|string',
//                'position_of_ceo' => 'required|string',
//                'template' => 'required|string'
//            ]
//        );
//
//        $template = Templatecontract::find($id);
//        $template->title = $validatedData['title'];
//        $template->position = $validatedData['position'];
//        $template->name_of_ceo = $validatedData['name_of_ceo'];
//        $template->position_of_ceo = $validatedData['position_of_ceo'];
//        $template->template = $validatedData['template'];
//        $file = $request->file('signature');
//
//        if(!empty($template->signature)) {
//            \Storage::delete($template->signature);
//        }
//
//        if(!empty($file)) {
//            $path = $file->store('public/signature');
//            \Storage::url($path);
//
//            $nm=$path.time()."_".$file->getClientOriginalName();
//
//            $template->signature = $nm;
//        }
//
//        $template->save();
//
//        return response()->success('contract template successfully updated');
//
//    }
//
//    public function destroy(int $id) {
//        $template = Templatecontract::findOrFail($id);
//        $template->delete();
//
//        return response()->success('contract template successfully deleted');
//    }

}
