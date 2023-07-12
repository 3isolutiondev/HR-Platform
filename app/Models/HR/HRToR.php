<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class HRToR extends Model implements HasMedia
{
    use HasSlug, HasMediaTrait;

    protected $table = "hr_tor";

    protected $fillable = [
        'title', 'slug', 'duty_station', 'contract_start', 'contract_end', 'duty_station', 'country_id',
        'relationship', 'job_standard_id', 'job_category_id', 'job_level_id', 'organization', 'mailing_address',
        'duration_id', 'program_title', 'min_salary', 'max_salary', 'is_immap_inc', 'is_immap_france', 'immap_office_id',
        'is_international', 'status', 'is_shared', 'hq_us', 'hq_france', 'with_template', 'other_category', 'cluster',
        'skillset', 'cluster_seconded', 'contract_length', 'created_by_id'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    protected function getClusterAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    protected function getSkillsetAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function job()
    {
        return $this->hasMany('App\Models\Job', 'tor_id');
    }

    public function job_standard()
    {
        return $this->belongsTo('App\Models\HR\HRJobStandard');
    }

    public function job_category()
    {
        return $this->belongsTo('App\Models\HR\HRJobCategory');
    }

    public function job_level()
    {
        return $this->belongsTo('App\Models\HR\HRJobLevel');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function job_country()
    {
        return $this->belongsTo('App\Models\Country')->select('id as value', 'name as label');
    }

    public function sub_sections()
    {
        return $this->hasMany('App\Models\HR\HRToRSection', 'hr_tor_id');
    }

    public function duration()
    {
        return $this->belongsTo('App\Models\Duration');
    }

    public function matching_requirements()
    {
        return $this->hasMany('App\Models\HR\HRToRRequirement', 'tor_id');
    }

    public function immap_office()
    {
        return $this->belongsTo('App\Models\ImmapOffice');
    }

    public function created_by_immaper()
    {
        return $this->belongsTo('App\Models\User', 'created_by_id');
    }
}
