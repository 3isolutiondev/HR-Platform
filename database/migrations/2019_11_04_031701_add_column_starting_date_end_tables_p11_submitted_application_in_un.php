<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnStartingDateEndTablesP11SubmittedApplicationInUn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->dropColumn('bmonth');
            $table->dropColumn('byear');
            $table->date('starting_date')->nullable()->after('profile_id');
            $table->date('ending_date')->nullable()->after('starting_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->dropColumn('starting_date');
            $table->dropColumn('ending_date');
            $bmonth = [
                '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                '11', '12'
            ];
            $table->enum('bmonth', $bmonth)->after('profile_id');
            $table->year('byear')->after('bmonth');
        });
    }
}
