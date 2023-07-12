<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UNOrganization extends Model
{
    protected $table = "un_organizations";

    protected $fillable = [ 'name', 'slug', 'abbreviation' ];

    public function p11_submitted_application_in_un()
    {
        return $this->hasMany('App\Models\P11\P11SubmittedApplicationInUn','un_organization_id');
    }
}
