<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use App\Models\Job;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SbpJobClosedNotImmapNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $job, $tor, $sbpRosterName, $dutyStation, $country, $organization, $cluster;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Job $job, string $sbpRosterName = "Surge Roster")
    {
        $this->job = $job;
        $this->tor = $job->tor;
        $this->sbpRosterName = $sbpRosterName;
        $this->dutyStation = $job->tor->duty_station;
        $this->country = $job->country->name;
        $this->organization = $job->tor->organization;
        $this->cluster = $job->tor->cluster_seconded ? $job->tor->cluster_seconded : $job->tor->cluster;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $place = ($this->country === "Home Based") ? $this->country : $this->dutyStation . ' - ' . $this->country;
        $subject = "Stand Down Message - ". $this->job->title . " - " . $place .' - ' . $this->organization;

        if(!empty($this->cluster) && !is_null($this->cluster)) {
          $subject = $subject . " - " . $this->cluster;
        }

        return $this->subject($subject)->markdown('mail.SbpJobClosedNotImmapNotification');
    }
}
