<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Searchable\Searchable;
use Spatie\Searchable\SearchResult;

class Skill extends Model implements Searchable
{
    protected $fillable = ['skill','slug', 'skill_for_matching', 'addedBy', 'is_approved', 'category'];

    protected $hidden = ['pivot','created_at','updated_at'];

    public function getSearchResult(): SearchResult
    {
        return new \Spatie\Searchable\SearchResult(
            $this,
            $this->skill
        );
    }

    public function p11_employment_records()
    {
        return $this->belongsToMany('App\Models\P11\P11EmploymentRecord','p11_employment_records_skills','skill_id','p11_employment_record_id')->withTimestamps();
    }

    public function p11_portfolios()
    {
        return $this->belongsToMany('App\Models\P11\P11Portfolio','p11_portfolios_skills','skill_id','p11_portfolio_id')->withTimestamps();
    }

    public function profiles()
    {
        return $this->belongsToMany('App\Models\Profile', 'p11_profiles_skills', 'skill_id', 'profile_id')->withPivot('proficiency')->withTimestamps();
    }

    //  public function p11_field_of_works()
    // {
    //     return $this->hasMany('App\Models\P11\P11FieldOfWork','field_of_work_id');
    // }
}
