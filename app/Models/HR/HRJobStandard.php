<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class HRJobStandard extends Model
{
    use HasSlug;

    protected $table = "hr_job_standards";

    protected $fillable = ['name', 'slug', 'under_sbp_program', 'sbp_recruitment_campaign'];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function job_categories()
    {
        return $this->belongsToMany('App\Models\HR\HRJobCategory', 'hr_job_standards_job_categories', 'job_standard_id', 'job_category_id')->withTimestamps();
    }

    public function tors()
    {
        return $this->hasMany('App\Models\HR\HRToR', 'job_standard_id');
    }
}
