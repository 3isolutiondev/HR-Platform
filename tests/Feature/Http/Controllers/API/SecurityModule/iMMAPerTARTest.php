<?php

namespace Tests\Feature\Http\Controllers\API\SecurityModule;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Response as ResponseCode;
use App\Models\User;
use App\Models\SecurityModule\tarRequest;

class iMMAPerTARTest extends TestCase
{
    protected static $db_inited = false;
    protected $last_test = false;
    protected $role_id = 1;
    protected $immaper_tar_id = 1;
    protected $admin_tar_id = 2;

    protected $valid_tar_data = [
        'travel_purpose_id' => 1,
        'overnight' => 0,
        'explanation' => "explanation",

        'itineraries' => [
            ['date_travel' => '2020-10-10 ', 'from_city' => 'Jakarta', 'to_city' => 'Depok'],
            ['date_travel' => '2020-10-11 ', 'from_city' => 'Depok', 'to_city' => 'Bekasi']
        ],

        'isSubmit' => true
    ];

    protected $valid_tar_update_data = [
        '_method' => 'PUT',
        'country_id' => 1,
        'purpose' => "Travel Purpose and Justification",
        'need_government_paper' => 0,
        'criticality_of_the_movement_id' => 1,
        'itineraries' => [
            ['date_time' => '2020-12-10 10:00:00', 'from_city' => 'Jakarta', 'to_city' => 'Depok'],
            ['date_time' => '2020-12-10 15:00:00', 'from_city' => 'Depok', 'to_city' => 'Bekasi']
        ],

        'isSubmit' => true
    ];

    protected static function initDB()
    {
        echo "\n---initDB---\n"; // proof it only runs once per test TestCase class
        // ...more db init stuff, like seeding etc.
        Artisan::call('migrate:fresh', ['--database' => 'mysql_testing']);
        Artisan::call('migrate', ['--database' => 'mysql_testing']);
        Artisan::call('db:seed', ['--class' => 'FirstInstallSeeder', '--database' => 'mysql_testing']);
        Artisan::call('db:seed', ['--class' => 'UserForTestingSeeder', '--database' => 'mysql_testing']);
        Artisan::call('db:seed', ['--class' => 'SecurityModuleCriticalMovementSeeeder', '--database' => 'mysql_testing']);
    }

    public function setUp(): void
    {
        parent::setUp();

        if (!static::$db_inited) {
            static::$db_inited = true;
            static::initDB();
        }
    }

    // STORE
    /** @test
     * guest / not registered user cannot create tar
    */
    public function guest_cannot_create_tar()
    {
        $response = $this->post('api/security-module/tar', [])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot create tar
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_create_tar()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar', [])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot create tar
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_create_tar()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar', [])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot make tar request if the data is invalid
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_create_tar_with_invalid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar', [
            'travel_purpose_id' => 'string',
            'explanation' => ''
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can make tar request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_create_tar_with_valid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar', $this->valid_tar_data)->assertStatus(ResponseCode::HTTP_CREATED)->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper admin can make tar request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function admin_can_create_tar_with_valid_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar', $this->valid_tar_data)->assertStatus(ResponseCode::HTTP_CREATED)->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }


    // IMMAPER LIST - this is a function to get all requests that the immaper made
    /** @test
     * guest / not registered user cannot see all of his movement request
    */
    public function guest_cannot_see_all_tar_lists()
    {
        $response = $this->get('api/security-module/tar/immaper/lists/all')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his saved movement request
    */
    public function guest_cannot_see_saved_tar_lists()
    {
        $response = $this->get('api/security-module/tar/immaper/lists/saved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his submitted movement request
    */
    public function guest_cannot_see_submitted_tar_lists()
    {
        $response = $this->get('api/security-module/tar/immaper/lists/submitted')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his approved movement request
    */
    public function guest_cannot_see_approved_tar_lists()
    {
        $response = $this->get('api/security-module/tar/immaper/lists/approved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his disapproved movement request
    */
    public function guest_cannot_see_disapproved_tar_lists()
    {
        $response = $this->get('api/security-module/tar/immaper/lists/disapproved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_all_tar_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/all')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his saved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_saved_tar_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/saved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his submitted movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_submitted_tar_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/submitted')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his approved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_approved_tar_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/approved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his disapproved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_disapproved_tar_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/disapproved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_all_tar_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/all')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his saved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_saved_tar_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/saved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his submitted movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_submitted_tar_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/submitted')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his approved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_approved_tar_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/approved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his disapproved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_disapproved_tar_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/disapproved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can see all of his movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_all_tar_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/all')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his saved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_saved_tar_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/saved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his submitted movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_submitted_tar_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/submitted')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his approved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_approved_tar_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/approved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his disapproved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_disapproved_tar_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/disapproved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot access the immaper list api if the status is not all, saved, submitted, approved or disapproved
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_tar_lists_if_status_is_invalid()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/lists/random')->assertNotFound();
    }


    // IMMAPER SHOW - this is a function to get specific movememt request by it's id and immaper can only seen his movement request
    /** @test
     * guest / not registered user cannot see one specific of his movement request
    */
    public function guest_cannot_see_single_movement_request()
    {
        $response = $this->get('api/security-module/tar/immaper/show/'. $this->immaper_tar_id)->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see one specific of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_single_movement_request()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/show/' . $this->immaper_tar_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see one specific of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_single_movement_request()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/show/' . $this->immaper_tar_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can see one specific of his movement request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_single_movement_request()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();

        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/show/' . $this->immaper_tar_id)->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot see movement requests from other user
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_single_movement_request_from_other_user()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/show/' . $this->admin_tar_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot see movement requests if not exists
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_single_movement_request_if_its_not_exist()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/immaper/show/' . ($this->immaper_tar_id - 1) )->assertNotFound();
    }


    // GETtarPDF
     /** @test
     * guest / not registered user cannot see one specific PDF of his movement request
    */
    public function guest_cannot_see_single_pdf_movement_request()
    {
        $response = $this->get('api/security-module/tar/' . $this->immaper_tar_id . '/pdf')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see one specific PDF of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_single_pdf_movement_request()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/' . $this->immaper_tar_id . '/pdf')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see one specific PDF of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_single_pdf_movement_request()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/' . $this->immaper_tar_id . '/pdf')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }


    /** @test
     * immaper user can see one specific PDF of his movement request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_single_pdf_movement_request()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();

        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/' . $this->immaper_tar_id . '/pdf')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot see PDF movement requests from other user
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_single_pdf_movement_request_from_other_user()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/' . $this->admin_tar_id . '/pdf')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot see PDF movement requests if not exists
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_single_pdf_movement_request_if_its_not_exist()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/tar/' . ($this->immaper_tar_id - 1) . '/pdf')->assertNotFound();
    }


    // UPDATE
    /** @test
     * guest / not registered user cannot update tar
    */
    public function guest_cannot_update_tar()
    {
        $response = $this->post('api/security-module/tar/' . $this->immaper_tar_id, [ "_method" => 'PUT' ])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot update tar
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_update_tar()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar/' . $this->immaper_tar_id, [ "_method" => 'PUT' ])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot update tar
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_update_tar()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar/' . $this->immaper_tar_id, [ "_method" => 'PUT' ])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot update tar request if the data is invalid
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_update_tar_with_invalid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar/' . $this->immaper_tar_id, [
            'country_id' => 'string',
            'purpose' => '',
            '_method' => 'PUT'
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can update tar request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_update_tar_with_valid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar/' . $this->immaper_tar_id, $this->valid_tar_update_data)->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot update tar request if tar is not found
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_update_tar_if_not_found()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/tar/' . ($this->immaper_tar_id - 1), $this->valid_tar_update_data)->assertNotFound();
    }


    // DESTROY
    /** @test
     * guest / not registered user cannot delete tar
    */
    public function guest_cannot_delete_tar()
    {
        $response = $this->delete('api/security-module/tar/' . $this->immaper_tar_id)->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot delete tar
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_delete_tar()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/tar/' . $this->immaper_tar_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot delete tar
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_delete_tar()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/tar/' . $this->immaper_tar_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can delete tar request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_delete_tar_if_exist()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/tar/' . $this->immaper_tar_id)->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot delete tar request if tar is not found
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_delete_tar_if_not_found()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/tar/' . ($this->immaper_tar_id - 1))->assertNotFound();
    }

}
