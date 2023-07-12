<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Skill extends Model
{
    protected $table = 'p11_skills';

    protected $fillable = ['profile_id', 'skill_id', 'proficiency', 'days', 'months', 'years', 'has_portfolio'];

    protected $hidden = ['created_at','updated_at'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function skill()
    {
        return $this->belongsTo('App\Models\Skill');
    }
}
