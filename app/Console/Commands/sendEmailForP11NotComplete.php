<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotCompleteNotification;

class sendEmailForP11NotComplete extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'not-complete-notification:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send P11 Not Complete Notification';

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
       $users = User::select('email')->where('p11Completed', 0)->get()->pluck('email')->chunk(90);
        foreach($users as $key => $user) {
        dump($key);
        //if($key > 1 ) {
        if($key == 8) {
            $user->push('example@organization.org');
            Mail::to(env('MAIL_USERNAME'))->bcc($user->all())->send(new NotCompleteNotification());
            dump($user->all());
        }}
    }
}
