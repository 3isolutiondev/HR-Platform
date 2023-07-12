<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = ['name', 'description', 'url', 'attachment_id'];

    public function skills() {
        return $this->belongsToMany('App\Models\Skill');
    }

    public function attachment() {
        return $this->belongsTo('App\Models\Attachment', 'attachment_id');
    }

    public function p11_employment_record() {
        return $this->belongsToMany('App\Models\P11\P11EmploymentRecord', 'p11_employment_records_portfolios','portfolio_id','employment_record_id');
    }
}
