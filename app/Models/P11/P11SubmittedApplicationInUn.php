<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11SubmittedApplicationInUn extends Model
{
    protected $table = "p11_submitted_application_in_un";

    protected $fillable = ['starting_date', 'ending_date', 'country_id', "project", 'profile_id', "duty_station", "line_manager", "immap_office_id", "position"];

    public function getProjectAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function immap_office()
    {
        return $this->belongsTo('App\Models\ImmapOffice');
    }
}
