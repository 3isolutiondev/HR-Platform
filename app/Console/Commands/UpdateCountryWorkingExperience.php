<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;

use Illuminate\Support\Facades\DB;

class UpdateCountryWorkingExperience extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'country-experience:fix-update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        $profiles = Profile::all();
        foreach($profiles as $profile) {
            // $profile = Profile::findOrFail(1435);
            $country_ids = $profile->p11_employment_records->pluck('country_id')->toArray();

            if (count($country_ids) > 0) {
                $countryList = array_unique($country_ids);
                foreach($countryList as $country_id) {
                    $record_in_countries = $profile->p11_employment_records()->where('country_id', $country_id)->get();

                    $exp_years = 0;
                    $exp_months = 0;
                    $exp_days = 0;

                    if (count($record_in_countries) > 0) {
                        foreach($record_in_countries as $expRecord) {
                            $from = date_create($expRecord->from);
                            $to = date_create($expRecord->to);
                            $interval = date_diff($to, $from);

                            $exp_years = $exp_years + $interval->y;
                            $exp_months = $exp_months + ($interval->m + ( $interval->y * 12 ));
                            $exp_days = $exp_days + $interval->days;
                        }

                        $p11_country_experiences = $profile->whereHas('p11_country_of_works', function($query) use ($profile, $country_id) {
                            $query->where('profile_id', $profile->id)->where('country_id', $country_id);
                        })->get();


                        if (count($p11_country_experiences) == 0) {
                            $p11_country_experience_saved = $profile->country_of_works()->attach($country_id, [
                                'years' => $exp_years,
                                'months' => $exp_months,
                                'days' => $exp_days
                            ]);
                        } else {
                            $p11_country_experience_updated = $profile->country_of_works()->updateExistingPivot($country_id, [
                                'years' => $exp_years,
                                'months' => $exp_months,
                                'days' => $exp_days
                            ]);
                        }
                    }

                }
                $country_exp = $profile->p11_country_of_works->pluck('country_id')->toArray();
                $country_diff = array_diff($country_exp, $countryList);
                if (count($country_diff) > 0) {
                    $profile->country_of_works()->detach($country_diff);
                }
            } else {
                $profile->country_of_works()->detach();
            }
        }
    }

    // protected function saveWorkExperienceEachCountry($profile, $country_id)
    // {
    //     // $profile = $record->profile;
    //     // $country = $record->country;

    //     $p11_employment_record_countries = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->where('country_id', $country_id)->first();
    //     // dd($p11_employment_record_countries['min_from']);
    //     $from = date_create($p11_employment_record_countries['min_from']);
    //     $to = date_create($p11_employment_record_countries['max_to']);
    //     $interval = date_diff($to, $from);

    //     $years = $interval->y;
    //     $months = $interval->m + ( $interval->y * 12 );
    //     $days = $interval->days;

    //     // $p11_country_experiences = $profile->has('country_of_works')->get();
    //     $p11_country_experiences = $profile->whereHas('p11_country_of_works', function($query) use ($profile, $country_id) {
    //         $query->where('profile_id', $profile->id)->where('country_id', $country_id);
    //     })->get();

    //     if (count($p11_country_experiences) == 0) {
    //         $p11_country_experience_saved = $profile->country_of_works()->attach($country_id, [
    //             'years' => $years,
    //             'months' => $months,
    //             'days' => $days
    //         ]);
    //     } else {
    //         if ($years == 0 && $months == 0 && $days == 0) {
    //             $delete_experience = $profile->country_of_works()->detach($country_id);
    //         } else {
    //             $p11_country_experience_updated = $profile->country_of_works()->updateExistingPivot($country_id, [
    //                 'years' => $years,
    //                 'months' => $months,
    //                 'days' => $days
    //             ]);
    //         }
    //     }
    // }
}
