<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11EmploymentRecordSkill extends Model
{
    protected $table = "p11_employment_records_skills";

    public function employment_record()
    {
        return $this->belongsTo('App\Models\P11\P11EmploymentRecord','p11_employment_record_id');
    }
}
