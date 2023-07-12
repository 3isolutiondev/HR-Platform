<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobManager extends Model {
    
    protected $table = "job_managers";

    protected $fillable = [
        'job_id','user_id', 'email', 'label', 'name', 'jobuser'
    ];

    public function job() {
        return $this->belongsTo('App\Models\Job', 'job_id');
    }
}