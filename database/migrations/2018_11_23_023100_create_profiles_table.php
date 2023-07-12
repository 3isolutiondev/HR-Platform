<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('family_name');
            $table->string('maiden_name')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('birth_nationalities')->nullable();
            $table->string('present_nationalities')->nullable();
            $table->boolean('gender')->nullable();
            $table->integer('height')->nullable();
            $table->integer('weight')->nullable();
            $table->string('marital_status')->nullable();
            $table->boolean('has_disabilities')->default(0);
            $table->text('disabilities')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('permanent_address_phone')->nullable();
            $table->text('present_address')->nullable();
            $table->string('present_address_phone')->nullable();
            $table->string('office_telephone')->nullable();
            $table->string('office_fax')->nullable();
            $table->string('email');
            $table->boolean('has_dependents')->default(0);
            // dependents list
            $table->boolean('legal_permanent_residence_status')->default(0);
            $table->unsignedInteger('legal_permanent_residence_status_country')->nullable();
            $table->boolean('legal_step_changing_present_nationality')->default(0);
            $table->text('legal_step_changing_present_nationality_explanation')->nullable();
            $table->boolean('relatives_employed_by_public_international_organization')->default(0);
            // relatives list
            $table->string('preferred_field_of_work')->nullable();
            $table->boolean('accept_employment_less_than_six_month')->default(1);
            $table->boolean('previously_submitted_application_for_UN')->default(0);
            // languages list
            // clerical grades list
            $table->text('office_equipment_abilities')->nullable();
            // education universities list
            // education schools list
            // professional societies list
            // publication list
            // employment records
            $table->boolean('objections_making_inquiry_of_present_employer')->default(0);
            $table->boolean('permanent_civil_servant')->default(0);
            $table->date('permanent_civil_servant_from')->nullable();
            $table->date('permanent_civil_servant_to')->nullable();
            $table->boolean('permanent_civil_servant_is_now')->default(0);
            //references list
            $table->text('relevant_facts')->nullable();
            // signature img
            $table->unsignedInteger('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
