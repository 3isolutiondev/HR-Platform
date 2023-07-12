<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStarHistory extends Model
{
    protected $table = 'user_star_histories';

    protected $fillable = ['user_id', 'user_who_moved_the_user', 'state'];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function user_who_moved()
    {
        return $this->belongsTo('App\Models\User', 'user_who_moved_the_user');
    }
}
