<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use App\Models\Country;
use App\Models\Language;
use App\Models\Attachment;
use App\Models\P11\P11EmploymentRecord;
// use Faker\Generator as Faker;
use Faker\Factory as Faker;

// CREATE USER AND PROFILE
class UserForTestingSeeder extends Seeder
{
    protected function updateSkill($profile, $skillId) {
        $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skillId) {
            $query->where('skill_id', $skillId);
        })->first();

        if (!empty($p11_employment_records_skills)) {
            $from = new DateTime($p11_employment_records_skills['min_from']);
            $to = new DateTime($p11_employment_records_skills['max_to']);
            $interval = $to->diff($from);

            $profile_skill =  $profile->p11_skills()->where('skill_id', $skillId)->first();
            if (!empty($profile_skill)) {
                $profile_skill->fill([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                ])->save();
            } else {
                 $profile->p11_skills()->create([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'skill_id' => $skillId,
                    'proficiency' => rand(1,5)
                ]);
            }
        }
    }

    protected function updateSector($profile, $sectorId) {
        $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sectorId) {
            $query->where('sector_id', $sectorId);
        })->first();

        if (!empty($p11_employment_records_sectors)) {
            $from = new DateTime($p11_employment_records_sectors['min_from']);
            $to = new DateTime($p11_employment_records_sectors['max_to']);
            $interval = $to->diff($from);

            $profile_sector = $profile->p11_sectors()->where('sector_id', $sectorId)->first();
            if (!empty($profile_sector)) {
                $profile_sector->fill([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y
                ])->save();
            } else {
                $profile->p11_sectors()->create([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'sector_id' => $sectorId,
                ]);
            }
        }
    }

    protected function createCompleteUser(Profile $profile, Country $country) {
        $profile->present_nationalities()->attach($country->id, ['time' => 'present']);

        $profile->phones()->create([
            'phone' => $country->phone_code . '-' . rand(100000000,999999999),
            'is_primary' => 1
        ]);

        $fieldofworkId = rand(1,40);
        $profile->field_of_works()->attach($fieldofworkId);
        $profile->field_of_works()->attach($fieldofworkId+1);

        $langCount = rand(1,3);

        for($i = 1; $i <= $langCount; $i++) {
            $lang = Language::findOrFail($i + rand(1,100));
            if ($i == 1) {
                $profile->languages()->attach($lang->id, ['is_mother_tongue' => 1, 'language_level_id' => 3]);
            } else {
                $profile->languages()->attach($lang->id, ['is_mother_tongue' => 0, 'language_level_id' => rand(1,2)]);
            }
        }
        $faker = Faker::create();

        $educations = [
            [
                'name' => $faker->company,
                'place' => $faker->city,
                'attended_from' => date_format(date_create('2000-03-01'), 'Y-m-d'),
                'attended_to' => date_format(date_create('2004-02-01'), 'Y-m-d'),
                'degree' => $faker->sentence(4, true),
                'study' => NULL,
                'country_id' => rand(1,200),
                'degree_level_id' => 2,
                'untilNow' => 0
            ],
            [
                'name' => $faker->company,
                'place' => $faker->city,
                'attended_from' => date_format(date_create('2006-03-01'), 'Y-m-d'),
                'attended_to' => date_format(date_create('2008-02-01'), 'Y-m-d'),
                'degree' => $faker->sentence(4, true),
                'study' => NULL,
                'country_id' => rand(1,200),
                'degree_level_id' => 3,
                'untilNow' => 0
            ],
            [
                'name' => $faker->company,
                'place' => $faker->city,
                'attended_from' => date_format(date_create('2010-03-01'), 'Y-m-d'),
                'attended_to' => date_format(date_create('2012-02-01'), 'Y-m-d'),
                'degree' => $faker->sentence(4, true),
                'study' => NULL,
                'country_id' => rand(1,200),
                'degree_level_id' => 4,
                'untilNow' => 0
            ]
        ];

        $educationCount = rand(0,2);

        for($i = 0; $i <= $educationCount; $i++) {
            $profile->p11_education_universities()->create($educations[$i]);
        }

        $supervised = rand(0, 200);

        $employment = [
            'employer_name' => $faker->company,
            'employer_address' => $faker->address,
            'from' => date_format(date_create('2013-01-01'), 'Y-m-d'),
            'to' => date_format(date_create('2017-01-01'), 'Y-m-d'),
            'job_title' => $faker->jobTitle,
            'job_description' => $faker->text(),
            'business_type' => $faker->catchPhrase,
            'number_of_employees_supervised' => $supervised == 0 ? NULL : $supervised,
            'country_id' => rand(1,200),
            'untilNow' => 0,
            'profile_id' => $profile->id
        ];

        $emp_record = P11EmploymentRecord::create($employment);
        $emp_record->employment_skills()->attach([1,2,3,4,5]);
        $emp_record->employment_sectors()->attach([1,2,3]);

        for ($i = 1; $i < 6; $i++) {
            $this->updateSkill($profile, $i);
        }

        for ($i = 1; $i < 4; $i++) {
            $this->updateSector($profile, $i);
        }

        $reference_person = [
            'full_name' => $faker->name,
            'country_id' => $country->id,
            'phone' => $country->phone_code . '-' . rand(100000000,999999999),
            'email' => $faker->email,
            'organization' => $faker->company,
            'job_position' => $faker->jobTitle
        ];

        $profile->p11_references()->create($reference_person);

        $attachment = Attachment::create(['uploader_id' => $profile->user->id]);
        $file = resource_path('pdf/cv-test.pdf');
        $attachment->addMedia($file)->preservingOriginal()->toMediaCollection('cv_files', 's3');

        $profile->fill(['cv_id' => $attachment->id])->save();
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // JUST REGISTERED USER
        $registered_user = User::create([
            'first_name' => 'registered',
            'middle_name' => NULL,
            'family_name' => 'user',
            'full_name' => 'registered user',
            'email' => 'registereduser@mail.com',
            'password' => Hash::make('registereduser123!'),
            'p11Status' => '{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0, "form9": 0, "form10": 0, "form11": 0}',
            'last_login_at' => date('Y-m-d H:i:s')
        ]);

        $registered_user->assignRole('User');

        $registered_user_profile = Profile::create([
            'first_name' => $registered_user->first_name,
            'middle_name' => $registered_user->middle_name,
            'family_name' => $registered_user->family_name,
            'email' => $registered_user->email,
            'user_id' => $registered_user->id,
            'gender' => 2,
            'selected_roster_process' => json_encode([])
        ]);

        // VERIFIED USER AFTER REGISTER
        $verified_user = User::create([
            'first_name' => 'verified',
            'middle_name' => NULL,
            'family_name' => 'user',
            'full_name' => 'verified user',
            'email' => 'verifieduser@mail.com',
            'password' => Hash::make('verifieduser123!'),
            'p11Status' => '{"form1": 0, "form2": 0, "form3": 0, "form4": 0, "form5": 0, "form6": 0, "form7": 0, "form8": 0, "form9": 0, "form10": 0, "form11": 0}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s')
        ]);

        $verified_user->assignRole('User');

        $verified_user_profile = Profile::create([
            'first_name' => $verified_user->first_name,
            'middle_name' => $verified_user->middle_name,
            'family_name' => $verified_user->family_name,
            'email' => $verified_user->email,
            'user_id' => $verified_user->id,
            'gender' => 2,
            'selected_roster_process' => json_encode([])
        ]);

        // PROFILE COMPLETED USER
        $completed_user_profile = User::create([
            'first_name' => 'completed',
            'middle_name' => 'user',
            'family_name' => 'profile',
            'full_name' => 'completed user profile',
            'email' => 'completeduserprofile@mail.com',
            'password' => Hash::make('completeduserprofile123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'p11Completed' => 1
        ]);

        $completed_user_profile->assignRole('User');

        $cu_country = Country::findOrFail(rand(1,200));

        $cu_profile = Profile::create([
            'first_name' => $completed_user_profile->first_name,
            'middle_name' => $completed_user_profile->middle_name,
            'family_name' => $completed_user_profile->family_name,
            'email' => $completed_user_profile->email,
            'user_id' => $completed_user_profile->id,
            'gender' => 1,
            'country_residence_id' => $cu_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($cu_profile, $cu_country);

        // IMMAPER USER
        $immaper = User::create([
            'first_name' => 'immaper',
            'middle_name' => NULL,
            'family_name' => 'user',
            'full_name' => 'immaper user',
            'email' => 'immaperuser@mail.com',
            'password' => Hash::make('immaperuser123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'immaperuser@organization.org',
            'p11Completed' => 1
        ]);

        $immaper->assignRole('User');

        $immaper_country = Country::findOrFail(rand(1,200));

        $immaper_profile = Profile::create([
            'first_name' => $immaper->first_name,
            'middle_name' => $immaper->middle_name,
            'family_name' => $immaper->family_name,
            'email' => $immaper->email,
            'user_id' => $immaper->id,
            'gender' => 1,
            'country_residence_id' => $immaper_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'immaperuser@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'Finance Officer',
            'duty_station' => "Washington DC",
            'line_manager' => 'Finance Manager',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 0,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($immaper_profile, $immaper_country);

        // Global Security USER
        $global_security = User::create([
            'first_name' => 'Global',
            'middle_name' => NULL,
            'family_name' => 'Security',
            'full_name' => 'Global Security',
            'email' => 'globalsecurity@mail.com',
            'password' => Hash::make('globalsecurity123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'globalsecurity@organization.org',
            'p11Completed' => 1
        ]);

        $global_security->assignRole('Global Security');

        $global_security_country = Country::findOrFail(rand(1,200));

        $global_security_profile = Profile::create([
            'first_name' => $global_security->first_name,
            'middle_name' => $global_security->middle_name,
            'family_name' => $global_security->family_name,
            'email' => $global_security->email,
            'user_id' => $global_security->id,
            'gender' => 1,
            'country_residence_id' => $global_security_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'globalsecurity@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'Global Security Advisor',
            'duty_station' => "Washington DC",
            'line_manager' => 'CEO',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 0,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($global_security_profile, $global_security_country);

        // National Security USER
        $national_security = User::create([
            'first_name' => 'National',
            'middle_name' => NULL,
            'family_name' => 'Security',
            'full_name' => 'National Security',
            'email' => 'nationalsecurity@mail.com',
            'password' => Hash::make('nationalsecurity123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'nationalsecurity@organization.org',
            'p11Completed' => 1
        ]);

        $national_security->assignRole('National Security');

        $national_security_country = Country::findOrFail(rand(1,200));

        $national_security_profile = Profile::create([
            'first_name' => $national_security->first_name,
            'middle_name' => $national_security->middle_name,
            'family_name' => $national_security->family_name,
            'email' => $national_security->email,
            'user_id' => $national_security->id,
            'gender' => 1,
            'country_residence_id' => $national_security_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'nationalsecurity@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'National Security Officer',
            'duty_station' => "Jordan",
            'line_manager' => 'Country Director',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 0,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($national_security_profile, $national_security_country);

        // CEOs and Operations Managers USER
        $ceo = User::create([
            'first_name' => 'immap',
            'middle_name' => NULL,
            'family_name' => 'ceo',
            'full_name' => 'immap ceo',
            'email' => 'immapceo@mail.com',
            'password' => Hash::make('immapceo123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'immapceo@organization.org',
            'p11Completed' => 1
        ]);

        $ceo->assignRole('CEOs and Operations Managers');

        $ceo_country = Country::findOrFail(rand(1,200));

        $ceo_profile = Profile::create([
            'first_name' => $ceo->first_name,
            'middle_name' => $ceo->middle_name,
            'family_name' => $ceo->family_name,
            'email' => $ceo->email,
            'user_id' => $ceo->id,
            'gender' => 1,
            'country_residence_id' => $ceo_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'immapceo@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'CEO',
            'duty_station' => "Washington DC",
            'line_manager' => 'Board of Director',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 1,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($ceo_profile, $ceo_country);

        // SBPP MANAGER
        $sbpp_manager = User::create([
            'first_name' => 'sbpp',
            'middle_name' => NULL,
            'family_name' => 'manager',
            'full_name' => 'sbpp manager',
            'email' => 'sbppmanager@mail.com',
            'password' => Hash::make('sbppmanager123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'sbppmanager@organization.org',
            'p11Completed' => 1
        ]);

        $sbpp_manager->assignRole('SBPP Manager');

        $sbpp_manager_country = Country::findOrFail(rand(1,200));

        $sbpp_manager_profile = Profile::create([
            'first_name' => $sbpp_manager->first_name,
            'middle_name' => $sbpp_manager->middle_name,
            'family_name' => $sbpp_manager->family_name,
            'email' => $sbpp_manager->email,
            'user_id' => $sbpp_manager->id,
            'gender' => 1,
            'country_residence_id' => $sbpp_manager_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'sbppmanager@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'SBPP Manager',
            'duty_station' => "Washington DC",
            'line_manager' => 'CEO',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 1,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($sbpp_manager_profile, $sbpp_manager_country);

        // MANAGER USER
        $manager = User::create([
            'first_name' => 'immap',
            'middle_name' => NULL,
            'family_name' => 'manager',
            'full_name' => 'immap manager',
            'email' => 'immapmanager@mail.com',
            'password' => Hash::make('immapmanager123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'immapmanager@organization.org',
            'p11Completed' => 1
        ]);

        $manager->assignRole('Manager');

        $manager_country = Country::findOrFail(rand(1,200));

        $manager_profile = Profile::create([
            'first_name' => $manager->first_name,
            'middle_name' => $manager->middle_name,
            'family_name' => $manager->family_name,
            'email' => $manager->email,
            'user_id' => $manager->id,
            'gender' => 1,
            'country_residence_id' => $manager_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'immapmanager@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => 'Manager',
            'duty_station' => "Washington DC",
            'line_manager' => 'Country Director',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 1,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($manager_profile, $manager_country);

        // ADMIN USER
        $admin = User::create([
            'first_name' => 'immap',
            'middle_name' => NULL,
            'family_name' => 'admin',
            'full_name' => 'immap admin',
            'email' => 'immapadmin@mail.com',
            'password' => Hash::make('immapadmin123!'),
            'p11Status' => '{"form1": 1, "form2": 1, "form3": 1, "form4": 1, "form5": 1, "form6": 1, "form7": 1, "form8": 1, "form9": 1, "form10": 1, "form11": 1}',
            'last_login_at' => date('Y-m-d H:i:s'),
            'email_verified_at' => date('Y-m-d H:i:s'),
            'immap_email' => 'immapadmin@organization.org',
            'p11Completed' => 1
        ]);

        $admin->assignRole('Admin');

        $admin_country = Country::findOrFail(rand(1,200));

        $admin_profile = Profile::create([
            'first_name' => $admin->first_name,
            'middle_name' => $admin->middle_name,
            'family_name' => $admin->family_name,
            'email' => $admin->email,
            'user_id' => $admin->id,
            'gender' => 1,
            'country_residence_id' => $admin_country->id,
            'legal_permanent_residence_status' => 0,
            'legal_step_changing_present_nationality' => 0,
            'relatives_employed_by_public_international_organization' => 0,
            'accept_employment_less_than_six_month' => 0,
            'previously_submitted_application_for_UN' => 0,
            'has_publications' => 0,
            'objections_making_inquiry_of_present_employer' => 0,
            'permanent_civil_servant' => 0,
            'immap_email' => 'immapadmin@organization.org',
            'verified_immaper' => 1,
            'is_immaper' => 1,
            'is_immap_inc' => 1,
            'is_immap_france' => 0,
            'job_title' => '3iSolution Careers Admin',
            'duty_station' => "Washington DC",
            'line_manager' => 'Senior Technical Advisor',
            'start_of_current_contract' => '2020-01-01',
            'end_of_current_contract' => '2020-12-31',
            'immap_contract_international' => 1,
            'disclaimer_agree' => 1,
            'disclaimer_open' => 0,
            'immap_office_id' => 12,
            'selected_roster_process' => json_encode([])
        ]);

        $this->createCompleteUser($admin_profile, $admin_country);
    }
}
