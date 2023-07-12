<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSetImTestInQuizTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('quiz_templates', function (Blueprint $table) {
            $table->boolean('is_im_test')->default(0)->after('slug');
            $table->bigInteger('im_test_template_id')->unsigned()->nullable()->after('is_im_test');
            $table->integer('duration')->default(NULL)->nullable()->change();
            $table->integer('pass_score')->default(NULL)->nullable()->change();

            $table->foreign('im_test_template_id')->references('id')->on('im_test_templates');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quiz_templates', function (Blueprint $table) {
            $table->dropForeign('quiz_templates_im_test_template_id_foreign');
            $table->dropColumn('is_im_test');
            $table->dropColumn('im_test_template_id');
            $table->integer('duration')->default(1)->nullable(false)->change();
            $table->integer('pass_score')->default(70)->nullable(false)->change();
        });
    }
}
