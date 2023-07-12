<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// TAR Revision Model
class TARRequestRevision extends Model
{
    protected $table = "security_module_tar_request_revision";

    protected $fillable = [
        'name', 'travel_purpose', 'remarks', 'status', 'user_id', 'submitted_date',
        'tar_request_id', 'user_who_edit', 'disapproved_reasons', 'revision_needed',
        'approved_comments', 'travel_type', 'is_high_risk', 'heat_certificate', 'security_measure_immap_careers',
        'security_measure_email', 'security_measure_smart24','view_status', 'edit_on_approval', 'risk_level'
    ];

    protected $hidden = ['created_at', 'updated_at', 'user_id', 'status'];

    // submitted_date accessor, modify null value into empty string
    public function getSubmmittedDateAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // remarks accessor, modify null value into empty string
    public function getRemarksAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // TARRequest Revision relation with TARRequest [N-to-1]
    public function tar_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\TARRequest', 'tar_request_id');
    }

    // TARRequest Revision relation with TAR Itinerary Revision [1-to-N]
    public function itineraries()
    {
        return $this->hasMany('App\Models\SecurityModule\TARRequestItineraryRevision', 'tar_request_revision_id');
    }

    // TARRequest Revision relation with User [N-to-1]
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // TARRequest Revision relation with User (Last Edit User) [N-to-1]
    public function last_edit_user()
    {
        return $this->belongsTo('App\Models\User', 'user_who_edit');
    }
}
