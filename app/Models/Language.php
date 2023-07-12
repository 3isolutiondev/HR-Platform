<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasSlug;

    protected $fillable = [ 'name', 'slug' ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function p11_languages()
    {
        return $this->hasMany('App\Models\Language');
    }

    public function jobs()
    {
        return $this->belongsToMany('App\Models\Job');
    }
}
