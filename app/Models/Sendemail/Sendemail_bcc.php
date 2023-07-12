<?php

namespace App\Models\Sendemail;

use Illuminate\Database\Eloquent\Model;

class Sendemail_bcc extends Model {

    protected $fillable = ['send_email_id', 'email'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='send_email_bcc';

    function bcc(){
        return $this->belongsTo('App\Models\Sendemail\Sendemail', 'send_email_id');
    }
    
}
