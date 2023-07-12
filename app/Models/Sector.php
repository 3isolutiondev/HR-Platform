<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Searchable\Searchable;
use Spatie\Searchable\SearchResult;
use Illuminate\Database\Eloquent\Model;

class Sector extends Model implements Searchable
{
    use HasSlug;

    protected $fillable = [ 'name', 'slug', 'is_approved', 'addedBy' ];
    protected $hidden = ["pivot"];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getSearchResult(): SearchResult
    {
        $this->sector = $this->name;
        return new \Spatie\Searchable\SearchResult(
            $this,
            $this->sector
        );
    }

    public function p11_professional_societies()
    {
        return $this->belongsToMany('App\Models\P11\P11ProfessionalSociety', 'p11_professional_society_sector', 'sector_id', 'p11_society_id');
    }

    public function p11_employment_records()
    {
        return $this->belongsToMany('App\Models\P11\P11EmploymentRecord', 'p11_employment_records_sectors', 'sector_id', 'p11_employment_id')->withTimestamps();
    }

    public function p11_portfolios()
    {
        return $this->belongsToMany('App\Models\P11\P11Portfolio', 'p11_portfolios_sectors', 'sector_id', 'p11_portfolio_id')->withTimestamps();
    }

    public function p11_sectors()
    {
        return $this->hasMany('App\Models\P11\P11Sector', 'sector_id');
    }


    // public function p11_languages()
    // {
    //     return $this->hasMany('App\Models\Language');
    // }

    // public function jobs()
    // {
    //     return $this->belongsToMany('App\Models\Job');
    // }
}
