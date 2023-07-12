<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;

class Repository_holiday extends Model {

    protected $fillable = ['date', 'event', 'repository_id'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="repository_holiday";

    function repo(){
        return $this->belongsTo('App\Models\Repository\Repository', 'repository_id');
    }
}
