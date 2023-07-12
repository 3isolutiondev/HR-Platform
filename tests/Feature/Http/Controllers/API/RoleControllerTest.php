<?php

namespace Tests\Feature\Http\Controllers\API;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response as ResponseCode;
use Faker\Factory;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

class RoleControllerTest extends TestCase
{
    protected static $db_inited = false;

    protected static function initDB()
    {
        echo "\n---initDB---\n"; // proof it only runs once per test TestCase class
        // ...more db init stuff, like seeding etc.
        Artisan::call('migrate:fresh', ['--database' => 'mysql_testing']);
        Artisan::call('migrate', ['--database' => 'mysql_testing']);
        Artisan::call('db:seed', ['--class' => 'FirstInstallSeeder', '--database' => 'mysql_testing']);
        Artisan::call('db:seed', ['--class' => 'UserForTestingSeeder', '--database' => 'mysql_testing']);
    }

    public function setUp(): void
    {
        parent::setUp();

        if (!static::$db_inited) {
            static::$db_inited = true;
            static::initDB();
        }
    }

    // INDEX FUNCTION

    /** @test */
    public function guest_cannot_see_all_roles()
    {
        $response = $this->get('api/roles')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test */
    public function user_without_permission_cannot_see_all_roles()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/roles')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
            ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_can_see_all_roles()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/roles')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    // SHOW FUNCTION

    /** @test */
    public function guest_cannot_see_role()
    {
        $response = $this->get('api/roles/1')->assertStatus(ResponseCode::HTTP_FOUND);
    }

     /** @test */
    public function user_without_permission_cannot_see_role()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/roles/1')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
            ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_can_see_role()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/roles/1')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test */
    public function user_with_permission_cannot_see_unsaved_role()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/roles/200')->assertNotFound()->assertJsonFragment([
            'status' => 'error',
            'message' => 'Sorry, We cannot found Your data'
        ])->assertJsonStructure(['status', 'message']);
    }

    // STORE FUNCTION

    /** @test */
    public function guest_cannot_save_role()
    {
        $response = $this->post('api/roles', [])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test */
    public function user_without_permission_cannot_save_role()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles', [])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_can_save_role_with_correct_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles', [
            'name' => 'Test Role2',
            'permissions' => ["Dashboard Access", "Show User", "Show User"],
            'immap_offices' => [10,12,13]
        ])->assertStatus(ResponseCode::HTTP_CREATED)->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test */
    public function user_with_permission_cannot_save_role_with_uncorrect_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles', [
            'name' => 'Test Role2',
            'permissions' => ["Dashboard Access", "Show User", "Show User", "444"],
            'immap_offices' => [10,12,13,"tes"]
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_cannot_save_role_with_existing_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles', [
            'name' => 'Test Role2',
            'permissions' => ["Dashboard Access", "Show User", "Show User"],
            'immap_offices' => [10,12,13]
        ])->assertStatus(ResponseCode::HTTP_INTERNAL_SERVER_ERROR);
    }

    // UPDATE FUNCTION

    /** @test */
    public function guest_cannot_update_role_if_using_post()
    {
        $response = $this->post('api/roles/6', [])->assertStatus(ResponseCode::HTTP_METHOD_NOT_ALLOWED);
    }

    /** @test */
    public function guest_cannot_update_role()
    {
        $response = $this->post('api/roles/6', ["_method" => "PUT"])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test */
    public function user_without_permission_cannot_update_role()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles/6', ["_method" => "PUT"])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_can_update_role_with_correct_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles/6', [
            "_method" => "PUT",
            'name' => 'Test Role22',
            'permissions' => ["Dashboard Access", "Show User", "Show User"],
            'immap_offices' => [10,12,13]
        ])->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test */
    public function user_with_permission_cannot_update_role_with_uncorrect_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles/6', [
            "_method" => "PUT",
            'name' => 'Test Role23',
            'permissions' => ["Dashboard Access", "Show User", "Show User", "444"],
            'immap_offices' => [10,12,13,"tes"]
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test */
    public function user_with_permission_cannot_update_role_with_unexisting_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles/100', [
            "_method" => "PUT",
            'name' => 'Test Role2',
            'permissions' => ["Dashboard Access", "Show User", "Show User"],
            'immap_offices' => [10,12,13]
        ])->assertNotFound();
    }

    /** @test */
    public function cannot_update_role_if_parameter_not_int()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/roles/bahdaf', [
            "_method" => "PUT",
            'name' => 'Test Role2',
            'permissions' => ["Dashboard Access", "Show User", "Show User"],
            'immap_offices' => [10,12,13]
        ])->assertStatus(ResponseCode::HTTP_METHOD_NOT_ALLOWED);
    }

     // DESTROY FUNCTION

    /** @test */
    public function guest_cannot_delete_role()
    {
        $response = $this->delete('api/roles/6')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test */
    public function user_without_permission_cannot_delete_role()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/roles/6')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

     /** @test */
     public function user_with_permission_cannot_delete_role_with_uncorrect_data()
     {
         $user = User::where('email', 'immapadmin@mail.com')->first();
         $response = $this->actingAs($user, 'api')->delete('api/roles/1qsd')->assertStatus(ResponseCode::HTTP_METHOD_NOT_ALLOWED)->assertJsonFragment([
             'status' => 'error'
         ])->assertJsonStructure(['status', 'message', 'errors']);
     }

    /** @test */
    public function user_with_permission_can_delete_role_with_correct_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/roles/6')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test */
    public function user_with_permission_cannot_delete_role_with_unexisting_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/roles/100')->assertNotFound();
    }

    // GET ROLE OPTIONS

     /** @test */
     public function guest_cannot_see_all_options_roles()
     {
         $response = $this->get('api/roles/all-options')->assertStatus(ResponseCode::HTTP_FOUND);
     }

     /** @test */
     public function user_without_permission_cannot_see_all_options_roles()
     {
         $user = User::where('email', 'completeduserprofile@mail.com')->first();
         $response = $this->actingAs($user, 'api')->get('api/roles/all-options')->assertForbidden()->assertJsonFragment([
             'status' => 'error'
             ])->assertJsonStructure(['status', 'message', 'errors']);
     }

     /** @test */
     public function user_with_permission_can_see_all_options_roles()
     {
         $user = User::where('email', 'immapadmin@mail.com')->first();
         $response = $this->actingAs($user, 'api')->get('api/roles/all-options')->assertOk()->assertJsonFragment([
             'status' => 'success'
         ])->assertJsonStructure(['status', 'message', 'data']);

         static::$db_inited = false;
     }
}
