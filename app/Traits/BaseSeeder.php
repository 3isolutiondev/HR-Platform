<?php

namespace App\Traits;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Attachment;
use App\Models\Profile;
use App\Models\Country;
use App\Models\Language;
use App\Models\P11\P11EmploymentRecord;

trait BaseSeeder
{
    protected function updateSkill($profile, $skillId) {
        $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skillId) {
            $query->where('skill_id', $skillId);
        })->first();

        if (!empty($p11_employment_records_skills)) {
            $from = new \DateTime($p11_employment_records_skills['min_from']);
            $to = new \DateTime($p11_employment_records_skills['max_to']);
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
            $from = new \DateTime($p11_employment_records_sectors['min_from']);
            $to = new \DateTime($p11_employment_records_sectors['max_to']);
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

    public function createCompleteUser(Profile $profile, Country $country) {
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
}
