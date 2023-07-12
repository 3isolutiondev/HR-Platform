<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Answer_im_test extends Model implements HasMedia {
    
    use HasMediaTrait;
    
    protected $fillable = ['profil_id', 'im_test_id', 'question_im_test_id', 'multiple_choice_im_test_id'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='im_test_answer';
    
}
