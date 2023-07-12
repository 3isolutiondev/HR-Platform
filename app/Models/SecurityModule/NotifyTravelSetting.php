<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

class NotifyTravelSetting extends Model
{
    protected $table = 'security_module_notify_settings';
    protected $fillable = ['country_id', 'email'];

    public function country()
    {
        return $this->belongsTo('App\Models\Country', 'country_id');
    }
}
