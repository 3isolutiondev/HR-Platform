<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;

class Repository_country_permission extends Model {

    protected $fillable = ['immap_office_id', 'repository_id', 'permission', 'permission_id'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="repository_country_permission";

    // function repo(){
    //     return $this->hasMany('App\Models\Repository\Repository', 'category_id');
    // }
}
