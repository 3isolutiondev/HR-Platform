<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Profile;
use App\Models\Job;

/**
 * This is the file containing function to be used in any controller to check a user(s) is Job Manager or not
 */
trait JobManagerTrait
{
    /**
     * ================ isJobManager Function ===================
     * This is a function to check if selected user is a Job Manager for the Selected Job
     * $user is a selected user coming from the controller or middleware
     * $job is a selected job coming from the controller or middleware
     *      > please see the controller or middleware that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function isJobManager(User $user, Job $job) {
       $jobManagers = $job->job_manager;

       if (empty($jobManagers)) {
           return false;
       }

       foreach($jobManagers as $jobManager) {
           if ($jobManager->user_id === $user->id) {
               return true;
           }
       }

       return false;
    }

}
