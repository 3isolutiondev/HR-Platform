<?php

namespace App\Models\Userreference;

use Illuminate\Database\Eloquent\Model;

class Question extends Model {
   
    protected $fillable = ['is_default', 'question', 'category_question_reference_id'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='question_reference';
    
    function belongscategory(){
        return $this->belongsTo('App\Models\Userreference\Questioncategory', 'category_question_reference_id');
    }

    function answerby_many_user(){
        return $this->belongsToMany('App\Models\Profile', 'Answer');
    }
    
    function hasanswer(){
        return $this->hasOne('App\Models\Userreference\Answer', 'question_reference_id');
    }

    function prereference_answer(){
        return $this->belongsToMany('\App\Models\Userreference\Question', 'user_answer_question_reference',
            'question_reference_id', 'p11_references_id');
        // return $this->hasMany('\App\Models\Userreference\Answer', 'p11_references_id');
    }
}
