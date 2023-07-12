<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Repository_category extends Model {
    use NodeTrait;

    protected $fillable = ['name', 'status', 'type', 'parent_id', '_lft', '_rgt'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="repository_category";

    function repo(){
        return $this->hasMany('App\Models\Repository\Repository', 'category_id');
    }
}
