<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSecurityModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('countries')) {
            if (!Schema::hasColumn('countries', 'seen_in_security_module')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->boolean('seen_in_security_module')->default(1);
                });
            }
        }

        if (Schema::hasTable('countries')) {
            if (!Schema::hasColumn('countries', 'is_high_risk')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->boolean('is_high_risk')->default(0);
                });
            }
        }

        if (!Schema::hasTable('security_module_officer_countries')) {
            Schema::create('security_module_officer_countries', function (Blueprint $table) {
                $table->unsignedInteger('user_id');
                $table->unsignedInteger('country_id');

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_mrf_requests')) {
            Schema::create('security_module_mrf_requests', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->text('name')->nullable();
                $table->unsignedInteger('country_id')->nullable();
                $table->string('country_name')->nullable();
                $table->text('purpose');
                $table->string('criticality_of_the_movement')->nullable(); // filled by value inside configuration file: config > securitymodule.php > criticalMovements
                $table->string('status')->default('saved'); // ['saved', 'submitted', 'approved', 'disapproved', 'revision'])->default('saved');
                $table->unsignedInteger('user_id');
                $table->timestamp('submitted_date')->nullable();
                $table->text('disapproved_reasons')->nullable();
                $table->text('revision_needed')->nullable();
                $table->text('approved_comments')->nullable();
                $table->text('security_assessment')->nullable();
                $table->string('security_measure')->nullable();
                $table->string('movement_state')->nullable();
                $table->string('travel_type')->nullable();
                $table->string('transportation_type');
                $table->boolean('security_measure_email')->default(0);
                $table->boolean('security_measure_smart24')->default(0);
                $table->timestamps();

                $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_mrf_requests_revisions')) {
            Schema::create('security_module_mrf_requests_revisions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->text('name')->nullable();
                $table->unsignedInteger('country_id')->nullable();
                $table->string('country_name')->nullable();
                $table->text('purpose');
                $table->string('criticality_of_the_movement')->nullable();
                $table->string('status')->default('saved'); // ['saved', 'submitted', 'approved', 'disapproved', 'revision'])->default('saved');
                $table->unsignedInteger('user_id');
                $table->timestamp('submitted_date')->nullable();
                $table->text('disapproved_reasons')->nullable();
                $table->text('revision_needed')->nullable();
                $table->text('approved_comments')->nullable();
                $table->text('security_assessment')->nullable();
                $table->string('security_measure')->nullable();
                $table->string('movement_state')->nullable();
                $table->string('travel_type')->nullable();
                $table->string('transportation_type');
                $table->boolean('security_measure_email')->default(0);
                $table->boolean('security_measure_smart24')->default(0);
                $table->unsignedBigInteger('mrf_request_id');
                $table->unsignedInteger('user_who_edit')->nullable();

                $table->timestamps();

                $table->foreign('mrf_request_id','mrfforrev')->references('id')->on('security_module_mrf_requests')->onDelete('cascade');
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('user_who_edit')->references('id')->on('users')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('security_module_mrf_request_itineraries')) {
            Schema::create('security_module_mrf_request_itineraries', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('mrf_request_id');
                $table->dateTime('date_time')->nullable();
                $table->dateTime('return_date_time')->nullable();
                $table->time('etd')->nullable();
                $table->text('from_city');
                $table->text('to_city');
                $table->time('eta')->nullable();
                $table->unsignedSmallInteger('order')->default(0);
                $table->string('need_government_paper')->default('no');
                $table->boolean('need_government_paper_now')->nullable();
                $table->unsignedInteger('government_paper_id')->nullable();
                $table->boolean('overnight')->default(0);
                $table->text('overnight_explanation')->nullable();
                $table->timestamps();

                $table->foreign('government_paper_id','mrf_itineraries_paper_id')->references('id')->on('attachments')->onDelete('set null');
                $table->foreign('mrf_request_id','mrf')->references('id')->on('security_module_mrf_requests')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_mrf_request_itineraries_revisions')) {
            Schema::create('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('mrf_request_revision_id');
                $table->dateTime('date_time')->nullable();
                $table->dateTime('return_date_time')->nullable();
                $table->time('etd')->nullable();
                $table->text('from_city');
                $table->text('to_city');
                $table->time('eta')->nullable();
                $table->unsignedSmallInteger('order')->default(0);
                $table->string('need_government_paper')->default('no');
                $table->boolean('need_government_paper_now')->nullable();
                $table->unsignedInteger('government_paper_id')->nullable();
                $table->boolean('overnight')->default(0);
                $table->text('overnight_explanation')->nullable();
                $table->timestamps();

                $table->foreign('government_paper_id','mrf_itineraries_rev_paper_id')->references('id')->on('attachments')->onDelete('set null');
                $table->foreign('mrf_request_revision_id','mrfrevid')->references('id')->on('security_module_mrf_requests_revisions', 'mrf_req_rev')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_mrf_request_travel_details')) {
            Schema::create('security_module_mrf_request_travel_details', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('mrf_request_id');
                $table->text('vehicle_make')->nullable();
                $table->text('vehicle_model')->nullable();;
                $table->text('vehicle_color')->nullable();;
                $table->text('vehicle_plate')->nullable();;
                $table->text('comm_gsm')->nullable();;
                $table->text('comm_sat_phone')->nullable();
                $table->boolean('comm_vhf_radio')->default(0);
                $table->boolean('comm_sat_tracker')->default(0);
                $table->boolean('ppe')->default(0);
                $table->boolean('medical_kit')->default(0);
                $table->text('personnel_on_board')->nullable();
                $table->unsignedSmallInteger('order')->default(0);
                $table->timestamps();

                $table->foreign('mrf_request_id','mrfid')->references('id')->on('security_module_mrf_requests','mrf_request')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_mrf_request_travel_details_revisions')) {
            Schema::create('security_module_mrf_request_travel_details_revisions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('mrf_request_revision_id');
                $table->text('vehicle_make')->nullable();
                $table->text('vehicle_model')->nullable();;
                $table->text('vehicle_color')->nullable();;
                $table->text('vehicle_plate')->nullable();;
                $table->text('comm_gsm')->nullable();;
                $table->text('comm_sat_phone')->nullable();
                $table->boolean('comm_vhf_radio')->default(0);
                $table->boolean('comm_sat_tracker')->default(0);
                $table->boolean('ppe')->default(0);
                $table->boolean('medical_kit')->default(0);
                $table->text('personnel_on_board')->nullable();
                $table->unsignedSmallInteger('order')->default(0);
                $table->timestamps();

                $table->foreign('mrf_request_revision_id','mrfrev')->references('id')->on('security_module_mrf_requests_revisions','mrf_req_for_rev')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_tar_request')) {
            Schema::create('security_module_tar_request', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->text('name')->nullable();
                $table->string('travel_purpose');
                $table->text('remarks')->nullable();
                $table->string('status')->default('saved');
                $table->unsignedInteger('user_id');
                $table->timestamp('submitted_date')->nullable();
                $table->text('disapproved_reasons')->nullable();
                $table->text('revision_needed')->nullable();
                $table->text('approved_comments')->nullable();
                $table->string('travel_type')->nullable(); // the value is one of : ['one-way-trip','round-trip','multi-location']
                $table->boolean('is_high_risk')->default(0);
                $table->boolean('heat_certificate')->default(0);
                $table->boolean('security_measure_email')->default(0);
                $table->boolean('security_measure_smart24')->default(0);
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_tar_request_revision')) {
            Schema::create('security_module_tar_request_revision', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->text('name')->nullable();
                $table->string('travel_purpose');
                $table->text('remarks')->nullable();
                $table->string('status')->default('saved');
                $table->unsignedInteger('user_id');
                $table->timestamp('submitted_date')->nullable();
                $table->unsignedBigInteger('tar_request_id');
                $table->unsignedInteger('user_who_edit')->nullable();
                $table->text('disapproved_reasons')->nullable();
                $table->text('revision_needed')->nullable();
                $table->text('approved_comments')->nullable();
                $table->string('travel_type')->nullable(); // the value is one of : ['one-way-trip','round-trip','multi-location']
                $table->boolean('is_high_risk')->default(0);
                $table->boolean('heat_certificate')->default(0);
                $table->boolean('security_measure_email')->default(0);
                $table->boolean('security_measure_smart24')->default(0);
                $table->timestamps();

                $table->foreign('tar_request_id','tarforrevision')->references('id')->on('security_module_tar_request')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('user_who_edit')->references('id')->on('users')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('security_module_tar_request_itineraries')) {
            Schema::create('security_module_tar_request_itineraries', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tar_request_id');
                $table->dateTime('date_travel')->nullable();
                $table->dateTime('return_date_travel')->nullable();
                $table->unsignedInteger('from_country_id')->nullable();
                $table->string('from_country_name')->nullable();
                $table->string('from_city');
                $table->unsignedInteger('to_country_id')->nullable();
                $table->string('to_country_name')->nullable();
                $table->string('to_city');
                $table->unsignedSmallInteger('order')->default(0);
                $table->boolean('overnight')->default(0);
                $table->text('overnight_explanation')->nullable();
                $table->boolean('is_high_risk')->default(0);
                $table->timestamps();

                $table->foreign('from_country_id')->references('id')->on('countries')->onDelete('set null');
                $table->foreign('to_country_id')->references('id')->on('countries')->onDelete('set null');
                $table->foreign('tar_request_id','tar')->references('id')->on('security_module_tar_request')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('security_module_tar_request_itineraries_revision')) {
            Schema::create('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('tar_request_revision_id');
                $table->dateTime('date_travel')->nullable();
                $table->dateTime('return_date_travel')->nullable();
                $table->unsignedInteger('from_country_id')->nullable();
                $table->string('from_country_name')->nullable();
                $table->text('from_city');
                $table->unsignedInteger('to_country_id')->nullable();
                $table->string('to_country_name')->nullable();
                $table->text('to_city');
                $table->unsignedSmallInteger('order')->default(0);
                $table->boolean('overnight')->default(0);
                $table->text('overnight_explanation')->nullable();
                $table->boolean('is_high_risk')->default(0);
                $table->timestamps();

                $table->foreign('tar_request_revision_id','tar_revision_id')->references('id')->on('security_module_tar_request_revision', 'tar_request_revision')->onDelete('cascade');
                $table->foreign('from_country_id', 'itineraries_revision_from_country_id')->references('id')->on('countries')->onDelete('set null');
                $table->foreign('to_country_id', 'itineraries_revision_to_country_id')->references('id')->on('countries')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('security_module_high_risk_cities')) {
            Schema::create('security_module_high_risk_cities', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('city');
                $table->unsignedInteger('country_id');
                $table->boolean('is_high_risk');
                $table->timestamps();

                $table->foreign('country_id')->references('id')->on('countries');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('security_module_high_risk_cities')) {
            Schema::dropIfExists('security_module_high_risk_cities');
        }

        if (Schema::hasTable('security_module_tar_request_itineraries_revision')) {
            Schema::dropIfExists('security_module_tar_request_itineraries_revision');
        }

        if (Schema::hasTable('security_module_tar_request_itineraries')) {
            Schema::dropIfExists('security_module_tar_request_itineraries');
        }

        if (Schema::hasTable('security_module_tar_request_revision')) {
            Schema::dropIfExists('security_module_tar_request_revision');
        }

        if (Schema::hasTable('security_module_tar_request')) {
            Schema::dropIfExists('security_module_tar_request');
        }

        if (Schema::hasTable('security_module_mrf_request_travel_details_revisions')) {
            Schema::dropIfExists('security_module_mrf_request_travel_details_revisions');
        }

        if (Schema::hasTable('security_module_mrf_request_travel_details')) {
            Schema::dropIfExists('security_module_mrf_request_travel_details');
        }

        if (Schema::hasTable('security_module_mrf_request_itineraries_revisions')) {
            Schema::dropIfExists('security_module_mrf_request_itineraries_revisions');
        }

        if (Schema::hasTable('security_module_mrf_request_itineraries')) {
            Schema::dropIfExists('security_module_mrf_request_itineraries');
        }

        if (Schema::hasTable('security_module_mrf_requests_revisions')) {
            Schema::dropIfExists('security_module_mrf_requests_revisions');
        }

        if (Schema::hasTable('security_module_mrf_requests')) {
            Schema::dropIfExists('security_module_mrf_requests');
        }

        if (Schema::hasTable('countries')) {
            if (Schema::hasColumn('countries', 'is_high_risk')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->dropColumn('is_high_risk');
                });
            }
        }

        if (Schema::hasTable('countries')) {
            if (Schema::hasColumn('countries', 'seen_in_security_module')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->dropColumn('seen_in_security_module');
                });
            }
        }

        if (Schema::hasTable('security_module_officer_countries')) {
            Schema::dropIfExists('security_module_officer_countries');
        };
    }
}
