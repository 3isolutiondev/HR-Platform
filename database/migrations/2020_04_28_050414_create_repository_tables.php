<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRepositoryTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('repository_category', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('repository', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('category_id');
            $table->string('name')->nullable();
            $table->bigInteger('media_id')->nullable();
            $table->bigInteger('attachments_id')->nullable();
            $table->string('file_name')->nullable();
            $table->string('download_url')->nullable();
            $table->string('file_url')->nullable();
            $table->string('status', 1)->nullable()->comment='1. Draft, 2. Publish';
            $table->string('type', 1)->nullable()->comment='1. National, 2. International';
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('repository_category')->onDelete('cascade');

        });

        Schema::create('repository_section', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('sub_section', 225);
            $table->text('sub_section_content');
            $table->bigInteger('repository_id')->unsigned();
            $table->timestamps();

            $table->foreign('repository_id')->references('id')->on('repository')->onDelete('cascade');
        });

        Schema::create('repository_holiday', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('date');
            $table->string('event');
            $table->bigInteger('repository_id')->unsigned();
            $table->timestamps();

            $table->foreign('repository_id')->references('id')->on('repository')->onDelete('cascade');
        });

        Schema::create('role_repository', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->timestamps();
        });

        DB::table('role_repository')->insert([
            ['name' => 'Administrator'],
            ['name' => 'All iMMAPers'],
            ['name' => 'Managers'],
            ['name' => 'Country Office'],
        ]);

        Schema::create('repository_permission', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('repository_id');
            
            $table->string('permission');
            $table->string('permission_id', 1);
           
            $table->timestamps();

            $table->foreign('repository_id')->references('id')->on('repository')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('role_repository')->onDelete('cascade');
        });

        Schema::create('repository_country_permission', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('immap_office_id');
           
            $table->unsignedBigInteger('repository_id');

            $table->string('permission');
            $table->string('permission_id', 1);

            $table->timestamps();

            $table->foreign('repository_id')->references('id')->on('repository')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('repository_permission');
        Schema::dropIfExists('role_repository');
        Schema::dropIfExists('repository_holiday');
        Schema::dropIfExists('repository_section');
        Schema::dropIfExists('repository');
        Schema::dropIfExists('repository_category');
        Schema::dropIfExists('repository_country_permission');
    }
}
