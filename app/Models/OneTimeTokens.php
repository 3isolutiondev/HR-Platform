<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OneTimeTokens extends Model
{
    protected $table = "one_time_tokens";

    protected $fillable = [ 'user_id', 'token' ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }
}
