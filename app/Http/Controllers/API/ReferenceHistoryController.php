<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ReferenceHistory;
use App\Models\Profile;
use App\Models\Roster\RosterProcess;
use Illuminate\Support\Facades\DB;
use PDF;

class ReferenceHistoryController extends Controller
{
    /**
     * @SWG\GET(
     *   path="/api/reference-check-histories/{profile_id}",
     *   tags={"Reference Check History"},
     *   summary="Get reference check history for a profile",
     *   description="File: app\Http\Controllers\API\ReferenceHistoryController@get, permission:Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function get($profile_id)
    {
        $referenceHistories = ReferenceHistory::leftJoin('p11_references', 'p11_references.id', '=', 'reference_history.reference_id')
        ->select('reference_history.*', 'p11_references.profile_id')
        ->with(['reference' => function ($query) {
            return $query->select('id', 'full_name', 'email', 'phone');
        }, 'reference.profile', 'reference.profile.user', 'job', 'roster_process', 'attachment'])
        ->where('p11_references.profile_id', $profile_id)
        ->where('reference_history.attachment_id', '!=', null)
        ->get();

        $referenceHistories->each(function ($history) {
            $attachment = $history->attachment;
            if ($attachment) {
                $attachment = $attachment->getMedia('p11_references')->first();
                if (!empty($attachment)) {
                    $history->reference_file = collect([
                        'url' => $attachment->getFullUrlFromS3(),
                        'mime_type' => $attachment->mime_type,
                        'file_name' => $attachment->file_name,
                    ]);
                    $history->setHidden(['media', 'attachment']);
                }
            }
        });
        
        return response()->success(__('crud.success.default'), $referenceHistories);
    }
}