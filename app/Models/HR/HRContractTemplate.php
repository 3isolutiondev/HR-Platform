<?php

namespace App\Models\HR;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class HRContractTemplate extends Model implements HasMedia
{
    use HasSlug, HasMediaTrait;

    protected $table = 'hr_contract_templates';

    protected $fillable = [ 'template_name', 'slug', 'contracts', 'footer' ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('template_name')
            ->saveSlugsTo('slug');
    }

}
