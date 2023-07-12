<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11EmploymentRecordSector extends Model
{
    protected $table = "p11_employment_records_sectors";

    public function employment_record()
    {
        return $this->belongsTo('App\Models\P11\P11EmploymentRecord','p11_employment_id');
    }
}
