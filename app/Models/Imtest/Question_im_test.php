<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

class Question_im_test extends Model
{
    protected $fillable = ['question', 'im_test_id'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table = 'question_im_test';

    function belongs_im()
    {
        return $this->belongsTo('App\Models\Imtest\Imtest', 'im_test_id');
    }

    function answer()
    {
        return $this->hasMany('App\Models\Imtest\Multiple_choice', 'question_im_test_id');
    }

    // function question_hasmany_user_answer()
    // {
    //     return $this->belongsToMany('App\Models\User', 'user_answer');
    // }

    function im_test_q_answer () {
        return $this->hasOne('App\Models\Imtest\Answer_im_test', 'question_im_test_id');
    }
}
