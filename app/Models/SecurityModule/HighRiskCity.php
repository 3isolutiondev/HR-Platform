<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

class HighRiskCity extends Model
{
    protected $table = "security_module_high_risk_cities";

    protected $fillable = ['city', 'is_high_risk', 'country_id'];

    // relation between high risk city with country
    public function country()
    {
        return $this->belongsTo('App\Models\Country', 'country_id');
    }
}
