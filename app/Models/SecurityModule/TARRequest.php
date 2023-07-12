<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

// International Travel Request (TAR) Model
class TARRequest extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $table = "security_module_tar_request";

    protected $fillable = [
        'name', 'travel_purpose', 'remarks', 'status', 'user_id', 'submitted_date',
        'disapproved_reasons', 'revision_needed', 'approved_comments', 'travel_type',
        'is_high_risk', 'heat_certificate', 'security_measure_email', 'security_measure_immap_careers',
        'security_measure_smart24','view_status', 'edit_on_approval', 'risk_level', 'is_archived'
    ];

    protected $hidden = ['updated_at', 'user_id'];

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

    // disapproved_reasons accessor, modify null value into empty string
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

    // TARRequest relation with TAR Itineraries [1-to-N]
    public function itineraries()
    {
        return $this->hasMany('App\Models\SecurityModule\TARRequestItinerary', 'tar_request_id');
    }

    // TARRequest relation with User [N-to-1]
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // TARRequest relation with TARRequest Revision [1-to-N]
    public function revisions()
    {
        return $this->hasMany('App\Models\SecurityModule\TARRequestRevision', 'tar_request_id');
    }
}
