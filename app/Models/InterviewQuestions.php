<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewQuestions extends Model
{
    protected $fillable = [
        'question', 'editable','question_type', 'job_id', 'user_id', 'roster_process_id', 'roster_profile_id'
    ];

    protected $table = "interview_questions";
}
