<?php

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('API')->group(function () {

    Route::get('work-reference/get-question/{id}/{profilID}', 'Userreference\AnswerController@getquestion')->where('id', '[0-9]+');
    Route::get('work-reference/{id}', 'Userreference\AnswerController@show')->where('id', '[0-9]+');
    Route::post('work-reference', 'Userreference\AnswerController@store');
    Route::put('work-reference/{id}', 'Userreference\AnswerController@update')->where('id', '[0-9]+');
    Route::post('work-reference/validate-email', 'Userreference\AnswerController@validateemail');
    Route::get('work-reference/check-exist-data/{id}', 'Userreference\AnswerController@checkexist')->where('id', '[0-9]+');

    // Route::get('reference-questions/{id}/profile/{profilID}', 'Userreference\AnswerController@getquestion')->where(['id' => '[0-9]+', 'profilID' => '[0-9]+']);
    // Route::get('reference-questions/count-data/{id}/profile/{profilID}', 'Userreference\AnswerController@countdata')->where(['id' => '[0-9]+', 'profilID' => '[0-9]+']);
    // Route::get('reference-questions/check-data/{id}/profile/{profilID}', 'Userreference\AnswerController@checkdata')->where(['id' => '[0-9]+', 'profilID' => '[0-9]+']);
    Route::get('reference-questions/list-data/{categoryId}/profile/{profilID}', 'Userreference\AnswerController@listdata')->where(['categoryId' => '[0-9]+', 'profilID' => '[0-9]+']);

    // LOGIN AND REGISTER
    Route::post('login', 'AuthenticationController@login')->name('login');
    Route::post('refresh', 'AuthenticationController@refresh');
    Route::post('register', 'AuthenticationController@register');

    //THIRD PARTY CLIENT
    Route::post('third-party/login', 'ThirdPartyClient\ThirdPartyClientController@login');
    Route::middleware('auth:third-party-client-api')->group(function () {
        Route::post('third-party/onboarding/add-immaper','ThirdPartyClient\ThirdPartyClientController@addUsersAsImmper')->middleware('manage_onboarding_list_sharepoint');
        Route::get('third-party/surge/all','ThirdPartyClient\ThirdPartyClientController@getSurgeData')->middleware('third-party-permission:Access for Surge Platform');
        Route::post('third-party/onboarding/sync-immaper-data','ThirdPartyClient\ThirdPartyClientController@syncImmaperData')->middleware('manage_onboarding_list_sharepoint');
    });
    // RESET PASSWORD
    Route::post('reset-password', 'AuthenticationController@reset');
    Route::post('reset-password-form', 'AuthenticationController@resetPassword')->middleware('signed')->name('password.reset');

    // JOB LIST
    Route::get('jobs/{id}', 'JobController@show')->where('id', '[0-9]+');
    Route::get('jobs/{id}/pdf', 'JobController@getReport')->where('id', '[0-9]+');
    Route::get('jobs/countries', 'JobController@getCountryByJob');
    Route::get('jobs/languages', 'JobController@getLanguageByJob');
    Route::post('jobs/search-filter', 'JobController@searchFilter');
    Route::get('check-has-assign-as-job-manager', 'JobController@checkHasAssignAsJobManager');

    // ROSTER RECRUITMENT
    Route::get('roster-recruitment-eligibility-check', 'Roster\RosterController@rosterRecruitmentEligibilityCheck');

    // EMAIL VERIFICATION
    Route::get('email/verify/{id}', 'VerificationController@verify')->middleware('signed')->name('verification.verify');
    Route::post('email/resend', 'VerificationController@resend')->name('verification.resend');
    Route::get('immap-email/verify/{id}', 'VerificationController@verifyImmapEmail')->middleware('signed')->where('id', '[0-9]+')->name('verification.verify_immap_address');
    Route::post('immap-email/resend', 'VerificationController@resendImmapEmail')->name('verification.resend_immap_address');

    // Get All Roster Process Data
    Route::get('roster-processes', 'Roster\RosterProcessController@index');

    // Get Roster deployment file
    Route::get('roster-deployement-file/{userId}/{token}', 'Roster\RosterController@getRosterDeployementFile')->middleware('cors')->where('userId', '[0-9]+');

    // Post reference check file
    Route::post('p11-update-reference-file', 'AttachmentController@update_reference_file');
    
    // Post job reference check file
    Route::post('job-p11-update-reference-file', 'AttachmentController@job_update_reference_file');
    
    // Post verify reference check url
    Route::post('p11-verify-reference', 'Roster\RosterController@referenceCheckVerifyCode');
    Route::post('job-p11-verify-reference', 'JobController@referenceCheckVerifyCode');

    // Route::middleware(['auth:api', 'jwt.verify'])->group(function () {
    Route::middleware('auth:api')->group(function () {
        // STORAGE
        Route::get('storage/media/{mediaId}', 'Media\FileController@getMedia')->where('mediaId', '[0-9]+');
        Route::get('storage/{fileId}/conversions/{fileName}', 'Media\FileController@getConversionFile')->where('id', '[0-9]+');
        Route::get('storage/{fileId}/{fileName}', 'Media\FileController@getFile')->where('id', '[0-9]+');

        // LOGOUT
        Route::get('logout', 'AuthenticationController@logout');

        // CHECK VERIFIED
        Route::get('check-verified', 'AuthenticationController@checkVerified');

        // ONE TIME TOKEN
        Route::get('generate-one-time-token', 'AuthenticationController@generateOneTimeToken');

        // THIRD PARTY CLIENT
        Route::get('third-party/permissions', 'ThirdPartyClient\ThirdPartyClientController@permissions')->middleware('permission:Set as Admin');
        Route::post('third-party/register', 'ThirdPartyClient\ThirdPartyClientController@register')->middleware('permission:Set as Admin');
        Route::put('third-party/{id}', 'ThirdPartyClient\ThirdPartyClientController@update')->middleware('permission:Set as Admin');
        Route::get('third-party/get-all', 'ThirdPartyClient\ThirdPartyClientController@getAll')->middleware('permission:Set as Admin');
        Route::get('third-party/{id}', 'ThirdPartyClient\ThirdPartyClientController@show')->where(['id' => '[0-9]+'])->middleware('permission:Set as Admin');
        Route::delete('third-party/{id}', 'ThirdPartyClient\ThirdPartyClientController@delete')->where(['id' => '[0-9]+'])->middleware('permission:Set as Admin');

        Route::middleware('verified')->group(function () {

            // GET SBP ROSTER PROCESS DATA
            Route::get('roster-processes/sbp', 'Roster\RosterProcessController@getSbpRosterProcess');

            Route::get('get-name/{id}', 'ProfileController@getName')->where('id', '[0-9]+');

            // JOB COMMENT
            Route::post('jobs/save-comment', 'JobController@saveComment');
            Route::delete('jobs/delete-comment/{id}', 'JobController@deleteComment')->where('id', '[0-9]+');
            Route::delete('jobs/delete-applicant/{id}/{userId}', 'JobController@deleteApplicant')
                   ->where(['id' => '[0-9]+', 'userId' => '[0-9]+'])->middleware('permission:Set as Admin');
            Route::get('jobs/get-comment-by-job-id/{id}', 'JobController@getCommentByJobId')->where('id', '[0-9]+');
            Route::get('jobs/get-comment-by-job-user-id/{id}/{userId}', 'JobController@getCommentByJobByUserId')
                ->where(['id' => '[0-9]+', 'userId' => '[0-9]+']);
            Route::post('jobs/update-comment', 'JobController@updateComment');

            //JOB APPLICATION DELETE
            Route::delete('jobs/delete-applicant/{id}/{userId}', 'JobController@deleteApplicant')
                    ->where(['id' => '[0-9]+', 'userId' => '[0-9]+'])->middleware('permission:Set as Admin');
            Route::delete('jobs/delete-application/{id}/{userId}', 'JobController@deleteApplicant')
                    ->where(['id' => '[0-9]+', 'userId' => '[0-9]+']);

            // JOB MANAGER
            Route::post('jobs/delete-manager', 'JobController@deleteManager');
            Route::post('jobs/save-manager', 'JobController@saveManager');

            // JOB STATUS UPDATE
            Route::post('jobs/update-status-job', 'JobController@updateStatusJob');

            //JOB APPLICANT TEST SCORE UPDATE
            Route::put('jobs/save-applicant-test-score/{id}', 'JobController@saveApplicantTestScore');

            Route::middleware(['permission:P11 Access'])->group(function () {
                Route::get('p11-profile', 'ProfileController@p11_profile');
                Route::get('p11-profile-form-1', 'ProfileController@p11_profile_form_1');
                // Route::get('p11-profile-form-2', 'ProfileController@p11_profile_form_2');
                // Route::get('p11-profile-form-3', 'ProfileController@p11_profile_form_3');
                Route::get('p11-profile-form-2', 'ProfileController@p11_profile_form_2');
                Route::get('p11-profile-form-3', 'ProfileController@p11_profile_form_3');
                Route::get('p11-profile-form-4', 'ProfileController@p11_profile_form_4');
                // Route::get('p11-profile-form-7', 'ProfileController@p11_profile_form_7');
                Route::get('p11-profile-form-5', 'ProfileController@p11_profile_form_5');
                Route::get('p11-profile-form-6', 'ProfileController@p11_profile_form_6');
                Route::get('p11-profile-form-7', 'ProfileController@p11_profile_form_7');
                Route::get('p11-profile-form-8', 'ProfileController@p11_profile_form_8');
                Route::get('p11-profile-form-12', 'ProfileController@p11_profile_form_12');

                Route::middleware('profile_update')->group(function () {
                    Route::put('p11-update-profile', 'ProfileController@p11_update_profile');
                    Route::put('p11-update-form-1', 'ProfileController@p11_update_form_1');
                    // Route::put('p11-update-form-2', 'ProfileController@p11_update_form_2');
                    // Route::put('p11-update-form-3', 'ProfileController@p11_update_form_3');
                    Route::put('p11-update-form-2', 'ProfileController@p11_update_form_2');
                    Route::put('p11-update-form-3', 'ProfileController@p11_update_form_3');
                    Route::put('p11-update-form-4', 'ProfileController@p11_update_form_4');
                    // Route::put('p11-update-form-7', 'ProfileController@p11_update_form_7');
                    Route::put('p11-update-form-5', 'ProfileController@p11_update_form_5');
                    Route::put('p11-update-form-6', 'ProfileController@p11_update_form_6');
                    Route::put('p11-update-form-7', 'ProfileController@p11_update_form_7');
                    Route::put('p11-update-form-8', 'ProfileController@p11_update_form_8');
                    Route::put('p11-submit-finished', 'ProfileController@p11_submit_finished');
                    // Route::put('p11-preview-form', 'ProfileController@p11_preview_form');
                    Route::post('p11-update-cv', 'ProfileController@p11_update_cv');
                    Route::post('p11-update-signature', 'ProfileController@p11_update_signature');
                    Route::post('p11-update-photo', 'ProfileController@p11_update_photo');
                    Route::delete('p11-delete-cv', 'ProfileController@p11_delete_cv');
                    Route::delete('p11-delete-signature', 'ProfileController@p11_delete_signature');
                    Route::delete('p11-delete-photo', 'ProfileController@p11_delete_photo');
                    Route::put('p11-update-p11-status', 'ProfileController@p11_update_p11_status');
                    Route::post('p11-accept-disclaimer', 'ProfileController@accept_disclaimer');
                });
                Route::get('p11-disclaimer-status', 'ProfileController@disclaimer_status');

                //GET PROFILE
                Route::get('profile', 'ProfileController@profile');
                Route::get('profile-biodata', 'ProfileController@profile_biodata');
                Route::get('profile-already-immaper', 'ProfileController@profile_already_immaper');
                Route::get('profile-languages', 'ProfileController@profile_languages');
                Route::get('profile-education-universities', 'ProfileController@profile_education_universities');
                Route::get('profile-education-schools', 'ProfileController@profile_education_schools');
                Route::get('profile-skills', 'ProfileController@profile_skills');
                Route::get('profile-employment-records', 'ProfileController@profile_employment_records');
                Route::get('profile-professional-societies', 'ProfileController@profile_professional_societies');
                Route::get('profile-portfolios', 'ProfileController@profile_portfolios');
                Route::get('profile-publications', 'ProfileController@profile_publications');
                Route::get('profile-last-update', 'ProfileController@profile_last_update');
                // Route::get('profile-disabilities', 'ProfileController@profile_disabilities');
                // Route::get('profile-dependents', 'ProfileController@profile_dependents');
                Route::get('profile-legal-permanent-residence-status', 'ProfileController@profile_legal_permanent_residence_status');
                Route::get('profile-legal-step-changing-nationality', 'ProfileController@profile_legal_step_changing_nationality');
                Route::get('profile-relatives-employed', 'ProfileController@profile_relatives_employed');
                Route::get('profile-previously-submitted-for-un', 'ProfileController@profile_previously_submitted_for_un');
                Route::get('profile-permanent-civil-servants', 'ProfileController@profile_permanent_civil_servants');
                Route::get('profile-references', 'ProfileController@profile_references');
                Route::get('profile-relevant-facts', 'ProfileController@profile_relevant_facts');
                Route::get('profile-biodata-address-and-nationalities', 'ProfileController@profile_biodata_address_and_nationalities');
                Route::get('profile-cv-and-signature', 'ProfileController@profile_cv_and_signature');
                Route::get('profile-phones', 'ProfileController@profile_phones');

                Route::get('profile-roster-process', 'ProfileController@profile_roster_process');
                Route::post('profile-roster-dashboard/{id}', 'ProfileController@profile_roster_dashboard')->middleware('permission:Index Roster Dashboard');
                Route::get('profile-verified-roster', 'ProfileController@profile_verified_roster');
                Route::get('current-profile-roster-process/v2/roster-process/{rosterProcessID}', 'ProfileController@current_profile_roster_process_v2')->where('rosterProcessID', '[0-9]+');
                Route::get('history-profile-roster-process/v2/roster-process/{rosterProcessID}', 'ProfileController@history_profile_roster_process_v2')->where('rosterProcessID', '[0-9]+');
                // Route::get('current-profile-roster-process/v2/{id}/roster-process/', 'ProfileController@current_profile_roster_process_v2')->where(['id' => '[0-9]+', 'rosterProcessID' => '[0-9]+']);

                // ROUTE RELATED TO REMOVE ACCOUNT FEATURE (User Request)
                Route::get('profile-delete-account-data', 'UserController@getDeleteAccountData');
                Route::post('remove-account-request', 'UserController@removeAccountRequest');
                Route::get('check-remove-account-token/{deleteAccountToken}', 'UserController@checkRemoveAccountToken');
                Route::post('remove-account', 'UserController@removeAccount');


                Route::middleware(['profile_update'])->group(function () {
                    // APPLY ROSTER
                    Route::post('apply-roster', 'ProfileController@applyRoster');
                    Route::post('apply-roster-from-job', 'ProfileController@applyRosterFromJob');

                    // UPDATE PROFILE
                    Route::put('update-profile-biodata', 'ProfileController@update_profile_biodata');
                    Route::put('update-profile-already-immaper', 'ProfileController@update_profile_already_immaper');
                    Route::put('update-profile-already-immaper/{profileID}', 'ProfileController@update_profile_already_immaper');
                    // Route::put('update-profile-disabilities', 'ProfileController@update_profile_disabilities');
                    // Route::put('update-profile-professional-societies', 'ProfileController@update_profile_professional_societies');
                    // Route::put('update-profile-publications', 'ProfileController@update_profile_publications');
                    // Route::put('update-profile-disabilities', 'ProfileController@update_profile_disabilities');
                    // Route::put('update-profile-dependents', 'ProfileController@update_profile_dependents');
                    Route::put('update-profile-legal-permanent-residence-status', 'ProfileController@update_profile_legal_permanent_residence_status');
                    Route::put('update-profile-legal-step-changing-nationality', 'ProfileController@update_profile_legal_step_changing_nationality');
                    // Route::put('update-profile-relatives-employed', 'ProfileController@update_profile_relatives_employed');
                    // Route::put('update-profile-previously-submitted-for-un', 'ProfileController@update_profile_previously_submitted_for_un');
                    // Route::put('update-profile-permanent-civil-servants', 'ProfileController@update_profile_permanent_civil_servants');
                    Route::put('update-profile-relevant-facts', 'ProfileController@update_profile_relevant_facts');
                    Route::put('update-profile-biodata-address-and-nationalities', 'ProfileController@update_profile_biodata_address_and_nationalities');
                    Route::put('update-profile-cv', 'ProfileController@update_profile_cv');
                    Route::put('update-profile-signature', 'ProfileController@update_profile_signature');
                    Route::put('update-reference-notice-read', 'ProfileController@updateReferenceNoticeRead');
                    // UPDATE YES NO FIELD
                    // Route::put('update-has-disabilities', 'ProfileController@update_has_disabilities');
                    Route::put('update-same-with-permanent', 'ProfileController@update_same_with_permanent');
                    // Route::put('update-has-dependents', 'ProfileController@update_has_dependents');
                    Route::put('update-legal-permanent-residence', 'ProfileController@update_legal_permanent_residence');
                    Route::put('update-legal-step', 'ProfileController@update_legal_step');
                    Route::put('update-relatives-employed', 'ProfileController@update_relatives_employed');
                    Route::put('update-previously-submitted', 'ProfileController@update_previously_submitted');
                    Route::put('update-has-professional-societies', 'ProfileController@update_has_professional_societies');
                    Route::put('update-has-publications', 'ProfileController@update_has_publications');
                    Route::put('update-permanent-civil-servant', 'ProfileController@update_permanent_civil_servant');
                    Route::put('p11-update-preferred-field-of-works', 'ProfileController@update_preferred_field_of_works');
                    Route::put('update-is-immaper', 'ProfileController@update_is_immaper');
                    Route::put('update-is-international-contract', 'ProfileController@update_is_international_contract');
                    Route::put('update-is-international-contract/{id}', 'ProfileController@update_is_international_contract_single');
                    Route::put('update-objections-making-inquiry-of-present-employer', 'ProfileController@update_objections_making_inquiry_of_present_employer');
                    Route::post('send-verification-immap-email', 'ProfileController@send_verification_immap_email');
                    Route::put('update-share-profile-consent', 'ProfileController@update_share_profile_consent');
                    Route::put('update-profile-reminder', 'ProfileController@update_profile_reminder');
                });



                // P11 Country data needed in Form
                Route::get('countries/nationalities', 'CountryController@nationalities');
                Route::get('countries/phone-codes', 'CountryController@phoneCodes');
                Route::get('countries/country-code-with-flag', 'CountryController@countryCodeWithFlag');
                Route::get('countries/all', 'CountryController@allCountries');

                // Line Managers Data Needed in Form
                Route::get('users/line-managers', 'UserController@lineManagers');
                //Change Line manager
                Route::put('users/change-line-manager/{id}', 'UserController@changeLineManager')->where('id', '[0-9]+');

                // Get graph api code
                Route::get('users/graph_access_token', 'UserController@set_microsoft_graph_token');

                // P11 Language data needed in form
                Route::get('languages/all', 'LanguageController@all');

                // FIELD OF WORK CRUD
                Route::get('field-of-works/all-options', 'FieldOfWorkController@allOptions')->middleware('permission:Index Field of Work|P11 Access');
                Route::get('field-of-works', 'FieldOfWorkController@index')->middleware('permission:Index Field of Work');
                Route::get('field-of-works/{id}', 'FieldOfWorkController@show')->where('id', '[0-9]+')->middleware('permission:Show Field of Work');
                // Route::middleware('profile_update')->group(function() {
                Route::post('field-of-works', 'FieldOfWorkController@store')->middleware('permission:Add Field of Work');
                Route::put('field-of-works/{id}', 'FieldOfWorkController@update')->where('id', '[0-9]+')->middleware('permission:Edit Field of Work');
                Route::delete('field-of-works/{id}', 'FieldOfWorkController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Field of Work');
                // });
                Route::post('field-of-works/set-is-approved', 'FieldOfWorkController@setIsApproved')->middleware('permission:Approve Field of Work');
                Route::post('field-of-works/suggestions', 'FieldOfWorkController@suggestions');
                Route::post('field-of-works/merge', 'FieldOfWorkController@merge');

                // // OFFICE EQUIPMENT CRUD
                // Route::get('office-equipments', 'OfficeEquipmentController@index');
                // Route::get('office-equipments/{id}', 'OfficeEquipmentController@show')->where('id', '[0-9]+');
                // Route::post('office-equipments', 'OfficeEquipmentController@store');
                // Route::put('office-equipments/{id}', 'OfficeEquipmentController@update')->where('id', '[0-9]+');
                // Route::delete('office-equipments/{id}', 'OfficeEquipmentController@destroy')->where('id', '[0-9]+');
                // Route::post('office-equipments/suggestions', 'OfficeEquipmentController@suggestions');

                // P11 Un org data needed in form
                Route::get('un-organizations/all', 'UNOrganizationController@all');

                // SKILL CRUD
                Route::get('skills', 'SkillController@index');
                Route::get('skills/{id}', 'SkillController@show')->where('id', '[0-9]+');
                Route::post('skills', 'SkillController@store');
                Route::post('skills/merge', 'SkillController@merge');
                Route::put('skills/{id}', 'SkillController@update')->where('id', '[0-9]+');
                Route::delete('skills/{id}', 'SkillController@destroy')->where('id', '[0-9]+');
                Route::post('skills/suggestions', 'SkillController@suggestions');
                Route::post('skills/set-is-approved', 'SkillController@setIsApproved');
                // Route::post('skills/select-for-matching', 'SkillController@skillForMatching')->middleware('permission:Select Skill for Matching');
                Route::post('skills/set-for-matching', 'SkillController@setForMatching')->middleware('permission:Select Skill for Matching');
                Route::get('skills/skills-for-matching', 'SkillController@skillsForMatching');

                // ATTACHMENT CRUD
                Route::middleware('profile_update')->group(function () {
                    // UPDATE CERTIFICATE
                    Route::post('p11-update-university-certificate', 'AttachmentController@update_university_certificate');
                    Route::post('p11-delete-university-certificate', 'AttachmentController@delete_university_certificate');
                    Route::post('p11-update-school-certificate', 'AttachmentController@update_school_certificate');
                    Route::post('p11-delete-school-certificate', 'AttachmentController@delete_school_certificate');

                    // UPDATE PORTFOLIO
                    Route::post('/p11-update-portfolio-file', 'AttachmentController@update_portfolio_file');
                    Route::post('/p11-delete-portfolio-file', 'AttachmentController@delete_portfolio_file');

                    // UPDATE PUBLICATION FILE
                    Route::post('/p11-update-publication-file', 'AttachmentController@update_publication_file');
                    Route::post('/p11-delete-publication-file', 'AttachmentController@delete_publication_file');
                });


                // P11
                Route::namespace('P11')->group(function () {
                    // P11 CLERICAL GRADE CRUD
                    // Route::get('p11-clerical-grades/lists', 'P11ClericalGradeController@lists');

                    // Route::get('p11-clerical-grades', 'P11ClericalGradeController@index');
                    // Route::get('p11-clerical-grades/{id}', 'P11ClericalGradeController@show')->where('id', '[0-9]+');
                    // Route::post('p11-clerical-grades', 'P11ClericalGradeController@store');
                    // Route::put('p11-clerical-grades/{id}', 'P11ClericalGradeController@update')->where('id', '[0-9]+');
                    // Route::delete('p11-clerical-grades/{id}', 'P11ClericalGradeController@destroy')->where('id', '[0-9]+');

                    // P11 DEPENDENT CRUD
                    // Route::get('p11-dependents/lists', 'P11DependentController@lists');

                    // Route::get('p11-dependents', 'P11DependentController@index');
                    // Route::get('p11-dependents/{id}', 'P11DependentController@show')->where('id', '[0-9]+');
                    // Route::post('p11-dependents', 'P11DependentController@store');
                    // Route::put('p11-dependents/{id}', 'P11DependentController@update')->where('id', '[0-9]+');
                    // Route::delete('p11-dependents/{id}', 'P11DependentController@destroy')->where('id', '[0-9]+');

                    // P11 LEGAL PERMANENT RESIDENCE
                    Route::get('p11-legal-permanent-residence-status/lists', 'P11LegalPermanentResidenceStatusController@lists');

                    Route::get('p11-legal-permanent-residence-status', 'P11LegalPermanentResidenceStatusController@index');
                    Route::get('p11-legal-permanent-residence-status/{id}', 'P11LegalPermanentResidenceStatusController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-legal-permanent-residence-status', 'P11LegalPermanentResidenceStatusController@store');
                        Route::put('p11-legal-permanent-residence-status/{id}', 'P11LegalPermanentResidenceStatusController@update')->where('id', '[0-9]+');
                        Route::delete('p11-legal-permanent-residence-status/{id}', 'P11LegalPermanentResidenceStatusController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 EDUCATION SCHOOL CRUD
                    Route::get('p11-education-schools/lists', 'P11EducationSchoolController@lists');

                    Route::get('p11-education-schools', 'P11EducationSchoolController@index');
                    Route::get('p11-education-schools/{id}', 'P11EducationSchoolController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-education-schools', 'P11EducationSchoolController@store');
                        Route::put('p11-education-schools/{id}', 'P11EducationSchoolController@update')->where('id', '[0-9]+');
                        Route::delete('p11-education-schools/{id}', 'P11EducationSchoolController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 EDUCATION UNIVERSITY CRUD
                    Route::get('p11-education-universities/lists', 'P11EducationUniversityController@lists');

                    Route::get('p11-education-universities', 'P11EducationUniversityController@index');
                    Route::get('p11-education-universities/{id}', 'P11EducationUniversityController@show')->where('id', '[0-9]+');

                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-education-universities', 'P11EducationUniversityController@store');
                        Route::put('p11-education-universities/{id}', 'P11EducationUniversityController@update')->where('id', '[0-9]+');
                        Route::delete('p11-education-universities/{id}', 'P11EducationUniversityController@destroy')->where('id', '[0-9]+');
                    });

                    // TRUS BIKIN COMMAND UNTUK UPDATE UPDATED_AT BASED ON HIGHEST RELATION UPDATED_AT

                    // P11 EMPLOYMENT RECORD CRUD
                    Route::get('p11-employment-records/lists', 'P11EmploymentRecordController@lists');

                    Route::get('p11-employment-records', 'P11EmploymentRecordController@index');
                    Route::get('p11-employment-records/{id}', 'P11EmploymentRecordController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-employment-records', 'P11EmploymentRecordController@store');
                        Route::put('p11-employment-records/{id}', 'P11EmploymentRecordController@update')->where('id', '[0-9]+');
                        Route::delete('p11-employment-records/{id}', 'P11EmploymentRecordController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 LANGUAGE CRUD
                    Route::get('p11-languages/lists', 'P11LanguageController@lists');

                    Route::get('p11-languages', 'P11LanguageController@index');
                    Route::get('p11-languages/{id}', 'P11LanguageController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-languages/update-mother-tongue', 'P11LanguageController@updateMotherTongue');
                        Route::post('p11-languages', 'P11LanguageController@store');
                        Route::put('p11-languages/{id}', 'P11LanguageController@update')->where('id', '[0-9]+');
                        Route::delete('p11-languages/{id}', 'P11LanguageController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 PROFESSIONAL SOCIETY CRUD
                    Route::get('p11-professional-societies/lists', 'P11ProfessionalSocietyController@lists');
                    Route::get('p11-professional-societies', 'P11ProfessionalSocietyController@index');
                    Route::get('p11-professional-societies/{id}', 'P11ProfessionalSocietyController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-professional-societies', 'P11ProfessionalSocietyController@store');
                        Route::put('p11-professional-societies/{id}', 'P11ProfessionalSocietyController@update')->where('id', '[0-9]+');
                        Route::delete('p11-professional-societies/{id}', 'P11ProfessionalSocietyController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 PUBLICATION CRUD
                    Route::get('p11-publications/lists', 'P11PublicationController@lists');

                    Route::get('p11-publications', 'P11PublicationController@index');
                    Route::get('p11-publications/{id}', 'P11PublicationController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-publications', 'P11PublicationController@store');
                        Route::put('p11-publications/{id}', 'P11PublicationController@update')->where('id', '[0-9]+');
                        Route::delete('p11-publications/{id}', 'P11PublicationController@destroy')->where('id', '[0-9]+');
                        Route::delete('profile-publication-destroy/{id}', 'P11PublicationController@profile_publication_destroy')->where('id', '[0-9]+');
                    });

                    // P11 REFERENCE CRUD
                    Route::get('p11-references/lists', 'P11ReferenceController@lists');

                    Route::get('p11-references', 'P11ReferenceController@index');
                    Route::get('p11-references/{id}', 'P11ReferenceController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-references', 'P11ReferenceController@store');
                        Route::put('p11-references/{id}', 'P11ReferenceController@update')->where('id', '[0-9]+');
                        Route::delete('p11-references/{id}', 'P11ReferenceController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 RELATIVES EMPLOYED BY PUBLIC INTERNATIONAL ORGANIZATION CRUD
                    Route::get('p11-relatives-employed/lists', 'P11RelativesEmployedByPublicIntOrgController@lists');

                    Route::get('p11-relatives-employed', 'P11RelativesEmployedByPublicIntOrgController@index');
                    Route::get('p11-relatives-employed/{id}', 'P11RelativesEmployedByPublicIntOrgController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-relatives-employed', 'P11RelativesEmployedByPublicIntOrgController@store');
                        Route::put('p11-relatives-employed/{id}', 'P11RelativesEmployedByPublicIntOrgController@update')->where('id', '[0-9]+');
                        Route::delete('p11-relatives-employed/{id}', 'P11RelativesEmployedByPublicIntOrgController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 FIELD OF WORK CRUD
                    Route::get('p11-field-of-works', 'P11FieldOfWorkController@index');
                    Route::get('p11-field-of-works/{id}', 'P11FieldOfWorkController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-field-of-works', 'P11FieldOfWorkController@store');
                        Route::put('p11-field-of-works/{id}', 'P11FieldOfWorkController@update')->where('id', '[0-9]+');
                        Route::delete('p11-field-of-works/{id}', 'P11FieldOfWorkController@destroy')->where('id', '[0-9]+');
                    });

                    // P11 OFFICE EQUIPMENT CRUD
                    // Route::get('p11-office-equipments', 'P11FieldOfWorkController@index');
                    // Route::get('p11-office-equipments/{id}', 'P11FieldOfWorkController@show')->where('id', '[0-9]+');
                    // Route::post('p11-office-equipments', 'P11FieldOfWorkController@store');
                    // Route::put('p11-office-equipments/{id}', 'P11FieldOfWorkController@update')->where('id', '[0-9]+');
                    // Route::delete('p11-office-equipments/{id}', 'P11FieldOfWorkController@destroy')->where('id', '[0-9]+');

                    // P11 SUBMITTED APPLICATION IN UN CRUD
                    Route::get('p11-submitted-application-in-un/lists', 'P11SubmittedApplicationInUnController@lists');

                    Route::get('p11-submitted-application-in-un', 'P11SubmittedApplicationInUnController@index');
                    Route::get('p11-submitted-application-in-un/{id}', 'P11SubmittedApplicationInUnController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-submitted-application-in-un', 'P11SubmittedApplicationInUnController@store');
                        Route::put('p11-submitted-application-in-un/{id}', 'P11SubmittedApplicationInUnController@update')->where('id', '[0-9]+');
                        Route::delete('p11-submitted-application-in-un/{id}', 'P11SubmittedApplicationInUnController@destroy')->where('id', '[0-9]+');
                    });

                    //P11 PERMANENT CIVIL SERVANT
                    Route::get('p11-permanent-civil-servants/lists', 'P11PermanentCivilServantController@lists');

                    Route::get('p11-permanent-civil-servants', 'P11PermanentCivilServantController@index');
                    Route::get('p11-permanent-civil-servants/{id}', 'P11PermanentCivilServantController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-permanent-civil-servants/update-is-now', 'P11PermanentCivilServantController@updateIsNow');
                        Route::post('p11-permanent-civil-servants', 'P11PermanentCivilServantController@store');
                        Route::put('p11-permanent-civil-servants/{id}', 'P11PermanentCivilServantController@update')->where('id', '[0-9]+');
                        Route::delete('p11-permanent-civil-servants/{id}', 'P11PermanentCivilServantController@destroy')->where('id', '[0-9]+');
                    });

                    //P11 CRIMINAL RECORD
                    // Route::get('p11-criminal-records/lists', 'P11CriminalRecordController@lists');

                    // Route::get('p11-criminal-records', 'P11CriminalRecordController@index');
                    // Route::get('p11-criminal-records/{id}', 'P11CriminalRecordController@show')->where('id', '[0-9]+');
                    // Route::post('p11-criminal-records', 'P11CriminalRecordController@store');
                    // Route::put('p11-criminal-records/{id}', 'P11CriminalRecordController@update')->where('id', '[0-9]+');
                    // Route::delete('p11-criminal-records/{id}', 'P11CriminalRecordController@destroy')->where('id', '[0-9]+');

                    //P11 PORTFOLIO
                    Route::get('p11-portfolios/lists', 'P11PortfolioController@lists');

                    Route::get('p11-portfolios', 'P11PortfolioController@index');
                    Route::get('p11-portfolios/{id}', 'P11PortfolioController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-portfolios', 'P11PortfolioController@store');
                        Route::put('p11-portfolios/{id}', 'P11PortfolioController@update')->where('id', '[0-9]+');
                        Route::delete('p11-portfolios/{id}', 'P11PortfolioController@destroy')->where('id', '[0-9]+');
                    });

                    //P11 SKILLS
                    Route::get('p11-skills/lists', 'P11SkillController@lists');
                    Route::get('p11-skills/{id}', 'P11SkillController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('p11-skills', 'P11SkillController@store');
                        Route::put('p11-skills/{id}', 'P11SkillController@update')->where('id', '[0-9]+');
                        Route::delete('p11-skills/{id}', 'P11SkillController@destroy')->where('id', '[0-9]+');
                    });

                    //P11 PHONES
                    Route::get('/p11-phones', 'P11PhoneController@index');
                    Route::get('/p11-phones/{id}', 'P11PhoneController@show')->where('id', '[0-9]+');
                    Route::middleware('profile_update')->group(function () {
                        Route::post('/p11-phones', 'P11PhoneController@store');
                        Route::put('/p11-phones/{id}', 'P11PhoneController@update')->where('id', '[0-9]+');
                        Route::delete('/p11-phones/{id}', 'P11PhoneController@destroy')->where('id', '[0-9]+');
                        Route::post('/p11-phones/update-primary-phone', 'P11PhoneController@update_primary_phone');
                    });

                    //P11 SECTORS
                    /**
                     * this routes below is the early version of profile creation page, when we gathered and sector data foreach profile for analytics purpose
                     * Still can be useful if it's needed again
                     */
                    // Route::get('/p11-sectors', 'P11SectorController@index');
                    // Route::get('/p11-sectors/{id}', 'P11SectorController@show')->where('id', '[0-9]+');
                    // Route::middleware('profile_update')->group(function () {
                    //     Route::post('/p11-sectors', 'P11SectorController@store');
                    //     Route::put('/p11-sectors/{id}', 'P11SectorController@update')->where('id', '[0-9]+');
                    //     Route::delete('/p11-sectors/{id}', 'P11SectorController@destroy')->where('id', '[0-9]+');
                    // });
                });
            });

            // APPLY JOB
            Route::middleware(['permission:Apply Job'])->group(function () {
                Route::post('apply-job', 'JobController@applyJob')->middleware('lastApplyJob');
                Route::post('apply-job-with-cover-letter', 'JobController@applyJobWithCoverLetter')->middleware('lastApplyJob');
                Route::post('upload-cover-letter', 'AttachmentController@uploadCoverLetter');
                Route::post('delete-cover-letter', 'AttachmentController@deleteCoverLetter');
                Route::get('job-applications/{status_id}/', 'UserController@jobApplications')->where('status_id', '[0-9]+');
                Route::get('job-applications_by_profile_id/{status_id}/{profileId}', 'ProfileController@jobApplications')->where(['status_id' => '[0-9]+', 'profileId' => '[0-9]+']);
                Route::get('job-applications_id/{profileId?}', 'ProfileController@jobApplicationByProfileId')->where(['profileId' => '[0-9]+']);
            });

            // FILTER APPLICANTS

            // FILTER JOB APPLICATIONS BLM BERES TINGGAL INI

            // VIEW PROFILE

            //begin: to allow iMMAPer with user right when selected as HR to access this route
            Route::middleware(['permission:View Applicant Profile|Apply Job'])->group(function () {
                Route::get('profile/{id}', 'ProfileController@profile')->where('id', '[0-9]+');
                Route::get('profile-biodata/{id}', 'ProfileController@profile_biodata')->where('id', '[0-9]+');
                Route::get('profile-already-immaper/{id}', 'ProfileController@profile_already_immaper')->where('id', '[0-9]+');
                Route::get('profile-languages/{id}', 'ProfileController@profile_languages')->where('id', '[0-9]+');
                Route::get('profile-education-universities/{id}', 'ProfileController@profile_education_universities')->where('id', '[0-9]+');
                Route::get('profile-education-schools/{id}', 'ProfileController@profile_education_schools')->where('id', '[0-9]+');
                Route::get('profile-skills/{id}', 'ProfileController@profile_skills')->where('id', '[0-9]+');
                Route::get('profile-professional-societies/{id}', 'ProfileController@profile_professional_societies')->where('id', '[0-9]+');
                Route::get('profile-employment-records/{id}', 'ProfileController@profile_employment_records')->where('id', '[0-9]+');
                Route::get('profile-portfolios/{id}', 'ProfileController@profile_portfolios')->where('id', '[0-9]+');
                Route::get('profile-publications/{id}', 'ProfileController@profile_publications')->where('id', '[0-9]+');
                // Route::get('profile-disabilities/{id}', 'ProfileController@profile_disabilities')->where('id', '[0-9]+');
                // Route::get('profile-dependents/{id}', 'ProfileController@profile_dependents')->where('id', '[0-9]+');
                Route::get('profile-legal-permanent-residence-status/{id}', 'ProfileController@profile_legal_permanent_residence_status')->where('id', '[0-9]+');
                Route::get('profile-legal-step-changing-nationality/{id}', 'ProfileController@profile_legal_step_changing_nationality')->where('id', '[0-9]+');
                Route::get('profile-relatives-employed/{id}', 'ProfileController@profile_relatives_employed')->where('id', '[0-9]+');
                Route::get('profile-previously-submitted-for-un/{id}', 'ProfileController@profile_previously_submitted_for_un')->where('id', '[0-9]+');
                Route::get('profile-permanent-civil-servants/{id}', 'ProfileController@profile_permanent_civil_servants')->where('id', '[0-9]+');
                Route::get('profile-references/{id}', 'ProfileController@profile_references')->where('id', '[0-9]+');
                Route::get('profile-relevant-facts/{id}', 'ProfileController@profile_relevant_facts')->where('id', '[0-9]+');
                Route::get('profile-biodata-address-and-nationalities/{id}', 'ProfileController@profile_biodata_address_and_nationalities')->where('id', '[0-9]+');
                Route::get('profile-cv-and-signature/{id}', 'ProfileController@profile_cv_and_signature')->where('id', '[0-9]+');
                Route::get('profile-phones/{id}', 'ProfileController@profile_phones')->where('id', '[0-9]+');
                Route::get('profile-roster-process/{id}', 'ProfileController@profile_roster_process')->where('id', '[0-9]+');
                Route::get('profile-verified-roster/{id}', 'ProfileController@profile_verified_roster')->where('id', '[0-9]+');
                Route::get('view-current-profile-roster-process/v2/{id}/roster-process/{rosterProcessID}', 'ProfileController@view_current_profile_roster_process_v2')->where(['id' => '[0-9]+', 'rosterProcessID' => '[0-9]+']);
                Route::get('view-history-profile-roster-process/v2/{id}/roster-process/{rosterProcessID}', 'ProfileController@view_history_profile_roster_process_v2')->where(['id' => '[0-9]+', 'rosterProcessID' => '[0-9]+']);

                Route::get('profile/star-archive-status/{id}', 'ProfileController@getStarArchiveStatus')->where('id', '[0-9]+');

            });

            // CHECK PROFILE ACCESS TO ROSTER STATUS
            Route::get('profile/{id}/check-roster-access', 'ProfileController@checkRosterAccess')->where('id', '[0-9]+');
            Route::get('profile/check-roster-access', 'ProfileController@checkRosterAccess');
            Route::post('profile/check-roster-invitation', 'ProfileController@checkExistingRosterInvitation');

            Route::get('check-profile/{id}', 'ProfileController@checkProfile')->where('id', '[0-9]+');
            Route::get('check-current-profile', 'ProfileController@checkCurrentProfile');
            Route::get('get-profile/{id}', 'ProfileController@getProfile')->where('id', '[0-9]+')->middleware(['permission:Index Immaper']);


            // DOWNLOAD PROFILE RESUME
            Route::get('profile/download-resume/{id}', 'ProfileController@downloadResume')->where('id', '[0-9]+')->middleware(['permission:View Applicant Profile|See Completed Profiles|Set as Admin','iMMAPer']);

            // DOWNLOAD ANONYMIZED PROFILE RESUME
            Route::get('profile/download-anonymized-resume/{id}', 'ProfileController@downloadAnonymizedResume')->where('id', '[0-9]+')->middleware(['permission:View Applicant Profile|See Completed Profiles|Set as Admin','iMMAPer']);

            Route::middleware(['permission:View Applicant List|Apply Job'])->group(function () {
                Route::post('jobs/{id}/applicants/{status_id}/filter', 'JobController@filterApplicants')->where(['id' => '[0-9]+', 'status_id' => '[0-9]+']);
                Route::get('jobs/download-profiles/{id}/{status_id}', 'JobController@getJobProfilesExport')->where(['id' => '[0-9]+', 'status_id' => '[0-9]+']);
                Route::post('jobs/reference-check-invitation', 'JobController@referenceCheckInvitation');
                Route::get('jobs/{id}/applicants/count', 'JobController@getUserByStatus')->where(['id' => '[0-9]+']);
                Route::post('jobs/{id}/recommendations', 'JobController@recommendations')->where('id', '[0-9]+');
                Route::post('jobs/{id}/send-invitations', 'JobController@sendInvitations')->where('id', '[0-9]+');
                Route::post('jobs/{id}/save-interview-date', 'JobController@saveInterviewDate')->where('id', '[0-9]+');
                Route::post('jobs/{id}/send-interview-invitation', 'JobController@sendInterviewInvitation')->where('id', '[0-9]+');
                Route::post('jobs/{id}/send-interview-invitation', 'JobController@sendInterviewInvitation')->where('id', '[0-9]+');
                Route::post('jobs/{id}/change-physical-interview', 'JobController@changePhysicalInterview')->where('id', '[0-9]+');
                Route::post('jobs/request-contract', 'JobController@storeRequestContract');
                Route::post('jobs/send-email-request-contract', 'JobController@sendEmailContractRequest');
                Route::put('jobs/request-contract/{id}', 'JobController@updateRequestContract')->where(['id' => '[0-9]+']);
            });

            // Send Surge Notification
            Route::post('job/send-sbp-roster-notification/error', 'JobController@processSbpNotificationError')->where(['id' => '[0-9]+'])->middleware(['permission:View SBP Job|Set as Admin', 'iMMAPer']);
            Route::post('jobs/send-sbp-roster-notification/{id}', 'JobController@sendSbpNotification')->middleware(['permission:View SBP Job|Set as Admin', 'iMMAPer']);

            // DOWNLOAD INTERVIEW SCORE FILE
            Route::get('jobs/{id}/interview-score/download', 'JobController@downloadInterviewScore')->where(['id' => '[0-9]+'])->middleware('downloadInterviewScore');

            Route::get('timezones/all-options', 'TimezoneController@getTimezoneOptions');

            // CHANGE APPLICANT STATUS
            Route::post('jobs/{id}/change-status', 'JobController@changeApplicantStatus')->where('id', '[0-9]+')->middleware('permission:Change Applicant Status|Apply Job');

            // JOB CRUD
            Route::post('jobs', 'JobController@store')->middleware('permission:Add Job|Set as Admin');
            Route::put('jobs/{id}', 'JobController@update')->where('id', '[0-9]+')->middleware('permission:Edit Job');
            Route::delete('jobs/{id}', 'JobController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Job');

            // JOB STATUS CRUD
            Route::get('job-status', 'JobStatusController@all')->middleware('permission:Index Job Status|Apply Job');
            Route::get('job-status/under-sbp', 'JobStatusController@getJobStatusUnderSbp')->middleware('permission:Index Job Status|Apply Job');
            Route::get('job-status/default', 'JobStatusController@default')->middleware('permission:Index Job Status|Apply Job');
            Route::get('job-status/{id}', 'JobStatusController@show')->where('id', '[0-9]+')->middleware('permission:Show Job Status');
            Route::post('job-status', 'JobStatusController@store')->middleware('permission:Add Job Status');
            Route::put('job-status/{id}', 'JobStatusController@update')->where('id', '[0-9]+')->middleware('permission:Edit Job Status');
            Route::delete('job-status/{id}', 'JobStatusController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Job Status');
            Route::post('job-status/change-order', 'JobStatusController@changeOrder')->middleware('permission:Edit Job Status');

            // INTERVIEW RESULT FILE
            Route::middleware('iMMAPer')->group(function() {
                Route::post('job-interview-files', 'JobInterviewFilesController@store');
                Route::get('job-interview-files/getfile/{jobID}/{userID}', 'JobInterviewFilesController@getfile')
                    ->where(['jobID' => '[0-9]+', 'userID' => '[0-9]+']);
                Route::post('job-interview-files/{id}', 'JobInterviewFilesController@update')
                    ->where('id', '[0-9]+');
            });

            // INTERVIEW QUESTIONS
            Route::middleware('iMMAPer')->group(function() {
                Route::post('job-interview-questions', 'JobInterviewQuestionController@store');
                Route::get('job-interview-questions/{jobID}', 'JobInterviewQuestionController@get');
                Route::get('job-interview-questions-roster/{rosterProfileID}', 'JobInterviewQuestionController@getRosterQuestions')
                    ->where(['$rosterProfileID' => '[0-9]+']);
                Route::post('job-interview-questions/{id}', 'JobInterviewQuestionController@update')
                    ->where('id', '[0-9]+');
                Route::post('job-interview-questions/edit/enable', 'JobInterviewQuestionController@enableEdit')
                    ->where('id', '[0-9]+');
                Route::delete('job-interview-questions/{id}', 'JobInterviewQuestionController@destroy')
                    ->where('id', '[0-9]+');
                Route::post('job-interview-questions/roster-process/change_interview_order', 'JobInterviewQuestionController@update_interview_order');
            });

            // INTERVIEW SCORES
            Route::middleware('iMMAPer')->group(function() {
                Route::post('job-interview-scores', 'JobInterviewScoreController@store');
                Route::put('job-interview-scores', 'JobInterviewScoreController@update');
                Route::post('job-interview-scores/enable-validation', 'JobInterviewScoreController@enableEdit');
                Route::get('job-interview-scores/jobs/{jobId}/profile/{profileId}', 'JobInterviewScoreController@getInterviewReportPdf');
                Route::get('job-interview-scores/roster-process/{rosterProcessId}/profile/{rosterProfileId}', 'JobInterviewScoreController@getRosterInterviewReportPdf');
                Route::post('job-interview-scores/jobs/{jobId}/profile/{profileId}/final-score', 'JobInterviewScoreController@setFinalScore');
                Route::post('job-interview-scores/roster-process/{rosterProcessId}/profile/{profileRosterId}/final-score', 'JobInterviewScoreController@setRosterFinalScore');
            });

            // USER CRUD
            Route::get('users', 'UserController@index')->middleware('permission:Index User');
            Route::get('users/{id}', 'UserController@show')->where('id', '[0-9]+')->middleware('permission:Show User');
            Route::post('users', 'UserController@store')->middleware('permission:Add User');
            Route::put('users/{id}', 'UserController@update')->where('id', '[0-9]+')->middleware('permission:Edit User');
            Route::delete('users/{id}', 'UserController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete User');
            Route::get('users-statistic-p11-complete', 'UserController@usersStatisticP11Complete')->middleware('permission:Dashboard Access');
            Route::get('users/immap-verification/{id}', 'UserController@send_verification_immaper')->where('id', '[0-9]+')->middleware('permission:Edit User');
            Route::get('email/to', 'UserController@dashboard_email_to')->middleware('permission:Index User');
            Route::get('email/immap', 'UserController@dashboard_email_immap')->middleware('permission:Index User|Edit Job|Add Job');

            Route::get('users/filter-user', 'UserController@filterUser')->middleware('permission:Set as Admin');

            //immapers
            Route::get('immapers', 'UserController@immapers')->middleware('permission:Index Immaper');
            Route::post('get-immapers-by-filter', 'UserController@getImmapersByFilter')->middleware('permission:Index Immaper');
            Route::get('immapers-by-line-manager', 'UserController@getImmapersByLineManager')->middleware('lineManager');
            Route::get('immapers-value-label', 'UserController@immapers_value_label')->middleware('permission:Index Immaper|Apply Job');
            Route::get('immapers/{id}', 'UserController@immapers_show')->middleware('permission:Index Immaper');
            Route::put('immapers/{id}', 'UserController@immapers_update')->middleware('permission:Edit Immaper');
            Route::get('p11-completed-users', 'UserController@p11CompletedUsers')->middleware('permission:Index Immaper');
            Route::get('completed-users', 'UserController@p11CompletedUsers')->middleware('permission:Index Immaper');
            Route::put('add-immaper', 'UserController@addImmaper')->middleware('permission:Edit Immaper');
            Route::get('immapers-filter-data', 'UserController@immapersFilterData')->middleware('permission:Index Immaper|Set as Admin');
            Route::get('contract-history/{id}', 'UserController@contractHistory')->where('id', '[0-9]+')->middleware('permission:Index Immaper|Set as Admin');
            Route::post('import-immapers', 'UserController@importImmapers')->middleware('permission:Edit Immaper');

            // TESTING USER PERMISSION AND ROLE
            Route::get('users/roles/{id}', function ($id) {
                $user = User::findOrFail($id);
                return $user->getRoleNames();
            });
            Route::get('users/permissions/{id}', function ($id) {
                $user = User::findOrFail($id);
                return $user->getAllPermissions();
            });

            // PERMISSION CRUD
            Route::get('permissions', 'PermissionController@index')->middleware('permission:Index Permission');
            Route::get('permissions/{id}', 'PermissionController@show')->where('id', '[0-9]+')->middleware('permission:Show Permission');
            Route::post('permissions', 'PermissionController@store')->middleware('permission:Add Permission');
            Route::put('permissions/{id}', 'PermissionController@update')->where('id', '[0-9]+')->middleware('permission:Edit Permission');
            Route::delete('permissions/{id}', 'PermissionController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Permission');
            Route::get('permissions/ungroup', "PermissionController@getUngroup")->middleware('permission:Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin');

            // ROLE CRUD
            Route::get('roles/all-options', 'RoleController@allOptions')->middleware('permission:Add Role|Edit Role|Add User|Edit User|Set as Admin');
            Route::get('roles', 'RoleController@index')->middleware('permission:Index Role|Index User|Set as Admin');
            Route::get('roles/{id}', 'RoleController@show')->where('id', '[0-9]+')->middleware('permission:Show Role');
            Route::post('roles', 'RoleController@store')->middleware('permission:Add Role');
            Route::put('roles/{id}', 'RoleController@update')->where('id', '[0-9]+')->middleware('permission:Edit Role');
            Route::delete('roles/{id}', 'RoleController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Role');

            // GROUP PERMISSION CRUD
            Route::get('groups/with-permissions', 'GroupController@getWithPermissions')->middleware('permission:Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin');
            Route::get('groups/all-options', 'GroupController@allOptions')->middleware('permission:Add Permission|Edit Permission|Add Role|Edit Role|Set as Admin');
            Route::get('groups', 'GroupController@index')->middleware('permission:Index Permission|Index Role|Set as Admin');
            Route::get('groups/{id}', 'GroupController@show')->where('id', '[0-9]+')->middleware('permission:Show Permission|Show Role|Set as Admin');
            Route::post('groups', 'GroupController@store')->middleware('permission:Add Permission|Add Role|Set as Admin');
            Route::put('groups/{id}', 'GroupController@update')->where('id', '[0-9]+')->middleware('permission:Edit Permission|Edit Role|Set as Admin');
            Route::delete('groups/{id}', 'GroupController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Permission|Delete Role|Set as Admin');

            // COUNTRY CRUD
            Route::get('countries', 'CountryController@index')->middleware('permission:Index Country');
            Route::get('countries/p11', 'CountryController@forP11')->middleware('permission:P11 Access');
            Route::get('countries/{id}', 'CountryController@show')->where('id', '[0-9]+')->middleware('permission:Show Country');
            Route::post('countries', 'CountryController@store')->middleware('permission:Add Country');
            Route::put('countries/set-seen-in-p11', 'CountryController@setSeenInP11')->middleware('permission:Edit Country');
            Route::put('countries/{id}', 'CountryController@update')->where('id', '[0-9]+')->middleware('permission:Edit Country');
            Route::delete('countries/{id}', 'CountryController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Country');
            // Adding routes for field seen-in-security-module
            Route::put('countries/set-seen-in-security-module', 'CountryController@setSeenInSecurityModule')->middleware('permission:Add Country|Edit Country');
            Route::put('countries/set-vehicle-filled-by-immaper', 'CountryController@setVehicleFilledByiMMAPer')->middleware('permission:Add Country|Edit Country');
            // Get Countries for Security Module
            Route::get('security-module/countries', 'CountryController@securityCountries')->middleware('permission:Can Make Travel Request|Manage Security Module|Approve National Travel Request|Approve Global Travel Request');
            Route::get('security-module/risk-locations/countries', 'CountryController@riskLocationCountries')->middleware('permission:Set as Admin');
            Route::get('security-module/notify-countries', 'CountryController@notifyCountries')->middleware('permission:Set as Admin');
            Route::get('security-module/notify-settings/{id}', 'CountryController@getNotifyEmailsByCountry')->where('id', '[0-9]+')->middleware('permission:Set as Admin');
            Route::put('security-module/notify-settings/{id}/update', 'CountryController@updateNotifyEmailsByCountry')->where('id', '[0-9]+')->middleware('permission:Set as Admin');

            // CONTRACT CRUD
            Route::get('print-contract/{id}', 'Contract\ContractController@printcontrack')->where('id', '[0-9]+');

            Route::get('contract', 'Contract\ContractController@index'); //->middleware('permission:Show Contract');

            Route::get('contract/{id}', 'Contract\ContractController@show')->where('id', '[0-9]+'); //->middleware('permission:Show Contract');
            Route::post('contract', 'Contract\ContractController@store'); //->middleware('permission:Add Contract');
            Route::put('contract/{id}', 'Contract\ContractController@update')->where('id', '[0-9]+'); //->middleware('permission:Edit Contract');
            Route::delete('contract/{id}', 'Contract\ContractController@destroy')->where('id', '[0-9]+');

            Route::post('searchuserbyemail', 'Contract\ContractController@searchuserbyemail');

            //Contract Template CRUD
            Route::get('contract-template', 'Contract\ContracttemplateController@index'); //->middleware('permission:Index Template');
            Route::get('contract-template/{id}', 'Contract\ContracttemplateController@show')->where('id', '[0-9]+'); //->middleware('permission:Show Template');
            Route::post('contract-template', 'Contract\ContracttemplateController@store'); //->middleware('permission:Add Template');
            Route::put('contract-template/{id}', 'Contract\ContracttemplateController@update')->where('id', '[0-9]+'); //->middleware('permission:Edit Template');
            Route::delete('contract-template/{id}', 'Contract\ContracttemplateController@destroy')->where('id', '[0-9]+');

            //Im Test

            // Route::namespace()

            // Route::get('im-test/{id}', 'Im\ImController@show')->where('id', '[0-9]+'); //->middleware('permission:Show Contract');
            // Route::get('im-test-1', 'Im\ImController@im_test_1');
            // Route::get('im-test-2', 'Im\ImController@im_test_2');
            // Route::get('im-test-3', 'Im\ImController@im_test_3');
            // Route::get('im-test-4', 'Im\ImController@im_test_4');
            // Route::get('im-test-5', 'Im\ImController@im_test_5');

            // Route::post('im-test', 'Im\ImController@store'); //->middleware('permission:Add Contract');
            // Route::post('im-test-post-1', 'Im\ImController@im_test_post_1');
            // Route::post('im-test-post-2', 'Im\ImController@im_test_post_2');
            // Route::post('im-test-post-3', 'Im\ImController@im_test_post_3');
            // Route::post('im-test-post-4', 'Im\ImController@im_test_post_4');
            // Route::post('im-test-post-5', 'Im\ImController@im_test_post_5');

            // Route::put('im-test/{id}', 'Im\ImController@update')->where('id', '[0-9]+'); //->middleware('permission:Edit Contract');
            // Route::put('im-test-update-1', 'Im\ImController@im_test_update_1');
            // Route::put('im-test-update-2', 'Im\ImController@im_test_update_2');
            // Route::put('im-test-update-3', 'Im\ImController@im_test_update_3');
            // Route::put('im-test-update-4', 'Im\ImController@im_test_update_4');
            // Route::put('im-test-update-5', 'Im\ImController@im_test_update_5');
            // Route::delete('im-test/{id}', 'Im\ImController@destroy')->where('id', '[0-9]+');

            //Reference Check
            Route::get('reference-check', 'Userreference\ReferencecheckController@index')->middleware('permission:Show Reference Check|Set as Admin');
            Route::get('reference-check/{id}', 'Userreference\ReferencecheckController@show')->where('id', '[0-9]+')->middleware('permission:Show Reference Check|Set as Admin');
            Route::post('reference-check', 'Userreference\ReferencecheckController@store')->middleware('permission:Add Reference Check|Set as Admin');
            Route::put('reference-check/{id}', 'Userreference\ReferencecheckController@update')->where('id', '[0-9]+')->middleware('permission:Edit Reference Check|Set as Admin');
            Route::delete('reference-check/{id}', 'Userreference\ReferencecheckController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Reference Check|Set as Admin');
            Route::delete('reference-check/delete-question/{id}', 'Userreference\ReferencecheckController@destroyquestion')->where('id', '[0-9]+')->middleware('permission:Delete Reference Check|Set as Admin');
            Route::get('reference-question-category/all-options', 'Userreference\ReferencecheckController@allOptions');
            Route::get('reference-check-history/{profile_id}', 'ReferenceHistoryController@get')->where('profile_id', '[0-9]+')->middleware('permission:Set as Admin');
            
            //Question Reference
            //

            Route::get('reference-question-category', 'Userreference\QuestioncategoryController@index')->middleware('permission:Index Reference Question Category');
            Route::get('reference-question-category/{id}', 'Userreference\QuestioncategoryController@show')->where('id', '[0-9]+')->middleware('permission:Show Reference Question Category');
            Route::post('reference-question-category', 'Userreference\QuestioncategoryController@store')->middleware('permission:Reference Question Category');
            Route::put('reference-question-category/{id}', 'Userreference\QuestioncategoryController@update')->where('id', '[0-9]+')->middleware('permission:Edit Reference Question Category');
            Route::delete('reference-question-category/{id}', 'Userreference\QuestioncategoryController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Reference Question Category');

            Route::get('reference-question', 'Userreference\QuestionController@index')->middleware('permission:Index Reference Question');
            Route::get('reference-question/{id}', 'Userreference\QuestionController@show')->where('id', '[0-9]+')->middleware('permission:Show Reference Question');
            Route::post('reference-question', 'Userreference\QuestionController@store')->middleware('permission:Reference Question');
            Route::put('reference-question/{id}', 'Userreference\QuestionController@update')->where('id', '[0-9]+')->middleware('permission:Edit Reference Question');
            Route::delete('reference-question/{id}', 'Userreference\QuestionController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Reference Question');

            // LANGUAGE CRUD
            Route::get('languages/all-options', 'LanguageController@all')->middleware('permission:Index Language|Index HR Job Category');
            Route::get('languages', 'LanguageController@index')->middleware('permission:Index Language');
            Route::get('languages/{id}', 'LanguageController@show')->where('id', '[0-9]+')->middleware('permission:Show Language');
            Route::post('languages', 'LanguageController@store')->middleware('permission:Add Language');
            Route::put('languages/{id}', 'LanguageController@update')->where('id', '[0-9]+')->middleware('permission:Edit Language');
            Route::delete('languages/{id}', 'LanguageController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Language');

            // SECTOR CRUD
            Route::get('sectors/all-options', 'SectorController@allOptions')->middleware('permission:Index Sector|P11 Access');
            Route::get('sectors', 'SectorController@index')->middleware('permission:Index Sector');
            Route::post('sectors/merge', 'SectorController@merge')->middleware('permission:Add Sector');
            Route::get('sectors/{id}', 'SectorController@show')->where('id', '[0-9]+')->middleware('permission:Show Sector');
            Route::post('sectors', 'SectorController@store')->middleware('permission:Add Sector');
            Route::put('sectors/{id}', 'SectorController@update')->where('id', '[0-9]+')->middleware('permission:Edit Sector');
            Route::delete('sectors/{id}', 'SectorController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Sector');
            Route::post('sectors/suggestions', 'SectorController@suggestions');
            Route::post('sectors/set-is-approved', 'SectorController@setIsApproved')->middleware('permission:Approve Sector');
            Route::get('sectors/approved-sectors', 'SectorController@approvedSectors')->middleware('permission:Index Roster');

            // UN ORGANIZATION CRUD
            Route::get('un-organizations', 'UNOrganizationController@index')->middleware('permission:Index UN Org');
            Route::get('un-organizations/{id}', 'UNOrganizationController@show')->where('id', '[0-9]+')->middleware('permission:Show UN Org');
            Route::post('un-organizations', 'UNOrganizationController@store')->middleware('permission:Add UN Org');
            Route::put('un-organizations/{id}', 'UNOrganizationController@update')->where('id', '[0-9]+')->middleware('permission:Edit UN Org');
            Route::delete('un-organizations/{id}', 'UNOrganizationController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete UN Org');

            // DEGREE LEVEL CRUD
            Route::get('degree-levels/all-options', 'DegreeLevelController@all')->middleware('permission:Index Degree Level|P11 Access|Index HR Job Category');
            Route::get('degree-levels', 'DegreeLevelController@all')->middleware('permission:Index Degree Level|P11 Access');
            Route::get('degree-levels/{id}', 'DegreeLevelController@show')->where('id', '[0-9]+')->middleware('permission:Show Degree Level');
            Route::post('degree-levels', 'DegreeLevelController@store')->middleware('permission:Add Degree Level');
            Route::put('degree-levels/{id}', 'DegreeLevelController@update')->where('id', '[0-9]+')->middleware('permission:Edit Degree Level');
            Route::delete('degree-levels/{id}', 'DegreeLevelController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Degree Level');
            Route::post('degree-levels/change-order', 'DegreeLevelController@changeOrder')->middleware('permission:Edit Degree Level');

            // LANGUAGE LEVEL CRUD
            Route::get('language-levels/all-options', 'LanguageLevelController@all')->middleware('permission:Index Language Level|P11 Access|Index HR Job Category');
            Route::get('language-levels', 'LanguageLevelController@all')->middleware('permission:Index Language Level|P11 Access');
            Route::get('language-levels/default', 'LanguageLevelController@default')->middleware('permission:Index Language Level');
            Route::get('language-levels/{id}', 'LanguageLevelController@show')->where('id', '[0-9]+')->middleware('permission:Show Language Level');
            Route::post('language-levels', 'LanguageLevelController@store')->middleware('permission:Add Language Level');
            Route::put('language-levels/{id}', 'LanguageLevelController@update')->where('id', '[0-9]+')->middleware('permission:Edit Language Level');
            Route::delete('language-levels/{id}', 'LanguageLevelController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Language Level');
            Route::post('language-levels/change-order', 'LanguageLevelController@changeOrder')->middleware('permission:Edit Language Level');

            // SETTING CRUD
            Route::get('settings', 'SettingController@index')->middleware('permission:Index Setting');
            Route::get('settings/options/{slug}', 'SettingController@options');
            Route::get('settings/{id}', 'SettingController@show')->where('id', '[0-9]+')->middleware('permission:Show Setting');
            Route::post('settings', 'SettingController@store')->middleware('permission:Add Setting');
            Route::put('settings/{id}', 'SettingController@update')->where('id', '[0-9]+')->middleware('permission:Edit Setting');
            Route::delete('settings/{id}', 'SettingController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Setting');

            // DURATION CRUD
            Route::get('durations', 'DurationController@index')->middleware('permission:Index Duration');
            Route::get('durations/{id}', 'DurationController@show')->where('id', '[0-9]+')->middleware('permission:Show Duration');
            Route::post('durations', 'DurationController@store')->middleware('permission:Add Duration');
            Route::put('durations/{id}', 'DurationController@update')->where('id', '[0-9]+')->middleware('permission:Edit Duration');
            Route::delete('durations/{id}', 'DurationController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Duration');
            Route::get('/durations/all-options', 'DurationController@allOptions')->middleware('permission:Add ToR|Edit ToR');

            // IMMAP OFFICE CRUD
            Route::get('/immap-offices/hq', 'ImmapOfficeController@getHQ')->middleware('permission:P11 Access');
            Route::get('/immap-offices/p11-all-options', 'ImmapOfficeController@p11AllOptions')->middleware('permission:P11 Access');
            Route::get('/immap-offices/all-options', 'ImmapOfficeController@allOptions')->middleware('permission:Add Immap Office|P11 Access|Approve Domestic Travel Request|Approve Global Travel Request');
            Route::get('/immap-offices', 'ImmapOfficeController@index')->middleware('permission:Index Immap Office');
            Route::get('/immap-offices/{id}', 'ImmapOfficeController@show')->middleware('permission:Show Immap Office');
            Route::post('/immap-offices', 'ImmapOfficeController@store')->middleware('permission:Add Immap Office');
            Route::put('/immap-offices/{id}', 'ImmapOfficeController@update')->middleware('permission:Edit Immap Office');
            Route::delete('/immap-offices/{id}', 'ImmapOfficeController@destroy')->middleware('permission:Delete Immap Office');
            Route::post('/immap-offices/set-is-active', 'ImmapOfficeController@setIsActive')->middleware('permission:Approve Immap Office');
            Route::post('/immap-offices/set-is-hq', 'ImmapOfficeController@setIsHQ')->middleware('permission:Approve Immap Office');

            // QUIZ TEMPLATE CRUD
            Route::namespace('Quiz')->group(function () {
                Route::get('quiz-templates', 'QuizTemplateController@index')->middleware('permission:Index Quiz Template');
                Route::get('quiz-templates/{id}', 'QuizTemplateController@show')->where('id', '[0-9]+')->middleware('permission:Show Quiz Template');
                Route::post('quiz-templates', 'QuizTemplateController@store')->middleware('permission:Add Quiz Template');
                Route::put('quiz-templates/{id}', 'QuizTemplateController@update')->where('id', '[0-9]+')->middleware('permission:Edit Quiz Template');
                Route::delete('quiz-templates/{id}', 'QuizTemplateController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Quiz Template');
                Route::get('/quiz-templates/all-options', 'QuizTemplateController@allOptions')->middleware('permission:Add Quiz|Edit Quiz');
                Route::post('quiz-templates/set-is-default', 'QuizTemplateController@setIsDefault')->middleware('permission:Index Quiz Template|Edit Quiz Template');
            });

            Route::namespace('Roster')->group(function () {
                // Roster
                Route::get('roster', 'RosterController@index')->middleware('permission:Index Roster');
                Route::get('roster/{id}/count', 'RosterController@getRosterCountByStep')->where('id', '[0-9]+')->middleware('permission:Index Roster');
                Route::post('roster/profiles', 'RosterController@getProfileList')->middleware('permission:Index Roster|Approve Roster');
                Route::post('roster/change-step', 'RosterController@changeStep')->middleware('permission:Index Roster|Approve Roster');

                Route::post('roster/skype-call-invitation', 'RosterController@skypeInvitation')->middleware('permission:Approve Roster');
                Route::post('roster/im-test-invitation', 'RosterController@imTestInvitation')->middleware('permission:Approve Roster');
                Route::put('roster/save-im-test-score/{id}', 'RosterController@saveIMTestScore')->middleware('permission:Approve Roster');
                Route::post('roster/interview-invitation', 'RosterController@interviewInvitation')->middleware('permission:Approve Roster');
                Route::post('roster/send-group-invitations', 'RosterController@sendInvitationsGroup')->middleware('permission:Approve Roster');
                Route::post('roster/reference-check-invitation', 'RosterController@referenceCheckInvitation')->middleware('permission:Approve Roster');


                // Roster Process
                Route::get('roster-processes/{id}/roster-campaign-data', 'RosterProcessController@getRosterCampaignData')->where('id', '[0-9]+')->middleware('permission:Index Roster|Approve Roster');
                Route::post('roster-processes/{id}/update-campaign-data', 'RosterProcessController@updateRosterCampaignData')->where('id', '[0-9]+')->middleware('permission:Index Roster|Approve Roster');
                Route::get('roster-processes/all-options', 'RosterProcessController@allOptions');
                Route::get('roster-processes/default', 'RosterProcessController@getDefault')->middleware('permission:Index Roster');
                Route::get('roster-processes/{id}/roster-steps', 'RosterProcessController@getRosterSteps')->middleware('permission:Index Roster|Approve Roster');
                Route::get('roster-processes/{id}', 'RosterProcessController@show')->where('id', '[0-9]+')->middleware('permission:Show Roster Process|P11 Access');
                Route::post('roster-processes', 'RosterProcessController@store')->middleware('permission:Add Roster Process');
                Route::put('roster-processes/{id}', 'RosterProcessController@update')->where('id', '[0-9]+')->middleware('permission:Edit Roster Process');
                Route::delete('roster-processes/{id}', 'RosterProcessController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Roster Process');
                Route::get('roster-processes/sbp-skillsets/all', 'RosterProcessController@getAllSbpSkillSets')->middleware('permission:Set as Admin|Add Roster Process|Edit Roster Process|Add ToR|Edit ToR');
                Route::get('roster-processes/sbp-skillsets', 'RosterProcessController@getSbpSkillSets')->middleware('permission:Set as Admin|Add Roster Process|Edit Roster Process');

                // Roster Step
                Route::post('roster-steps', 'RosterStepController@store')->middleware('permission:Add Roster Step|Add Roster Process');
                Route::put('roster-steps/{id}', 'RosterStepController@update')->where('id', '[0-9]+')->middleware('permission:Edit Roster Step|Edit Roster Process');
                Route::delete('roster-steps/{id}', 'RosterStepController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Roster Step|Delete Roster Process');

                // DOWNLOAD STATISTIC AND PROFILE DATA FOR ROSTER PROCESS IN CSV FILE FORMAT
                Route::get('roster/download-statistics/{id}', 'RosterController@downloadStatistics')->middleware('permission:Index Roster|Approve Roster');
                Route::get('roster/download-roster-profiles/{id}/{step}', 'RosterController@downloadRosterProfiles')->where(['id' => '[0-9]+', 'step' => '[0-9]+'])->middleware('permission:Index Roster|Approve Roster');

            });

            Route::get('get-skype', 'ProfileController@getSkype')->middleware('permission:Approve Roster|Change Applicant Status');

            // IM Test
            Route::namespace('Im')->group(function () {
                // IM Test Template
                Route::get('im-test-templates/all-options', 'IMTestTemplateController@allOptions')->middleware('permission:Index IM Test Template|Add Quiz Template');
                Route::get('im-test-templates', 'IMTestTemplateController@index')->middleware('permission:Index IM Test Template');
                Route::get('im-test-templates/{id}', 'IMTestTemplateController@show')->where('id', '[0-9]+')->middleware('permission:Show IM Test Template');
                Route::post('im-test-templates', 'IMTestTemplateController@store')->middleware('permission:Add IM Test Template');
                Route::put('im-test-templates/{id}', 'IMTestTemplateController@update')->where('id', '[0-9]+')->middleware('permission:Edit IM Test Template');
                Route::delete('im-test-templates/{id}', 'IMTestTemplateController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete IM Test Template');
                Route::post('im-test-templates/set-is-default', 'IMTestTemplateController@setIsDefault')->middleware('permission:Index IM Test Template|Edit IM Test Template');
                Route::post('im-test-update-data-set', 'IMTestTemplateController@im_test_update_data_set')->middleware('permission:Index IM Test Template|Edit IM Test Template|Apply Job');
                Route::delete('im-test-destroy-data-set/{id}', 'IMTestTemplateController@im_test_destroy_data_set')->middleware('permission:Index IM Test Template|Edit IM Test Template|Delete IM Test Template');

                Route::get('im-test-templates/{id}/steps/{step}', 'IMTestTemplateController@steps')
                    ->where(['id' => '[0-9]+', 'step' => '[0-9]+'])->middleware('permission:Show IM Test Template|Apply Job');

                //Take IM Test
                // NEED EVALUATION FOR THIS ROUTE, FRONT END NOT USING THESE ROUTE
                // Route::get('follow-imtest', 'FollowImTestController@index'); //->middleware('permission:Show Contract');

                // Route::get('follow-imtest/{id}', 'FollowImTestController@show')->where('id', '[0-9]+'); //->middleware('permission:Show Contract');

                Route::post('follow-imtest', 'FollowImTestController@store');
                // NEED EVALUATION FOR THIS ROUTE, FRONT END NOT USING THESE ROUTE
                // Route::put('follow-imtest/{id}/steps/{step}', 'FollowImTestController@update')
                //     ->where(['id' => '[0-9]+', 'step' => '[0-9]+']);

                // Route::delete('follow-imtest/{id}', 'FollowImTestController@destroy')->where('id', '[0-9]+');

                Route::get('im-test/{id}/user/{userid}', 'FollowImTestController@result')
                    ->where(['id' => '[0-9]+', 'userid' => '[0-9]+']);

                Route::get('im-test/{id}/check-user', 'IMTestController@checkUser')->where('id', '[0-9]+');
                Route::get('im-test/{id}/start-test', 'IMTestController@startTest')->where('id', '[0-9]+');
                // NEED EVALUATION
                // Route::get('follow-imtest/{id}/steps/{step}', 'FollowImTestController@steps')
                //     ->where(['id' => '[0-9]+', 'step' => '[0-9]+'])->middleware('permission:Show IM Test Template');
            });

            // HR
            Route::namespace('HR')->group(function () {

                // JOB LEVEL CRUD
                Route::get('hr-job-levels/all-options', 'HRJobLevelController@allOptions')->middleware('permission:Index HR Job Level|Index ToR');
                Route::get('hr-job-levels', 'HRJobLevelController@index')->middleware('permission:Index HR Job Level');
                Route::get('hr-job-levels/{id}', 'HRJobLevelController@show')->where('id', '[0-9]+')->middleware('permission:Show HR Job Level');
                Route::post('hr-job-levels', 'HRJobLevelController@store')->middleware('permission:Add HR Job Level');
                Route::put('hr-job-levels/{id}', 'HRJobLevelController@update')->where('id', '[0-9]+')->middleware('permission:Edit HR Job Level');
                Route::delete('hr-job-levels/{id}', 'HRJobLevelController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete HR Job Level');

                // //JOB REQUIREMENTS CRUD
                Route::get('/hr-requirements/all-options', 'HRRequirementController@allOptions')->middleware('permission:Index HR Job Category|Index ToR|Add ToR|Edit ToR');
                Route::get('/hr-requirements/get-component/{value}', 'HRRequirementController@getComponent')->where('value', implode('|', array_keys(config('hr.requirements'))))->middleware('permission:Index HR Job Category|Index ToR|Add ToR|Edit ToR');

                //JOB CATEGORY CRUD
                Route::get('hr-job-categories/tor-parameters/{id}', 'HRJobCategoryController@torParameters')->where('id', '[0-9]+')->middleware('permission:Index HR Job Standard|Index ToR');
                Route::get('hr-job-categories/all-options', 'HRJobCategoryController@allOptions')->middleware('permission:Index HR Job Standard');
                Route::get('hr-job-categories', 'HRJobCategoryController@index')->middleware('permission:Index HR Job Category');
                Route::get('hr-job-categories/{id}', 'HRJobCategoryController@show')->where('id', '[0-9]+')->middleware('permission:Show HR Job Category');
                Route::post('hr-job-categories', 'HRJobCategoryController@store')->middleware('permission:Add HR Job Category');
                Route::put('hr-job-categories/{id}', 'HRJobCategoryController@update')->where('id', '[0-9]+')->middleware('permission:Edit HR Job Category');
                Route::delete('hr-job-categories/{id}', 'HRJobCategoryController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete HR Job Category');
                Route::post('hr-job-categories/approve', 'HRJobCategoryController@approveCategory')->middleware('permission:Index HR Job Category');
                Route::get('hr-job-categories-approved', 'HRJobCategoryController@getApprovedCategory')->middleware('permission:Index HR Job Category|Index HR Job Standard|Index ToR|Show ToR|Edit ToR|Add ToR');

                //JOB STANDARD CRUD
                Route::get('hr-job-standards/all-options', 'HRJobStandardController@allOptions')->middleware('permission:Index HR Job Standard|Index ToR');
                Route::get('hr-job-standards', 'HRJobStandardController@index')->middleware('permission:Index HR Job Standard');
                Route::get('hr-job-standards/{id}', 'HRJobStandardController@show')->where('id', '[0-9]+')->middleware('permission:Show HR Job Standard');
                Route::post('hr-job-standards', 'HRJobStandardController@store')->middleware('permission:Add HR Job Standard');
                Route::put('hr-job-standards/{id}', 'HRJobStandardController@update')->where('id', '[0-9]+')->middleware('permission:Edit HR Job Standard');
                Route::delete('hr-job-standards/{id}', 'HRJobStandardController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete HR Job Standard');
                Route::get('hr-job-standards/tor-options/{id}', 'HRJobStandardController@torOptions')->where('id', '[0-9]+')->middleware('permission:Index ToR|Index HR Job Standard');

                //JOB TOR CRUD
                Route::get('tor/{id}/pdf', 'HRToRController@getPDFToR')->where('id', '[0-9]+')->middleware('permission:Show ToR|Edit ToR');
                Route::get('tor/{id}/word', 'HRToRController@getWORDToR')->where('id', '[0-9]+')->middleware('permission:Show ToR|Edit ToR');
                Route::post('tor/{id}/recommendations', 'HRToRController@getRecommendations')->where('id', '[0-9]+')->middleware('permission:Index ToR|Show ToR|Edit ToR');
                Route::get('tor/with-requirements/{id}', 'HRToRController@withRequirements')->where('id', '[0-9]+')->middleware('permission:Index ToR|Add Job|Edit Job|Show Job');
                Route::get('tor/all-options', 'HRToRController@allOptions')->middleware('permission:Index ToR|Add Job|Edit Job');
                Route::post('tor/{id}/all', 'HRToRController@index')->middleware('permission:Index ToR');
                Route::get('/tor/{id}/view-tor', 'HRToRController@viewToR')->where('id', '[0-9]+')->middleware('permission:Show ToR');
                Route::get('tor/{id}', 'HRToRController@show')->where('id', '[0-9]+')->middleware('permission:Show ToR');
                Route::post('tor', 'HRToRController@store')->middleware('permission:Add ToR');
                Route::put('tor/{id}', 'HRToRController@update')->where('id', '[0-9]+')->middleware('permission:Edit ToR');
                Route::delete('tor/{id}', 'HRToRController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete ToR');
                Route::get('tor/jobstandard', 'HRToRController@getJobstandard')->middleware('permission:Index ToR');
                Route::get('tor/{id}/duplicate', 'HRToRController@duplicateToR')->middleware('permission:Show ToR|Edit ToR');

                //HR CONTRACT TEMPLATES CRUD
                Route::get('hr-contract-templates', 'HRContractTemplateController@index')->middleware('permission:Index Contract Template');
                Route::get('hr-contract-templates/{id}', 'HRContractTemplateController@show')->where('id', '[0-9]+')->middleware('permission:Show Contract Template');
                Route::post('hr-contract-templates', 'HRContractTemplateController@store')->middleware('permission:Add Contract Template');
                Route::put('hr-contract-templates/{id}', 'HRContractTemplateController@update')->where('id', '[0-9]+')->middleware('permission:Edit Contract Template');
                Route::delete('hr-contract-templates/{id}', 'HRContractTemplateController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Contract Template');
                Route::post('hr-contract-templates/upload-logo', 'HRContractTemplateController@uploadLogo')->middleware('permission:Add Contract Template|Edit Contract Template');
            });

            // Security  Module
            Route::namespace('SecurityModule')->prefix('security-module')->middleware(['iMMAPer'])->group(function() {
                // Put your route here

                // Set High Risk City
                Route::get('countries/{country_id}', 'SecurityAdvisorController@getCountry')->where('country_id', '[0-9]+')->middleware('permission:Set as Admin|Can Make Travel Request');
                Route::post('countries/set-high-risk', 'SecurityAdvisorController@setHighRisk')->middleware('permission:Set as Admin');
                Route::post('risk-location/add', 'SecurityAdvisorController@saveHighRiskCity')->middleware('permission:Set as Admin');
                Route::put('risk-location/edit/{city_id}', 'SecurityAdvisorController@editHighRiskCity')->middleware('permission:Set as Admin');
                Route::delete('risk-location/delete/{city_id}', 'SecurityAdvisorController@deleteHighRiskCity')->middleware('permission:Set as Admin');

                // Travel Purpose data
                Route::get('travel-purposes/all-options', 'BasicDataController@travelPurposeOptions')->middleware('permission:Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request');
                // Critical Movement data
                Route::get('critical-movements/all-options', 'BasicDataController@criticalMovementOptions')->middleware('permission:Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request');
                // Security Measure data
                Route::get('security-measures/all-options', 'BasicDataController@securityMeasureOptions')->middleware('permission:Manage Security Module|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request');
                // Movement State data
                Route::get('movement-states/all-options', 'BasicDataController@movementStateOptions')->middleware('permission:Manage Security Module|Can Make Travel Request|Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request');

                // Security Officers
                Route::get('security-advisors/get-view-only-immaper', 'SecurityAdvisorController@getViewOnlyImmaper')->middleware('permission:Manage Security Module');
                Route::post('security-advisors/immaper/assign-countries/user/{id}', 'SecurityAdvisorController@assignImmaper')->where('id', '[0-9]+')->middleware('permission:Manage Security Module');
                Route::post('security-advisors/national/assign-countries/user/{id}', 'SecurityAdvisorController@assign')->where('id', '[0-9]+')->middleware('permission:Manage Security Module');
                Route::get('security-advisors/national/user/{id}/countries', 'SecurityAdvisorController@getCountries')->where('id', '[0-9]+')->middleware('permission:Manage Security Module');
                Route::get('security-advisors/immaper/user/{id}/countries', 'SecurityAdvisorController@getImmaperCountries')->where('id', '[0-9]+')->middleware('permission:Manage Security Module');
                Route::get('security-advisors/{securityType}', 'SecurityAdvisorController@index')->where('securityType', 'national|global|immaper')->middleware('permission:Manage Security Module');

                // MRF Form Store
                Route::post('mrf', 'MRFRequestController@store')->middleware('permission:Can Make Travel Request');
                // MRF PDF
                Route::get('mrf/{id}/pdf', 'MRFRequestController@getMRFPDF')->middleware('permission:Can Make Travel Request');
                // MRF Form Update
                Route::put('mrf/{id}', 'MRFRequestController@update')->where('id', '[0-9]+')->middleware('permission:Can Make Travel Request');
                // Delete MRF
                Route::delete('mrf/{id}', 'MRFRequestController@destroy')->where('id', '[0-9]+')->middleware('permission:Can Make Travel Request');
                // SHOW MRF DATA based on user
                Route::get('mrf/{user}/show/{id}', 'MRFRequestController@show')->where('id', '[0-9]+')->where('user', '(immaper|security)')->middleware('permission:Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request|View Other Travel Request');
                // TAR Form data
                Route::post('tar', 'TARRequestController@store')->middleware('permission:Can Make Travel Request');
                //TAR get PDF
                Route::get('tar/{id}/pdf', 'TARRequestController@getTARPDF')->middleware('permission:Can Make Travel Request');
                // TAR Form update
                Route::put('tar/{id}', 'TARRequestController@update')->where('id', '[0-9]+')->middleware('permission:Can Make Travel Request');
                // Delete TAR
                Route::delete('tar/{id}', 'TARRequestController@destroy')->where('id', '[0-9]+')->middleware('permission:Can Make Travel Request');
                // SHOW TAR DATA based on user
                Route::get('tar/{user}/show/{id}', 'TARRequestController@show')->where('id', '[0-9]+')->where('user', '(immaper|security)')->middleware('permission:Can Make Travel Request|Approve Global Travel Request|Approve Domestic Travel Request|View Other Travel Request');
                // Travel Requests Lists for the iMMAPer
                Route::get('travel-requests/{requestType}/immaper/lists/{status}', 'TravelRequestController@listsForImmaper')->where('requestType', '(all|tar|mrf)')->where('status', '(all|saved|submitted|approved|disapproved|revision)')->middleware('permission:Can Make Travel Request');
                // Security POV
                Route::get('/travel-requests', 'TravelRequestController@lists');
                //Approval Travel Requests Lists
                Route::get('/approval-travel-requests', 'TravelRequestController@getAllApproval');
                // Security Update TAR
                Route::post('tar/{id}/security-update', 'TARRequestController@security_update')->where('id', '[0-9]+')->middleware('permission:Approve Global Travel Request');
                // Security Update MRF
                Route::post('mrf/{id}/security-update', 'MRFRequestController@security_update')->where('id', '[0-9]+')->middleware('permission:Approve Domestic Travel Request');
                // Update Trip view status
                Route::put('update-trip-view-status/{id}', 'TravelRequestController@updateTripViewStatus')->where('id', '[0-9]+')->middleware('permission:Hide Travel Dashboard Events');
                // Update Trip check in status TAR
                Route::put('tar/{id}/check-in', 'TARRequestController@checkIn')->where('id', '[0-9]+');
                // Update Trip check in status MRF
                Route::put('mrf/{id}/check-in', 'MRFRequestController@checkIn')->where('id', '[0-9]+');
                // Export travel request in Excel document
                Route::get('/download-travel-requests', 'TravelRequestController@getTravelRequestsExport');
            });

            Route::middleware(['iMMAPer'])->group(function() {
                // Security Module Upload MRF Government File
                Route::post('security-module/upload-mrf-government-file', 'AttachmentController@upload_mrf_government_file')->middleware('permission:Can Make Travel Request');
                Route::post('security-module/delete-mrf-government-file', 'AttachmentController@delete_mrf_government_file')->middleware('permission:Can Make Travel Request');
                // Security Module Upload TAR Government File
                Route::post('security-module/upload-tar-government-file', 'AttachmentController@upload_tar_government_file')->middleware('permission:Can Make Travel Request');
                Route::post('security-module/delete-tar-government-file', 'AttachmentController@delete_tar_government_file')->middleware('permission:Can Make Travel Request');
                // Security Module Upload MRF Air Ticket File
                Route::post('security-module/upload-mrf-air-ticket-file', 'AttachmentController@upload_mrf_air_ticket_file')->middleware('permission:Can Make Travel Request');
                Route::post('security-module/delete-mrf-air-ticket-file', 'AttachmentController@delete_mrf_air_ticket_file')->middleware('permission:Can Make Travel Request');
            });

            //Policy Repository
            Route::middleware(['iMMAPer'])->group(function() {
                Route::get('repository', 'Repository\RepositoryController@index')->middleware('permission:Index Repository|Set as Admin');
                Route::get('repository/{id}/{type}', 'Repository\RepositoryController@show')
                    ->where(['id' => '[0-9]+', 'type' => '[0-9]+'])->middleware('permission:Show Repository|Set as Admin');
                Route::post('repository', 'Repository\RepositoryController@store')->middleware('permission:Add Repository|Set as Admin');
                Route::put('repository/{id}', 'Repository\RepositoryController@update')->where('id', '[0-9]+')->middleware('permission:Edit Repository|Set as Admin');
                Route::delete('repository/{id}', 'Repository\RepositoryController@destroy')->where('id', '[0-9]+')->middleware('permission:Delete Repository|Set as Admin');

                Route::post('repository/search', 'Repository\RepositoryController@search')
                    ->middleware('permission:Show Repository|Set as Admin');

                Route::post('upload-policy-repository', 'Repository\RepositoryController@upload_files')->middleware('permission:Add Repository|Set as Admin');
                Route::post('delete-policy-repository', 'Repository\RepositoryController@delete_file')->middleware('permission:Add Repository|Set as Admin');

                Route::get('repository-category', 'Repository\RepositorycategoryController@index')->middleware('permission:Index Repository|Set as Admin');

                Route::get('repository-category/{type}', 'Repository\RepositorycategoryController@show')
                    ->where('type', '[0-9]+')->middleware('permission:Show Repository|Set as Admin');

                Route::post('repository-category', 'Repository\RepositorycategoryController@store')->middleware('permission:Add Repository|Set as Admin');
                Route::put('repository-category/{id}', 'Repository\RepositorycategoryController@update')->where('id', '[0-9]+')->middleware('permission:Edit Repository|Set as Admin');

                Route::delete('repository-category/{id}', 'Repository\RepositorycategoryController@destroy')
                    ->where('id', '[0-9]+')->middleware('permission:Delete Repository|Set as Admin');

                Route::get('repository-category/category-by-type/{type}', 'Repository\RepositorycategoryController@getCategoryByType')
                    ->where('type', '[1-5]')->middleware('permission:Index Repository|Add Repository|Edit Repository|Delete Repository|Set as Admin');
                Route::get('repository-category/tree-category-by-type/{type}', 'Repository\RepositorycategoryController@getTreeCategoryByType')
                    ->where('type', '[1-5]')->middleware('permission:Index Repository|Add Repository|Edit Repository|Delete Repository|Set as Admin');

                Route::post('repository/notify', 'Repository\RepositoryController@notify')->middleware('permission:Share Repository|Set as Admin');
                Route::get('repository/getImmapOffice', 'Repository\RepositoryController@getImmapOffice')->middleware('permission:Show Repository|Set as Admin');
                Route::get('repository/getRoleRepo', 'Repository\RepositoryController@getRoleRepo')->middleware('permission:Show Repository|Set as Admin');
                Route::get('repository/getDocById/{id}', 'Repository\RepositoryController@getDocById')->where('id', '[0-9]+')->middleware('permission:Show Repository|Set as Admin');

                Route::delete('repository-delete-section/{id}', 'Repository\RepositoryController@deletesection')
                    ->where('id', '[0-9]+')->middleware('permission:Delete Repository|Set as Admin');

                Route::get('repository/pdf/{id}', 'Repository\RepositoryController@getPdf')
                    ->where('id', '[0-9]+')->middleware('permission:Show Repository|Set as Admin');
            });

            // On Boarding
            Route::get('onboarding', 'Onboarding\ContactinformationController@index');

            Route::get('onboarding/{id}', 'Onboarding\ContactinformationController@show')->where('id', '[0-9]+');
            Route::post('onboarding', 'Onboarding\ContactinformationController@store');
            Route::put('onboarding/{id}', 'Onboarding\ContactinformationController@update')->where('id', '[0-9]+');
            Route::delete('onboarding/{id}', 'Onboarding\ContactinformationController@destroy')->where('id', '[0-9]+');

            Route::post('onboarding/upload', 'Onboarding\ContactinformationController@uploadfile');

            Route::delete('onboarding/remove-file/{id}', 'Onboarding\ContactinformationController@removefile')->where('id', '[0-9]+');

            //P11 Completed
            Route::get('get-p11completed', 'P11CompletedController@getP11Completed');
            Route::post('completed-profiles', 'P11CompletedController@getCompleteProfiles');
            Route::post('completed-profiles/archive', 'P11CompletedController@toggleArchiveCompleteProfiles')->middleware('permission:Set as Admin|Can Archive a Profile');
            Route::post('completed-profiles/star', 'P11CompletedController@toggleStarCompleteProfiles')->middleware('permission:Can Star a Profile');
            Route::get('get-available-job', 'P11CompletedController@getavailableJob');
            Route::get('get-roster-process', 'P11CompletedController@getRosterProcess');
            Route::get('get-immaper', 'P11CompletedController@getImmaper');
            Route::get('get-verified-immaper', 'P11CompletedController@getverifiedImmaper');
            Route::post('send-invitation-complete-profile', 'P11CompletedController@sendInvitation');

            //Log
            Route::get('logs', 'Logs\LogsController@index');

            //send email
            Route::post('send-email', 'Sendemail\SendemailController@store');
            Route::get('get-email', 'Sendemail\SendemailController@index');

        });
    });
});

Route::fallback(function () {
    return response()->json(['message' => 'Not Found.'], 404);
});
