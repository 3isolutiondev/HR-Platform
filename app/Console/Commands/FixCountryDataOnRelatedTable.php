<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;

class FixCountryDataOnRelatedTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'country-data:fix';//country-experience:fix

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
    public function handle() {

        DB::table('p11_country_profile')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_education_schools')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );
        
        DB::table('p11_legal_permanent_residence_status')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_country_experiences')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_education_schools')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_education_universities')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_employment_records')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        // DB::table('p11_legal_permanent_residence_status')->where('country_id', 225)
        //     ->update(
        //         array(
        //             'country_id'=>109
        //         )
        //     );

        DB::table('p11_professional_societies')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_references')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_relatives_employed_by_public_int_org')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_submitted_application_in_un')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );
        
        DB::table('hr_tor')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('immap_offices')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('jobs')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );
        
        DB::table('p11_addresses')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_birth_nationalities')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_country_experiences')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );
        
        DB::table('p11_legal_permanent_residence_status_countries')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );

        DB::table('p11_present_nationalities')->where('country_id', 225)
            ->update(
                array(
                    'country_id'=>109
                )
            );
        
        DB::table('profiles')->where('country_residence_id', 225)
            ->update(
                array(
                    'country_residence_id'=>109
                )
            );
        
        DB::table('countries')->where('id', '=', 225)->delete();

        // DB::table('p11_present_nationalities')->where('country_id', 225)
        //     ->update(
        //         array(
        //             'country_id'=>109
        //         )
        //     );
    }
}
