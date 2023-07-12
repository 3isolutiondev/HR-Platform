<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterviewFiles extends Model
{
    protected $fillable = [
        'job_id', 'user_id', 'media_id', 'attachments_id', 'file_name', 'download_url', 'user_interview_id', 'user_interview_name', 'user_interview_email'
    ];

    protected $table = "jobs_interview_files";

    public function job()
    {
        // return $this->belongsTo('App\Models\JobUser', 'job_user_id');
        return $this->belongsTo('App\Models\Job', 'job_id');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'attachments_id');
    }
}
