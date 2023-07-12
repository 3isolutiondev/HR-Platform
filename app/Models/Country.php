<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasSlug;
    protected $hidden = ['pivot','created_at','updated_at'];

    protected $fillable = [
        'name', 'slug', 'country_code', 'nationality', 'phone_code',
        'flag', 'seen_in_p11', 'seen_in_security_module', 'is_high_risk',
        'vehicle_filled_by_immaper'
    ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function profiles()
    {
        return $this->belongsToMany('App\Models\Profile', 'p11_country_profile')->withPivot('time');
    }

    public function p11_legal_permanent_residence_status()
    {
        return $this->hasMany('App\Models\P11\P11LegalPermanentResidenceStatus','profile_id');
    }

    public function p11_education_universities()
    {
        return $this->hasMany('App\Models\P11\P11EducationUniversity');
    }

    public function p11_education_schools()
    {
        return $this->hasMany('App\Models\P11\P11EducationSchool');
    }

    public function p11_professional_societies()
    {
        return $this->hasMany('App\Models\P11\P11ProfessionalSociety');
    }

    public function p11_employment_records()
    {
        return $this->hasMany('App\Models\P11\P11EmploymentRecord');
    }

    public function jobs()
    {
        return $this->hasMany('App\Models\Job');
    }

    public function tors()
    {
        return $this->hasMany('App\Models\HR\HRToR','country_id');
    }

    public function immap_office()
    {
        return $this->hasOne('App\Models\ImmapOffice');
    }

    public function country_of_works()
    {
        return $this->belongsToMany('App\Models\Profile', 'p11_country_experiences', 'country_id', 'profile_id')->withPivot('years', 'months', 'days')->withTimestamps();
    }

    public function p11_country_of_works()
    {
        return $this->hasMany('App\Models\P11\P11CountryExperience', 'country_id');
    }

    // relation between national security officer and country
    public function user_officer()
    {
        return $this->belongsToMany('App\Models\User', 'security_module_officer_countries', 'country_id', 'user_id');
    }

    // relation between country and high risk city
    public function high_risk_cities()
    {
        return $this->hasMany('App\Models\SecurityModule\HighRiskCity', 'country_id');
    }

    // relation between country and notify travel setting (security module)
    public function notifyEmails()
    {
        return $this->hasMany('App\Models\SecurityModule\NotifyTravelSetting', 'country_id');
    }
}
