<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // CREATE PERMISSION
        Permission::create(['name' => 'Show User']);
        Permission::create(['name' => 'Add User']);
        Permission::create(['name' => 'Edit User']);
        Permission::create(['name' => 'Delete User']);

        Permission::create(['name' => 'Show Permission']);
        Permission::create(['name' => 'Add Permission']);
        Permission::create(['name' => 'Edit Permission']);
        Permission::create(['name' => 'Delete Permission']);

        Permission::create(['name' => 'Show Role']);
        Permission::create(['name' => 'Add Role']);
        Permission::create(['name' => 'Edit Role']);
        Permission::create(['name' => 'Delete Role']);

        Permission::create(['name' => 'Show Profile']);
        Permission::create(['name' => 'Add Profile']);
        Permission::create(['name' => 'Edit Profile']);
        Permission::create(['name' => 'Delete Profile']);
        Permission::create(['name' => 'Edit Current Profile']);

        Permission::create(['name' => 'Index Country']);
        Permission::create(['name' => 'Show Country']);
        Permission::create(['name' => 'Add Country']);
        Permission::create(['name' => 'Edit Country']);
        Permission::create(['name' => 'Delete Country']);

        Permission::create(['name' => 'Show Attachment']);
        Permission::create(['name' => 'Store Attachment']);
        Permission::create(['name' => 'Delete Attachment']);

        Permission::create(['name' => 'Show Clerical Grade']);
        Permission::create(['name' => 'Add Clerical Grade']);
        Permission::create(['name' => 'Edit Clerical Grade']);
        Permission::create(['name' => 'Delete Clerical Grade']);

        Permission::create(['name' => 'Show Dependent']);
        Permission::create(['name' => 'Add Dependent']);
        Permission::create(['name' => 'Edit Dependent']);
        Permission::create(['name' => 'Delete Dependent']);

        Permission::create(['name' => 'Show Education School']);
        Permission::create(['name' => 'Add Education School']);
        Permission::create(['name' => 'Edit Education School']);
        Permission::create(['name' => 'Delete Education School']);

        Permission::create(['name' => 'Show Education University']);
        Permission::create(['name' => 'Add Education University']);
        Permission::create(['name' => 'Edit Education University']);
        Permission::create(['name' => 'Delete Education University']);

        Permission::create(['name' => 'Show Employment Record']);
        Permission::create(['name' => 'Add Employment Record']);
        Permission::create(['name' => 'Edit Employment Record']);
        Permission::create(['name' => 'Delete Employment Record']);

        Permission::create(['name' => 'Show Language']);
        Permission::create(['name' => 'Add Language']);
        Permission::create(['name' => 'Edit Language']);
        Permission::create(['name' => 'Delete Language']);

        Permission::create(['name' => 'Show Professional Society']);
        Permission::create(['name' => 'Add Professional Society']);
        Permission::create(['name' => 'Edit Professional Society']);
        Permission::create(['name' => 'Delete Professional Society']);

        Permission::create(['name' => 'Show Publication']);
        Permission::create(['name' => 'Add Publication']);
        Permission::create(['name' => 'Edit Publication']);
        Permission::create(['name' => 'Delete Publication']);

        Permission::create(['name' => 'Show Reference']);
        Permission::create(['name' => 'Add Reference']);
        Permission::create(['name' => 'Edit Reference']);
        Permission::create(['name' => 'Delete Reference']);

        Permission::create(['name' => 'Show Relative']);
        Permission::create(['name' => 'Add Relative']);
        Permission::create(['name' => 'Edit Relative']);
        Permission::create(['name' => 'Delete Relative']);

        Permission::create(['name' => 'Index Job']);
        Permission::create(['name' => 'Show Job']);
        Permission::create(['name' => 'Add Job']);
        Permission::create(['name' => 'Edit Job']);
        Permission::create(['name' => 'Delete Job']);
        
        Permission::create(['name' => 'Index ToR']);
        Permission::create(['name' => 'Show ToR']);
        Permission::create(['name' => 'Add ToR']);
        Permission::create(['name' => 'Edit ToR']);
        Permission::create(['name' => 'Delete ToR']);

        Permission::create(['name' => 'Dashboard Access']);

        $role = Role::create(['name' => 'User']);
        $role->givePermissionTo('Edit Current Profile');

        $role = Role::create(['name' => 'Admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'HR']);
        $role->givePermissionTo([
            'Show Job', 'Add Job', 'Edit Job', 'Delete Job',
            'Show Profile', 'Edit Current Profile', 'Dashboard Access'
        ]);

        $role = Role::create(['name' => 'Employee']);
        $role->givePermissionTo('Edit Current Profile');
    }
}
