<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Models\Imtest;
use Illuminate\Database\Eloquent\Model;

class user_answer  extends Model {
    
    protected $fillable = ['user_id', 'question_im_test_id', 'multiple_choice_im_test_id'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='user_answer_im_test';
    
    // function belongsmchoice(){
    //     return $this->belongsTo('App\Models\Imtest\mchoice', 'mchoice_id');
    // }
    
}
