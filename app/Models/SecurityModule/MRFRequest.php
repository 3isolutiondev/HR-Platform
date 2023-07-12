<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

// Domestic Travel Request (MRF) Model
class MRFRequest extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $table = "security_module_mrf_requests";

    protected $fillable = [
        'name', 'country_id', 'country_name','purpose', 'criticality_of_the_movement', 'status', 'user_id', 'submitted_date',
        'disapproved_reasons', 'revision_needed', 'approved_comments', 'security_assessment', 'security_measure',
        'movement_state', 'travel_type', 'transportation_type', 'security_measure_email', 'security_measure_smart24',
        'vehicle_filled_by_yourself','view_status', 'edit_on_approval', 'risk_level', 'security_measure_immap_careers', 'is_archived'
    ];

    protected $hidden = ['updated_at', 'user_id'];

    // submitted_date accessor, modify null value into empty string
    public function getSubmmittedDateAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // disapproved_reasons, modify null value into empty string
    public function getDisapprovedReasonsAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // revision_needed accessor, modify null value into empty string
    public function getRevisionNeededAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // approved_comments accessor, modify null value into empty string
    public function getApprovedCommentsAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // movement_state accessor, modify null value into empty string
    public function getMovementStateAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // security_measure accessor, modify null value into empty string
    public function getSecurityMeasureAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // security_assessment accessor, modify null value into empty string
    public function getSecurityAssessmentAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // travel_type accessor, modify null value into empty string
    public function getTravelTypeAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // MRFRequest relation with MRF Itineraries [1-to-N]
    public function itineraries()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequestItinerary', 'mrf_request_id');
    }

    // MRFRequest relation with MRF Travel Details [1-to-N]
    public function travel_details()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequestTravelDetail', 'mrf_request_id');
    }

    // MRFRequest relation with User [N-to-1]
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // MRFRequest relation with Country [N-to-1]
    public function country()
    {
        return $this->belongsTo('App\Models\Country', 'country_id');
    }

    // MRFRequest relation with it's revisions [1-to-N]
    public function revisions()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequestRevision', 'mrf_request_id');
    }
}
