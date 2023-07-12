<?php

namespace App\Http\Controllers\API\Media;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Models\Media;
use App\Models\User;
use App\Models\Profile;
use App\Models\JobUser;

class FileController extends Controller
{

    /**
     * check if the parameter ($record) is null or not
     *
     * @param any   $record any data
     */
    protected function checkRecordEmpty($record = null)
    {
        if (is_null($record)) {
            response()->error(__('file.error.404'), 404);
            abort(404);
        }
    }

    /**
     * check the file belongs to hidden user or not and
     * check if the current user is able to see hidden user file
     *
     * @param string    $userStatus     user status
     */
    protected function checkUserStatus(string $userStatus)
    {
        if ($userStatus === 'Hidden') {
            response()->error(__('file.error.404'), 404);
            abort(404);
        }
    }

    /**
     * Check file permission by finding relation between attachment model with the $modelPath
     *
     * @param string    $modelPath      location of the model i.e: App\Models\P11\P11Portfolio
     * @param string    $relationColumn foreign key column related to $modelPath
     * @param integer   $attachmentId   model id stored in the $modelPath table
     */
    protected function handleAttachmentFile(string $modelPath, string $relationColumn, int $attachmentId)
    {
        $record = $modelPath::where($relationColumn, $attachmentId)->first();

        $this->checkRecordEmpty($record);
        $this->checkUserStatus($record->profile->user->status);
    }

    /**
     * Check file permission by finding relation between profiles and attachments table
     *
     * @param string    $relationColumn foreign key(cv_id|passport_id|signature_id) from attachments table
     * @param integer   $attachmentId   attachment id stored in the profile table under $relationColumn
     */
    protected function handleProfileFile(string $relationColumn, int $attachmentId)
    {
        $profile = Profile::where($relationColumn, $attachmentId)->first();

        $this->checkRecordEmpty($profile);
        $this->checkUserStatus($profile->user->status);
    }

    /**
     * Check cover letter file permission
     *
     * @param string    $coverLetterUrl cover letter url
     */
    protected function handleCoverLetterFile(string $coverLetterUrl)
    {
        $jobApplicationData = JobUser::where('cover_letter_url', $coverLetterUrl)->first();

        $this->checkRecordEmpty($jobApplicationData);
        $this->checkUserStatus($jobApplicationData->user->status);
    }

    /**
     * Check the file permission by detecting collection_name saved in media table
     *
     * @param Media     $media  Media model data
     * @param object    $record Model data based on model_type in media table
     */
    protected function checkFile(Media $media, $record)
    {
        switch ($media->collection_name) {
            case config('medialibrary.collection_names.photo'):
                // handle user status and permission for profile photo
                $this->checkUserStatus($record->user->status);

                break;
            case config('medialibrary.collection_names.cv'):
                $this->handleProfileFile('cv_id', $record->id);

                break;
            case config('medialibrary.collection_names.education'):
                $this->handleAttachmentFile('App\Models\P11\P11EducationUniversity', 'diploma_file_id', $record->id);

                break;
            case config('medialibrary.collection_names.training'):
                $this->handleAttachmentFile('App\Models\P11\P11EducationSchool', 'certificate_file_id', $record->id);

                break;
            case config('medialibrary.collection_names.portfolio'):
                $this->handleAttachmentFile('App\Models\P11\P11Portfolio', 'attachment_id', $record->id);

                break;
            case config('medialibrary.collection_names.passport'):
                $this->handleProfileFile('passport_id', $record->id);

                break;
            case config('medialibrary.collection_names.signature'):
                $this->handleProfileFile('signature_id', $record->id);

                break;
            case config('medialibrary.collection_names.publication'):
                $this->handleAttachmentFile('App\Models\P11\P11Publication', 'publication_file_id', $record->id);

                break;
            case config('medialibrary.collection_names.im_test.user_answers.file1'):
                $this->handleAttachmentFile('App\Models\Imtest\Follow_im_test', 'file1', $record->id);

                break;
            case config('medialibrary.collection_names.im_test.user_answers.file2'):
                $this->handleAttachmentFile('App\Models\Imtest\Follow_im_test', 'file2', $record->id);

                break;
            case config('medialibrary.collection_names.im_test.user_answers.file3'):
                $this->handleAttachmentFile('App\Models\Imtest\Follow_im_test', 'file3', $record->id);

                break;
            case config('medialibrary.collection_names.recruitment.cover_letter'):
                $this->handleCoverLetterFile($media->getFullUrlFromS3());

                break;
            case config('medialibrary.collection_names.recruitment.interview'):
                $this->handleAttachmentFile('App\Models\JobInterviewFiles', 'attachments_id', $record->id);;

                break;
            case config('medialibrary.collection_names.security_module.tar.request'):
                $this->checkUserStatus($record->user->status);

                break;
            case config('medialibrary.collection_names.security_module.mrf.request'):
                $this->checkUserStatus($record->user->status);

                break;
            case config('medialibrary.collection_names.security_module.mrf.air_ticket'):
                $this->handleAttachmentFile('App\Models\SecurityModule\MRFRequestItinerary', 'air_ticket_id', $record->id);

                break;
            case config('medialibrary.collection_names.security_module.mrf.government_file'):
                $this->handleAttachmentFile('App\Models\SecurityModule\MRFRequestItinerary', 'government_paper_id', $record->id);

                break;
            default:
                break;
        }
    }

    /**
     * @SWG\GET(
     *   path="/api/storage/{fileId}/{fileName}",
     *   tags={"Media"},
     *   summary="Get file based on file id and file name",
     *   description="File: app\Http\Controllers\API\Media\FileController@getFile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="File"),
     *   @SWG\Response(response=404, description="File not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="fileId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Media table id"
     *   ),
     *   @SWG\Parameter(
     *       name="fileName",
     *       in="path",
     *       required=true,
     *       type="string",
     *       description="File name"
     *   )
     * )
     *
     */
    public function getFile(int $fileId, string $fileName)
    {
        $media = Media::where('id', $fileId)->where('file_name', $fileName)->first();
        $this->checkRecordEmpty($media);

        $record = $media->model_type::where('id', $media->model_id)->first();
        $this->checkRecordEmpty($record);

        if ($media->model_type == 'App\Models\Attachment' && $media->collection_name !== 'p11_references') {
            if (!is_null($record->uploader_id)) {
                $this->checkUserStatus($record->user->status);
                return response()->download($this->getPath($media));
            }
        }

        $this->checkFile($media, $record);

        return response()->download($this->getPath($media));
    }

    /**
     * @SWG\GET(
     *   path="/api/storage/{fileId}/conversions/{fileName}",
     *   tags={"Media"},
     *   summary="Get conversion version of an image stored in the system",
     *   description="File: app\Http\Controllers\API\Media\FileController@getConversionFile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="File"),
     *   @SWG\Response(response=404, description="File not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="fileId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Media table id"
     *   ),
     *   @SWG\Parameter(
     *       name="fileName",
     *       in="path",
     *       required=true,
     *       type="string",
     *       description="File name"
     *   )
     * )
     *
     */
    public function getConversionFile(int $fileId, string $fileName)
    {
        $conversion = (strpos($fileName, '-p11-thumb.') !== false) ? 'p11-thumb' : (strpos($fileName, '-thumb.') !== false) ? 'thumb' : '';

        $media = Media::where('id', $fileId)->first();
        $this->checkRecordEmpty($media);

        $conversionPath = $media->getPath($conversion);
        $this->checkRecordEmpty($conversionPath);

        $record = $media->model_type::where('id', $media->model_id)->first();
        $this->checkRecordEmpty($record);

        if ($media->model_type == 'App\Models\Attachment') {
            if (!is_null($record->uploader_id)) {
                $this->checkUserStatus($record->user->status);
                return response()->download($media->getPath());
            }
        }

        $this->checkFile($media, $record);

        return response()->download($media->getPath($conversion));
    }

    public function getPath($media) {
        $relatedModel = $media->model;
        if($media->disk === 'public') return $media->getPath();
        $modelExist = Media::where('model_type', $media->model_type)->where('model_id', $media->model_id)->where('collection_name', 'temporary_files'.$media->collection_name.$media->id)->get()->first();
        if(!$modelExist) {
            $res = $media->copy($relatedModel, 'temporary_files'.$media->collection_name.$media->id, 'public');
            return $res->getPath();
        } else {
            return $modelExist->getPath();
        }
        return '';
    }

        /**
     * @SWG\GET(
     *   path="/api/storage/media/{mediaId}",
     *   tags={"Media"},
     *   summary="Get media url based on id",
     *   description="File: app\Http\Controllers\API\Media\FileController@getMediaUrl",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="File"),
     *   @SWG\Response(response=404, description="File not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="mediaId",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Media table id"
     *   ),
     * )
     *
     */
    public function getMedia(int $mediaId)
    {
        $media = Media::where('id', $mediaId)->first();
        $this->checkRecordEmpty($media);

        $record = $media->model_type::where('id', $media->model_id)->first();
        $this->checkRecordEmpty($record);

        if ($media->model_type == 'App\Models\Attachment') {
            if (!is_null($record->uploader_id)) {
                $this->checkUserStatus($record->user->status);
                return response()->download($this->getPath($media));
            }
        }

        $this->checkFile($media, $record);

        return response()->download($this->getPath($media));
    }
}
