<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSection extends Model
{
    protected $table = 'job_sections';

    protected $fillable = ['job_id', 'sub_section', 'sub_section_content'];

    public function job() {
        $this->belongsTo('App\Models\Job','job_id');
    }
}
