<?php

namespace App\Console\Commands;

use App\Mail\SecurityModule\FlightNumberReminderEmail;
use App\Mail\SecurityModule\FlightNumberReminderErrorReportMail;
use App\Mail\SecurityModule\FlightNumberReminderReportMail;
use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\TARRequest;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FlightNumberReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:flight-number';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reminder iMMMAPers to fill their flight numbers for the trip';

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
        Log::info('Flight Number Reminder Script run at ' . date('Y-m-d H:i:s'));
        $todayDate = Carbon::now()->format('Y-m-d');

        $tarOneWayAndMultiLocationTrips = TARRequest::whereIn('status', ['submitted', 'revision', 'approved'])->whereIn('travel_type', ['one-way-trip', 'multi-location'])->whereHas('user', function ($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries', function ($query) {
            $query->whereNull('flight_number');
        })->get();

        $tarRoundTrips = TARRequest::whereIn('status', ['submitted', 'revision', 'approved'])->where('travel_type', 'round-trip')->whereHas('user', function ($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries', function ($query) {
            $query->whereNull('flight_number_outbound_trip')->orWhereNull('flight_number_return_trip');
        })->get();

        $tar = $tarRoundTrips->concat($tarOneWayAndMultiLocationTrips);

        $mrfOneWayAndMultiLocationTrips = MRFRequest::whereIn('status', ['submitted', 'revision', 'approved'])->whereIn('travel_type', ['one-way-trip', 'multi-location'])->where('transportation_type', 'air-travel')->whereHas('user', function ($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries', function ($query) {
            $query->whereNull('flight_number');
        })->get();

        $mrfRoundTrips = MRFRequest::whereIn('status', ['submitted', 'revision', 'approved'])->where('travel_type', 'round-trip')->where('transportation_type', 'air-travel')->whereHas('user', function ($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries', function ($query) {
            $query->whereNull('flight_number_outbound_trip')->orWhereNull('flight_number_return_trip');
        })->get();

        $mrfAirAndGroundTrips = MRFRequest::whereIn('status', ['submitted', 'revision', 'approved'])->where('transportation_type', 'air-and-ground-travel')->whereHas('user', function ($query) {
            $query->whereIn('status', ['Active', 'Inactive']);
        })->whereHas('itineraries', function ($query) {
            $query->whereNull('flight_number')->where('travelling_by', 'Flight');
        })->get();

        $mrf = $mrfRoundTrips->concat($mrfOneWayAndMultiLocationTrips);
        $mrf = $mrf->concat($mrfAirAndGroundTrips);

        $this->info("\nSending Flight Number Reminder Email...");
        $progressBar = $this->output->createProgressBar(count($tar) + count($mrf));
        $progressBar->start();

        $emailsFailed = [];
        $emailsSent = [];

        foreach ($tar as $key => $trip) {
            $dataAsc =  $trip->itineraries()->orderBy('order','asc')->first();
            $dataDesc = $trip->itineraries()->orderBy('order','desc')->first();
            if($trip->user->profile->under_sbp_program == true || $trip->risk_level == 'High' || $trip->risk_level == 'Moderate'){
                $beforeTripStart = Carbon::parse($dataAsc->date_travel)->subDays(1)->format('Y-m-d');

                if ($beforeTripStart == $todayDate) {
                    $iMMAPerName = $trip->user->full_name;
                    $iMMAPerEmail = $trip->user->profile->immap_email;
                    $trip_type = 'INT';
                    $status = $trip->status;
                    Mail::to($iMMAPerEmail)->send(new FlightNumberReminderEmail($iMMAPerName, $trip_type, $trip->id, $trip->name, $status));
    
                    if (Mail::failures()) {
                        array_push($emailsFailed, $trip->name);
                        Log::error("Send Email Flight Number Reminder Failed for $trip->name");
                    }else{
                        array_push($emailsSent, $trip->name);
                    }
                }
                $progressBar->advance();
                sleep(3);
            }
        }

        foreach ($mrf as $key => $trip) {
            $dataAsc =  $trip->itineraries()->orderBy('order','asc')->first();
            $dataDesc = $trip->itineraries()->orderBy('order','desc')->first();
            if($trip->user->profile->under_sbp_program == true || $trip->risk_level == 'High' || $trip->risk_level == 'Moderate'){
                $beforeTripStart = Carbon::parse($dataAsc->date_time)->subDays(1)->format('Y-m-d');

                if ($beforeTripStart == $todayDate) {
                    $iMMAPerName = $trip->user->full_name;
                    $iMMAPerEmail = $trip->user->profile->immap_email;
                    $trip_type = 'DOM';
                    $status = $trip->status;
                    Mail::to($iMMAPerEmail)->send(new FlightNumberReminderEmail($iMMAPerName, $trip_type, $trip->id, $trip->name, $status));
    
                    if (Mail::failures()) {
                        array_push($emailsFailed, $trip->name);
                        Log::error("Send Email Flight Number Reminder Failed for $trip->name");
                    }else{
                        array_push($emailsSent, $trip->name);
                    }
                }
    
                $progressBar->advance();
                sleep(3);
            }
        }

        $progressBar->finish();
        $this->info("\nDone.");

        if (count($emailsFailed) > 0) {
            $this->info("\nStart sending error report email to developer...");
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new FlightNumberReminderErrorReportMail($emailsFailed));
            $this->info("\nDone.");

            return false;
        }

        $this->info("\nStart sending report email to developer...");
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new FlightNumberReminderReportMail($emailsSent));
        $this->info("\nDone.");

        Log::info('Finished ' . date('Y-m-d H:i:s'));

        return true;
    }
}
