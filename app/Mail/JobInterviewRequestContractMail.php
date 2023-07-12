<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JobInterviewRequestContractMail extends Mailable
{
    use Queueable, SerializesModels;

    public $first_name, $last_name, $position, $paid_from, $project_code, $project_task, $supervisor, $unanet_approver_name, $hosting_agency, $duty_station, $monthly_rate, $housing, $perdiem, $phone, $other, $requester, $contract_start, $contract_end , $not_applicable, $cost_center, $home_based, $request_type, $currency;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($first_name, $last_name, $position, $paid_from, $project_code, $project_task, $supervisor, $unanet_approver_name, $hosting_agency, $duty_station, $monthly_rate, $housing, $perdiem, $phone, $other, $requester, $contract_start, $contract_end, $not_applicable, $cost_center, $country_slug, $request_type, $currency, $replyTo='')
    {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->position = $position;
        $this->paid_from = $paid_from == 0 ? 'HQ' : 'Field';
        $this->project_code = $project_code;
        $this->project_task = empty($project_task) ? '-' : $project_task;
        $this->supervisor = $supervisor;
        $this->unanet_approver_name = $unanet_approver_name;
        $this->hosting_agency = empty($hosting_agency) ? '-' : $hosting_agency;
        $this->duty_station = $duty_station;
        $this->monthly_rate = $monthly_rate;
        $this->housing = $housing;
        $this->perdiem = $perdiem;
        $this->phone = $phone;
        $this->other = $other;
        $this->requester = $requester;
        $this->contract_start = $contract_start;
        $this->contract_end = $contract_end;
        $this->not_applicable = $not_applicable;
        $this->cost_center = $cost_center;
        $this->currency = $currency;
        $this->home_based = $country_slug == "home-based" ? 'Yes' : 'No';
        if (!empty($replyTo)) {
            $this->replyTo($replyTo);
        }

        if ($request_type == 'contract-extension') {
            $this->request_type = 'Contract Extension';
        } else if ($request_type == 'contract-amendment') {
            $this->request_type = 'Contract Amendment';
        } else {
            $this->request_type = 'New Contract';
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->request_type." Request for ".$this->first_name." ".$this->last_name)->markdown('mail.jobInterviewRequestContract');
    }
}
