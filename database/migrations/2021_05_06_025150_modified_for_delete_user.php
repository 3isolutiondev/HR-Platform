<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Job_user_move_status_history;
use App\Models\Job;
use App\Models\Country;
use App\Models\Profile;
use App\Models\User;
use App\Models\Attachment;
use App\Models\Imtest\Follow_im_test;
use App\Models\JobInterviewFiles;

class ModifiedForDeleteUser extends Migration
{
    protected function upJobApplication()
    {
        if (Schema::hasTable('job_user')) {
            if (Schema::hasColumn('job_user', 'user_id')) {
                Schema::table('job_user', function (Blueprint $table) {
                    $userIds = DB::table('job_user')->select('user_id')->distinct()->get()->pluck('user_id')->toArray();
                    if (!empty($userIds)) {
                        $deletedIds = [];
                        foreach($userIds as $userId) {
                            if (User::where('id', $userId)->doesntExist()) {
                                array_push($deletedIds, $userId);
                            }
                        }
                        if (count($deletedIds) > 0) {
                            DB::table('job_user')->whereIn('user_id', $deletedIds)->delete();
                        }
                    }
                    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                });
            }
            if (Schema::hasColumn('job_user', 'job_id')) {
                Schema::table('job_user', function (Blueprint $table) {
                    $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                });
            }
        }

        if (Schema::hasTable('job_user_move_status_history')) {
            if (Schema::hasColumn('job_user_move_status_history', 'user_move_id')) {
                Schema::table('job_user_move_status_history', function (Blueprint $table) {
                    Job_user_move_status_history::where('user_move_id', 0)->update(['user_move_id' => null]);
                    $table->foreign('user_move_id', 'user_who_move_it')->references('id')->on('users')->onDelete('set null');
                });
            }
            if (Schema::hasColumn('job_user_move_status_history', 'job_id')) {
                Schema::table('job_user_move_status_history', function (Blueprint $table) {
                    $jobIds = Job_user_move_status_history::select('job_id')->distinct()->get()->pluck('job_id')->toArray();
                    if (!empty($jobIds)) {
                        $deletedIds = [];
                        foreach($jobIds as $jobId) {
                            if (Job::where('id', $jobId)->doesntExist()) {
                                array_push($deletedIds, $jobId);
                            }
                        }
                        if (count($deletedIds) > 0) {
                            Job_user_move_status_history::whereIn('job_id', $deletedIds)->delete();
                        }
                    }
                    $table->foreign('job_id', 'history_job_id')->references('id')->on('jobs')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfiles()
    {
        if (Schema::hasTable('profiles')) {
            if (Schema::hasColumn('profiles', 'user_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $userIds = DB::table('profiles')->select('user_id')->distinct()->get()->pluck('user_id')->toArray();
                    $deletedIds = [];
                    if (!empty($userIds)) {
                        foreach($userIds as $userId) {
                            if (User::where('id', $userId)->doesntExist()) {
                                array_push($deletedIds, $userId);
                            }
                        }
                    }
                    if (count($deletedIds) > 0) {
                        Profile::whereIn('user_id', $deletedIds)->delete();
                    }
                    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileNationalities()
    {
        if (Schema::hasTable('p11_country_profile')) {
            if (Schema::hasColumn('p11_country_profile', 'profile_id')) {
                Schema::table('p11_country_profile', function (Blueprint $table) {
                    $profileIds = DB::table('p11_country_profile')->select('profile_id')->distinct()->get()->pluck('profile_id')->toArray();
                    if (!empty($profileIds)) {
                        $deletedIds = [];
                        foreach($profileIds as $profileId) {
                            if (Profile::where('id', $profileId)->doesntExist()) {
                                array_push($deletedIds, $profileId);
                            }
                        }
                        if (count($deletedIds) > 0) {
                            DB::table('p11_country_profile')->whereIn('profile_id', $deletedIds)->delete();
                        }
                    }
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileAddress()
    {
        if (Schema::hasTable('p11_addresses')) {
            if (Schema::hasColumn('p11_addresses', 'profile_id')) {
                Schema::table('p11_addresses', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upDeleteP11BirthNationalities()
    {
        if (Schema::hasTable('p11_birth_nationalities')) {
            $p11BirthNationalities = DB::table('p11_birth_nationalities')->get();
            if ($p11BirthNationalities->isEmpty()) {
                Schema::dropIfExists('p11_birth_nationalities');
            }
        }
    }

    protected function upProfileCountryExperiences()
    {
        if (Schema::hasTable('p11_country_experiences')) {
            if (Schema::hasColumn('p11_country_experiences', 'profile_id')) {
                Schema::table('p11_country_experiences', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileDependents()
    {
        if (Schema::hasTable('p11_dependents')) {
            if (Schema::hasColumn('p11_dependents', 'profile_id')) {
                Schema::table('p11_dependents', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileEducationFormalTraining()
    {
        if (Schema::hasTable('p11_education_schools')) {
            if (Schema::hasColumn('p11_education_schools', 'profile_id')) {
                Schema::table('p11_education_schools', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
            if (Schema::hasColumn('p11_education_schools', 'certificate_file_id')) {
                Schema::table('p11_education_schools', function (Blueprint $table) {
                    $table->dropForeign(['certificate_file_id']);
                    $table->foreign('certificate_file_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }
        }
    }

    protected function upProfileEducationUniversity()
    {
        if (Schema::hasTable('p11_education_universities')) {
            if (Schema::hasColumn('p11_education_universities', 'profile_id')) {
                Schema::table('p11_education_universities', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
            if (Schema::hasColumn('p11_education_universities', 'diploma_file_id')) {
                Schema::table('p11_education_universities', function (Blueprint $table) {
                    $table->dropForeign(['diploma_file_id']);
                    $table->foreign('diploma_file_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }
        }
    }

    protected function upProfileEmploymentRecords()
    {
        if (Schema::hasTable('p11_employment_records')) {
            if (Schema::hasColumn('p11_employment_records', 'profile_id')) {
                Schema::table('p11_employment_records', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }

            if (Schema::hasTable('p11_employment_records_sectors')) {
                if (Schema::hasColumn('p11_employment_records_sectors', 'p11_employment_id')) {
                    Schema::table('p11_employment_records_sectors', function (Blueprint $table) {
                        $table->dropForeign(['p11_employment_id']);
                        $table->foreign('p11_employment_id')->references('id')->on('p11_employment_records')->onDelete('cascade');
                    });
                }
            }

            if (Schema::hasTable('p11_employment_records_skills')) {
                if (Schema::hasColumn('p11_employment_records_skills', 'p11_employment_record_id')) {
                    Schema::table('p11_employment_records_skills', function (Blueprint $table) {
                        $table->dropForeign(['p11_employment_record_id']);
                        $table->foreign('p11_employment_record_id')->references('id')->on('p11_employment_records')->onDelete('cascade');
                    });
                }
            }
        }
    }

    protected function upProfileFieldOfWorks()
    {
        if (Schema::hasTable('p11_field_of_works')) {
            if (Schema::hasColumn('p11_field_of_works', 'profile_id')) {
                Schema::table('p11_field_of_works', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileLanguages()
    {
        if (Schema::hasTable('p11_languages')) {
            if (Schema::hasColumn('p11_languages', 'profile_id')) {
                Schema::table('p11_languages', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileLegalPermanentResidenceStatus()
    {
        if (Schema::hasTable('p11_legal_permanent_residence_status')) {
            if (Schema::hasColumn('p11_legal_permanent_residence_status', 'profile_id')) {
                Schema::table('p11_legal_permanent_residence_status', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }

        if (Schema::hasTable('p11_legal_permanent_residence_status_countries')) {
            if (Schema::hasColumn('p11_legal_permanent_residence_status_countries', 'profile_id')) {
                Schema::table('p11_legal_permanent_residence_status_countries', function (Blueprint $table) {
                    $table->foreign('profile_id', 'legal_permanent_profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfilePermanentCivilServants()
    {
        if (Schema::hasTable('p11_permanent_civil_servants')) {
            if (Schema::hasColumn('p11_permanent_civil_servants', 'profile_id')) {
                Schema::table('p11_permanent_civil_servants', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfilePhones()
    {
        if (Schema::hasTable('p11_phones')) {
            if (Schema::hasColumn('p11_phones', 'profile_id')) {
                Schema::table('p11_phones', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfilePortfolios()
    {
        if (Schema::hasTable('p11_portfolios')) {
            if (Schema::hasColumn('p11_portfolios', 'profile_id')) {
                Schema::table('p11_portfolios', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }

            if (Schema::hasColumn('p11_portfolios', 'attachment_id')) {
                Schema::table('p11_portfolios', function (Blueprint $table) {
                    $table->dropForeign(['attachment_id']);
                    $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }

            if (Schema::hasTable('p11_portfolios_sectors')) {
                if (Schema::hasColumn('p11_portfolios_sectors', 'p11_portfolio_id')) {
                    Schema::table('p11_portfolios_sectors', function (Blueprint $table) {
                        $table->dropForeign(['p11_portfolio_id']);
                        $table->foreign('p11_portfolio_id')->references('id')->on('p11_portfolios')->onDelete('cascade');
                    });
                }
            }

            if (Schema::hasTable('p11_portfolios_skills')) {
                if (Schema::hasColumn('p11_portfolios_skills', 'p11_portfolio_id')) {
                    Schema::table('p11_portfolios_skills', function (Blueprint $table) {
                        $table->dropForeign(['p11_portfolio_id']);
                        $table->foreign('p11_portfolio_id')->references('id')->on('p11_portfolios')->onDelete('cascade');
                    });
                }
            }
        }
    }

    protected function upProfilePresentNationalities()
    {
        if (Schema::hasTable('p11_present_nationalities')) {
            if (Schema::hasColumn('p11_present_nationalities', 'profile_id')) {
                Schema::table('p11_present_nationalities', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileProfessionalSocieties()
    {
        if (Schema::hasTable('p11_professional_societies')) {
            if (Schema::hasColumn('p11_professional_societies', 'profile_id')) {
                Schema::table('p11_professional_societies', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }

        if (Schema::hasTable('p11_professional_society_sector')) {
            if (Schema::hasColumn('p11_professional_society_sector', 'p11_society_id')) {
                Schema::table('p11_professional_society_sector', function (Blueprint $table) {
                    $table->dropForeign(['p11_society_id']);
                    $table->foreign('p11_society_id')->references('id')->on('p11_professional_societies')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfilePublications()
    {
        if (Schema::hasTable('p11_publications')) {
            if (Schema::hasColumn('p11_publications', 'publication_file_id')) {
                Schema::table('p11_publications', function (Blueprint $table) {
                    $table->dropForeign(['publication_file_id']);
                    $table->foreign('publication_file_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }

            if (Schema::hasColumn('p11_publications', 'profile_id')) {
                Schema::table('p11_publications', function (Blueprint $table) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileReferences()
    {
        if (Schema::hasTable('p11_references')) {
            if (Schema::hasColumn('p11_references', 'profile_id')) {
                Schema::table('p11_references', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileRelatives()
    {
        if (Schema::hasTable('p11_relatives_employed_by_public_int_org')) {
            if (Schema::hasColumn('p11_relatives_employed_by_public_int_org', 'profile_id')) {
                Schema::table('p11_relatives_employed_by_public_int_org', function (Blueprint $table) {
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileSectors()
    {
        if (Schema::hasTable('p11_sectors')) {
            if (Schema::hasColumn('p11_sectors', 'profile_id')) {
                Schema::table('p11_sectors', function (Blueprint $table) {
                    $table->dropForeign('p11_profiles_sectors_profile_id_foreign');
                    $table->foreign('profile_id', 'p11_profiles_sectors_profile_id_foreign')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileSkills()
    {
        if (Schema::hasTable('p11_skills')) {
            if (Schema::hasColumn('p11_skills', 'profile_id')) {
                Schema::table('p11_skills', function (Blueprint $table) {
                    $table->dropForeign('p11_profiles_skills_profile_id_foreign');
                    $table->foreign('profile_id', 'p11_profiles_skills_profile_id_foreign')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileSubmittedApplicationInUN()
    {
        if (Schema::hasTable('p11_submitted_application_in_un')) {
            if (Schema::hasColumn('p11_submitted_application_in_un', 'profile_id')) {
                Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileRosterProcess()
    {
        if (Schema::hasTable('profile_roster_processes')) {
            if (Schema::hasColumn('profile_roster_processes', 'profile_id')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upProfileCvIdCardPassportSignature() {
        if (Schema::hasTable('profiles')) {
            if (Schema::hasColumn('profiles', 'cv_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $cvIds = Profile::select('cv_id')->distinct()->get()->pluck('cv_id')->toArray();
                    if (!empty($cvIds)) {
                        $updatedIds = [];
                        foreach($cvIds as $cvId) {
                            if (Attachment::where('id', $cvId)->doesntExist()) {
                                array_push($updatedIds, $cvId);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Profile::whereIn('cv_id', $updatedIds)->update(['cv_id' => NULL]);
                        }
                    }

                    $table->foreign('cv_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }

            if (Schema::hasColumn('profiles', 'id_card_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $cardIds = Profile::select('id_card_id')->distinct()->get()->pluck('id_card_id')->toArray();
                    if (!empty($cardIds)) {
                        $updatedIds = [];
                        foreach($cardIds as $cardId) {
                            if (Attachment::where('id', $cardId)->doesntExist()) {
                                array_push($updatedIds, $cardId);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Profile::whereIn('id_card_id', $updatedIds)->update(['id_card_id' => NULL]);
                        }
                    }
                    $table->foreign('id_card_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }

            if (Schema::hasColumn('profiles', 'passport_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $passportIds = Profile::select('passport_id')->distinct()->get()->pluck('passport_id')->toArray();
                    if (!empty($passportIds)) {
                        $updatedIds = [];
                        foreach($passportIds as $passportId) {
                            if (Attachment::where('id', $passportId)->doesntExist()) {
                                array_push($updatedIds, $passportId);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Profile::whereIn('passport_id', $updatedIds)->update(['passport_id' => NULL]);
                        }
                    }
                    $table->foreign('passport_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }

            if (Schema::hasColumn('profiles', 'signature_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $signatureIds = Profile::select('signature_id')->distinct()->get()->pluck('signature_id')->toArray();
                    if (!empty($signatureIds)) {
                        $updatedIds = [];
                        foreach($signatureIds as $signatureId) {
                            if (Attachment::where('id', $signatureId)->doesntExist()) {
                                array_push($updatedIds, $signatureId);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Profile::whereIn('signature_id', $updatedIds)->update(['signature_id' => NULL]);
                        }
                    }
                    $table->foreign('signature_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }
        }
    }

    protected function upReferenceCheckAnswer()
    {
        if (Schema::hasTable('user_answer_question_reference')) {
            if (Schema::hasColumn('user_answer_question_reference', 'profil_id')) {
                Schema::table('user_answer_question_reference', function (Blueprint $table) {
                    $table->dropForeign(['p11_references_id']);
                    $table->foreign('p11_references_id')->references('id')->on('p11_references')->onDelete('cascade');
                    $table->foreign('profil_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }
    }

    protected function upImTestAnswer()
    {
        if (Schema::hasTable('follow_im_test')) {
            if (Schema::hasColumn('follow_im_test', 'profil_id')) {
                Schema::table('follow_im_test', function (Blueprint $table) {
                    $table->unsignedInteger('file1')->nullable()->change();
                    $table->unsignedInteger('file2')->nullable()->change();
                    $table->unsignedInteger('file3')->nullable()->change();
                    $file1Ids = Follow_im_test::select('file1')->distinct()->get()->pluck('file1')->toArray();
                    if (!empty($file1Ids)) {
                        $updatedIds = [];
                        foreach($file1Ids as $file1Id) {
                            if (Attachment::where('id', $file1Id)->doesntExist()) {
                                array_push($updatedIds, $file1Id);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Follow_im_test::whereIn('file1', $updatedIds)->update(['file1' => NULL]);
                        }
                    }
                    $file2Ids = Follow_im_test::select('file2')->distinct()->get()->pluck('file2')->toArray();
                    if (!empty($file2Ids)) {
                        $updatedIds = [];
                        foreach($file2Ids as $file2Id) {
                            if (Attachment::where('id', $file2Id)->doesntExist()) {
                                array_push($updatedIds, $file2Id);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Follow_im_test::whereIn('file2', $updatedIds)->update(['file2' => NULL]);
                        }
                    }
                    $file3Ids = Follow_im_test::select('file3')->distinct()->get()->pluck('file3')->toArray();
                    if (!empty($file3Ids)) {
                        $updatedIds = [];
                        foreach($file3Ids as $file3Id) {
                            if (Attachment::where('id', $file3Id)->doesntExist()) {
                                array_push($updatedIds, $file3Id);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            Follow_im_test::whereIn('file3', $updatedIds)->update(['file3' => NULL]);
                        }
                    }
                    $table->foreign('file1')->references('id')->on('attachments')->onDelete('set null');
                    $table->foreign('file2')->references('id')->on('attachments')->onDelete('set null');
                    $table->foreign('file3')->references('id')->on('attachments')->onDelete('set null');
                });
            }
        }
    }

    protected function upJobManagers()
    {
        if (Schema::hasTable('job_managers')) {
            if (Schema::hasColumn('job_managers', 'user_id')) {
                Schema::table('job_managers', function (Blueprint $table) {
                    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                });
            }
        }
    }

    protected function upJobManagerComments()
    {
        if (Schema::hasTable('job_manager_comments')) {
            if (Schema::hasColumn('job_manager_comments', 'user_id')) {
                Schema::table('job_manager_comments', function (Blueprint $table) {
                    $table->foreign('comment_by_id')->references('id')->on('users')->onDelete('set null');
                });
            }
        }
    }

    protected function upJobInterviewFiles()
    {
        if (Schema::hasTable('jobs_interview_files')) {
            if (Schema::hasColumn('jobs_interview_files', 'user_interview_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->unsignedInteger('user_interview_id')->nullable()->change();
                });
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $jobInterviewFileIds = JobInterviewFiles::select('user_interview_id')->distinct()->get()->pluck('user_interview_id')->toArray();
                    if (!empty($jobInterviewFileIds)) {
                        $updatedIds = [];
                        foreach($jobInterviewFileIds as $jobInterviewFileId) {
                            if (Attachment::where('id', $jobInterviewFileId)->doesntExist()) {
                                array_push($updatedIds, $jobInterviewFileId);
                            }
                        }
                        if (count($updatedIds) > 0) {
                            JobInterviewFiles::whereIn('user_interview_id', $updatedIds)->update(['user_interview_id' => NULL]);
                        }
                    }
                    $table->dropForeign(['user_interview_id']);
                    $table->foreign('user_interview_id')->references('id')->on('users')->onDelete('set null');
                });
            }
            if (Schema::hasColumn('jobs_interview_files', 'attachments_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->unsignedInteger('attachments_id')->nullable()->change();
                    $table->foreign('attachments_id')->references('id')->on('attachments')->onDelete('set null');
                });
            }
            if (Schema::hasColumn('jobs_interview_files', 'media_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->unsignedInteger('media_id')->nullable()->change();
                    $table->foreign('media_id')->references('id')->on('media')->onDelete('set null');
                });
            }
        }
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->upProfilePhones();
        $this->upProfileNationalities();
        $this->upProfileAddress();
        $this->upDeleteP11BirthNationalities();
        $this->upProfileCountryExperiences();
        $this->upProfileDependents();
        $this->upProfileEducationFormalTraining();
        $this->upProfileEducationUniversity();
        $this->upProfileEmploymentRecords();
        $this->upProfileFieldOfWorks();
        $this->upProfileLanguages();
        $this->upProfileLegalPermanentResidenceStatus();
        $this->upProfilePermanentCivilServants();
        $this->upProfilePortfolios();
        $this->upProfilePresentNationalities();
        $this->upProfileProfessionalSocieties();
        $this->upProfilePublications();
        $this->upProfileReferences();
        $this->upProfileRelatives();
        $this->upProfileSectors();
        $this->upProfileSkills();
        $this->upProfileSubmittedApplicationInUN();
        $this->upProfileRosterProcess();
        $this->upProfileCvIdCardPassportSignature();
        $this->upReferenceCheckAnswer();
        $this->upImTestAnswer();
        $this->upJobManagers();
        $this->upJobManagerComments();
        $this->upJobInterviewFiles();
        $this->upJobApplication();
        $this->upProfiles();
    }

    protected function downJobApplication()
    {
        if (Schema::hasTable('job_user')) {
            if (Schema::hasColumn('job_user', 'user_id')) {
                Schema::table('job_user', function (Blueprint $table) {
                    $table->dropForeign('job_user_user_id_foreign');
                });
            }
            if (Schema::hasColumn('job_user', 'job_id')) {
                Schema::table('job_user', function (Blueprint $table) {
                    $table->dropForeign('job_user_job_id_foreign');
                });
            }
        }

        if (Schema::hasTable('job_user_move_status_history')) {
            if (Schema::hasColumn('job_user_move_status_history', 'user_move_id')) {
                Schema::table('job_user_move_status_history', function (Blueprint $table) {
                    $table->dropForeign('user_who_move_it');
                });
            }
            if (Schema::hasColumn('job_user_move_status_history', 'job_id')) {
                Schema::table('job_user_move_status_history', function (Blueprint $table) {
                    $table->dropForeign('history_job_id');
                });
            }
        }
    }

    protected function downProfiles()
    {
        if (Schema::hasTable('profiles')) {
            if (Schema::hasColumn('profiles', 'user_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign(['user_id']);
                });
            }
        }
    }

    protected function downProfileNationalities()
    {
        if (Schema::hasTable('p11_country_profile')) {
            if (Schema::hasColumn('p11_country_profile', 'profile_id')) {
                Schema::table('p11_country_profile', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileAddress()
    {
        if (Schema::hasTable('p11_addresses')) {
            if (Schema::hasColumn('p11_addresses', 'profile_id')) {
                Schema::table('p11_addresses', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileCountryExperiences()
    {
        if (Schema::hasTable('p11_country_experiences')) {
            if (Schema::hasColumn('p11_country_experiences', 'profile_id')) {
                Schema::table('p11_country_experiences', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileDependents()
    {
        if (Schema::hasTable('p11_dependents')) {
            if (Schema::hasColumn('p11_dependents', 'profile_id')) {
                Schema::table('p11_dependents', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileEducationFormalTraining()
    {
        if (Schema::hasTable('p11_education_schools')) {
            if (Schema::hasColumn('p11_education_schools', 'profile_id')) {
                Schema::table('p11_education_schools', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
            if (Schema::hasColumn('p11_education_schools', 'certificate_file_id')) {
                Schema::table('p11_education_schools', function (Blueprint $table) {
                    $table->dropForeign(['certificate_file_id']);
                    $table->foreign('certificate_file_id')->references('id')->on('attachments')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileEducationUniversity()
    {
        if (Schema::hasTable('p11_education_universities')) {
            if (Schema::hasColumn('p11_education_universities', 'profile_id')) {
                Schema::table('p11_education_universities', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
            if (Schema::hasColumn('p11_education_universities', 'diploma_file_id')) {
                Schema::table('p11_education_universities', function (Blueprint $table) {
                    $table->dropForeign(['diploma_file_id']);
                    $table->foreign('diploma_file_id')->references('id')->on('attachments')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileEmploymentRecords()
    {
        if (Schema::hasTable('p11_employment_records')) {
            if (Schema::hasColumn('p11_employment_records', 'profile_id')) {
                Schema::table('p11_employment_records', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }

            if (Schema::hasTable('p11_employment_records_sectors')) {
                if (Schema::hasColumn('p11_employment_records_sectors', 'p11_employment_id')) {
                    Schema::table('p11_employment_records_sectors', function (Blueprint $table) {
                        $table->dropForeign(['p11_employment_id']);
                        $table->foreign('p11_employment_id')->references('id')->on('p11_employment_records')->onDelete('restrict');
                    });
                }
            }

            if (Schema::hasTable('p11_employment_records_skills')) {
                if (Schema::hasColumn('p11_employment_records_skills', 'p11_employment_record_id')) {
                    Schema::table('p11_employment_records_skills', function (Blueprint $table) {
                        $table->dropForeign(['p11_employment_record_id']);
                        $table->foreign('p11_employment_record_id')->references('id')->on('p11_employment_records')->onDelete('restrict');
                    });
                }
            }
        }
    }

    protected function downProfileFieldOfWorks()
    {
        if (Schema::hasTable('p11_field_of_works')) {
            if (Schema::hasColumn('p11_field_of_works', 'profile_id')) {
                Schema::table('p11_field_of_works', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileLanguages()
    {
        if (Schema::hasTable('p11_languages')) {
            if (Schema::hasColumn('p11_languages', 'profile_id')) {
                Schema::table('p11_languages', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileLegalPermanentResidenceStatus()
    {
        if (Schema::hasTable('p11_legal_permanent_residence_status')) {
            if (Schema::hasColumn('p11_legal_permanent_residence_status', 'profile_id')) {
                Schema::table('p11_legal_permanent_residence_status', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }

        if (Schema::hasTable('p11_legal_permanent_residence_status_countries')) {
            if (Schema::hasColumn('p11_legal_permanent_residence_status_countries', 'profile_id')) {
                Schema::table('p11_legal_permanent_residence_status_countries', function (Blueprint $table) {
                    $table->dropForeign('legal_permanent_profile_id');
                });
            }
        }
    }

    protected function downProfilePermanentCivilServants()
    {
        if (Schema::hasTable('p11_permanent_civil_servants')) {
            if (Schema::hasColumn('p11_permanent_civil_servants', 'profile_id')) {
                Schema::table('p11_permanent_civil_servants', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfilePhones()
    {
        if (Schema::hasTable('p11_phones')) {
            if (Schema::hasColumn('p11_phones', 'profile_id')) {
                Schema::table('p11_phones', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfilePortfolios()
    {
        if (Schema::hasTable('p11_portfolios')) {
            if (Schema::hasColumn('p11_portfolios', 'profile_id')) {
                Schema::table('p11_portfolios', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->dropForeign(['attachment_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                    $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('restrict');
                });
            }

            if (Schema::hasTable('p11_portfolios_sectors')) {
                if (Schema::hasColumn('p11_portfolios_sectors', 'p11_portfolio_id')) {
                    Schema::table('p11_portfolios_sectors', function (Blueprint $table) {
                        $table->dropForeign(['p11_portfolio_id']);
                        $table->foreign('p11_portfolio_id')->references('id')->on('p11_portfolios')->onDelete('restrict');
                    });
                }
            }

            if (Schema::hasTable('p11_portfolios_skills')) {
                if (Schema::hasColumn('p11_portfolios_skills', 'p11_portfolio_id')) {
                    Schema::table('p11_portfolios_skills', function (Blueprint $table) {
                        $table->dropForeign(['p11_portfolio_id']);
                        $table->foreign('p11_portfolio_id')->references('id')->on('p11_portfolios')->onDelete('restrict');
                    });
                }
            }
        }
    }

    protected function downProfilePresentNationalities()
    {
        if (Schema::hasTable('p11_present_nationalities')) {
            if (Schema::hasColumn('p11_present_nationalities', 'profile_id')) {
                Schema::table('p11_present_nationalities', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileProfessionalSocieties()
    {
        if (Schema::hasTable('p11_professional_societies')) {
            if (Schema::hasColumn('p11_professional_societies', 'profile_id')) {
                Schema::table('p11_professional_societies', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
                });
            }
        }

        if (Schema::hasTable('p11_professional_society_sector')) {
            if (Schema::hasColumn('p11_professional_society_sector', 'p11_society_id')) {
                Schema::table('p11_professional_society_sector', function (Blueprint $table) {
                    $table->dropForeign(['p11_society_id']);
                    $table->foreign('p11_society_id')->references('id')->on('p11_professional_societies')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfilePublications()
    {
        if (Schema::hasTable('p11_publications')) {
            if (Schema::hasColumn('p11_publications', 'publication_file_id')) {
                Schema::table('p11_publications', function (Blueprint $table) {
                    $table->dropForeign(['publication_file_id']);
                    $table->foreign('publication_file_id')->references('id')->on('attachments')->onDelete('restrict');
                });
            }

            if (Schema::hasColumn('p11_publications', 'profile_id')) {
                Schema::table('p11_publications', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                });
            }
        }
    }

    protected function downProfileReferences()
    {
        if (Schema::hasTable('p11_references')) {
            if (Schema::hasColumn('p11_references', 'profile_id')) {
                Schema::table('p11_references', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileRelatives()
    {
        if (Schema::hasTable('p11_relatives_employed_by_public_int_org')) {
            if (Schema::hasColumn('p11_relatives_employed_by_public_int_org', 'profile_id')) {
                Schema::table('p11_relatives_employed_by_public_int_org', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                });
            }
        }
    }

    protected function downProfileSectors()
    {
        if (Schema::hasTable('p11_sectors')) {
            if (Schema::hasColumn('p11_sectors', 'profile_id')) {
                Schema::table('p11_sectors', function (Blueprint $table) {
                    $table->dropForeign('p11_profiles_sectors_profile_id_foreign');
                    $table->foreign('profile_id', 'p11_profiles_sectors_profile_id_foreign')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileSkills()
    {
        if (Schema::hasTable('p11_skills')) {
            if (Schema::hasColumn('p11_skills', 'profile_id')) {
                Schema::table('p11_skills', function (Blueprint $table) {
                    $table->dropForeign('p11_profiles_skills_profile_id_foreign');
                    $table->foreign('profile_id', 'p11_profiles_skills_profile_id_foreign')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileSubmittedApplicationInUN()
    {
        if (Schema::hasTable('p11_submitted_application_in_un')) {
            if (Schema::hasColumn('p11_submitted_application_in_un', 'profile_id')) {
                Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }

    protected function downProfileRosterProcess()
    {
        if (Schema::hasTable('profile_roster_processes')) {
            if (Schema::hasColumn('profile_roster_processes', 'profile_id')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->dropForeign(['profile_id']);
                    $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('restrict');
                });
            }
        }
    }


    protected function downProfileCvIdCardPassportSignature() {
        if (Schema::hasTable('profiles')) {
            if (Schema::hasColumn('profiles', 'cv_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign(['cv_id']);
                });
            }

            if (Schema::hasColumn('profiles', 'id_card_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign(['id_card_id']);
                });
            }

            if (Schema::hasColumn('profiles', 'passport_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign(['passport_id']);
                });
            }

            if (Schema::hasColumn('profiles', 'signature_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign(['signature_id']);
                });
            }
        }
    }

    protected function downReferenceCheckAnswer()
    {
        if (Schema::hasTable('user_answer_question_reference')) {
            if (Schema::hasColumn('user_answer_question_reference', 'profil_id')) {
                Schema::table('user_answer_question_reference', function (Blueprint $table) {
                    $table->dropForeign(['profil_id']);
                    $table->dropForeign(['p11_references_id']);
                    $table->foreign('p11_references_id')->references('id')->on('p11_references')->onDelete('restrict');
                });
            }
        }
    }

    protected function downImTestAnswer()
    {
        if (Schema::hasTable('follow_im_test')) {
            if (Schema::hasColumn('follow_im_test', 'profil_id')) {
                Schema::table('follow_im_test', function (Blueprint $table) {
                    $table->dropForeign(['file1']);
                    $table->dropForeign(['file2']);
                    $table->dropForeign(['file3']);
                });
            }
        }
    }

    public function downJobManagers()
    {
        if (Schema::hasTable('job_managers')) {
            if (Schema::hasColumn('job_managers', 'user_id')) {
                Schema::table('job_managers', function (Blueprint $table) {
                    $table->dropForeign(['user_id']);
                });
            }
        }
    }

    protected function downJobManagerComments()
    {
        if (Schema::hasTable('job_manager_comments')) {
            if (Schema::hasColumn('job_manager_comments', 'user_id')) {
                Schema::table('job_manager_comments', function (Blueprint $table) {
                    $table->dropForeign(['comment_by_id']);
                });
            }
        }
    }

    protected function downJobInterviewFiles()
    {
        if (Schema::hasTable('jobs_interview_files')) {
            if (Schema::hasColumn('jobs_interview_files', 'user_interview_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->dropForeign(['user_interview_id']);
                    $table->foreign('user_interview_id')->references('id')->on('users')->onDelete('restrict');
                });
            }
            if (Schema::hasColumn('jobs_interview_files', 'attachments_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->dropForeign(['attachments_id']);
                });
            }
            if (Schema::hasColumn('jobs_interview_files', 'media_id')) {
                Schema::table('jobs_interview_files', function (Blueprint $table) {
                    $table->dropForeign(['media_id']);
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->downJobApplication();
        $this->downProfiles();
        $this->downProfileNationalities();
        $this->downProfileAddress();
        $this->downProfileCountryExperiences();
        $this->downProfileDependents();
        $this->downProfileEducationFormalTraining();
        $this->downProfileEducationUniversity();
        $this->downProfileEmploymentRecords();
        $this->downProfileFieldOfWorks();
        $this->downProfileLanguages();
        $this->downProfileLegalPermanentResidenceStatus();
        $this->downProfilePermanentCivilServants();
        $this->downProfilePhones();
        $this->downProfilePortfolios();
        $this->downProfilePresentNationalities();
        $this->downProfileProfessionalSocieties();
        $this->downProfilePublications();
        $this->downProfileReferences();
        $this->downProfileRelatives();
        $this->downProfileSectors();
        $this->downProfileSkills();
        $this->downProfileSubmittedApplicationInUN();
        $this->downProfileRosterProcess();
        $this->downProfileCvIdCardPassportSignature();
        $this->downReferenceCheckAnswer();
        $this->downImTestAnswer();
        $this->downJobManagers();
        $this->downJobManagerComments();
        $this->downJobInterviewFiles();
    }
}
