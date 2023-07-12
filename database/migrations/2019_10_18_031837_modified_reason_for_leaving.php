<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifiedReasonForLeaving extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_employment_records', function (Blueprint $table) {
            $table->text('reason_for_leaving')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_employment_records', function (Blueprint $table) {
            $table->text('reason_for_leaving')->nullable(false)->change();
        });
    }
}
