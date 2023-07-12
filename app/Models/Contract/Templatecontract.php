<?php

namespace App\Models\Contract;

//use Spatie\Sluggable\HasSlug;
//use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class Templatecontract extends Model
{
//    use HasSlug;

    protected $fillable = ['title', 'position', 'name_of_ceo', 'position_of_ceo', 'template'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table="template_contracts";


//    public function getSlugOptions() : SlugOptions
//    {
//        return SlugOptions::create()
//            ->generateSlugsFrom('title')
//            ->saveSlugsTo('slug');
//    }
}
