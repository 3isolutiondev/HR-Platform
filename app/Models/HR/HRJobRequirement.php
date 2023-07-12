<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class HRJobRequirement extends Model
{
    protected $table = 'hr_job_requirements';

    protected $fillable = ['job_category_id','requirement','component','requirement_value'];

    public function getRequirementValueAttribute($value) {
        return json_decode($value);
    }

    public function job_category() {
        return $this->belongsTo('App\Models\HR\HRJobCategory');
    }

}
