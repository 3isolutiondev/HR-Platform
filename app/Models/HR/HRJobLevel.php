<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class HRJobLevel extends Model
{
    use HasSlug;

    protected $table = "hr_job_levels";

    protected $fillable = ['name','slug'];

    // protected $hidden = ['pivot'];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function tors()
    {
        return $this->hasMany('App\Models\HR\HRToR','job_level_id');
    }
}
