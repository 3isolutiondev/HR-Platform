<?php

namespace App\Console\Commands;

use App\Models\ThirdPartyClient\ThirdPartyClient as ThirdPartyClients;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ThirdPartyClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:third-party';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command is for create, update and delete the credentials of third party client';

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
        $choices = [
            1 => 'Add',
            2 => 'Update',
            3 => 'Delete'
        ];

        $choice = $this->choice('Choose the third party action',$choices);

        if ($choice == 'Add') {
            $username = $this->ask('Enter the username');
            if (strlen($username) < 5) {
                $this->error('The username must be at least 5 charachers');
            } else {
                $password = $this->secret('Enter the password');

                $lengthPasses = (Str::length($password) >= 12);
                $uppercasePasses = (Str::lower($password) !== $password);
                $numericPasses = ((bool) preg_match('/[0-9]/', $password));
                $specialCharacterPasses = ((bool) preg_match('/[^A-Za-z0-9]/', $password));

                if ($lengthPasses && $uppercasePasses && $numericPasses && $specialCharacterPasses) {
                    $checkClient = ThirdPartyClients::where('username', $username)->first();

                    if (!is_null($checkClient)) {
                        $this->error('The username already exist');
                    } else {
                         $client = new ThirdPartyClients();
                         $client->username = $username;
                         $client->password = Hash::make($password);
                         $client->save();

                         if ($client) {
                            $this->info('The Third party client has been created successful!');
                         } else {
                            $this->error('Server error, Please again'); 
                         }
                    }
                } else {
                    $this->error('The password must have at least 12 characters, 1 uppercase letter, 1 number, and 1 symbol');
                }
            }
        } else if ($choice == 'Update') {
            $username = $this->ask('Enter the username');

            $client = ThirdPartyClients::where('username', $username)->first();

            if (!is_null($client)) { 
                $password = $this->secret('Enter the new password');

                $lengthPasses = (Str::length($password) >= 12);
                $uppercasePasses = (Str::lower($password) !== $password);
                $numericPasses = ((bool) preg_match('/[0-9]/', $password));
                $specialCharacterPasses = ((bool) preg_match('/[^A-Za-z0-9]/', $password));

                if ($lengthPasses && $uppercasePasses && $numericPasses && $specialCharacterPasses) {
                    $client->password = Hash::make($password);
                    $client->save();

                    if ($client) {
                        $this->info('The Third party client has been updated successful!');
                     } else {
                        $this->error('Server error, Please again'); 
                     }
                } else {
                    $this->error('The password must have at least 12 characters, 1 uppercase letter, 1 number, and 1 symbol');
                }
            } else {
                $this->error('This Username is not exist'); 
            }

        } else {
            $username = $this->ask('Enter the username');

            $client = ThirdPartyClients::where('username', $username)->first();

            if (!is_null($client)) { 
                $client->delete();

                if ($client) {
                    $this->info('The Third party client has been deleted successful!');
                 } else {
                    $this->error('Server error, Please again'); 
                 }

            } else {
                $this->error('This Username is not exist'); 
            }
        }
    }
}
