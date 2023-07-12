<?php

namespace App\Models\Userreference;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model {

    protected $fillable = ['question_reference_id', 'answer', 'p11_references_id', 'profil_id', 'category_question_reference_id'];
    // protected $hidden = ['created_at', 'updated_at'];

    protected $table='user_answer_question_reference';

    // function belongsquestion(){
    //     return $this->belongsTo('App\Models\Userreference\Question', 'question_reference_id');
    // }

    function belong_profile(){
        return $this->belongsTo('App\Models\Profile', 'profil_id');
    }
    function belong_preference(){
        return $this->belongsTo('App\Models\P11\P11Reference', 'p11_references_id');
    }

    function belong_question(){
        return $this->belongsTo('App\Models\Userreference\Question', 'question_reference_id');
    }
}
