<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;

use Illuminate\Support\Facades\DB;

class fixSkill extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:skill';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix user skill experiences';

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
        $profiles = Profile::whereHas('p11_employment_records')->get();

        foreach($profiles as $profile) {
            foreach($profile->p11_skills as $skill) {
                $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill) {
                    $query->where('skill_id', $skill->skill_id);
                })->first();

                if (!empty($p11_employment_records_skills)) {
                    $from = date_create($p11_employment_records_skills['min_from']);
                    $to = date_create($p11_employment_records_skills['max_to']);
                    $interval = date_diff($to, $from);

                    $profile_skill = $profile->p11_skills()->where('skill_id', $skill->skill_id)->first();

                    if (!empty($profile_skill)) {
                        $profile_skill->fill([
                            'days' => $interval->days,
                            'months' => $interval->m + ( $interval->y * 12 ),
                            'years' => $interval->y
                        ])->save();
                    }
                }
            }

            foreach($profile->p11_sectors as $sector) {
                $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sector) {
                    $query->where('sector_id', $sector->sector_id);
                })->first();

                if (!empty($p11_employment_records_sectors)) {
                    $from = date_create($p11_employment_records_sectors['min_from']);
                    $to = date_create($p11_employment_records_sectors['max_to']);
                    $interval = date_diff($to, $from);

                    $profile_sector = $profile->p11_sectors()->where('sector_id', $sector->sector_id)->first();

                    if (!empty($profile_sector)) {
                        $profile_sector->fill([
                            'days' => $interval->days,
                            'months' => $interval->m + ( $interval->y * 12 ),
                            'years' => $interval->y
                        ])->save();
                    }
                }
            }
        }

    }
}
