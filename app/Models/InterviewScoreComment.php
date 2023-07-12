<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewScoreComment extends Model
{
    protected $fillable = [
        'applicant_id', 'editable', 'manager_id', 'comment', 'roster_profile_id', 'roster_process_id', 'manager_user_id'
    ];

    protected $table = "interview_score_comments";

    public function jobUser()
    {
        return $this->belongsTo('App\Models\JobUser', 'applicant_id');
    }

    public function rosterProfileUser()
    {
        return $this->belongsTo('App\Models\Roster\ProfileRosterProcess', 'roster_profile_id');
    }

    public function manager()
    {
        return $this->belongsTo('App\Models\JobManager', 'manager_id');
    }
}
