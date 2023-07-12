<?php

namespace App\Models\Onboarding;

use Illuminate\Database\Eloquent\Model;

class Bank_information extends Model {
   
    protected $fillable = ['contact_id', 'if_account_in_us', 'if_account_overseas', 'if_foreign_currency_overseas'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='bank_information';
    
    function contact(){
        return $this->belongsTo('App\Models\Onboarding\Contact_information', 'contact_id');
    }

}
