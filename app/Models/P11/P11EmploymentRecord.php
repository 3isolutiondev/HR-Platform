<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11EmploymentRecord extends Model
{
    protected $table = 'p11_employment_records';
    // change employer address to text
    protected $fillable = [
        'employer_name', 'employer_address', 'from', 'to', 'job_title',
        'job_description', 'business_type', 'supervisor_name',
        'number_of_employees_supervised', 'kind_of_employees_supervised',
        'reason_for_leaving', 'profile_id', 'country_id', 'untilNow',
        // 'starting_salary', 'final_salary',
    ];

    protected $hidden = ["pivot", "created_at", "updated_at"];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function employment_skills()
    {
        return $this->belongsToMany('App\Models\Skill', 'p11_employment_records_skills', 'p11_employment_record_id', 'skill_id')->withTimestamps();
    }

    public function skills()
    {
        return $this->belongsToMany('App\Models\Skill', 'p11_employment_records_skills', 'p11_employment_record_id', 'skill_id')->select('skills.id as value', 'skills.skill as label', 'p11_employment_records_skills.proficiency as proficiency');
    }

    public function p11_employment_records_skills()
    {
        return $this->hasMany('App\Models\P11\P11EmploymentRecordSkill');
    }

    public function employment_sectors()
    {
        return $this->belongsToMany('App\Models\Sector', 'p11_employment_records_sectors', 'p11_employment_id', 'sector_id')->withTimestamps();
    }

    public function sectors()
    {
        return $this->belongsToMany('App\Models\Sector', 'p11_employment_records_sectors', 'p11_employment_id', 'sector_id');
    }

    public function p11_employment_records_sectors()
    {
        return $this->hasMany('App\Models\P11\P11EmploymentRecordSector', 'p11_employment_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }
}
