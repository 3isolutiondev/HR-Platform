<?php

namespace App\Models\HR;

use Illuminate\Database\Eloquent\Model;

class HRJobCategorySection extends Model
{
    protected $table = "hr_job_categories_sections";

    protected $fillable = [ 'hr_job_category_id', 'sub_section', 'sub_section_content', 'level' ];

    public function hr_job_category() {
        $this->belongsTo('App\Models\HR\HRJobCategory','hr_job_category_id');
    }
}
