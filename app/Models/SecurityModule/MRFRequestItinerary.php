<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// Domestic Travel Request (MRF) Itinerary Model
class MRFRequestItinerary extends Model
{
    protected $table = "security_module_mrf_request_itineraries";

    protected $fillable = [
        'mrf_request_id', 'date_time', 'return_date_time', 'from_city', 'to_city', 'flight_number',
        'flight_number_outbound_trip', 'flight_number_return_trip','order', 'need_government_paper', 
        'need_government_paper_now', 'government_paper_id','overnight', 'overnight_explanation',
        'etd', 'eta','travelling_by','outbound_trip_final_destination','check_in', 'check_in_outbound', 'check_in_return'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    // overnight_explanation accessor, modify null value into empty string
    public function getOvernightExplanationAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    // etd accessor, modify value into H:i format if not null
    public function getEtd($value)
    {
        return !is_null($value) ? substr($value, 0, -3) : $value;
    }

    // eta accessor, modify value into H:i format if not null
    public function getEta($value)
    {
        return !is_null($value) ? substr($value, 0, -3) : $value;
    }

    // MRFRequest Itineraries relation with it's MRF Request [N-to-1]
    public function mrf_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\MRFRequest', 'mrf_request_id');
    }

    // MRF Request Itinerary relation with Attachment [government access paper] [N-to-1]
    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'government_paper_id');
    }

    // MRF Request Itinerary relation with Attachment [air ticket] [N-to-1]
    public function airTicket()
    {
        return $this->belongsTo('App\Models\Attachment', 'air_ticket_id');
    }
}
