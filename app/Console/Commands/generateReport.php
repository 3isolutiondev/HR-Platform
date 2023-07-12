<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use App\Models\SecurityModule\MRFRequest;
use App\Models\SecurityModule\TARRequest;
use App\Models\Country;
use App\Traits\iMMAPerTrait;

class generateReport extends Command
{
    use iMMAPerTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Report';

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
        $totalUser = count(User::all());
        $totalCompletedUser = count(User::where('p11Completed', 1)->get());
        $totaliMMAPers = count($this->iMMAPerFromProfileQuery(Profile::select('*'))->get());

        dump('Total User: '. $totalUser);
        dump('Total Completed User: '. $totalCompletedUser);
        dump('Total iMMAPer: '. $totaliMMAPers);

        $roles = Role::all();

        foreach($roles as $role) {
            $total = count($this->iMMAPerFromUserQuery(User::role($role->name))->get());

            dump('Total iMMAPer ('.$role->name.'): '. $total);
            dump('Percentage of iMMAPer ('.$role->name.') with total iMMAPer: '. round($total / $totaliMMAPers * 100, 2) . '%');
            dump('Percentage of iMMAPer ('.$role->name.') with total Completed User: '. round($total / $totalCompletedUser * 100, 2) . '%');
            dump('Percentage of iMMAPer ('.$role->name.') with total User: '. round($total / $totalUser * 100, 2) . '%' );
        }

        $approvedINTRequest = TARRequest::where('status', 'approved')->get();
        $approvedDOMRequest = MRFRequest::where('status', 'approved')->get();
        $approvedDOMAIRRequest = MRFRequest::where('status', 'approved')->where('transportation_type', 'air-travel')->get();
        $approvedDOMGROUNDRequest = MRFRequest::where('status', 'approved')->where('transportation_type', 'ground-travel')->get();

        dump("Approved International Request: " . count($approvedINTRequest));
        dump("Approved Domestic Request: " . count($approvedDOMRequest));
        dump("Approved Domestic Request (Air Travel): " . count($approvedDOMAIRRequest));
        dump("Approved Domestic Request (Ground Travel): " . count($approvedDOMGROUNDRequest));

        $listOfApprovedDomesticTravel = collect($approvedDOMRequest->pluck('country_id')->all());
        $listOfApprovedDomesticTravel = $listOfApprovedDomesticTravel->unique()->values()->all();

        foreach($listOfApprovedDomesticTravel as $countryId) {
            $country = Country::find($countryId);
            dump("Approved Domestic Travel (". $country->name."): " . count(MRFRequest::where('status', 'approved')->where('country_id', $countryId)->get()));
        }

    }
}
