<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11PermanentCivilServant extends Model
{
    protected $table = "p11_permanent_civil_servants";

    protected $fillable = ["from", "to", "is_now", "institution", 'profile_id'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }
}
