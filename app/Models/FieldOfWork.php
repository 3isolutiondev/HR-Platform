<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Searchable\Searchable;
use Spatie\Searchable\SearchResult;
// use Spatie\Sluggable\HasSlug;
// use Spatie\Sluggable\SlugOptions;

class FieldOfWork extends Model implements Searchable
{
    // use HasSlug;

    protected $table = "field_of_works";

    protected $fillable = ['field','slug','is_approved','addedBy'];

    protected $hidden = ['pivot'];
    // public function getSlugOptions() : SlugOptions
    // {
    //     return SlugOptions::create()
    //         ->generateSlugsFrom('field')
    //         ->saveSlugsTo('slug');
    // }

    public function getSearchResult(): SearchResult
     {
        // $url = route('blogPost.show', $this->slug);

         return new \Spatie\Searchable\SearchResult(
            $this,
            // $this->id,
            $this->field
            // $url
         );
     }

    public function p11_field_of_works()
    {
        return $this->hasMany('App\Models\P11\P11FieldOfWork','field_of_work_id');
    }
}
