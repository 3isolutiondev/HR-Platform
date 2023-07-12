<?php

namespace App\Models\Sendemail;

use Illuminate\Database\Eloquent\Model;

class Sendemail extends Model {

    protected $fillable = ['title', 'content', 'status'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='send_email';

    function cc(){
        return $this->hasMany('App\Models\Sendemail\Sendemail_cc', 'send_email_id');
    }
    function bcc(){
        return $this->hasMany('App\Models\Sendemail\Sendemail_bcc', 'send_email_id');
    }
    function to(){
        return $this->hasMany('App\Models\Sendemail\Sendemail_to', 'send_email_id');
    }

}
