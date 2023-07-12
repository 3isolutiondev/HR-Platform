<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Profile extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $fillable = [
        'first_name', 'middle_name', 'family_name',
        'gender',
        'country_residence_id',
        'office_telephone', 'skype', 'office_email',
        'email', 'has_dependents',
        'legal_permanent_residence_status',
        'legal_permanent_residence_status_country',
        'legal_step_changing_present_nationality',
        'legal_step_changing_present_nationality_explanation',
        'relatives_employed_by_public_international_organization',
        'accept_employment_less_than_six_month',
        'previously_submitted_application_for_UN',
        'has_professional_societies',
        'has_publications',
        'objections_making_inquiry_of_present_employer',
        'permanent_civil_servant',
        'permanent_civil_servant_from',
        'permanent_civil_servant_to',
        'permanent_civil_servant_is_now',
        'relatives_employed_by_public_international_organization',
        'relevant_facts', 'violation_of_law',
        'user_id', 'cv_id', 'id_card_id', 'passport_id',
        'signature_id', 'become_roster', 'linkedin_url',
        'is_immaper', 'verified_immaper', 'immap_email',
        'immap_contract_international',
        'immap_office_id',
        'is_immap_inc', 'is_immap_france',
        'job_title', 'duty_station', 'line_manager', 'start_of_current_contract', 'end_of_current_contract',
        'objection_name', 'objection_email', 'objection_position', 'objection_organization',
        'work_experience_years', 'work_experience_months', 'work_experience_days',
        'disclaimer_agree', 'disclaimer_open', 'selected_roster_process', 'updated_at',
        'line_manager_id',
        'under_sbp_program',
        'project_code',
        'share_profile_consent',
        'hear_about_us_from',
        'other_text',
        'paid_from',
        'project_task',
        'supervisor_id',
        'unanet_approver_id',
        'hosting_agency',
        'monthly_rate',
        'housing',
        'perdiem',
        'phone',
        'is_other',
        'not_applicable',
        'other',
        'cost_center',
        'currency',
        'team',
        'contract_type',
        'reference_notice_read',
        'updated_profile'
    ];

    protected $hidden = [
        'created_at', 'pivot'
    ];

    public function registerMediaConversions(Media $media = null)
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->fit(Manipulations::FIT_CROP, 200, 200)->nonQueued();

        $this->addMediaConversion('p11-thumb')
            ->crop(Manipulations::CROP_TOP, 428, 240)->nonQueued();
    }

    public function getMiddleNameAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getMaidenNameAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getGenderAttribute($value)
    {
        return empty($value) ? 0 : $value;
    }

    public function getLinkedinUrlAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getSkypeAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getOfficeTelephoneAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getOfficeEmailAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getCountryResidenceIdAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getImmapEmailAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getJobTitleAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getDutyStationAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getLineManagerAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getStartOfCurrentContractAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getEndOfCurrentContractAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getObjectionNameAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getObjectionEmailAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getObjectionPositionAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    public function getObjectionOrganizationAttribute($value)
    {
        return empty($value) ? '' : $value;
    }

    // public function getCountryResidenceAttribute($value)
    // {
    //     return empty($value) ? '' : ['value' => $this->country_residence->id, 'label' => $this->country_residence->name];
    // }

    // public function getImmapOfficeAttribute($value)
    // {
    //     return is_null($value) ? '' : $value;
    // }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function nationalities()
    {
        return $this->belongsToMany('App\Models\Country', 'p11_country_profile')->withPivot('time');
    }

    public function birth_nationalities()
    {
        return $this->belongsToMany('App\Models\Country', 'p11_country_profile')->wherePivot('time', 'birth');
    }
    public function present_nationalities()
    {
        return $this->belongsToMany('App\Models\Country', 'p11_country_profile')->wherePivot('time', 'present')->withTimestamps();
    }

    public function p11_addresses()
    {
        return $this->hasMany('App\Models\P11\P11Address', 'profile_id');
    }

    public function p11_addresses_permanent()
    {
        return $this->hasMany('App\Models\P11\P11Address')->select(
            'address as permanent_address',
            'country_id as permanent_country',
            'city as permanent_city',
            'postcode as permanent_postcode',
            'telephone as permanent_telephone',
            'fax as permanent_fax',
            'type',
            'profile_id'
        )->where('type', '<>', 'present')->latest();
    }

    public function p11_addresses_present()
    {
        return $this->hasMany('App\Models\P11\P11Address')->select(
            'address as present_address',
            'country_id as present_country',
            'city as present_city',
            'postcode as present_postcode',
            'telephone as present_telephone',
            'fax as present_fax',
            'profile_id'
        )->where('type', '=', 'present')->latest();
    }

    public function p11_dependents()
    {
        return $this->hasMany('App\Models\P11\P11Dependent', 'profile_id');
    }

    public function p11_legal_permanent_residence_status()
    {
        return $this->hasMany('App\Models\P11\P11LegalPermanentResidenceStatus', 'profile_id');
    }

    public function p11_legal_permanent_residence_status_countries()
    {
        return $this->belongsToMany('App\Models\Country', 'p11_legal_permanent_residence_status', 'profile_id', 'country_id');
    }
    // public function p11_legal_permanent_residence_status_countries()
    // {
    //     return $this->hasMany('App\Models\P11\P11LegalPermanentResidenceStatus','profile_id');
    // }

    public function p11_relatives_employed_by_int_org()
    {
        return $this->hasMany('App\Models\P11\P11RelativesEmployedByPublicIntOrg');
    }

    public function p11_field_of_works()
    {
        return $this->hasMany('App\Models\P11\P11FieldOfWork');
    }

    public function p11_submitted_application_for_un()
    {
        return $this->hasMany('App\Models\P11\P11SubmittedApplicationInUn', 'profile_id');
    }

    public function p11_languages()
    {
        return $this->hasMany('App\Models\P11\P11Language');
    }

    public function p11_education_universities()
    {
        return $this->hasMany('App\Models\P11\P11EducationUniversity');
    }

    public function latest_education_universities()
    {
        return $this->hasOne('App\Models\P11\P11EducationUniversity')->orderBy('attended_to','desc');
    }

    public function P11_education_schools()
    {
        return $this->hasMany('App\Models\P11\P11EducationSchool');
    }

    public function field_of_works()
    {
        return $this->belongsToMany('App\Models\FieldOfWork', 'p11_field_of_works', 'profile_id', 'field_of_work_id')->withTimestamps()->select('field');
    }

    public function p11_professional_societies()
    {
        return $this->hasMany('App\Models\P11\P11ProfessionalSociety');
    }

    public function p11_publications()
    {
        return $this->hasMany('App\Models\P11\P11Publication');
    }

    public function p11_employment_records()
    {
        return $this->hasMany('App\Models\P11\P11EmploymentRecord');
    }

    public function p11_permanent_civil_servants()
    {
        return $this->hasMany('App\Models\P11\P11PermanentCivilServant');
    }

    public function p11_references()
    {
        return $this->hasMany('App\Models\P11\P11Reference');
    }

    public function p11_portfolios()
    {
        return $this->hasMany('App\Models\P11\P11Portfolio');
    }

    public function skills()
    {
        return $this->belongsToMany('App\Models\Skill', 'p11_skills', 'profile_id', 'skill_id')->as('proficiency')->withPivot('proficiency', 'years', 'has_portfolio')->withTimestamps();
    }

    public function p11_skills()
    {
        return $this->hasMany('App\Models\P11\P11Skill', 'profile_id');
        // return $this->hasMany('App\Models\P11\P11ProfileSkill','profile_id');
    }

    public function sectors()
    {
        return $this->belongsToMany('App\Models\Sector', 'p11_sectors', 'profile_id', 'sector_id')->withPivot('years', 'has_portfolio')->withTimestamps();
    }

    public function p11_sectors()
    {
        return $this->hasMany('App\Models\P11\P11Sector', 'profile_id');
    }

    public function country_of_works()
    {
        return $this->belongsToMany('App\Models\Country', 'p11_country_experiences', 'profile_id', 'country_id')->withPivot('years', 'months', 'days')->withTimestamps();
    }

    public function p11_country_of_works()
    {
        return $this->hasMany('App\Models\P11\P11CountryExperience', 'profile_id');
    }

    public function p11_cv()
    {
        return $this->belongsTo('App\Models\Attachment', 'cv_id');
    }

    public function p11_id_card()
    {
        return $this->belongsTo('App\Models\Attachment', 'id_card_id');
    }

    public function p11_passport()
    {
        return $this->belongsTo('App\Models\Attachment', 'passport_id');
    }

    public function p11_signature()
    {
        return $this->belongsTo('App\Models\Attachment', 'signature_id');
    }

    public function phones()
    {
        return $this->hasMany('App\Models\P11\P11Phone', 'profile_id');
    }

    public function p11_immap_office()
    {
        return $this->belongsTo('App\Models\ImmapOffice', 'immap_office_id');
    }

    public function languages()
    {
        return $this->belongsToMany('App\Models\Language', 'p11_languages', 'profile_id', 'language_id');
    }

    public function attachment()
    {
        return $this->hasMany('App\Models\Attachment', 'profile_id');
    }

    public function profile_roster_processes()
    {
        return $this->hasMany('App\Models\Roster\ProfileRosterProcess', 'profile_id');
    }

    public function country_residence()
    {
        return $this->belongsTo('App\Models\Country', 'country_residence_id');
    }

    public function roster_processes()
    {
        return $this->belongsToMany('App\Models\Roster\RosterProcess', 'profile_roster_processes', 'profile_id', 'roster_process_id')
            ->withPivot(
                'id',
                'set_as_current_process',
                'current_step',
                'is_completed',
                'is_rejected',
                'skype',
                'skype_date',
                'skype_timezone',
                'skype_invitation_done',
                'im_test_template_id',
                'im_test_timezone',
                'im_test_invitation_done',
                'im_test_submit_date',
                'interview_skype',
                'interview_date',
                'interview_timezone',
                'interview_invitation_done',
                'reference_check_id',
                'im_test_done',
                'im_test_end_time',
                'im_test_start_time',
                'panel_interview',
                'interview_type',
                'interview_address'
            )->withTimestamps();
    }

    function user_answer_many_question()
    {
        return $this->belongsToMany('App\Models\Imtest\Question_im_test', 'Answer');
    }

    function user_has_reference_question()
    {
        return $this->hasMany('\App\Models\Userreference\Answer', 'profil_id');
    }

    function reference_category()
    {
        return $this->belongsToMany(
            'App\Models\Userreference\Questioncategory',
            'profil_assignment_question',
            'profil_id',
            'category_question_reference_id'
        );
    }

    function follow_im_test()
    {
        return $this->belongsToMany(
            'App\Models\Imtest\Imtest',
            'follow_im_test',
            'profil_id',
            'im_test_id'
        )
            ->withPivot('text1', 'text2', 'text3', 'file1', 'file2', 'file3');
    }

    public function im_test_answers()
    {
        return $this->hasMany('App\Models\Imtest\Follow_im_test', 'profil_id');
    }

    function answer_im_test_question()
    {
        return $this->hasMany('\App\Models\Imtest\Answer_im_test', 'profil_id');
    }

    public function interview_request_contract(){
        return $this->hasMany('App\Models\JobInterviewRequestContract', 'profile_id');
    }
}
