<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImmapOffice extends Model
{
    protected $table = 'immap_offices';

    protected $fillable = ['city', 'country_id', 'is_active', 'is_hq'];

    protected $hidden = ['created_at', 'updated_at'];

    public function profile()
    {
        return $this->hasMany('App\Models\Profile');
    }

    public function tors()
    {
        return $this->hasMany('App\Models\HR\HRToR');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function roles()
    {
        return $this->belongsToMany('App\Models\Role', 'roles_immap_offices', 'immap_office_id', 'role_id');
    }

    public function jobs()
    {
        return $this->hasMany('App\Models\Job');
    }
}
