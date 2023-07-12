<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Duration extends Model
{
    protected $table = "durations";

    protected $fillable = [ 'id', 'name' ];

    public function tor()
    {
        return $this->hasMany('App\Models\HR\HRToR', 'duration_id');
    }
}
