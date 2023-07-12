<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class JobUser extends Model implements HasMedia
{
    use HasMediaTrait;
    protected $table = "job_user";

    protected $fillable = [
        "job_id", "user_id", "job_status_id", 'cover_letter_url',
        'interview_date', 'interview_invitation_done', 'timezone', 'skype_id', 'panel_interview',
        "start_date_availability", "departing_from", 'final_interview_score', 'reference_check_sent'
    ];

    public function getCoverLetterUrlAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getStartDateAvailabilityAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getDepartingFromAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function job()
    {
        return $this->belongsTo('App\Models\Job', 'job_id');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function job_status()
    {
        return $this->belongsTo('App\Models\JobStatus', 'job_status_id');
    }

    public function first_job_status()
    {
        return $this->belongsTo('App\Models\JobStatus', 'job_status_id')->latest();
    }

    public function job_interview_files() {
        return $this->hasMany('App\Models\JobInterviewFiles', 'job_user_id');
    }

    public function job_interview_scores() {
        return $this->hasMany('App\Models\InterviewScores', 'applicant_id');
    }

    public function job_interview_global_impression() {
        return $this->hasMany('App\Models\InterviewScoreComment', 'applicant_id');
    }

    public function job_user_tests() {
        return $this->hasMany('App\Models\JobUserTest', 'job_user_id');
    }
}
