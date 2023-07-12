<?php

namespace App\Models\Repository;

use Illuminate\Database\Eloquent\Model;

class Repository_section extends Model {

    protected $fillable = ['sub_section', 'sub_section_content', 'repository_id'];

    protected $hidden = ['created_at', 'updated_at'];

    protected $table="repository_section";

    function repo(){
        return $this->belongsTo('App\Models\Repository\Repository', 'repository_id');
    }
}
