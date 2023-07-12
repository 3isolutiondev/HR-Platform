<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;
use App\Models\Job;
use App\Traits\JobManagerTrait;
use App\Traits\iMMAPerTrait;

class DownloadInterviewScore
{
    use iMMAPerTrait, JobManagerTrait;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $authUser = auth()->user();
        $job = Job::find($request->route('id'));

        if (empty($job)) {
            return response()->error(__('job.error.notFound'), Response::HTTP_NOT_FOUND);
        }

        if (!$this->checkIMMAPerFromSelectedUser($authUser)) {
            return response()->error(__('response.forbidden'), Response::HTTP_FORBIDDEN);
        }

        if (!$this->isJobManager($authUser, $job) &&
            !$authUser->hasAnyPermission(['View Applicant Profile', 'See Completed Profiles', 'Set as Admin', 'See Profile Applicant History'])
        ) {
            return response()->error(__('response.forbidden'), Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
