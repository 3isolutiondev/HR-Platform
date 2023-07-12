<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Permission as PermissionModel;

class Permission extends PermissionModel
{
    use Searchable;

    protected $fillable = ['name', 'guard_name', 'description', 'group_id'];

    protected $hidden = [
        'created_at', 'updated_at', 'guard_name'
    ];

    public function group()
    {
        return $this->belongsTo('App\Models\Group', 'group_id');
    }
}
