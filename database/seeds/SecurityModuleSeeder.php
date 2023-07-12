<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use App\Models\Country;
use App\Models\Permission;
use App\Models\Role;
use App\Models\SecurityModule\CriticalMovement;
use App\Models\SecurityModule\TravelPurpose;
use App\Models\SecurityModule\SecurityMeasure;
use App\Models\SecurityModule\MovementState;
use Faker\Factory as Faker;

use App\Traits\BaseSeeder;

class SecurityModuleSeeder extends Seeder
{
    use BaseSeeder;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * Security Module Roles and Permissions
         * */

        // Permissions
        $securityModulePermissions = [
            'Can Make Travel Request',
            'Approve Domestic Travel Request',
            'Approve Global Travel Request',
            'Show Repository',
            'Apply Job',
            'P11 Access'
        ];

        foreach($securityModulePermissions as $permission) {
            $record = Permission::where('name', $permission)->first();
            if (empty($record)) {
                Permission::create(['name' => $permission]);
                dump($permission . ' permission succesfully created');
            } else { dump($permission . ' permission already exist'); }
        }

        // Roles
        $securityModuleRoles = [
            'Global Security Advisor' => [
                'Can Make Travel Request',
                'Approve Domestic Travel Request',
                'Approve Global Travel Request',
                'Show Repository',
                'Apply Job',
                'P11 Access'
            ],
            'National Security Advisor' => [
                'Can Make Travel Request',
                'Approve Domestic Travel Request',
                'Show Repository',
                'Apply Job',
                'P11 Access'
            ]
        ];

        foreach($securityModuleRoles as $role => $permissions) {
            $record = Role::where('name', $role)->first();

            if(empty($record)) {
                $record = Role::create(['name' => $role]);
                dump($role. ' role successfully created');
            } else { dump($role . ' role already exist'); }

            foreach($permissions as $permission) {
                if (!$record->hasPermissionTo($permission)) {
                    $record->givePermissionTo($permission);
                    dump($permission . ' permission successfully assign to '. $role . ' role');
                } else { dump($role . ' role already has '. $permission . ' permission'); }
            }
        }

         // IMMAPER USER
         if (!count(User::where('email','immaperuser@mail.com')->get())) {
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
                'job_title' => 'Developer',
                'duty_station' => "Washington DC",
                'line_manager' => 'CTO',
                'start_of_current_contract' => '2020-01-01',
                'end_of_current_contract' => '2020-12-31',
                'immap_contract_international' => 1,
                'disclaimer_agree' => 1,
                'disclaimer_open' => 0,
                'immap_office_id' => 12,
                'selected_roster_process' => json_encode([])
            ]);

            $this->createCompleteUser($immaper_profile, $immaper_country);
            dump('iMMAPer User Created');
         } else { dump('iMMAPer User Exist'); }

        // Global Security USER
        if (!count(User::where('email','globalsecurity@mail.com')->get())) {
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
            dump('Global Security Advisor Created');
        } else { dump('Global Security Advisor Exist'); }

        // National Security USER
        if (!count(User::where('email','nationalsecurity@mail.com')->get())) {

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
            dump('National Security Officer Created');
        } else { dump('National Security Officer Exist'); }
    }
}
