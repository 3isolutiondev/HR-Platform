<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAirTicketMrf extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('security_module_mrf_request_itineraries')) {
            Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
                if (!Schema::hasColumn('security_module_mrf_request_itineraries', 'upload_air_ticket')) {
                    $table->string('upload_air_ticket')->default('no');
                }
                if (!Schema::hasColumn('security_module_mrf_request_itineraries', 'upload_air_ticket_now')) {
                    $table->boolean('upload_air_ticket_now')->nullable();
                }
                if (!Schema::hasColumn('security_module_mrf_request_itineraries', 'air_ticket_id')) {
                    $table->unsignedInteger('air_ticket_id')->nullable();
                    $table->foreign('air_ticket_id','mrf_air_ticket_id')->references('id')->on('attachments')->onDelete('set null');
                }
            });
        }

        if (Schema::hasTable('security_module_mrf_request_itineraries_revisions')) {
            Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
                if (!Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'upload_air_ticket')) {
                    $table->string('upload_air_ticket')->default('no');
                }
                if (!Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'upload_air_ticket_now')) {
                    $table->boolean('upload_air_ticket_now')->nullable();
                }
                if (!Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'air_ticket_id')) {
                    $table->unsignedInteger('air_ticket_id')->nullable();
                    $table->foreign('air_ticket_id','rev_mrf_air_ticket_id')->references('id')->on('attachments')->onDelete('set null');
                }
            });
        }

        if (Schema::hasTable('security_module_critical_movements')) {
            Schema::dropIfExists('security_module_critical_movements');
        }

        if (Schema::hasTable('security_module_security_measures')) {
            Schema::dropIfExists('security_module_security_measures');
        }

        if (Schema::hasTable('security_module_travel_purposes')) {
            Schema::dropIfExists('security_module_travel_purposes');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('security_module_mrf_request_itineraries')) {
            Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
                if (Schema::hasColumn('security_module_mrf_request_itineraries', 'air_ticket_id')) {
                    $table->dropForeign('mrf_air_ticket_id');
                    $table->dropColumn('air_ticket_id');
                }
                if (Schema::hasColumn('security_module_mrf_request_itineraries', 'upload_air_ticket_now')) {
                    $table->dropColumn('upload_air_ticket_now');
                }
                if (Schema::hasColumn('security_module_mrf_request_itineraries', 'upload_air_ticket')) {
                    $table->dropColumn('upload_air_ticket');
                }
            });
        }

        if (Schema::hasTable('security_module_mrf_request_itineraries_revisions')) {
            Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
                if (Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'air_ticket_id')) {
                    $table->dropForeign('rev_mrf_air_ticket_id');
                    $table->dropColumn('air_ticket_id');
                }
                if (Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'upload_air_ticket_now')) {
                    $table->dropColumn('upload_air_ticket_now');
                }
                if (Schema::hasColumn('security_module_mrf_request_itineraries_revisions', 'upload_air_ticket')) {
                    $table->dropColumn('upload_air_ticket');
                }
            });
        }
    }
}
