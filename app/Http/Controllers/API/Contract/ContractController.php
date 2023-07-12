<?php

namespace App\Http\Controllers\API\Contract;

use App\Models\Contract\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Facades\View;


class ContractController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Contract\Contract';

    const SINGULAR = 'contract template';

    const FILLABLE = ['id_name', 'date_start', 'date_end', 'date_ttd', 'contract', 'name_of_ceo', 'position_of_ceo', 'signature', 'position', 'title', ];

    const RULES = [
        'id_name' => 'required|integer',
        'date_start' => 'required|date',
        'date_end' => 'required|date',
        'date_ttd' => 'required|date',
        'contract' => 'required|string',
        'name_of_ceo' => 'required|string',
        'position_of_ceo' => 'required|string'
    ];

    const UPDATEx_RULES = [
        'id_name' => 'integer',
        'date_start' => 'date',
        'date_end' => 'date',
        'date_ttd' => 'date',
        'contract' => 'string',
        'name_of_ceo' => 'string',
        'position_of_ceo' => 'string'
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
            'singular' => 'contract.contract.singular.default',
            'capital' => 'contract.contract.singular.capital'
        ]
    ];

    /**
     * @SWG\GET(
     *   path="/api/contract",
     *   tags={"Contract"},
     *   summary="Get all contract data",
     *   description="File: app\Http\Controllers\API\ContractController@index, permission:Show Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function index() {

        $cc= Contract::with([
            'user' => function($query) {
                $query->select('id','full_name', 'email');
            }
            ])->orderBy('created_at','desc')->get();

        return response()->success(__('crud.success.default'), $cc);
    }

    /**
     * @SWG\GET(
     *   path="/api/contract/{id}",
     *   tags={"Contract"},
     *   summary="Get specific contract data",
     *   description="File: app\Http\Controllers\API\ContractController@show, permission:Show Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="Contract id")
     * )
     *
     */
    function show($id){
        $ct = Contract::where('id', $id)->get();

        $usr = User::select('id', 'email', 'first_name', 'full_name')->where('id', $ct[0]['id_name'])->get();

        $dataarray=array(
            'id'=> $ct[0]['id'],
            'id_name'=> $ct[0]['id_name'],
            'date_start'=> $ct[0]['date_start'],
            'date_end'=> $ct[0]['date_end'],
            'date_ttd'=> $ct[0]['date_ttd'],
            'contract'=> $ct[0]['contract'],
            'name_of_ceo'=> $ct[0]['name_of_ceo'],
            'position_of_ceo'=> $ct[0]['position_of_ceo'],
            'signature'=> $ct[0]['signature'],
            'position'=> $ct[0]['position'],
            'title'=> $ct[0]['title'],
            'user' =>array(
                'id_user'=> $usr[0]['id'],
                'email'=> $usr[0]['email'],
                'first_name'=> $usr[0]['first_name'],
                'full_name'=> $usr[0]['full_name']
            )

        );
        return response()->success(__('crud.success.default'), $dataarray);

    }

    /**
     * @SWG\POST(
     *   path="/api/searchuserbyemail",
     *   tags={"Contract"},
     *   summary="Search user by email, used in contract form",
     *   description="File: app\Http\Controllers\API\ContractController@searchuserbyemail, Permission: Add Contract|Edit Contract",
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
     *              required={"email"},
     *              @SWG\Property(property="email", type="string", format="email", description="Profile email", example="johndoe@mail.com")
     *       )
     *    )
     * )
     *
     */
    function searchuserbyemail(Request $request) {
        $email = $this->validate($request,['email' => 'required|string'])['email'];
        $usr = User::select('id', 'email', 'first_name', 'full_name')->where('email', 'LIKE', "%$email%")->get();

        return response()->success(__('crud.success.default'), $usr);
    }

    /**
     * @SWG\GET(
     *   path="/api/print-contract/{id}",
     *   tags={"Contract"},
     *   summary="Print contract / download as pdf file",
     *   description="File: app\Http\Controllers\API\ContractController@printcontrack, Permission: Show Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="user id")
     * )
     *
     */
    function printcontrack($id_name) {

        $ct = Contract::select('contract', 'position', 'date_start', 'date_end')->where('id_name', $id_name)->first();

        $usr = User::select('full_name')->where('id', "$id_name")->first();
        if (empty($ct['contract'])) {
            abort(404, 'Page not found');
        }

        $pdfname=$usr['full_name'].'_'.$ct['position'].'_Contract_'.date("dMy", strtotime($ct['date_start'])).'_to_'.date("dMy", strtotime($ct['date_end']));

        $str= str_replace("[name]", $usr['full_name'], $ct['contract']);

        $header=View::make('contract.header');
        $footer=View::make('contract.footer');

        $view = View::make('contract.contract', [
            'content' => $str
        ]);

        $pdf = \PDF::loadHTML($view);
        $pdf->setOption('header-html', $header);
        $pdf->setOption('footer-html', $footer);

        return $pdf->stream($pdfname.'.pdf');
    }

    /**
     * @SWG\POST(
     *   path="/api/contract",
     *   tags={"Contract"},
     *   summary="Store contract",
     *   description="File: app\Http\Controllers\API\ContractController@store, permission:Add Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="contract",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id_name", "date_start", "date_end", "date_ttd", "contract", "name_of_ceo", "position_of_ceo"},
     *          @SWG\Property(property="id_name", type="integer", description="user id", example="4"),
     *          @SWG\Property(property="date_start", type="string", description="Contract start in format (date: Y-m-d)", example="2020-12-31"),
     *          @SWG\Property(property="date_end", type="string", description="Contract end in format (date: Y-m-d)", example="2020-01-01"),
     *          @SWG\Property(property="date_ttd", type="string", description="Signed date in format (date: Y-m-d)", example="2019-12-28"),
     *          @SWG\Property(property="contract", type="string", description="Contract text", example="<p>Text of the contract</p>"),
     *          @SWG\Property(property="name_of_ceo", type="string", description="CEO name (signature section)", example="William Barron"),
     *          @SWG\Property(property="position_of_ceo", type="string", description="Position below ceo name (signature section)", example="Chief Executive Officer"),
     *       )
     *    )
     * )
     *
     */

     /**
     * @SWG\POST(
     *   path="/api/contract/{id}",
     *   tags={"Contract"},
     *   summary="update contract",
     *   description="File: app\Http\Controllers\API\ContractController@update, permission:Add Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="contract",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method","id_name", "date_start", "date_end", "date_ttd", "contract", "name_of_ceo", "position_of_ceo"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="id_name", type="integer", description="user id", example="4"),
     *          @SWG\Property(property="date_start", type="string", description="Contract start in format (date: Y-m-d)", example="2020-12-31"),
     *          @SWG\Property(property="date_end", type="string", description="Contract end in format (date: Y-m-d)", example="2020-01-01"),
     *          @SWG\Property(property="date_ttd", type="string", description="Signed date in format (date: Y-m-d)", example="2019-12-28"),
     *          @SWG\Property(property="contract", type="string", description="Contract text", example="<p>Text of the contract</p>"),
     *          @SWG\Property(property="name_of_ceo", type="string", description="CEO name (signature section)", example="William Barron"),
     *          @SWG\Property(property="position_of_ceo", type="string", description="Position below ceo name (signature section)", example="Chief Executive Officer"),
     *       )
     *    )
     * )
     *
     */

     /**
     * @SWG\Delete(
     *   path="/api/contract/{id}",
     *   tags={"Contract"},
     *   summary="Delete contract",
     *   description="File: app\Http\Controllers\API\ContractController@destroy, permission:Delete Contract",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="contract id"),
     * )
     *
     */

}
