<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewScores extends Model
{
    protected $fillable = [
        'applicant_id', 'score', 'editable', 'interview_question_id', 'comment', 'roster_profile_id'
    ];

    protected $table = "interview_scores";

    public function jobUser()
    {
        return $this->belongsTo('App\Models\JobUser', 'applicant_id');
    }

    public function rosterProfileUser()
    {
        return $this->belongsTo('App\Models\Roster\ProfileRosterProcess', 'roster_profile_id');
    }

    public function interviewQuestion()
    {
        return $this->belongsTo('App\Models\InterviewQuestions', 'interview_question_id');
    }
}
