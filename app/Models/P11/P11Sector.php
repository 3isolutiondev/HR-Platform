<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Sector extends Model
{
    protected $table = "p11_sectors";

    protected $fillable = ['profile_id','sector_id','years','months','days','has_portfolio'];

    protected $hidden = ['created_at','updated_at'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

    public function sector()
    {
        return $this->belongsTo('App\Models\Sector','sector_id');
    }

    // public function employment_records()
    // {
    //     return $this->hasMany('App\Models\P11EmploymentRecord','p11_employment_id');
    // }
}
