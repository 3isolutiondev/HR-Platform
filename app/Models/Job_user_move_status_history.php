<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job_user_move_status_history extends Model
{
    protected $table='job_user_move_status_history';
    
    protected $fillable = [
        'job_id', 'user_id', 'job_status_id', 'user_move_id', 'is_current_status'
    ];

    public function mover()
    {
        return $this->belongsTo('App\Models\User', 'user_move_id');
    }

    public function order_status() {
        return $this->hasOne('App\Models\JobStatus', 'id','job_status_id');
    }

}
