<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameTableNameToFitP11 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('clerical_grades', 'p11_clerical_grades');
        Schema::rename('dependents', 'p11_dependents');
        Schema::rename('education_schools', 'p11_education_schools');
        Schema::rename('education_universities', 'p11_education_universities');
        Schema::rename('employment_records', 'p11_employment_records');
        Schema::rename('languages', 'p11_languages');
        Schema::rename('professional_societies', 'p11_professional_societies');
        Schema::rename('publications', 'p11_publications');
        Schema::rename('references', 'p11_references');
        Schema::rename('relatives_employed_by_public_int_org', 'p11_relatives_employed_by_public_int_org');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::rename('p11_clerical_grades', 'clerical_grades');
        Schema::rename('p11_dependents', 'dependents');
        Schema::rename('p11_education_schools', 'education_schools');
        Schema::rename('p11_education_universities', 'education_universities');
        Schema::rename('p11_employment_records', 'employment_records');
        Schema::rename('p11_languages', 'languages');
        Schema::rename('p11_professional_societies', 'professional_societies');
        Schema::rename('p11_publications', 'publications');
        Schema::rename('p11_references', 'references');
        Schema::rename('p11_relatives_employed_by_public_int_org', 'relatives_employed_by_public_int_org');
    }
}
