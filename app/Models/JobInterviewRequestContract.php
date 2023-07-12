<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobInterviewRequestContract extends Model
{
    protected $table = "job_interview_request_contracts";

    protected $fillable = [
        'job_id','profile_id','first_name', 'last_name', 'paid_from', 'project_code', 'project_task', 'supervisor', 'unanet_approver_name', 'hosting_agency', 'duty_station',
         'monthly_rate', 'housing','perdiem', 'phone', 'is_other','not_applicable', 'other', 'contract_start', 'contract_end', 'cost_center', 'request_type', 'under_surge_program',
         'currency', 'request_status', 'position', 'immap_office_id'
    ];

    public function getHostingAgencyAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getOtherAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getProjectTaskAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getContractStartAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getContractEndAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function job() {
        return $this->belongsTo('App\Models\Job', 'job_id');
    }
    public function profile() {
        return $this->belongsTo('App\Models\Profile', 'profile_id');
    }

    public function unanet_approver_user() {
        return $this->belongsTo('App\Models\User', 'unanet_approver_name');
    }

    public function supervisor_user() {
        return $this->belongsTo('App\Models\User', 'supervisor');
    }

    public function costCenterHQ()
    {
        return $this->belongsTo('App\Models\ImmapOffice', 'cost_center');
    }

}
