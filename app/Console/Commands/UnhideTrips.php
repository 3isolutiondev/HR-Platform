<?php

namespace App\Console\Commands;

use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\TARRequest;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;


class UnhideTrips extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trip:unhide-trips';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Unhide all trips which the return date matches with the current week';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Log::info('Unhide trips Script run at '. date('Y-m-d H:i:s'));

        $now = Carbon::now();
        $weekStartDate = $now->startOfWeek(Carbon::SUNDAY)->format('Y-m-d H:i');
        $weekEndDate = $now->endOfWeek(Carbon::SATURDAY)->format('Y-m-d H:i');

        Log::info('Start week => '. $weekStartDate);
        Log::info('End week => '. $weekEndDate);

        $tar = TARRequest::where('status','approved')->where('view_status','hide')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries',function($query) use ($weekStartDate,$weekEndDate){
           $query->whereBetween('return_date_travel', [$weekStartDate, $weekEndDate])
                 ->orWhereBetween('date_travel',[$weekStartDate, $weekEndDate]);
        })->update(['view_status' => 'unhide']);

        $mrf = MRFRequest::where('status','approved')->where('view_status','hide')->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries',function($query) use ($weekStartDate,$weekEndDate){
           $query->whereBetween('return_date_time', [$weekStartDate, $weekEndDate])
                 ->orWhereBetween('date_time',[$weekStartDate, $weekEndDate]);
        })->update(['view_status' => 'unhide']);

        Log::info('Tar count '. $tar);
        Log::info('Mrf count '. $mrf);
        Log::info('Finished '. date('Y-m-d H:i:s'));
    }
}
