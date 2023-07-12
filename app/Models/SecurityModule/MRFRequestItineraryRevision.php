<?php

namespace App\Models\SecurityModule;

use Illuminate\Database\Eloquent\Model;

// Domestic Travel Request MRF Itinerary Revision Model
class MRFRequestItineraryRevision extends Model
{
    protected $table = "security_module_mrf_request_itineraries_revisions";

    protected $fillable = [
        'mrf_request_revision_id', 'date_time', 'return_date_time', 'from_city', 'to_city',
        'flight_number', 'flight_number_outbound_trip', 'flight_number_return_trip', 'order',
        'need_government_paper', 'need_government_paper_now', 'government_paper_id',  'overnight', 'overnight_explanation',
        'etd', 'eta','travelling_by','outbound_trip_final_destination','check_in', 'check_in_outbound', 'check_in_return'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    // MRFRequest Itineraries Revision relation with it's MRF Request Revision [N-to-1]
    public function mrf_request()
    {
        return $this->belongsTo('App\Models\SecurityModule\MRFRequestRevision', 'mrf_request_revision_id');
    }

    // MRF Request Itinerary Revision relation with Attachment [government access paper] [N-to-1]
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
