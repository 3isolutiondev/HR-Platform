<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\DeleteAttachmentTrait;
use App\Models\Attachment;

class P11EducationSchoolController extends Controller
{
    use CRUDTrait, DeleteAttachmentTrait;

    const MODEL = 'App\Models\P11\P11EducationSchool';
    const SINGULAR = 'formal training';

    const FILLABLE = [
        'name', 'place', 'country_id',
        // 'type',
        'attended_from', 'attended_to', 'certificate',
        'certificate_file_id', 'profile_id'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'place' => 'required|string',
        'country_id' => 'required|integer',
        'attended_from' => 'required|date',
        'attended_to' => 'required|date',
        // 'type' => 'required|string|max:255',
        'certificate' => 'required|string|max:255',
        'certificate_file_id' => 'sometimes|nullable|integer'
    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-education-schools",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Get list of p11 education schools data without country label, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/p11-education-schools",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="store p11-education-schools, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11EducationSchool",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "place", "country_id", "attended_from", "attended_to", "certificate", "certificate_file_id"},
     *          @SWG\Property(property="name", type="string"),
     *          @SWG\Property(property="place", type="string"),
     *          @SWG\Property(property="country_id", type="integer"),
     *          @SWG\Property(property="attended_from", type="string"),
     *          @SWG\Property(property="attended_to", type="string"),
     *          @SWG\Property(property="certificate", type="string"),
     *          @SWG\Property(property="certificate_file_id", type="integer")
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $educationSchoolData = $request->only($this->fillable);
        $educationSchoolData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($educationSchoolData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => $this->singular]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular], 500));
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-education-schools/{id}",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Update specific p11 education schools data, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@update, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Education school / Formal training id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11EducationSchool",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "name", "place", "country_id", "attended_from", "attended_to", "certificate"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="Formal training name", example="GDPR Training"),
     *          @SWG\Property(property="place", type="string", description="Place where formal training take a place", example="Marseille"),
     *          @SWG\Property(property="country_id", type="integer", description="Country id", example=1),
     *          @SWG\Property(property="attended_from", type="string", format="date", description="attended date (from)", example="2020-10-21"),
     *          @SWG\Property(property="attended_to", type="string", format="date", description="attended date (to)", example="2020-11-21"),
     *          @SWG\Property(property="certificate", type="string", description="Certificate / diploma obtained", example="GDPR Master"),
     *          @SWG\Property(property="certificate_file_id", type="integer", description="Certificate file / image (attachment id)", example=190)
     *      )
     *   )
     * )
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::findOrFail($id);

        if (!empty($validatedData['certificate_file_id'])) {
            if ($validatedData['certificate_file_id'] !== $record['certificate_file_id']) {
                $this->deleteAttachment($record);
            }
        }

        $updated = $record->fill($request->only($this->fillable))->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => $this->singular]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }


     /**
     * @SWG\GET(
     *   path="/api/p11-education-schools/{id}",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Get specific p11 education school data, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Education school / Formal training id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with(['country', 'attachment'])->findOrFail($id);
        $media = $record->attachment;
        if (!empty($media)) {
            $media = $media->media->first();

            if (!empty($media)) {
                $record->certificate_file = new \stdclass;
                $record->certificate_file->file_id = $record->certificate_file_id;
                $record->certificate_file->filename = $media->file_name;
                $record->certificate_file->download_url = $media->getFullUrlFromS3();
                $record->certificate_file->file_url = $media->getFullUrlFromS3();
                // $record->certificate_file->file_url = $media->getFullUrl('p11_thumb');
                $record->certificate_file->mime = $media->mime_type;
            } else {
                $record->certificate_file = null;
            }
            unset($record->attachment);
        }

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-education-schools/lists",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Get list of all p11 education schools data related to the profile, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::with('country')->where('profile_id', $this->authProfileId)->get());
    }

     /**
     * @SWG\Delete(
     *   path="/api/p11-education-schools/{id}",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Delete specific p11 education schools data, in profile and profile creation page look at Formal Trainings & Workshops section",
     *   description="File: app\Http\Controllers\API\P11EducationSchoolController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Education school / Format training id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $this->deleteAttachment($record);

        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.delete', ['singular' => $this->singular]));
    }
}
