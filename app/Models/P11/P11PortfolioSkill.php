<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11PortfolioSkill extends Model
{
    protected $table = "p11_portfolios_skills";

    protected $fillable = ['p11_portfolio_id','skill_id'];

    public function p11_portfolio()
    {
        return $this->belongsTo('App\Models\P11\P11Portfolio','p11_portfolio_id');
    }
}
