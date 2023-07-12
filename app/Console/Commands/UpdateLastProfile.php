<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateLastProfile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile-last-update:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating updated_at column based on other relation on profile page';

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
        // P11 COMPLETE AJA
        $users = User::where('p11Completed',1)->get();
        foreach($users as $user) {

            $profile = $user->profile;
            $updated_at = $profile->updated_at;

            // CEK PROFILE PHOTO
            $media = $profile->getMedia('photos')->first();
            if(!empty($media)) {
                if ($media->updated_at > $updated_at ) {
                    $updated_at = $media->updated_at;
                }
            }

            // CEK PHONE NUMBER
            if(!empty($profile->phones)) {
                foreach($profile->phones as $phone) {
                    if ($phone->updated_at > $updated_at) {
                        $updated_at = $phone->updated_at;
                    }
                }
            }

            // CEK P11 EMPLOYMENT RECORDS
            if(!empty($profile->p11_employment_records)) {
                foreach($profile->p11_employment_records as $employment_record) {
                    if ($employment_record->updated_at > $updated_at && $employment_record->unitlNow == 0) {
                        $updated_at = $employment_record->updated_at;
                    }

                    if ($employment_record->untilNow == 1 && $employment_record->created_at > $updated_at) {
                        $updated_at = $employment_record->created_at;
                    }
                }
            }

            // CEK P11 EDUCATION UNIVERSITIES
            if(!empty($profile->p11_education_universities)) {
                foreach($profile->p11_education_universities as $university) {
                    if ($university->updated_at > $updated_at && $university->untilNow == 0) {
                        $updated_at = $university->updated_at;
                    }

                    if ($university->unitlNow == 1 && $university->created_at > $updated_at) {
                        $updated_at = $university->created_at;
                    }
                }
            }

            // CEK P11 LANGUAGES
            if(!empty($profile->p11_languages)) {
                foreach($profile->p11_languages as $language) {
                    if ($language->updated_at > $updated_at) {
                        $updated_at = $language->updated_at;
                    }
                }
            }

            // CEK P11 SKILLS
            if(!empty($profile->p11_skills)) {
                foreach($profile->p11_skills as $skill) {
                    if ($skill->updated_at > $updated_at) {
                        $updated_at = $skill->updated_at;
                    }
                }
            }

            // CEK P11 TRAININGS / SCHOOLS
            if(!empty($profile->p11_education_schools)) {
                foreach($profile->p11_education_schools as $school) {
                    if ($school->updated_at > $updated_at) {
                        $updated_at = $school->updated_at;
                    }
                }
            }

            // CEK P11 PORTFOLIO
            if(!empty($profile->p11_portfolios)) {
                foreach($profile->p11_portfolios as $portfolio) {
                    if ($portfolio->updated_at > $updated_at) {
                        $updated_at = $portfolio->updated_at;
                    }
                }
            }

            // CEK P11 PUBLICATION
            if(!empty($profile->p11_publications)) {
                foreach($profile->p11_publications as $publication) {
                    if ($publication->updated_at > $updated_at) {
                        $updated_at = $publication->updated_at;
                    }
                }
            }

            // CEK P11 REFERENCE LIST
            if(!empty($profile->p11_references)) {
                foreach($profile->p11_references as $reference) {
                    if ($reference->updated_at > $updated_at) {
                        $updated_at = $reference->updated_at;
                    }
                }
            }

            // CEK P11 WORKED WITH IMMAP
            if(!empty($profile->p11_submitted_application_for_un)) {
                foreach($profile->p11_submitted_application_for_un as $workedWithIMMAP) {
                    if ($workedWithIMMAP->updated_at > $updated_at) {
                        $updated_at = $workedWithIMMAP->updated_at;
                    }
                }
            }

            // CEK P11 RELATIVE EMPLOY WITH IMMAP
            if(!empty($profile->p11_relatives_employed_by_int_org)) {
                foreach($profile->p11_relatives_employed_by_int_org as $relative) {
                    if ($relative->updated_at > $updated_at) {
                        $updated_at = $relative->updated_at;
                    }
                }
            }

            // CEK P11 PERMANENT CIVIL SERVANT
            if(!empty($profile->p11_permanent_civil_servants)) {
                foreach($profile->p11_permanent_civil_servants as $civil_servant) {
                    if ($civil_servant->updated_at > $updated_at && $civil_servant->is_now == 0) {
                        $updated_at = $civil_servant->updated_at;
                    }

                    if ($civil_servant->is_now == 1 && $civil_servant->created_at > $updated_at) {
                        $updated_at = $civil_servant->created_at;
                    }
                }
            }

            // CEK CV
            $cv = $profile->p11_cv->getMedia('cv_files')->first();
            if($cv) {
                if ($cv->updated_at > $updated_at) {
                    $updated_at = $cv->updated_at;
                }
            }

            // CEK P11 AREAS OF EXPERTISE
            if(!empty($profile->p11_field_of_works)) {
                foreach($profile->p11_field_of_works as $field_of_work) {
                    if ($field_of_work->updated_at > $updated_at) {
                        $updated_at = $field_of_work->updated_at;
                    }
                }
            }

            // CEK P11 PRESENT NATIONALITIES
            // if (!empty($profile->present_nationalities)) {
            //     foreach($profile->present_nationalities as $nationality) {
            //         dump($nationality->pivot->created_at);
            //     }
            // } // Karena ga pake timestamp

            if ($profile->updated_at < $updated_at) {
                //dump($updated_at);
                $profile->fill(['updated_at' => $updated_at])->save();
            }





        }
    }
}
