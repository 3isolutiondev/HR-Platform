<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Job;

class SbpJobNotification extends Mailable
{
    use SerializesModels;

    public $job, $tor, $sbpRosterName, $dutyStation, $country, $duration, $acceptedMemberCount, $closingDate, $cluster;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Job $job, string $sbpRosterName = "Surge Roster", int $acceptedMemberCount)
    {
        $this->job = $job;
        $this->tor = $job->tor;
        $this->sbpRosterName = $sbpRosterName;
        $this->dutyStation = $job->tor->duty_station;
        $this->country = $job->country->name;
        $this->acceptedMemberCount = $acceptedMemberCount;
        $this->cluster = $job->tor->cluster_seconded ? $job->tor->cluster_seconded : $job->tor->cluster;

        $closingDate = new \DateTime($job->closing_date);
        $this->closingDate = $closingDate->format('l, d F Y');

        $this->duration = $job->contract_length . " months";
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "Surge Alert: ". $this->job->title ." / ". $this->tor->organization;

        if(!empty($this->cluster) && !is_null($this->cluster)) {
          $subject = $subject . " / " . $this->cluster;
        }

        if ($this->country == "Home Based") {
            $subject = $subject . " / " . $this->country;
        } else {
            $subject = $subject . " / " . $this->dutyStation . " / " . $this->country;
        }

        return $this->subject($subject)->markdown('mail.SbpJobNotification');
    }
}
