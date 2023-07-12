<?php

namespace App\Models\Onboarding;

use Illuminate\Database\Eloquent\Model;

class Contact_information extends Model {
   
    protected $fillable = ['first_name', 'last_name', 'middle_initial', 'mailing_address', 'phone', 'mobile', 'fax',
        'other', 'passport', 'passport_expiration_date', 'issuing_location', 'email', 'emergency_contact_information',
        'beneficiary_contact_information'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table='contact_information';

    function file(){
        return $this->hasOne('App\Models\Onboarding\Onboarding_file', 'contact_id');
    }

    function bank() {
        return $this->hasOne('App\Models\Onboarding\Bank_information', 'contact_id');
    }

}
