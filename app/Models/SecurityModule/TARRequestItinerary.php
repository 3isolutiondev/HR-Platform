<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// International Travel Request (TAR) Itinerary Model
class TARRequestItinerary extends Model
{
    protected $table = "security_module_tar_request_itineraries";

    protected $fillable = [
        'tar_request_id', 'date_travel', 'return_date_travel', 'from_country_id', 'from_country_name', 'from_city',
        'flight_number','flight_number_outbound_trip', 'flight_number_return_trip','outbound_trip_final_destination',
        'to_country_id', 'to_country_name', 'to_city', 'order', 'overnight', 'overnight_explanation', 'is_high_risk', 
        'check_in', 'check_in_outbound', 'check_in_return', 'need_government_paper', 'need_government_paper_now', 'government_paper_id'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    // overnight_explanation accessor, modify null value into empty string
    public function getOvernightExplanationAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // TARRequest Itinerary relation with Country (From Country) [N-to-1]
    public function fromCountry()
    {
        return $this->belongsTo('App\Models\Country', 'from_country_id');
    }

    // TARRequest Itinerary relation with Country (To Country) [N-to-1]
    public function toCountry()
    {
        return $this->belongsTo('App\Models\Country','to_country_id');
    }

    // TARRequest Itinerary relation with TARRequest [N-to-1]
    public function tar_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\TARRequest', 'tar_request_id');
    }

     // TARRequest Itinerary relation with Attachment [government access paper] [N-to-1]
     public function attachment()
     {
         return $this->belongsTo('App\Models\Attachment', 'government_paper_id');
     }
 
}
