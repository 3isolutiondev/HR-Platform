<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class JobStatusNewOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('job_status')->where('slug', 'reference-check')->update(['order' => 3]);
        DB::table('job_status')->where('slug', 'accepted')->update(['order' => 4]);
        DB::table('job_status')->where('slug', 'rejected')->update(['order' => 5]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('job_status')->where('slug', 'reference-check')->update(['order' => 5]);
        DB::table('job_status')->where('slug', 'accepted')->update(['order' => 3]);
        DB::table('job_status')->where('slug', 'rejected')->update(['order' => 4]);
    }
}
