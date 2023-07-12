<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBdateOnP11DependentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_dependents', function (Blueprint $table) {
            $bmonth = [
                '01','02','03','04','05','06','07','08','09','10',
                '11','12'
            ];

            $bdate = array_merge($bmonth, [
                '13','14','15','16','17','18','19','20',
                '21','22','23','24','25','26','27','28','29','30',
                '31'
            ]);

            $table->enum('bdate', $bdate)->nullable()->after('full_name');
            $table->enum('bmonth', $bmonth)->nullable()->after('bdate');
            $table->year('byear')->nullable()->after('bmonth');

            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_dependents', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn('bdate');
            $table->dropColumn('bmonth');
            $table->dropColumn('byear');
        });
    }
}
