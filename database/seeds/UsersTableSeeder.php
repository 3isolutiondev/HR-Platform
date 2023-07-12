<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Profile;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'first_name' => 'Admin',
            'middle_name' => 'Admin',
            'family_name' => 'Admin',
            'full_name' => 'Admin Admin Admin',
            'email' => 'admin@organization.com',
            'password' => Hash::make('Password@123'),
        ]);

        $user->assignRole('Admin');

        Profile::create([
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'family_name' => $user->family_name,
            // 'full_name' => $user->full_name,
            'email' => $user->email,
            'user_id' => $user->id
        ]);
    }
}
