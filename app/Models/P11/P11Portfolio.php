<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Portfolio extends Model
{
    protected $table = "p11_portfolios";

    protected $fillable = ['title', 'description', 'url', 'attachment_id', 'profile_id'];

    protected $hidden = ['pivot'];

    public function portfolio_skills()
    {
        return $this->belongsToMany('App\Models\Skill', 'p11_portfolios_skills', 'p11_portfolio_id', 'skill_id')->withTimestamps();
    }

    public function skills()
    {
        return $this->belongsToMany('App\Models\Skill', 'p11_portfolios_skills', 'p11_portfolio_id', 'skill_id')->withTimestamps()->select('skills.id as value','skills.skill as label');
    }

    public function p11_portfolio_skills()
    {
        return $this->hasMany('App\Models\P11\P11PortfolioSkill','p11_portfolio_id');
    }

    public function sectors()
    {
        return $this->belongsToMany('App\Models\Sector', 'p11_portfolios_sectors', 'p11_portfolio_id', 'sector_id')->withTimestamps();
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'attachment_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile', 'profile_id');
    }

}
