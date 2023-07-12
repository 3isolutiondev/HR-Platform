<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class DegreeLevel extends Model
{
    use HasSlug;

    protected $table = "degree_levels";

    protected $fillable = [ 'name', 'slug', 'order' ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function p11_education_universities()
    {
        return $this->hasMany('App\Models\P11\P11EducationUniversity','degree_level_id');
    }
}
