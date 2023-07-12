<?php

namespace App\Console\Commands;

use App\Mail\SecurityModule\CheckInReminderEmail;
use App\Mail\SecurityModule\CheckInReminderErrorReportEmail;
use App\Mail\SecurityModule\CheckInReminderReportEmail;
use Illuminate\Console\Command;
use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\TARRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Traits\iMMAPerTrait;
class CheckInReminder extends Command
{
    use iMMAPerTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trip:check-in-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check in reminder for all trips which the travelling date matches with the current date';

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
        Log::info('Check in reminder trips Script run at ' . date('Y-m-d H:i:s'));

        $today = Carbon::now()->format('Y-m-d');

        $tar = $this->iMMAPersWithValideContractQuery(TARRequest::where('status', 'approved'))->whereHas('itineraries', function ($query) use ($today) {
            $query->where('date_travel', $today)->orWhere('return_date_travel', $today);
        })->get();

        $mrf = $this->iMMAPersWithValideContractQuery(MRFRequest::where('status', 'approved'))->whereHas('itineraries', function ($query) use ($today) {
            $query->where('date_time', $today)->orWhere('return_date_time', $today);
        })->get();

        $this->info("\nSending Check in Reminder Email...");
        $progressBar = $this->output->createProgressBar(count($tar) + count($mrf));
        $progressBar->start();

        $emailsFailed = [];
        $emailsSent = [];

        foreach ($tar as $key => $trip) {
            $dataAsc =  $trip->itineraries()->orderBy('order', 'asc')->first();
            $dataDesc = $trip->itineraries()->orderBy('order', 'desc')->first();

            if ($trip->user->profile->under_sbp_program == true || $trip->risk_level == 'High' || $trip->risk_level == 'Moderate') {
                $iMMAPerEmail = $trip->user->profile->immap_email;
                $iMMAPerName = $trip->user->full_name;
                $trip_type = 'INT';

                Mail::to($iMMAPerEmail)->send(new CheckInReminderEmail($iMMAPerName, $trip_type, $trip->id, $trip->name));

                if (Mail::failures()) {
                    array_push($emailsFailed, $trip->name);
                    Log::error("Send Email Check In Reminder Failed for $trip->name");
                } else {
                    array_push($emailsSent, $trip->name);
                }

                $progressBar->advance();
                sleep(3);
            }
        }

        foreach ($mrf as $key => $trip) {
            $dataAsc =  $trip->itineraries()->orderBy('order', 'asc')->first();
            $dataDesc = $trip->itineraries()->orderBy('order', 'desc')->first();

            if ($trip->user->profile->under_sbp_program == true || $trip->risk_level == 'High' || $trip->risk_level == 'Moderate') {
                $iMMAPerEmail = $trip->user->profile->immap_email;
                $iMMAPerName = $trip->user->full_name;
                $trip_type = 'DOM';

                Mail::to($iMMAPerEmail)->send(new CheckInReminderEmail($iMMAPerName, $trip_type, $trip->id, $trip->name));

                if (Mail::failures()) {
                    array_push($emailsFailed, $trip->name);
                    Log::error("Send Email Check in Reminder Failed for $trip->name");
                } else {
                    array_push($emailsSent, $trip->name);
                }

                $progressBar->advance();
                sleep(3);
            }
        }

        $progressBar->finish();
        $this->info("\nDone.");

        if (count($emailsFailed) > 0) {
            $this->info("\nStart sending error report email to developer...");
            Mail::to(env('SCRIPT_MAIL_TO'))->send(new CheckInReminderErrorReportEmail($emailsFailed));
            $this->info("\nDone.");

            return false;
        }

        $this->info("\nStart sending report email to developer...");
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new CheckInReminderReportEmail($emailsSent));
        $this->info("\nDone.");

        Log::info('Finished ' . date('Y-m-d H:i:s'));

        return true;
    }
}
