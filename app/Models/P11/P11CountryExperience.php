<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11CountryExperience extends Model
{
    protected $table = "p11_country_experiences";

    protected $fillable = ['profile_id','country_id','years','months','days'];

    protected $hidden = ['created_at','updated_at'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country','country_id');
    }
}
