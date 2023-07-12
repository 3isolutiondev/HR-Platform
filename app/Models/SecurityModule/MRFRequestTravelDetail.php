<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// MRF Travel Detail Model
class MRFRequestTravelDetail extends Model
{
    protected $table = "security_module_mrf_request_travel_details";

    protected $fillable = [
        'mrf_request_id', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'vehicle_plate',
        'comm_gsm', 'comm_sat_phone', 'comm_vhf_radio', 'comm_sat_tracker', 'ppe', 'medical_kit',
        'personnel_on_board', 'order', 'comm_vhf_radio_call_sign', 'company_name', 'company_email', 
        'company_phone_number', 'company_driver'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    // comm_sat_phone accessor, modify null value into empty string
    public function getCommSatPhoneAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // MRFRequest Travel Detail relation with MRFRequest [N-to-1]
    public function mrf_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\MRFRequest', 'mrf_request_id');
    }
}
