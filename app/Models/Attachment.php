<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Attachment extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $fillable = ['uploader_id', 'external'];

    public function registerMediaConversions(Media $media = null)
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->fit(Manipulations::FIT_CROP, 200, 200)->nonQueued();

        $this->addMediaConversion('p11-thumb')
            ->width(428)
            ->height(240)
            //   ->fit(Manipulations::FIT_CROP, 428, 240, 0, 0);
            ->crop(Manipulations::CROP_TOP, 428, 240)->nonQueued();
        //   ->sharpen(10);
    }

    public function certificate_file()
    {
        return $this->belongsTo('App\Models\P11\P11EducationSchool', 'certificate_file_id');
    }

    public function certificate_url()
    {
        return $this->belongsTo('App\Models\P11\P11EducationSchool', 'certificate_file_id');
    }

    public function diploma_file()
    {
        return $this->hasMany('App\Models\P11\P11EducationUniversity', 'diploma_file_id');
    }

    public function portfolio_file()
    {
        return $this->hasMany('App\Models\P11\P11Portfolio', 'attachment_id');
    }

    public function reference_file()
    {
        return $this->hasMany('App\Models\P11\P11Reference', 'attachment_id');
    }

    public function cv()
    {
        return $this->belongsTo('App\Models\Profile', 'cv');
    }

    public function id_card()
    {
        return $this->belongsTo('App\Models\Profile', 'id_card');
    }

    public function passport()
    {
        return $this->belongsTo('App\Models\Profile', 'passport');
    }

    public function photo()
    {
        return $this->belongsTo('App\Models\User', 'photo');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'uploader_id');
    }

    // IM Test
    // public function file_dataset1()
    // {
    //     return $this->belongsTo('App\Models\Imtest\Imtest', 'file_dataset1');
    // }

    // public function file_dataset2()
    // {
    //     return $this->belongsTo('App\Models\Imtest\Imtest', 'file_dataset2');
    // }
    // public function file_dataset3()
    // {
    //     return $this->belongsTo('App\Models\Imtest\Imtest', 'file_dataset3');
    // }
}
