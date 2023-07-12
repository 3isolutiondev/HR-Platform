<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11RelativesEmployedByPublicIntOrg extends Model
{
    protected $table = 'p11_relatives_employed_by_public_int_org';

    protected $fillable = [
        'first_name', 'middle_name', 'family_name', 'full_name', 'relationship',
        'country_id', 'job_title', 'profile_id'
    ];

    public function getMiddleNameAttribute($value)
    {
        return (is_null($value) || $value === "null") ? '' : $value;
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }
    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }
}
