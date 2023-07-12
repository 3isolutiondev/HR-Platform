<?php

use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\MRFRequestItinerary;
use App\Models\SecurityModule\MRFRequestItineraryRevision;
use App\Models\SecurityModule\MRFRequestRevision;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTravellingByToTableMrfRequestItineraries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
            $table->string('travelling_by')->nullable()->after('to_city');
        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->string('travelling_by')->nullable()->after('to_city');
        });

        $this->updateDataOnUp();
    }

    private function updateDataOnUp()
    {
        MRFRequest::where('transportation_type','road-travel')->update([
            'transportation_type' => 'ground-travel'
        ]);

        MRFRequestRevision::where('transportation_type','road-travel')->update([
           'transportation_type' => 'ground-travel'
        ]);

       MRFRequestItinerary::join('security_module_mrf_requests','security_module_mrf_request_itineraries.mrf_request_id','=','security_module_mrf_requests.id')
                          ->where('security_module_mrf_requests.transportation_type','ground-travel')
                          ->update(['travelling_by' => 'Vehicle']);

       MRFRequestItineraryRevision::join('security_module_mrf_requests_revisions','security_module_mrf_request_itineraries_revisions.mrf_request_revision_id','=','security_module_mrf_requests_revisions.id')
                                   ->where('security_module_mrf_requests_revisions.transportation_type','ground-travel')
                                   ->update(['travelling_by' => 'Vehicle']);
    
    }       

    private function updateDataOnDown()
    {
       MRFRequest::where('transportation_type','ground-travel')->update([
            'transportation_type' => 'road-travel'
        ]);

       MRFRequestRevision::where('transportation_type','ground-travel')->update([
        'transportation_type' => 'road-travel'
        ]);
    }       

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
            $table->dropColumn('travelling_by');
        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->dropColumn('travelling_by');
        });

        $this->updateDataOnDown();
    }
}
