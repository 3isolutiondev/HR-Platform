<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Group extends Model
{
    use HasSlug;

    protected $fillable = ['name', 'slug', 'description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function permissions()
    {
        return $this->hasMany('App\Models\Permission');
    }
}
