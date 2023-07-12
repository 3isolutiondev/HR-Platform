<?php

namespace App\Http\Controllers\API;

use App\Models\Attachment;
use App\Models\P11\P11EducationUniversity;
use App\Models\P11\P11EducationSchool;
use App\Models\P11\P11Portfolio;
use App\Models\P11\P11Reference;
use App\Models\Profile;
use App\Models\ReferenceHistory;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Mail\ReferenceCheckMailHr;
use App\Mail\JobSendConfirmationMail;
use App\Mail\ReferenceCheckReceptionMail;
use Illuminate\Support\Facades\Mail;

use App\Models\Roster\ProfileRosterProcess;

class AttachmentController extends Controller
{
    const STORAGE_DISK = 's3';

    const UNIVERSITY = [
        'model' => 'App\Models\P11\P11EducationUniversity',
        'model_id_from_request' => 'education_university_id',
        'collection_name' => 'diploma_files',
        'foreign_key' => 'diploma_file_id',
        'update_rules' => [
            'file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF|max:2048',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            'education_university_id' => 'sometimes|nullable|integer',
        ],
        'conversion' => 'thumb',
        'error_response' => 'attachment.error.diploma_file',
        'success_response' => 'attachment.success.diploma_file',
        'delete_error_response' => 'attachment.error.delete_diploma_file',
        'delete_success_response' => 'attachment.success.delete_diploma_file',
    ];

    const SCHOOL = [
        'model' => 'App\Models\P11\P11EducationSchool',
        'model_id_from_request' => 'education_school_id',
        'collection_name' => 'certificate_files',
        'foreign_key' => 'certificate_file_id',
        'update_rules' => [
            'file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF|max:2048',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            'education_school_id' => 'sometimes|nullable|integer',
        ],
        'conversion' => 'thumb',
        'error_response' => 'attachment.error.certificate',
        'success_response' => 'attachment.success.certificate',
        'delete_error_response' => 'attachment.error.delete_certificate',
        'delete_success_response' => 'attachment.success.delete_certificate',
    ];

    const PORTFOLIO = [
        'model' => 'App\Models\P11\P11Portfolio',
        'model_id_from_request' => 'portfolio_id',
        'collection_name' => 'portfolios',
        'foreign_key' => 'attachment_id',
        'update_rules' => [
            'file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF|max:2048',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            'portfolio_id' => 'sometimes|nullable|integer',
        ],
        'conversion' => 'thumb',
        'error_response' => 'attachment.error.portfolio',
        'success_response' => 'attachment.success.portfolio',
        'delete_error_response' => 'attachment.error.delete_portfolio',
        'delete_success_response' => 'attachment.success.delete_portfolio',
    ];

    const PUBLICATION = [
        'model' => 'App\Models\P11\P11Publication',
        'collection_name' => 'publication_files',
        'foreign_key' => 'publication_file_id',
        'update_rules' => [
            'file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF|max:2048',
            // 'publication_id' => 'somtimes|nullable|integer',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            'publication_id' => 'sometimes|nullable|integer',
        ],
        'conversion' => 'thumb',
        'error_response' => 'attachment.error.publications',
        'success_response' => 'attachment.success.publications',
        'delete_error_response' => 'attachment.error.delete_publication',
        'delete_success_response' => 'attachment.success.delete_publication',
    ];

    const COVERLETTER = [
        // 'model' => 'App\Models\P11\P11EducationUniversity',
        // 'model_id_from_request' => 'education_university_id',
        'collection_name' => 'cover_letter',
        // 'foreign_key' => 'diploma_file_id',
        'update_rules' => [
            'file' => 'required|mimes:pdf,PDF|max:2048',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            // 'education_university_id' => 'sometimes|nullable|integer',
        ],
        'conversion' => '',
        'error_response' => 'attachment.error.cover_letter',
        'success_response' => 'attachment.success.cover_letter',
        'delete_error_response' => 'attachment.error.delete_cover_letter',
        'delete_success_response' => 'attachment.success.delete_cover_letter',
    ];

    const MRFGOVERNMENTFILE = [
        'collection_name' => 'security_module_mrf_government_files',
        'update_rules' => [
            'file' => 'required|mimes:pdf,PDF|max:2098',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
        ],
        'conversion' => '',
        'error_response' => 'attachment.error.government_file',
        'success_response' => 'attachment.success.government_file',
        'delete_error_response' => 'attachment.error.delete_government_file',
        'delete_success_response' => 'attachment.success.delete_government_file',
    ];

    const TARGOVERNMENTFILE = [
        'collection_name' => 'security_module_tar_government_files',
        'update_rules' => [
            'file' => 'required|mimes:pdf,PDF|max:2098',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
        ],
        'conversion' => '',
        'error_response' => 'attachment.error.government_file',
        'success_response' => 'attachment.success.government_file',
        'delete_error_response' => 'attachment.error.delete_government_file',
        'delete_success_response' => 'attachment.success.delete_government_file',
    ];

    const MRFAIRTICKETFILE = [
        'collection_name' => 'security_module_mrf_air_ticket_files',
        'update_rules' => [
            'file' => 'required|mimes:pdf,PDF|max:2098',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
        ],
        'conversion' => '',
        'error_response' => 'attachment.error.mrf_air_ticket_file',
        'success_response' => 'attachment.success.mrf_air_ticket_file',
        'delete_error_response' => 'attachment.error.delete_mrf_air_ticket_file',
        'delete_success_response' => 'attachment.success.delete_mrf_air_ticket_file',
    ];

    const REFERENCE = [
        'model' => 'App\Models\P11\P11Reference',
        'model_id_from_request' => 'reference_id',
        'collection_name' => 'p11_references',
        'foreign_key' => 'attachment_id',
        'update_rules' => [
            'file' => 'required|max:2048',
            'reference_history_id' => 'required|integer',
            'profile_roster_id' => 'required|integer',
        ],
        'job_update_rules' => [
            'file' => 'required|max:2048',
            'reference_history_id' => 'required|integer',
            'profile_id' => 'required|integer',
        ],
        'delete_rules' => [
            'id' => 'required|integer',
            'p11_reference_id' => 'sometimes|nullable|integer',
        ],
        'error_response' => 'attachment.error.reference',
        'success_response' => 'attachment.success.reference',
        'delete_error_response' => 'attachment.error.delete_reference',
        'delete_success_response' => 'attachment.success.delete_reference',
    ];

    // Related to other model
    protected function update_model_file(Request $request, Array $modelConfig)
    {
        $validatedData = $this->validate($request, $modelConfig['update_rules']);

        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($request->file('file'))->toMediaCollection($modelConfig['collection_name'], self::STORAGE_DISK);
        $media = $attachment->media->first();

        if ($media) {
            $model_file = new \StdClass();
            $model_file->id = $attachment->id;
            $model_file->filename = $media->file_name;
            $model_file->file_url = (!empty($modelConfig['conversion']) && $media->mime_type != 'application/pdf') ? $media->getFullUrlFromS3($modelConfig['conversion']) : $media->getFullUrlFromS3();
            $model_file->download_url = $media->getFullUrlFromS3();
            $model_file->mime = $media->mime_type;

            return response()->success('', $model_file);
        }

        P11Reference::where('id', $request->reference_id)->update(['attachment_id' => $attachment->id]);

        return response()->error(__($modelConfig['error_response']), 500);
    }


    /**
     * @SWG\Post(
     *   path="/api/p11-update-university-certificate",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="Store / Update education (university) certificate",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_university_certificate, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="University certificate File in jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function update_university_certificate(Request $request)
    {
        return $this->update_model_file($request, self::UNIVERSITY);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-school-certificate",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Store / Update formal training certificate",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_school_certificate, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Formal training certificate File in jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function update_school_certificate(Request $request)
    {
        return $this->update_model_file($request, self::SCHOOL);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-portfolio-file",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Store / Update portfolio file",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_portfolio_file, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Portfolio File in jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function update_portfolio_file(Request $request)
    {
        return $this->update_model_file($request, self::PORTFOLIO);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-publication-file",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Store / Update publication file",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_publication_file, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Publication File in jpg,jpeg,png,webp,JPG,PNG,JPEG,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function update_publication_file(Request $request)
    {
        return $this->update_model_file($request, self::PUBLICATION);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-reference-file",
     *   tags={"P11 Reference / Profile Reference"},
     *   summary="Store / Update Reference file",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_reference_file",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Reference File in doc,docx,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function update_reference_file(Request $request)
    {
        $modelConfig = self::REFERENCE;
        $validatedData = $this->validate($request, $modelConfig['update_rules']);

        $profileRoster = ProfileRosterProcess::with(['profile', 'profile.user'])->where('id', $validatedData['profile_roster_id'])->first();

        if (!$profileRoster) {
            return response()->error(__($modelConfig['error_response']), 404);
        }

        $profile = $profileRoster->profile;

        $referenceHistory = ReferenceHistory::with(['roster_process'])->where('id', $validatedData['reference_history_id'])->first();
        if(!$referenceHistory) {
            return response()->error(__($modelConfig['error_response']), 404);
        }
        $roster_process = $referenceHistory->roster_process;

        $reference = P11Reference::where('id', $referenceHistory->reference_id)->first();

        $attachment = Attachment::create(["external" => 1]);
        $attachment->addMedia($request->file('file'))->toMediaCollection($modelConfig['collection_name'], self::STORAGE_DISK);
        $media = $attachment->media->first();

        if ($media) {
            $model_file = new \StdClass();
            $model_file->id = $attachment->id;
            $model_file->filename = $media->file_name;
            $model_file->file_url = (!empty($modelConfig['conversion']) && $media->mime_type != 'application/pdf') ? $media->getFullUrl($modelConfig['conversion']) : $media->getFullUrl();
            $model_file->download_url = $media->getFullUrl();
            $model_file->mime = $media->mime_type;

            $referenceHistory->attachment_id = $attachment->id;
            $referenceHistory->save();

            $user = User::find($referenceHistory->reference_sender_id);
            if(isset($user) && isset($user->immap_email)) {
                Mail::to($user->immap_email)->send(new ReferenceCheckMailHr($user->full_name, $reference->full_name, $profile->user->full_name, $roster_process->name));
            }

            Mail::to($reference->email)->send(new ReferenceCheckReceptionMail($reference->full_name, $profile->user->full_name));
            ReferenceHistory::where('id', $validatedData['reference_history_id'])->update(['code' => null]);
            $referenceHistory->update(['code' => null]);
            return response()->success('', $model_file);
        }

        return response()->error(__($modelConfig['error_response']), 500);
    }

        /**
     * @SWG\Post(
     *   path="/api/p11-update-job-reference-file",
     *   tags={"P11 Reference / Profile Reference"},
     *   summary="Store / Update Reference file",
     *   description="File: app\Http\Controllers\API\AttachmentController@update_reference_file",
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Reference File in doc,docx,pdf,PDF format with max size 2048kb",
     *   )
     * )
     *
     */
    public function job_update_reference_file(Request $request)
    {
        $modelConfig = self::REFERENCE;
        $validatedData = $this->validate($request, $modelConfig['job_update_rules']);

        $profile = Profile::with(['user'])->where('id', $validatedData['profile_id'])->first();

        if (!$profile) {
            return response()->error(__($modelConfig['error_response']), 404);
        }

        $referenceHistory = ReferenceHistory::with(['job'])->where('id', $validatedData['reference_history_id'])->first();
        if(!$referenceHistory) {
            return response()->error(__($modelConfig['error_response']), 404);
        }

        $job = $referenceHistory->job;

        $reference = P11Reference::where('id', $referenceHistory->reference_id)->first();

        $attachment = Attachment::create(["external" => 1]);
        $attachment->addMedia($request->file('file'))->toMediaCollection($modelConfig['collection_name'], self::STORAGE_DISK);
        $media = $attachment->media->first();

        if ($media) {
            $model_file = new \StdClass();
            $model_file->id = $attachment->id;
            $model_file->filename = $media->file_name;
            $model_file->file_url = (!empty($modelConfig['conversion']) && $media->mime_type != 'application/pdf') ? $media->getFullUrl($modelConfig['conversion']) : $media->getFullUrl();
            $model_file->download_url = $media->getFullUrl();
            $model_file->mime = $media->mime_type;

            $referenceHistory->attachment_id = $attachment->id;
            $referenceHistory->save();

            $user = User::find($referenceHistory->reference_sender_id);
            if(isset($user) && isset($user->immap_email)) {
                Mail::to($user->immap_email)->send(new ReferenceCheckMailHr($user->full_name, $reference->full_name, $profile->user->full_name, $job->title));
            }

            Mail::to($reference->email)->send(new ReferenceCheckReceptionMail($reference->full_name, $profile->user->full_name));
            ReferenceHistory::where('id', $validatedData['reference_history_id'])->update(['code' => null]);
            $referenceHistory->update(['code' => null]);
            return response()->success('', $model_file);
        }

        return response()->error(__($modelConfig['error_response']), 500);
    }

    // DELETE RELATED TO OTHER MODEL
    protected function delete_model_file(Request $request, Array $modelConfig)
    {
        $validatedData = $this->validate($request, $modelConfig['delete_rules']);

        $oldAttachment = Attachment::find($request->id);
        if (!empty($oldAttachment)) {
            $oldMedia = $oldAttachment->getMedia($modelConfig['collection_name']);
            $oldMedia = $oldMedia->first();
            if (!empty($oldMedia)) {
                $oldMedia->delete();
            }

            if (!empty($validatedData[$modelConfig['model_id_from_request']])) {
                $educationUniversity = $modelConfig['model']::find($validatedData[$modelConfig['model_id_from_request']]);
                if(!empty($educationUniversity)) {
                    $educationUniversity->fill([$modelConfig['foreign_key'] => NULL])->save();
                }
            }

            $oldAttachmentDeleted = $oldAttachment->delete();

            return response()->success(__($modelConfig['delete_success_response']));
        }

        return response()->error(__($modelConfig['delete_error_response']), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-delete-university-certificate",
     *   tags={"P11 Education Universities / Education (University or Equivalent)"},
     *   summary="Delete education (university) certificate",
     *   description="File: app\Http\Controllers\API\AttachmentController@delete_university_certificate, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15),
     *          @SWG\Property(property="education_university_id", type="integer", description="Education training id (it can be null / empty, required when education university already saved)", example=30)
     *      )
     *   )
     * )
     *
     */
    public function delete_university_certificate(Request $request)
    {
        return $this->delete_model_file($request, self::UNIVERSITY);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-delete-school-certificate",
     *   tags={"P11 Education School / Formal Training & Workshops"},
     *   summary="Delete formal training certificate",
     *   description="File: app\Http\Controllers\API\AttachmentController@delete_university_certificate, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15),
     *          @SWG\Property(property="education_school_id", type="integer", description="Formal training id (it can be null / empty, required when formal training already saved)", example=30)
     *      )
     *   )
     * )
     *
     */
    public function delete_school_certificate(Request $request)
    {
        return $this->delete_model_file($request, self::SCHOOL);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-delete-portfolio-file",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Delete portfolio file",
     *   description="File: app\Http\Controllers\API\AttachmentController@delete_portfolio_file, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15),
     *          @SWG\Property(property="portfolio_id", type="integer", description="Portfolio id (it can be null / empty, required when portfolio already saved)", example=30)
     *      )
     *   )
     * )
     *
     */
    public function delete_portfolio_file(Request $request)
    {
        return $this->delete_model_file($request, self::PORTFOLIO);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-delete-publication-file",
     *   tags={"P11 Publications / Profile Publication data"},
     *   summary="Delete publication file",
     *   description="File: app\Http\Controllers\API\AttachmentController@delete_publication_file, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15),
     *          @SWG\Property(property="publication_id", type="integer", description="Publication id (it can be null / empty, required when publication already saved)", example=30)
     *      )
     *   )
     * )
     *
     */
    public function delete_publication_file(Request $request)
    {
        return $this->delete_model_file($request, self::PUBLICATION);
    }

    ## cover letter
    /**
     * @SWG\Post(
     *   path="/api/upload-cover-letter",
     *   tags={"Job"},
     *   summary="Store / Update cover letter for job posting",
     *   description="File: app\Http\Controllers\API\AttachmentController@uploadCoverLetter, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Cover letter file in pdf,PDF format with max size 2048kb",
     *   )
     * )
     */
    public function uploadCoverLetter(Request $request)
    {
        return $this->update_model_file($request, self::COVERLETTER);
    }

    /**
     * @SWG\Post(
     *   path="/api/delete-cover-letter",
     *   tags={"Job"},
     *   summary="Delete cover letter for job posting",
     *   description="File: app\Http\Controllers\API\AttachmentController@deleteCoverLetter, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="Job",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15)
     *      )
     *   )
     * )
     */
    public function deleteCoverLetter(Request $request)
    {
        $modelConfig = self::COVERLETTER;

        $validatedData = $this->validate($request, $modelConfig['delete_rules']);

        $oldAttachment = Attachment::find($request->id);
        if (!empty($oldAttachment)) {
            $oldMedia = $oldAttachment->getMedia($modelConfig['collection_name']);
            $oldMedia = $oldMedia->first();
            if (!empty($oldMedia)) {
                $oldMedia->delete();
            }

            $oldAttachmentDeleted = $oldAttachment->delete();

            return response()->success(__($modelConfig['delete_success_response']));
        }

        return response()->error(__($modelConfig['delete_error_response']), 500);
    }

    // MRF FORM GOVERNMENT ACCESS PAPER
    public function upload_mrf_government_file(Request $request)
    {
        return $this->update_model_file($request, self::MRFGOVERNMENTFILE);
    }

    public function delete_mrf_government_file(Request $request)
    {
        $modelConfig = self::MRFGOVERNMENTFILE;

        $validatedData = $this->validate($request, $modelConfig['delete_rules']);

        $oldAttachment = Attachment::find($request->id);

        return response()->success(__($modelConfig['delete_success_response']));
    }


     // TAR FORM GOVERNMENT ACCESS PAPER
     public function upload_tar_government_file(Request $request)
     {
         return $this->update_model_file($request, self::TARGOVERNMENTFILE);
     }
 
     /**
     * @SWG\Post(
     *   path="/api/security-module/delete-tar-government-file",
     *   tags={"Security Module"},
     *   summary="Delete government file attachment",
     *   description="File: app\Http\Controllers\API\AttachmentController@delete_tar_government_file, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="Security Module",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="Attachment id", example=15)
     *      )
     *   )
     * )
     */
     public function delete_tar_government_file(Request $request)
     {
         $modelConfig = self::TARGOVERNMENTFILE;
 
         $validatedData = $this->validate($request, $modelConfig['delete_rules']);
 
         $oldAttachment = Attachment::find($request->id);
 
         return response()->success(__($modelConfig['delete_success_response']));
     }
 
    // MRF FORM AIR TICKET
    public function upload_mrf_air_ticket_file(Request $request)
    {
        return $this->update_model_file($request, self::MRFAIRTICKETFILE);
    }

    public function delete_mrf_air_ticket_file(Request $request)
    {
        $modelConfig = self::MRFAIRTICKETFILE;

        $validatedData = $this->validate($request, $modelConfig['delete_rules']);

        $oldAttachment = Attachment::find($request->id);

        return response()->success(__($modelConfig['delete_success_response']));
    }
}
