<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class HRToRRequirement extends Model
{
    protected $table = 'hr_tor_requirements';

    protected $fillable = ['tor_id','requirement','component','requirement_value'];

    public function getRequirementValueAttribute($value) {
        return json_decode($value);
    }

    public function tor() {
        return $this->belongsTo('App\Models\HR\HRToR');
    }
}
