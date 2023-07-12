<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class HRJobCategory extends Model
{
    use HasSlug;

    protected $table = "hr_job_categories";

    protected $fillable = ['name','slug','is_approved'];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function tors()
    {
        return $this->hasMany('App\Models\HR\HRToR','job_category_id');
    }

    public function sub_sections()
    {
        return $this->hasMany('App\Models\HR\HRJobCategorySection','hr_job_category_id');
    }

    public function matching_requirements()
    {
        return $this->hasMany('App\Models\HR\HRJobRequirement','job_category_id');
    }

    public function roster_processes()
    {
        return $this->hasMany('App\Models\Roster\RosterProcess', 'hr_job_category_id');
    }

    public function hr_job_standard()
    {
        return $this->belongsToMany('App\Models\HR\HRJobStandard', 'hr_job_standards_hr_job_categories');
    }

}
