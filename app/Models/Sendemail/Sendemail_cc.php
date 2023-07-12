<?php

namespace App\Models\Sendemail;

use Illuminate\Database\Eloquent\Model;

class Sendemail_cc extends Model {

    protected $fillable = ['send_email_id', 'email'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='send_email_cc';

    function cc(){
        return $this->belongsTo('App\Models\Sendemail\Sendemail', 'send_email_id');
    }
    
}
