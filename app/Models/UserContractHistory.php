<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserContractHistory extends Model
{
    protected $table = 'user_contract_histories';

    protected $fillable = [
        'user_id', 'immap_office_id', 'is_immap_france', 'is_immap_inc', 'role',
        'project_code', 'immap_email', 'job_title', 'duty_station', 'line_manager',
        'start_of_contract', 'end_of_contract', 'immap_contract_international', 'under_sbp_program',
        'paid_from',
        'project_task',
        'supervisor_id',
        'unanet_approver_id',
        'hosting_agency',
        'monthly_rate',
        'housing',
        'perdiem',
        'phone',
        'is_other',
        'not_applicable',
        'other',
        'cost_center',
        'currency'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    public function immap_office()
    {
        return $this->belongsTo('App\Models\ImmapOffice', 'immap_office_id');
    }
}
