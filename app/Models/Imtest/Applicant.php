<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Applicant extends Model implements HasMedia {
    
    use HasMediaTrait;
    
    protected $fillable = ['file_answers1', 'file_answers2', 'file_answers3', 'user_id', 'im_test_id', 
        'text1', 'text2', 'text3'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='applicant';
    
}
