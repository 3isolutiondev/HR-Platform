<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobUserTest extends Model
{
    protected $table = "job_user_tests";

    protected $fillable = [
        'job_user_id', 'test_link', 'test_score', 'position_to_interview_step'
    ];

    public function jobUser() {
        return $this->belongsTo('App\Models\JobUser', 'job_user_id');
    }
}