<?php

namespace Tests\Feature\Http\Controllers\API\SecurityModule;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Response as ResponseCode;
use App\Models\User;
use App\Models\SecurityModule\MRFRequest;

class iMMAPerMRFTest extends TestCase
{
    protected static $db_inited = false;
    protected $last_test = false;
    protected $role_id = 1;
    protected $immaper_mrf_id = 1;
    protected $admin_mrf_id = 2;

    protected $valid_mrf_data = [
        'country_id' => 1,
        'purpose' => "Travel Purposes",
        'need_government_paper' => 0,
        'criticality_of_the_movement_id' => 1,
        'itineraries' => [
            ['date_time' => '2020-12-10 10:00:00', 'from_city' => 'Jakarta', 'to_city' => 'Depok'],
            ['date_time' => '2020-12-10 15:00:00', 'from_city' => 'Depok', 'to_city' => 'Bekasi']
        ],
        'travel_details' => [
            [
                'vehicle_make' => 'Toyota', 'vehicle_model' => 'Avanza', 'vehicle_color' => 'Black', 'vehicle_plate' => 'B 2398 SFU',
                'comm_gsm' => '08139999999', 'comm_sat_phone' => NULL, 'comm_vhf_radio' => 0, 'comm_sat_tracker' => 0, 'personnel_on_board' => 'Me and Driver'
            ],
            [
                'vehicle_make' => 'Toyota', 'vehicle_model' => 'Yaris', 'vehicle_color' => 'White', 'vehicle_plate' => 'B 7521 TKR',
                'comm_gsm' => '08139999999', 'comm_sat_phone' => NULL, 'comm_vhf_radio' => 0, 'comm_sat_tracker' => 0, 'personnel_on_board' => 'Me and Driver'
            ],
        ],
        'isSubmit' => true
    ];

    protected $valid_mrf_update_data = [
        '_method' => 'PUT',
        'country_id' => 1,
        'purpose' => "Travel Purpose and Justification",
        'need_government_paper' => 0,
        'criticality_of_the_movement_id' => 1,
        'itineraries' => [
            ['date_time' => '2020-12-10 10:00:00', 'from_city' => 'Jakarta', 'to_city' => 'Depok'],
            ['date_time' => '2020-12-10 15:00:00', 'from_city' => 'Depok', 'to_city' => 'Bekasi']
        ],
        'travel_details' => [
            [
                'vehicle_make' => 'Toyota', 'vehicle_model' => 'Avanza', 'vehicle_color' => 'Black', 'vehicle_plate' => 'B 2398 SFU',
                'comm_gsm' => '08139999999', 'comm_sat_phone' => NULL, 'comm_vhf_radio' => 0, 'comm_sat_tracker' => 0, 'personnel_on_board' => 'Me and Driver'
            ],
            [
                'vehicle_make' => 'Toyota', 'vehicle_model' => 'Yaris', 'vehicle_color' => 'White', 'vehicle_plate' => 'B 7521 TKR',
                'comm_gsm' => '08139999999', 'comm_sat_phone' => NULL, 'comm_vhf_radio' => 0, 'comm_sat_tracker' => 0, 'personnel_on_board' => 'Me and Driver'
            ],
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
     * guest / not registered user cannot create mrf
    */
    public function guest_cannot_create_mrf()
    {
        $response = $this->post('api/security-module/mrf', [])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot create mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_create_mrf()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf', [])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot create mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_create_mrf()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf', [])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot make mrf request if the data is invalid
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_create_mrf_with_invalid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf', [
            'country_id' => 'string',
            'purpose' => ''
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can make mrf request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_create_mrf_with_valid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf', $this->valid_mrf_data)->assertStatus(ResponseCode::HTTP_CREATED)->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper admin can make mrf request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function admin_can_create_mrf_with_valid_data()
    {
        $user = User::where('email', 'immapadmin@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf', $this->valid_mrf_data)->assertStatus(ResponseCode::HTTP_CREATED)->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }


    // IMMAPER LIST - this is a function to get all requests that the immaper made
    /** @test
     * guest / not registered user cannot see all of his movement request
    */
    public function guest_cannot_see_all_mrf_lists()
    {
        $response = $this->get('api/security-module/mrf/immaper/lists/all')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his saved movement request
    */
    public function guest_cannot_see_saved_mrf_lists()
    {
        $response = $this->get('api/security-module/mrf/immaper/lists/saved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his submitted movement request
    */
    public function guest_cannot_see_submitted_mrf_lists()
    {
        $response = $this->get('api/security-module/mrf/immaper/lists/submitted')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his approved movement request
    */
    public function guest_cannot_see_approved_mrf_lists()
    {
        $response = $this->get('api/security-module/mrf/immaper/lists/approved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * guest / not registered user cannot see all of his disapproved movement request
    */
    public function guest_cannot_see_disapproved_mrf_lists()
    {
        $response = $this->get('api/security-module/mrf/immaper/lists/disapproved')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_all_mrf_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/all')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his saved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_saved_mrf_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/saved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his submitted movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_submitted_mrf_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/submitted')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his approved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_approved_mrf_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/approved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * registered user but not complete the profile creation cannot see all of his disapproved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_disapproved_mrf_lists()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/disapproved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_all_mrf_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/all')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his saved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_saved_mrf_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/saved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his submitted movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_submitted_mrf_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/submitted')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his approved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_approved_mrf_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/approved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot see all of his disapproved movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_see_disapproved_mrf_lists()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/disapproved')->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can see all of his movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_all_mrf_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/all')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his saved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_saved_mrf_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/saved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his submitted movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_submitted_mrf_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/submitted')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his approved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_approved_mrf_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/approved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user can see all of his disapproved movement requests
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_see_disapproved_mrf_lists()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/disapproved')->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot access the immaper list api if the status is not all, saved, submitted, approved or disapproved
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_see_mrf_lists_if_status_is_invalid()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/lists/random')->assertNotFound();
    }


    // IMMAPER SHOW - this is a function to get specific movememt request by it's id and immaper can only seen his movement request
    /** @test
     * guest / not registered user cannot see one specific of his movement request
    */
    public function guest_cannot_see_single_movement_request()
    {
        $response = $this->get('api/security-module/mrf/immaper/show/'. $this->immaper_mrf_id)->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see one specific of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_single_movement_request()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/show/' . $this->immaper_mrf_id)->assertForbidden()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/show/' . $this->immaper_mrf_id)->assertForbidden()->assertJsonFragment([
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

        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/show/' . $this->immaper_mrf_id)->assertOk()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/show/' . $this->admin_mrf_id)->assertForbidden()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/immaper/show/' . ($this->immaper_mrf_id - 1) )->assertNotFound();
    }


    // GETMRFPDF
     /** @test
     * guest / not registered user cannot see one specific PDF of his movement request
    */
    public function guest_cannot_see_single_pdf_movement_request()
    {
        $response = $this->get('api/security-module/mrf/' . $this->immaper_mrf_id . '/pdf')->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot see one specific PDF of his movement request
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_see_single_pdf_movement_request()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/' . $this->immaper_mrf_id . '/pdf')->assertForbidden()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/' . $this->immaper_mrf_id . '/pdf')->assertForbidden()->assertJsonFragment([
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

        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/' . $this->immaper_mrf_id . '/pdf')->assertOk()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/' . $this->admin_mrf_id . '/pdf')->assertForbidden()->assertJsonFragment([
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
        $response = $this->actingAs($user, 'api')->get('api/security-module/mrf/' . ($this->immaper_mrf_id - 1) . '/pdf')->assertNotFound();
    }


    // UPDATE
    /** @test
     * guest / not registered user cannot update mrf
    */
    public function guest_cannot_update_mrf()
    {
        $response = $this->post('api/security-module/mrf/' . $this->immaper_mrf_id, [ "_method" => 'PUT' ])->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot update mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_update_mrf()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf/' . $this->immaper_mrf_id, [ "_method" => 'PUT' ])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot update mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_update_mrf()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf/' . $this->immaper_mrf_id, [ "_method" => 'PUT' ])->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user cannot update mrf request if the data is invalid
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_update_mrf_with_invalid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf/' . $this->immaper_mrf_id, [
            'country_id' => 'string',
            'purpose' => '',
            '_method' => 'PUT'
        ])->assertStatus(ResponseCode::HTTP_UNPROCESSABLE_ENTITY)->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can update mrf request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_update_mrf_with_valid_data()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf/' . $this->immaper_mrf_id, $this->valid_mrf_update_data)->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot update mrf request if mrf is not found
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_update_mrf_if_not_found()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->post('api/security-module/mrf/' . ($this->immaper_mrf_id - 1), $this->valid_mrf_update_data)->assertNotFound();
    }


    // DESTROY
    /** @test
     * guest / not registered user cannot delete mrf
    */
    public function guest_cannot_delete_mrf()
    {
        $response = $this->delete('api/security-module/mrf/' . $this->immaper_mrf_id)->assertStatus(ResponseCode::HTTP_FOUND);
    }

    /** @test
     * registered user but not complete the profile creation cannot delete mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function uncomplete_profile_cannot_delete_mrf()
    {
        $user = User::where('email', 'verifieduser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/mrf/' . $this->immaper_mrf_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * user with cmpleted profile and not an immaper cannot delete mrf
     * the user has 'Can Make Travel Request' permission
    */
    public function non_immaper_cannot_delete_mrf()
    {
        $user = User::where('email', 'completeduserprofile@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/mrf/' . $this->immaper_mrf_id)->assertForbidden()->assertJsonFragment([
            'status' => 'error'
        ])->assertJsonStructure(['status', 'message', 'errors']);
    }

    /** @test
     * immaper user can delete mrf request
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_can_delete_mrf_if_exist()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/mrf/' . $this->immaper_mrf_id)->assertOk()->assertJsonFragment([
            'status' => 'success'
        ])->assertJsonStructure(['status', 'message', 'data']);
    }

    /** @test
     * immaper user cannot delete mrf request if mrf is not found
     * the immaper user has 'Can Make Travel Request' permission
    */
    public function immaper_cannot_delete_mrf_if_not_found()
    {
        $user = User::where('email', 'immaperuser@mail.com')->first();
        $response = $this->actingAs($user, 'api')->delete('api/security-module/mrf/' . ($this->immaper_mrf_id - 1))->assertNotFound();
    }

}
