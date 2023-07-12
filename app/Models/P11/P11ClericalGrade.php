<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11ClericalGrade extends Model
{
    protected $table = "p11_clerical_grades";

    protected $fillable = ['language_id', 'typing_score', 'shorthand_score', 'profile_id'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function language()
    {
        return $this->belongsTo('App\Models\Language');
    }
}
