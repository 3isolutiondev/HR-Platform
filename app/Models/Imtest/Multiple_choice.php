<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

class Multiple_choice extends Model
{
    protected $fillable = ['choice', 'question_im_test_id', 'true_false'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='multiple_choice_im_test';
    
    function belongs_question(){
        return $this->belongsTo('App\Models\Imtest\Question_im_test', 'question_im_test_id');
    }
    
    function hasoneanswer(){
        return $this->hasOne('App\Models\Imtest\Answer_im_test', 'multiple_choice_im_test_id');
    }
    
}
