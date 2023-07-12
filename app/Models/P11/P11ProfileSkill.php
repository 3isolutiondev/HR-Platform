<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11ProfileSkill extends Model
{
    // protected $table = "p11_profiles_skills";
    protected $table = "p11_skills";

    protected $fillable = ['profile_id','skill_id','proficiency','years','has_portfolio'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

    public function skill()
    {
        return $this->belongsTo('App\Models\Skill','skill_id');
    }
}
