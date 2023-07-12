<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Follow_im_test extends Model implements HasMedia {

    use HasMediaTrait;

    protected $fillable = ['file1', 'file2', 'file3', 'profil_id', 'im_test_id',
        'text1', 'text2', 'text3'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='follow_im_test';

    function answer(){
        return $this->hasMany('App\Models\Imtest\Answer_im_test', 'follow_im_test_id');
    }

    function file1Answer() {
        return $this->belongsTo('App\Models\Attachment', 'file1');
    }

    function file2Answer() {
        return $this->belongsTo('App\Models\Attachment', 'file2');
    }

    function file3Answer() {
        return $this->belongsTo('App\Models\Attachment', 'file3');
    }

    function profile() {
        return $this->belongsTo('App\Models\Profile', 'profil_id');
    }

}
