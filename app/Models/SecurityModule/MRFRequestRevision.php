<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// Domestic Travel Request MRF Revision Model
class MRFRequestRevision extends Model
{
    protected $table = "security_module_mrf_requests_revisions";

    protected $fillable = [
        'name', 'country_id', 'country_name', 'purpose',
        'criticality_of_the_movement', 'status', 'user_id', 'submitted_date',
        'disapproved_reasons', 'revision_needed', 'approved_comments', 'security_assessment',
        'security_measure', 'movement_state', 'travel_type', 'mrf_request_id', 'user_who_edit',
        'transportation_type', 'security_measure_email', 'security_measure_smart24',
        'vehicle_filled_by_yourself','view_status', 'edit_on_approval', 'risk_level', 'security_measure_immap_careers'
    ];

    protected $hidden = ['created_at', 'updated_at', 'user_id', 'status'];

    // submitted_date accessor, modify null value into empty string
    public function getSubmmittedDateAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // travel_type accessor, modify null value into empty string
    public function getTravelTypeAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // MRFRequest Revision relation with MRFRequest [N-to-1]
    public function mrf_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\MRFRequest', 'mrf_request_id');
    }

    // MRFRequest Revision relation with MRFRequest Itinerary Revision [1-to-N]
    public function itineraries()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequestItineraryRevision', 'mrf_request_revision_id');
    }

    // MRFRequest Revision relation with MRFRequest Travel Detail Revision [1-to-N]
    public function travel_details()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequestTravelDetailRevision', 'mrf_request_revision_id');
    }

    // MRFRequest Revision relation with User [N-to-1]
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // MRFRequest Revision relation with Country [N-to-1]
    public function country()
    {
        return $this->belongsTo('App\Models\Country', 'country_id');
    }

    // MRFRequest Revision relation with User as the person who edit the request [N-to-1]
    public function last_edit_user()
    {
        return $this->belongsTo('App\Models\User', 'user_who_edit');
    }
}
