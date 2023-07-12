<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\DeleteAttachmentTrait;

class P11PublicationController extends Controller
{
    use CRUDTrait, DeleteAttachmentTrait;

    const MODEL = 'App\Models\P11\P11Publication';
    const SINGULAR = 'Publication';

    const FILLABLE = [
        'title', 'year', 'profile_id', 'publication_file_id', 'url'
    ];

    const RULES = [
        'title' => 'required|string|max:255',
        'year' => 'required|date_format:"Y"',
        'publication_file_id' => 'sometimes|nullable|integer',
        'url' => 'sometimes|nullable|string'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-publications",
     *   tags={"p11-publications / Profile Publication data"},
     *   summary="Get list of all p11 publications data inside the table",
     *   description="File: app\Http\Controllers\API\P11PublicationController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/p11-publications/{id}",
     *   tags={"P11 Publications / Profile Publication Data"},
     *   summary="Get specific p11 publication data",
     *   description="File: app\Http\Controllers\API\P11PublicationController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 publication id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::findOrFail($id);
        if(!empty($record->publication_file_id)) {
            $media = $record->attachment->media->first();
            if(!empty($media)) {
                $record->publication_file = new \stdClass;
                $record->publication_file->file_id = $record->publication_file_id;
                $record->publication_file->filename = $media->file_name;
                $record->publication_file->file_url = $media->getFullUrlFromS3('p11-thumb');
                $record->publication_file->download_url = $media->getFullUrlFromS3();
                $record->publication_file->mime = $media->mime_type;
            } else {
                $record->publication_file = '';
            }
            unset($record->attachment);
        }

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-publications",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Store p11 publication data",
     *   description="File: app\Http\Controllers\API\P11PublicationController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Publication",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"title", "year"},
     *          @SWG\Property(property="title", type="string", description="Publication title", example="The title of the publication"),
     *          @SWG\Property(property="year", type="integer", description="Publication year", example=2012),
     *          @SWG\Property(property="publication_file_id", type="integer", description="Attachment id where the publication file is saved [it's not required]", example=10),
     *          @SWG\Property(property="url", type="string", description="Publication URL [it's not required]", example="https://mywebsite.org/publication/title-of-publication")
     *      )
     *   )
     * )
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $publicationData = $request->only($this->fillable);
        $publicationData['year'] = $publicationData['year'].'-01-01';
        $publicationData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($publicationData);


        if (count($record->profile->p11_publications) > 0) {
            $record->profile->fill(['has_publications' => 1 ])->save();
        }

        if ($record) {
            return response()->success(__('crud.success.store',['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store',['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-publications/{id}",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Update specific p11 publications data",
     *   description="File: app\Http\Controllers\API\P11PublicationController@update, permission:P11 Access",
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
     *       description="P11 publication id"
     *   ),
     *   @SWG\Parameter(
     *      name="p11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "title", "year"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="title", type="string", description="Publication title", example="The title of the publication"),
     *          @SWG\Property(property="year", type="integer", description="Publication year", example=2012),
     *          @SWG\Property(property="publication_file_id", type="integer", description="Attachment id where the publication file is saved [it's not required]", example=10),
     *          @SWG\Property(property="url", type="string", description="Publication URL [it's not required]", example="https://mywebsite.org/publication/title-of-publication")
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $publicationData = $request->only($this->fillable);
        $publicationData['year'] = $publicationData['year'].'-01-01';

        $record = $this->model::findOrFail($id);
        $record->fill($publicationData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update',['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update',['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/profile-publication-destroy/{id}",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Delete p11 publications data",
     *   description="File: app\Http\Controllers\API\P11PublicationController@profile_publication_destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 publication id"
     *    ),
     * )
     *
     */
    public function profile_publication_destroy($id)
    {
        $record = $this->model::find($id);
        if (!$record) {
            return response()->error(__('crud.error.not_found'), 404);
        }
        $profile = $record->profile;

        if (!is_null($record->publication_file_id)) {
            $this->deleteAttachment($record);
        }

        $record->delete();

        if (count($profile->p11_publications) < 1) {
            $profile->fill(['has_publications' => 0 ])->save();
        }


        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }


    /**
     * @SWG\GET(
     *   path="/api/p11-publications/lists",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Get list of all p11 publications data related to the logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11PublicationController@lists, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::where('profile_id', $this->authProfileId)->get());
    }


    /**
     * @SWG\Delete(
     *   path="/api/p11-publications/{id}",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Delete p11 publications data",
     *   description="File: app\Http\Controllers\API\P11PublicationController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 publication id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::find($id);
        if (!$record) {
            return response()->error(__('crud.error.not_found'), 404);
        }

        if (!is_null($record->publication_file_id)) {
            $this->deleteAttachment($record);
        }

        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }
}
