<?php

namespace App\Traits\SecurityModule;

trait MRFTrait {
    /**
     * ====== Delete Itinerary files from mrf / domestic travel request =======
     * # this function will be used when deleting mrf request or delete a user
     *
     * # $itineraries:
     *      => is an array containing itineraries related to it's request,
     *         (array of MRFRequestItinerary)
     * # $checkRevision:
     *      => is boolean value to check and delete files related itinerary
     *         revision data
     * ========================================================================
     */
    public function deleteMRFItineraryFiles($itineraries, $checkRevision = true) {
        foreach($itineraries as $itinerary) {
            $airTicket = $itinerary->airTicket;
            if (!empty($airTicket)) {
                $itinerary->airTicket->delete();
                $itinerary->airTicket()->delete();
            }
            $gPaper = $itinerary->attachment;
            if (!empty($gPaper)) {
                $itinerary->attachment->delete();
                $itinerary->attachment()->delete();
            }
            if ($checkRevision) {
                foreach($itinerary->mrf_request->revisions as $mrfRevision) {
                    $this->deleteMRFItineraryFiles($mrfRevision->itineraries, false);
                }
            }
        };

        return true;
    }
}
