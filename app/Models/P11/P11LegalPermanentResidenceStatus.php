<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11LegalPermanentResidenceStatus extends Model
{
    protected $table = 'p11_legal_permanent_residence_status';

    protected $fillable = ['country_id','profile_id'];

    protected $hidden = ['profile_id'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country','country_id');
    }

}
