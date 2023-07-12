<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11ProfessionalSociety extends Model
{
    protected $table = 'p11_professional_societies';

    protected $fillable = [
        'name', 'description', 'country_id', 'attended_from', 'attended_to', 'profile_id'
    ];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function sectors()
    {
        return $this->belongsToMany('App\Models\Sector', 'p11_professional_society_sector', 'p11_society_id', 'sector_id');
    }

}
