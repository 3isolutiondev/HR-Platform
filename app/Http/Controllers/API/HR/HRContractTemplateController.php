<?php

namespace App\Http\Controllers\API\HR;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Attachment;

class HRContractTemplateController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\HR\HRContractTemplate';
    const SINGULAR = 'contract template';

    const FILLABLE = [ 'template_name', 'slug', 'contracts', 'footer' ];

    const RULES = [
        'template_name' => 'required|string',
        'contracts' => 'required|string',
        'footer' => 'sometimes|nullable|string'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/hr-contract-templates",
     *   tags={"HR Contract Template"},
     *   summary="list of hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@index, Permission: Index Contract Template",
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
     *   path="/api/hr-contract-templates/{id}",
     *   tags={"HR Contract Template"},
     *   summary="get specific of hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@show, Permission: Show Contract Template",
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
     * @SWG\Post(
     *   path="/api/hr-contract-templates",
     *   tags={"HR Contract Template"},
     *   summary="Store hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@store, Permission: Add Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="HRContractTemplate",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"template_name", "contracts"},
     *          @SWG\Property(property="template_name", type="string", description="Template Name", example="Template name"),
     *          @SWG\Property(property="contracts", type="string", description="Contract text", example="Contract text"),
     *          @SWG\Property(property="footer", type="string", description="Footer text")
     *      )
     *    ),
     * )
     */

    /**
     * @SWG\Post(
     *   path="/api/hr-contract-templates/{id}",
     *   tags={"HR Contract Template"},
     *   summary="Update hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@update, Permission: Edit Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer"),
     *   @SWG\Parameter(
     *      name="HRContractTemplate",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "template_name", "contracts"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="template_name", type="string", description="Template Name", example="Template Name"),
     *          @SWG\Property(property="contracts", type="string", description="Contract text", example="Contract Text"),
     *          @SWG\Property(property="footer", type="string", description="Footer Text")
     *      ),
     *    ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

     /**
     * @SWG\Delete(
     *   path="/api/hr-contract-templates/{id}",
     *   tags={"HR Contract Template"},
     *   summary="Delete hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@destroy, Permission: Delete Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer"),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/hr-contract-templates/upload-logo",
     *   tags={"HR Contract Template"},
     *   summary="upload logo on hr contract templates",
     *   description="File: app\Http\Controllers\API\HRContractTemplateController@uploadLogo, Permission: Add Contract Template|Edit Contract Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Logo in Image Format",
     *   )
     * )
     */
    public function uploadLogo(Request $request)
    {
        $validatedData = $this->validate($request, ['file' => 'required|max:2048']);

        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($request->file('file'))->toMediaCollection('contract-template-logo', 's3');
        $media = $attachment->getMedia('contract-template-logo');
        $attachment->download_url = $media[0]->getFullUrlFromS3();
        $attachment->file_url = $media[0]->getFullUrlFromS3();
        $attachment->mime = $media[0]->mime_type;

        if ($attachment) {
            return response()->success(__('attachment.success.upload'), $attachment);
        }

        return response()->error(__('attachment.error.upload'), 500);
    }
}
