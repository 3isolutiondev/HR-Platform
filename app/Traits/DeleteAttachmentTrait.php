<?php

namespace App\Traits;
use App\Models\Attachment;
use DB;

trait DeleteAttachmentTrait {
    /**
     * ============== Delete Cover Letter uploaded by Applicant ===============
     * # this function will be used when delete a job or delete a user
     *
     * # $applicantData:
     *      => is an array containing applicant data, (array of job_user table)
     * ========================================================================
     */
    public function deleteCoverLetter(array $applicantData = []) {
        if (!empty($applicantData)) {
            foreach($applicantData as $data) {
                if (!is_null($data['cover_letter_url'])) {
                    $mediaId = explode('/', str_replace(env('APP_STORAGE_URL'), '', $data['cover_letter_url']))[0];
                    if (!empty($mediaId)) {
                        $media = DB::table('media')->where('id', $mediaId)->first();
                        if (count((array) $media)) {
                            $attachment = Attachment::find($media->model_id);
                            if (!empty($attachment)) {
                                $attachment->delete();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * =================== Delete Interview Files Result =====================
     * # this function will be used when delete a job or delete a user
     *
     * # $jobInterViewFiles:
     *      => is an array containing data from jobs_interview_files,
     *         (array of jobs_interview_files table)
     * ========================================================================
     */
    public function deleteInterviewFiles(array $jobInterViewFiles = []) {
        if (!empty($jobInterViewFiles)) {
            foreach($jobInterViewFiles as $data) {
                if (!is_null($data['attachments_id'])) {
                    $attachment = Attachment::find($data['attachments_id']);
                    if (!empty($attachment)) {
                        $attachment->delete();
                    }
                }
            }
        }
    }

    /**
     * ===================== Delete Attachment Relation =======================
     * # this function is default function to delete attachment relation,
     * # the foreign key of the attachment table needs to be set to cascade or null
     *
     * # $record:
     *      => containing record data
     *      => example: $record = P11EducationSchool::findOrFail($id);
     * # $nameOfRelationFunction:
     *      => the name of the function that containing relation between
     *         the model and the attachment model
     *      => example: MRFRequest model and attachment relation through
     *         airTicket function
     *         (see: app/Models/SecurityModule/MRFRequest.php)
     * ========================================================================
     */
    public function deleteAttachment($record, $nameOfRelationFunction = 'attachment') {
        $attachment = $record->{$nameOfRelationFunction};
        if (!empty($attachment)) {
            $attachment->delete();
        }
    }

}
