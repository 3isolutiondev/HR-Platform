<?php

use Illuminate\Database\Seeder;
use App\Models\Setting;

class RequestContractSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (Setting::where('slug', 'contract-request-recipients-france')->get()->count() == 0) {
            Setting::create([
                'name' => 'Contract Request Recipients France',
                'slug' => 'contract-request-recipients-france',
                'value' => "admin@organization.org",
                ]);
        }

        if (Setting::where('slug', 'contract-request-recipients-united-states')->get()->count() == 0) {
            Setting::create([
                'name' => 'Contract Request Recipients United States',
                'slug' => 'contract-request-recipients-united-states',
                'value' => "admin@organization.org",
                ]);
        }
    }
}
