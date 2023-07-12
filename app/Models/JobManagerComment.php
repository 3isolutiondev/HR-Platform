<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobManagerComment extends Model {

    protected $table = "job_manager_comments";

    protected $fillable = [
        'job_id','user_id', 'comments', 'comment_by_id', 'root', 'manager_id', 'order_job_status'
    ];

    public function job() {
        return $this->belongsTo('App\Models\Job', 'job_id');
    }
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function commentby() {
        return $this->belongsTo('App\Models\User', 'comment_by_id');
    }

    public function replies() {
        return $this->hasMany('App\Models\JobManagerComment', 'root')->orderBy('created_at', 'DESC');
    }
}
