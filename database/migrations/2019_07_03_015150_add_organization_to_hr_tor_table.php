<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrganizationToHrTorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('durations')) {
            Schema::create('durations', function (Blueprint $table) {
                $table->bigIncrements('id')->unsigned();
                $table->string('name');
                $table->timestamps();
            });
        }

        Schema::table('hr_tor', function (Blueprint $table) {
            if (!Schema::hasColumn('hr_tor', 'organization')) {
                $table->string('organization')->after('slug');
            }
            if (!Schema::hasColumn('hr_tor', 'mailing_address')) {
                $table->text('mailing_address')->after('relationship')->nullable();
            }
            if (!Schema::hasColumn('hr_tor', 'duration_id')) {
                $table->bigInteger('duration_id')->unsigned()->nullable()->after('mailing_address');
            }

            $table->foreign('duration_id')->references('id')->on('durations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropForeign('hr_tor_duration_id_foreign');
            $table->dropColumn('duration_id');
            $table->dropColumn('organization');
            $table->dropColumn('mailing_address');
        });

        Schema::dropIfExists('durations');
    }
}
