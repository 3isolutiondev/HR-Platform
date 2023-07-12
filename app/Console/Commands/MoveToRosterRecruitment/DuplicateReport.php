<?php

namespace App\Console\Commands\MoveToRosterRecruitment;

class DuplicateReport
{
    /**
     * @var int
     */
    public $profileId;
    /**
     * @var string
     */
    public $fullname;
    /**
     * @var string
     */
    public $jobStatus;
    /**
     * @var string
     */
    public $rosterStep;

    /**
     * Create a new DuplicateReport instance.
     *
     * @param int $profileId
     * @param string $fullname
     * @param string $jobStatus
     * @param string $rosterStep
     *
     * @return void
     */
    public function __construct(int $profileId, string $fullname, string $jobStatus, string $rosterStep)
    {
        $this->profileId = $profileId;
        $this->fullname = $fullname;
        $this->jobStatus = $jobStatus;
        $this->rosterStep = $rosterStep;
    }
}
