<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNewJobStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_user', function (Blueprint $table) {
            $table->integer('reference_check_sent')->default(0);
        });
        Schema::table('job_status', function (Blueprint $table) {
            $table->integer('has_reference_check')->default(0);
        });

        $job_status_data = [
            [ 'has_reference_check' => 1, 'status' => 'Reference Check', 'slug' => 'reference-check', 'default_status' => 0, 'last_step' => 0, 'order' => 4, 'is_interview' => 0 ],
        ];

        foreach ($job_status_data as $key => $value) {
            DB::table('job_status')->insert($value);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // 
        Shema::table('job_user', function (Blueprint $table) {
            $table->dropColumn('reference_check_sent');
        });

        Schema::table('job_status', function (Blueprint $table) {
            $table->dropColumn('has_reference_check');
        });

        DB::table('job_status')->where('slug', 'reference-check')->delete();
    }
}
