<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\DeleteAttachmentTrait;
use App\Models\Attachment;

class P11EducationUniversityController extends Controller
{
    use CRUDTrait, DeleteAttachmentTrait;

    const MODEL = 'App\Models\P11\P11EducationUniversity';
    const SINGULAR = 'education university';

    const FILLABLE = [
        'name', 'place', 'country_id', 'attended_from',
        'attended_to', 'degree',
        // 'study',
        'profile_id', 'degree_level_id', 'diploma_file_id',
        "untilNow"
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'place' => 'required|string',
        'country_id' => 'required|integer',
        'untilNow' => 'required|boolean',
        'attended_from' => 'required|date',
        'attended_to' => 'required_if:untilNow,0|date',
        'degree' => 'required|string|max:255',
        // 'study' => 'required|string|max:255',
        'degree_level_id' => 'required|integer',
        'diploma_file_id' => 'sometimes|nullable|integer',

    ];

    protected $authUser, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-education-universities",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="list of p11 education universities, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\Post(
     *   path="/api/p11-education-universities",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="store p11 education universities, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="p11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "place", "country_id", "untilNow", "attended_from", "attended_to",
     *              "degree", "degree_level_id"},
     *          @SWG\Property(property="name", type="string"),
     *          @SWG\Property(property="place", type="string"),
     *          @SWG\Property(property="country_id", type="integer"),
     *          @SWG\Property(property="untilNow", type="boolean"),
     *          @SWG\Property(property="attended_from", type="string"),
     *          @SWG\Property(property="attended_to", type="string"),
     *          @SWG\Property(property="degree", type="string"),
     *          @SWG\Property(property="degree_level_id", type="integer"),
     *          @SWG\Property(property="diploma_file_id", type="integer")
     *      )
     *   )
     *
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $educationUniversityData = $request->only($this->fillable);
        $educationUniversityData['profile_id'] = $this->authProfileId;

        if ($educationUniversityData['untilNow'] == 1) {
            $educationUniversityData['attended_to'] = date('Y-m-d');
            $this->model::where('untilNow', 1)->where('profile_id', $this->authProfileId)->update(['untilNow' => 0]);
        }

        $record = $this->model::create($educationUniversityData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => $this->singular]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-education-universities/{id}",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="store p11 education universities, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@update, permission:P11 Access",
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
     *       description="P11 education university id"
     *   ),
     *   @SWG\Parameter(
     *      name="p11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method","name", "place", "country_id", "untilNow", "attended_from", "attended_to",
     *              "degree", "degree_level_id"},
     *          @SWG\Property(
     *             property="_method", type="string", enum={"PUT"}
     *          ),
     *          @SWG\Property(property="name", type="string"),
     *          @SWG\Property(property="place", type="string"),
     *          @SWG\Property(property="country_id", type="integer"),
     *          @SWG\Property(property="untilNow", type="boolean"),
     *          @SWG\Property(property="attended_from", type="string"),
     *          @SWG\Property(property="attended_to", type="string"),
     *          @SWG\Property(property="degree", type="string"),
     *          @SWG\Property(property="degree_level_id", type="integer"),
     *          @SWG\Property(property="diploma_file_id", type="integer")
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);

        if (!empty($validatedData['diploma_file_id'])) {
            if ($validatedData['diploma_file_id'] !== $record['diploma_file_id']) {
                $this->deleteAttachment($record);
            }
        }
        $educationUniversityData = $request->only($this->fillable);
        if ($educationUniversityData['untilNow'] == 1) {
            $educationUniversityData['attended_to'] = date('Y-m-d');
            $this->model::where('untilNow', 1)->where('profile_id', $this->authProfileId)->update(['untilNow' => 0]);
        }

        $updated = $record->fill($educationUniversityData)->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }


     /**
     * @SWG\GET(
     *   path="/api/p11-education-universities/{id}",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="list of p11 education universities, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 education university id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with(['country', 'attachment', 'degree_level'])->findOrFail($id);

        $media = $record->attachment;
        if (!empty($media)) {
            $media = $media->media->first();

            if (!empty($media)) {
                $record->diploma_file = new \stdclass;
                $record->diploma_file->file_id = $record->diploma_file_id;
                $record->diploma_file->filename = $media->file_name;
                $record->diploma_file->download_url = $media->getFullUrlFromS3();
                // $record->diploma_file->file_url = $media->getFullUrl('p11_thumb');
                $record->diploma_file->file_url = $media->getFullUrlFromS3();
                $record->diploma_file->mime = $media->mime_type;
            } else {
                $record->diploma_file = null;
            }
            unset($record->attachment);
        }
        return response()->success(__('crud.success.default'), $record);
    }


    /**
     * @SWG\GET(
     *   path="/api/p11-education-universities/lists",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="list of p11 education universities related to the profile, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::with('country')->where('profile_id', $this->authProfileId)->orderBy('attended_to', 'DESC')->orderBy('untilNow', 'DESC')->get(), 200);
    }

     /**
     * @SWG\Delete(
     *   path="/api/p11-education-universities/{id}",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="Delete p11 education universities, in profile and profile creation page look at Education (University or Equivalent) section",
     *   description="File: app\Http\Controllers\API\P11EducationUniversityController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 education university id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $this->deleteAttachment($record);

        $deleted = $record->delete();

        if ($deleted) {
            return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
        }

        return response()->error(__('crud.error.delete', ['singular' => ucfirst($this->singular)]), 500);
    }
}
