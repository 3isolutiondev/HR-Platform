<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11EducationSchool extends Model
{
    protected $table = 'p11_education_schools';

    protected $fillable = [
        'name', 'place', 'country_id', 'type',
        'attended_from', 'attended_to', 'certificate',
        'certificate_file_id', 'profile_id'
    ];

    // protected $appends = ['image_url'];

    // public function getImageUrlAttribute()
    // {
    //     return $this->getFirstMediaUrl('certificate_files');
    // }

    public function registerMediaCollections()
    {
        $this->addMediaCollection('certificate_files');
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment','certificate_file_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }
}
