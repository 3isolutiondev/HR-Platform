<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class ProfileRosterProcess extends Model implements HasMedia
{
    use HasMediaTrait;
    protected $table = 'profile_roster_processes';

    protected $fillable = [
        'roster_process_id', 'profile_id', 'set_as_current_process', 'current_step', 'is_completed', 'is_rejected',
        'skype', 'skype_date', 'skype_timezone', 'skype_invitation_done',
        'im_test_template_id', 'im_test_timezone', 'im_test_submit_date', 'im_test_submit_date_on_server', 'im_test_invitation_done', 'im_test_start_time', 'im_test_end_time', 'im_test_done',
        'interview_skype', 'interview_date', 'interview_timezone', 'interview_invitation_done',
        'reference_check_id', 'panel_interview', 'interview_type', 'interview_address', 'moved_date', 'mover_id', 'interview_order',
        'im_test_sharepoint_link', 'im_test_score'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile', 'profile_id');
    }

    public function roster_process()
    {
        return $this->belongsTo('App\Models\Roster\RosterProcess', 'roster_process_id');
    }

    public function im_test_template()
    {
        return $this->belongsTo('App\Models\Imtest\IMTestTemplate', 'im_test_template_id');
    }

    public function reference_check()
    {
        return $this->belongsTo('App\Models\Userreference\Questioncategory', 'reference_check_id');
    }

    public function mover()
    {
        return $this->belongsTo('App\Models\User', 'mover_id');
    }

    public function job_interview_scores() {
        return $this->hasMany('App\Models\InterviewScores', 'roster_profile_id');
    }

    public function job_interview_global_impression() {
        return $this->hasMany('App\Models\InterviewScoreComment', 'roster_profile_id');
    }

    public function interview_questions() {
        return $this->hasMany('App\Models\InterviewQuestions', 'roster_profile_id');
    }
}
