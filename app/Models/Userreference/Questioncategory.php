<?php

namespace App\Models\Userreference;

use Illuminate\Database\Eloquent\Model;

class Questioncategory extends Model {
   
    protected $fillable = ['name', 'is_default'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='category_question_reference';
    
    function hasquestion(){
        return $this->hasMany('App\Models\Userreference\Question', 'category_question_reference_id');
    }

    function category_hasmany_assigmnets(){
        return $this->belongsToMany('App\Models\Profile', 'profil_assignment_question',
            'category_question_reference_id', 'profil_id')
        ;
    }
}
