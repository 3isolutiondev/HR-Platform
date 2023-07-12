<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Phone extends Model
{
    protected $table = "p11_phones";

    protected $fillable = ['phone','is_primary','profile_id'];

    protected $hidden = ['updated_at','created_at','profile_id'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

}
