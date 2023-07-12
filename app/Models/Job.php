<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Job extends Model implements HasMedia
{

    use HasMediaTrait;
    protected $fillable = [
        'title',
        'status', 'opening_date', 'closing_date', 'tor_id', 'surge_alert_sent',
        'country_id', 'immap_office_id', 'contract_start', 'contract_end', 'use_test_step', 'test_step_position',
        'contract_length', 'exclude_immaper', 'include_cover_letter','show_contract','show_salary', 'interview_order'
    ];

    public function users()
    {
        return $this->belongsToMany('App\Models\User')->withTimestamps()->withPivot(
            'id', 'job_status_id', 'interview_date', 'interview_invitation_done', 'timezone', 'skype_id',
            'panel_interview', 'interview_type', 'interview_address', 'cover_letter_url', 'start_date_availability',
            'departing_from', "final_interview_score"
        );
    }

    public function job_user()
    {
        return $this->hasMany('App\Models\JobUser');
    }

    public function first_job_user()
    {
        return $this->hasOne('App\Models\JobUser');
    }

    public function job_interview_files(){
        return $this->hasMany('App\Models\JobInterviewFiles', 'job_id');
    }

    public function languages()
    {
        return $this->belongsToMany('App\Models\Language');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function tor()
    {
        return $this->belongsTo('App\Models\HR\HRToR');
    }

    public function sub_sections()
    {
        return $this->hasMany('App\Models\JobSection', 'job_id');
    }

    public function immap_office()
    {
        return $this->belongsTo('App\Models\ImmapOffice');
    }

    public function job_manager()
    {
        return $this->hasMany('App\Models\JobManager', 'job_id');
    }

    public function managerComments() {
        return $this->hasMany('App\Models\JobManagerComment', 'job_id')->where('root', 0);
    }

    public function interview_request_contract() {
        return $this->hasMany('App\Models\JobInterviewRequestContract', 'job_id');
    }

    public function jobHistory()
    {
        return $this->hasMany('App\Models\Job_user_move_status_history');
    }

    public function interviewScore(){
        return $this->hasMany('App\Models\JobInterviewFiles', 'job_id');
    }

    public function interview_questions() {
        return $this->hasMany('App\Models\InterviewQuestions', 'job_id');
    }
}
