<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\JobInterviewFiles;
use App\Models\JobManager;
use App\Models\Attachment;
use App\Models\JobUser;

class JobInterviewFilesController extends Controller
{

    /**
     * @SWG\GET(
     *   path="/api/job-interview-files/getfile/{jobID}/{userID}",
     *   tags={"Job Interview Result File"},
     *   summary="Get specific interview result file",
     *   description="File: app\Http\Controllers\API\JobStatusController@getfile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="jobID",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Job id"
     *   ),
     *   @SWG\Parameter(
     *       name="userID",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="User id"
     *   )
     * )
     *
     */
    public function getfile($jobID, $userID)
    {

        $files = JobUser::select('id')->with('job_interview_files')
            ->where(['job_id' => $jobID, 'user_id' => $userID])->orderBy('created_at', 'desc')->get();

        return response()->success(__('crud.success.default'), $files);
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-files",
     *   tags={"Job Interview Result File"},
     *   summary="store job interview file",
     *   description="File: app\Http\Controllers\API\JobStatusController@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="interviewResult",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"immap_email", "job_id", "user_id", "user_interview_id", "user_interview_name"},
     *              @SWG\Property(property="immap_email", type="string", description="iMMAP email address", example="jdoe@organization.org"),
     *              @SWG\Property(property="job_id", type="integer", description="Job id", example=53),
     *              @SWG\Property(property="user_id", type="integer", description="User id, the one who upload the interview result (hiring manager)", example=7),
     *              @SWG\Property(property="user_interview_id", type="integer", description="The interviewed person User id, ", example=20),
     *              @SWG\Property(property="user_interview_name", type="string", description="The interviewed person name", example="Michael Holmes")
     *           )
     *         ),
     *       )
     *    )
     * )
     *
     */
    public function store(Request $request)
    {

        $validatedData = $this->validate(
            $request,
            [
                'immap_email' => 'required|email',
                'job_id' => 'required|integer',
                // 'job_user_id' => 'required|integer',
                'user_id' => 'required|integer',
                'user_interview_id' => 'required|integer',
                'user_interview_name' => 'required|string',
                // 'user_interview_email' => 'required|string',

            ]
        );

        $check = JobManager::select('id')->where('email', $validatedData['immap_email'])->get();
        if ($check->count() == 0) {
            return response()->error(__('You don\'t have permission'), 500);
        } else {

            if (!empty($request->file)) {
                $ci = JobInterviewFiles::create([
                    'user_id' => $validatedData['user_id'],
                    'job_id' => $validatedData['job_id'],
                    'user_interview_id' => $validatedData['user_interview_id'],
                    'user_interview_name' => $validatedData['user_interview_name'],
                    'user_interview_email' => $validatedData['immap_email']
                ]);

                $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
                $attachment->addMedia($request->file)->toMediaCollection('job_interview_files', 's3');

                if ($attachment) {
                    $media = $attachment->media->first();
                    if ($media) {

                        $job = JobInterviewFiles::find($ci['id']);
                        $job->attachments_id = $media->model_id;
                        $job->media_id = $media->id;
                        $job->file_name = $media->file_name;
                        $job->download_url = $media->getMediaDownloadUrl();
                        // $job->user_interview_id = $media->getFullUrl();

                        $job->save();
                    }
                }
                $job = JobInterviewFiles::where(['user_id' => $validatedData['user_id'], 'job_id' => $validatedData['job_id']])->get();
                return response()->success(__('crud.success.default'), $job);
            } else {
                return response()->error(__('Please upload file'), 500);
            }
        }
    }

    /**
     * @SWG\POST(
     *   path="/api/job-interview-files/{id}",
     *   tags={"Job Interview Result File"},
     *   summary="update job interview resutl file",
     *   description="File: app\Http\Controllers\API\JobStatusController@update",
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
     *       description="Job interview file id, (job_interview_files table)"
     *   ),
     *   @SWG\Parameter(
     *       name="interviewResult",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *          required={"immap_email", "job_id", "user_id", "user_interview_id", "user_interview_name"},
     *          @SWG\Property(
     *              property="immap_email", type="string", description="Hiring manager iMMAP email address", example="jdoe@organization.org"
     *          )
     *       )
     *    )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, ['immap_email' => 'required|email']);

        $check = JobManager::select('id')->where('email', $validatedData['immap_email'])->get();
        if ($check->count() == 0) {
            return response()->error(__('You don\'t have permission'), 500);
        } else {

            $getattachmentid = JobInterviewFiles::select('attachments_id')->where('id', $id)->first();

            if (!empty($getattachmentid)) {
                $record = Attachment::findOrFail($getattachmentid['attachments_id']);
                $deleted = $record->delete();
            }

            if (!empty($request->file)) {
                $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
                $attachment->addMedia($request->file)->toMediaCollection('job_interview_files', 's3');

                if ($attachment) {
                    $media = $attachment->media->first();
                    if ($media) {

                        $job = JobInterviewFiles::find($id);
                        $job->attachments_id = $media->model_id;
                        $job->media_id = $media->id;
                        $job->file_name = $media->file_name;
                        $job->download_url = $media->getMediaDownloadUrl();

                        $job->save();
                    }
                }
                $job = JobInterviewFiles::find($id)->get();
                return response()->success(__('crud.success.default'), $job);
            } else {
                return response()->error(__('Please upload file'), 500);
            }
        }
    }
}
