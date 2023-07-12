<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11EducationUniversity extends Model
{
    protected $table = 'p11_education_universities';

    protected $fillable = [
        'name', 'place', 'country_id', 'attended_from',
        'attended_to', 'degree', 'study', 'diploma_file_id',
        'profile_id', 'degree_level_id', 'untilNow'
    ];

    public function registerMediaCollections()
    {
        $this->addMediaCollection('diploma_files');
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'diploma_file_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function degree_level()
    {
        return $this->belongsTo('App\Models\DegreeLevel', 'degree_level_id');
    }
}
