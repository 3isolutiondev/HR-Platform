<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;

class Repository_role extends Model {

    protected $fillable = ['id', 'name'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="role_repository";

    // function repo(){
    //     return $this->hasMany('App\Models\Repository\Repository', 'category_id');
    // }
}
