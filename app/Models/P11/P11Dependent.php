<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Dependent extends Model
{
    protected $table = 'p11_dependents';

    protected $fillable = [
        'first_name', 'middle_name', 'family_name',
        'full_name', 'bdate', 'bmonth', 'byear',
        'date_of_birth', 'relationship',
        'profile_id'
    ];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }
}
