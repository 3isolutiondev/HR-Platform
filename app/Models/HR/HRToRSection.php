<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class HRToRSection extends Model
{
    protected $table = "hr_tor_sections";

    protected $fillable = [ 'hr_tor_id', 'sub_section', 'sub_section_content', 'level' ];

    public function hr_tor() {
        $this->belongsTo('App\Models\HR\HRToR','hr_tor_id');
    }
}
