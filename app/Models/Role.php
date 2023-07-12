<?php

namespace App\Models;

use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Role as RoleModel;

class Role extends RoleModel
{
    use Searchable;

    protected $guard_name = 'api';

    protected $fillable = ['name', 'guard_name'];

    protected $hidden = ['pivot'];

    public function immap_offices()
    {
        return $this->belongsToMany('App\Models\ImmapOffice', 'roles_immap_offices', 'role_id', 'immap_office_id')->withTimestamps();
    }
}
