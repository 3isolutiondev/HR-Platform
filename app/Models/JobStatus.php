<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class JobStatus extends Model
{
    use HasSlug;

    protected $table = "job_status";

    protected $fillable = [
        'status',
        'slug',
        'default_status',
        'order',
        'last_step',
        'is_interview',
        'set_as_shortlist',
        'set_as_rejected',
        'under_sbp_program',
        'status_under_sbp_program',
        'has_reference_check',
        'set_as_first_test',
        'set_as_second_test',
        'set_as_test'
    ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('status')
            ->saveSlugsTo('slug');
    }

    public function job_users()
    {
        return $this->hasMany('App\Models\JobUser','job_status_id');
    }
}
