<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use App\Models\Profile;
use App\Models\Country;
use App\Models\FieldOfWork;
use App\Models\OfficeEquipment;
use App\Models\Skill;
use App\Models\Attachment;
use App\Models\User;
use App\Models\Role;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\ProfileRosterProcess;
use App\Models\Roster\RosterInvitation;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Http\Controllers\API\AuthenticationController;
use DateTime;
use App\Traits\UserTrait;
use App\Traits\ValidationTrait;
use App\Traits\iMMAPerTrait;
use App\Traits\SBPMemberTrait;
use App\Traits\RosterTrait;
use Illuminate\Support\Facades\Mail;
use App\Mail\ImmapVerification;
use App\Models\LanguageLevel;
use App\Models\Sector;
use dawood\phpChrome\Chrome;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;

use Spiritix\Html2Pdf\Converter;
use Spiritix\Html2Pdf\Input\StringInput;
use Spiritix\Html2Pdf\Output\DownloadOutput;
use Spatie\Browsershot\Browsershot;

class ProfileController extends Controller
{
    use ValidationTrait, iMMAPerTrait, SBPMemberTrait, UserTrait, RosterTrait;

    const MODEL = 'App\Models\Profile';
    const SINGULAR = 'Profile';

    const APPLICATION_PAGINATE = 5;

    const P11FORM1_RULES = [
        'first_name' => 'required|string|max:255',
        'middle_name' => 'sometimes|nullable|string',
        'family_name' => 'required|string|max:255',
        // 'maiden_name' => 'sometimes|nullable|string',
        // 'bdate' => 'required|in:01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
        // 'bmonth' => 'required|in:01,02,03,04,05,06,07,08,09,10,11,12',
        // 'byear' => 'required|date_format:Y',
        // 'place_of_birth' => 'required|string',
        // 'birth_nationalities' => 'sometimes|array',
        // 'birth_nationalities.*.value' => 'sometimes|integer',

        'present_nationalities' => 'sometimes|array',
        'present_nationalities.*.value' => 'sometimes|integer',
        'gender' => 'required|integer|max:3|min:0',
        // 'marital_status' => 'required|string',
        // 'has_disabilities' => 'required|boolean',
        // 'disabilities' => 'required_if:has_disabilities,0',
        'is_immaper' => 'required|boolean',
        'immap_email' => 'sometimes|nullable|required_if:is_immaper,1|email',
        'immap_office' => 'sometimes|nullable|required_if:is_immaper,1|array',
        'immap_office.*.value' => 'sometimes|nullable|required_if:is_immaper,1|integer',
        'is_immap_inc' => 'sometimes|nullable|required_if:is_immaper,1|boolean',
        'is_immap_france' => 'sometimes|nullable|required_if:is_immaper,1|boolean',
        'job_title' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'duty_station' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'line_manager' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'start_of_current_contract' => 'sometimes|nullable|required_if:is_immaper,1|date_format:Y-m-d',
        'end_of_current_contract' => 'sometimes|nullable|required_if:is_immaper,1|date_format:Y-m-d',
        // 'project' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'country_residence' => 'sometimes|nullable',
        'country_residence.value' => 'sometimes|nullable|integer|exists:countries,id',
        'office_telephone' => 'sometimes|nullable|string',
        'skype' => 'sometimes|nullable|string',
        'office_email' => 'sometimes|nullable|string|email',
    ];

    const P11FORM1_FILLABLE = [
        'first_name', 'middle_name', 'family_name',
        // 'maiden_name',
        // 'bdate', 'bmonth', 'byear',
        'gender',
        // 'place_of_birth',
        // 'marital_status',
        // 'has_disabilities', 'disabilities',
        'is_immaper', 'immap_email',
        'immap_office_id',
        // 'project',
        'is_immap_inc', 'is_immap_france',
        'job_title', 'duty_station', 'line_manager', 'line_manager_id',
        'start_of_current_contract', 'end_of_current_contract',
        'country_residence_id',
        'office_telephone', 'skype', 'office_email'

    ];

    const P11FORM2_RULES = [
        // 'permanent_address' => 'required|string',
        // 'permanent_country' => 'required',
        // 'permanent_city' => 'required|string',
        // 'permanent_postcode' => 'sometimes|nullable|string',
        // 'permanent_telephone' => 'sometimes|nullable|string',
        // 'permanent_fax' => 'sometimes|nullable|string',
        // 'sameWithPermanent' => 'required|boolean',
        // 'present_address' => 'sometimes|nullable|string',
        // 'present_country' => 'sometimes|nullable',
        // 'present_city' => 'sometimes|nullable|string',
        // 'present_postcode' => 'sometimes|nullable|string',
        // 'present_telephone' => 'sometimes|nullable|string',
        // 'present_fax' => 'sometimes|nullable|string',
        'country_residence' => 'sometimes|nullable',
        'country_residence.value' => 'sometimes|nullable|integer|exists:countries,id',
        'office_telephone' => 'sometimes|nullable|string',
        'skype' => 'sometimes|nullable|string',
        'office_email' => 'sometimes|nullable|string',
        // 'has_dependents' => 'required|boolean',
    ];

    const P11FORM2_FILLABLE = [
        'country_residence_id',
        'office_telephone', 'skype', 'office_email'
        // 'has_dependents'
    ];

    const P11FORM3_RULES = [
        'legal_permanent_residence_status' => 'required|boolean',
        'p11_legal_permanent_residence_status' => 'sometimes|nullable|array',
        'p11_legal_permanent_residence_status.*.value' => 'sometimes|nullable|integer|exists:countries,id',
        'legal_step_changing_present_nationality' => 'required|boolean',
        'legal_step_changing_present_nationality_explanation' =>  'required_if:legal_step_changing_present_nationality,1',
        'relatives_employed_by_public_international_organization' => 'required|boolean',
    ];

    const P11FORM3_FILLABLE = [
        'legal_permanent_residence_status', 'p11_legal_permanent_residence_status', 'legal_step_changing_present_nationality',
        'legal_step_changing_present_nationality_explanation', 'relatives_employed_by_public_international_organization',
    ];

    const P11FORM4_RULES = [
        'preferred_field_of_work' => 'sometimes|array',
        'accept_employment_less_than_six_month' => 'required|boolean',
        'previously_submitted_application_for_UN' => 'required|boolean',
    ];

    const P11FORM4_FILLABLE = ['preferred_field_of_work', 'accept_employment_less_than_six_month', 'previously_submitted_application_for_UN'];

    const P11FORM5_RULES = ['knowledge_of_language_counts' => 'required|integer|min:1'];

    const P11FORM6_RULES = [
        'education_universities_counts' => 'required|integer|min:1',
        'education_schools_counts' => 'sometimes|nullable|integer|min:1',
    ];

    const P11FORM7_RULES = [
        // 'has_professional_societies' => 'required|boolean',
        'has_publications' => 'required|boolean',
    ];

    const P11FORM7_FILLABLE = [
        // 'has_professional_societies',
        'has_publications'
    ];

    const P11FORM8_RULES = [
        'objections_making_inquiry_of_present_employer' => 'required|boolean',
        'permanent_civil_servant' => 'required|boolean',
        'objection_name' => 'required_if:objections_making_inquiry_of_present_employer,1',
        'objection_email' => 'required_if:objections_making_inquiry_of_present_employer,1',
        'objection_position' => 'sometimes|nullable|string',
        'objection_organization' => 'sometimes|nullable|string'
    ];

    const P11FORM8_FILLABLE = [
        'objections_making_inquiry_of_present_employer',
        'permanent_civil_servant',
        'objection_name',
        'objection_email',
        'objection_position',
        'objection_organization'
    ];

    const P11FORM9_RULES = [
        // 'references_counts' => 'required|integer|min:1',
        'references_counts' => 'sometimes|integer',
        'relevant_facts' => 'sometimes|nullable|string',
    ];

    const P11FORM9_FILLABLE = ['relevant_facts'];

    const P11FORM10_RULES = [
        'skills' => 'sometimes|array',
        'portfolios_counts' => 'sometimes|integer',
        // 'violation_of_law' => 'required|boolean',
    ];

    // const P11FORM10_FILLABLE = ['violation_of_law'];

    const P11FORM11_RULES = [
        // 'cv_file' => 'required|mimes:pdf',
        // 'signature_file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048',
        // 'photo_file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048',
        'linkedin_url' => 'sometimes|nullable|url',
        'hear_about_us_from' => 'sometimes|nullable|string',
        'other_text' => 'sometimes|nullable|string',
    ];

    const P11_PREVIEW_RULES = [
        'linkedin_url' => 'sometimes|nullable|url',
        'hear_about_us_from' => 'sometimes|nullable|string',
        'other_text' => 'sometimes|nullable|string',
    ];

    // ADA error di address
    const P11FORM11_FILLABLE = ['become_roster', 'linkedin_url', 'hear_about_us_from', 'other_text'];

    const P11_PREVIEW_FILLABLE = ['linkedin_url', 'hear_about_us_from', 'other_text'];

    const P11_UPDATE_PREFERRED_FIELD_OF_WORKS = [
        'preferred_field_of_work' => 'sometimes|array',
        'preferred_field_of_work.*.label' => 'sometimes|nullable|string',
        'preferred_field_of_work.*.addedBy' => 'sometimes|nullable|string',
    ];

    const UPDATE_BIODATA_RULES = [
        'first_name' => 'required|string|max:255',
        'middle_name' => 'sometimes|nullable|string',
        'family_name' => 'required|string|max:255',
        // 'maiden_name' => 'sometimes|nullable|string',
        // 'bdate' => 'required|in:01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
        // 'bmonth' => 'required|in:01,02,03,04,05,06,07,08,09,10,11,12',
        // 'byear' => 'required|date_format:Y',
        // 'place_of_birth' => 'required|string',
        'gender' => 'required|integer|min:0|max:3',
        // 'marital_status' => 'required|string',
        'linkedin_url' => 'sometimes|nullable|url',
        'skype' => 'sometimes|nullable|string',
        'present_nationalities' => 'required|array',
        'present_nationalities.*.value' => 'required|integer',
        'country_residence' => 'required',
        'country_residence.value' => 'required|integer|exists:countries,id'
        // 'linkedin_url' => 'required|url',s
        // 'become_roster' => 'required|boolean'
    ];

    const UPDATE_BIODATA_FILLABLE = [
        'first_name', 'middle_name', 'family_name', 'maiden_name',
        // 'bdate', 'bmonth', 'byear',
        'gender',
        // 'place_of_birth',
        // 'marital_status',
        'linkedin_url', 'become_roster', 'skype'
    ];

    const UPDATE_ALREADY_IMMAPER = [
        'is_immaper' => 'required|boolean',
        'immap_email' =>  'sometimes|nullable|required_if:is_immaper,1|string',
        'is_immap_inc' => 'sometimes|nullable|required_if:is_immaper,1|boolean',
        'is_immap_france' =>  'sometimes|nullable|required_if:is_immaper,1|boolean',
        'line_manager' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'line_manager_id' => 'sometimes|nullable|required_if:is_immaper,1|integer|exists:users,id',
        'job_title' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'duty_station' => 'sometimes|nullable|required_if:is_immaper,1|string',
        'start_of_current_contract' => 'sometimes|nullable|required_if:is_immaper,1|date_format:Y-m-d',
        'end_of_current_contract' => 'sometimes|nullable|required_if:is_immaper,1|date_format:Y-m-d',
        'immap_contract_international' => 'sometimes|nullable|required_if:is_immaper,1|boolean',
        'immap_office_id' => 'sometimes|nullable|required_if:is_immaper,1|integer|exists:immap_offices,id'
    ];
    // const UPDATE_DISABILITIES_RULES = [
    //     'has_disabilities' => 'required|boolean',
    //     'disabilities' => 'required_if:has_disabilities,0|string'
    // ];

    const UPDATE_LEGAL_PERMANENT_RESIDENCE_STATUS_RULES = [
        'legal_permanent_residence_status' => 'required|boolean',
        'legal_permanent_residence_status_countries' => 'required_if:legal_permanent_residence_status,1|array',
        'legal_permanent_residence_status_countries.*.value' => 'required|integer',
    ];

    const UPDATE_LEGAL_PERMANENT_RESIDENCE_STATUS_FILLABLE = ['legal_permanent_residence_status'];

    const UPDATE_LEGAL_STEP_CHANGING_NATIONALITY_RULES = [
        'legal_step_changing_present_nationality' => 'required|boolean',
        'legal_step_changing_present_nationality_explanation' => 'required_if:legal_step_changing_present_nationality,1|string'
    ];

    const UPDATE_RELEVANT_FACTS_RULES = ['relevant_facts' => 'sometimes|nullable|string'];

    const UPDATE_BIODATA_ADDRESS_AND_NATIONALITIES_RULES = [
        // 'birth_nationalities' => 'required|array',
        // 'birth_nationalities.*.value' => 'required|integer',
        // 'present_nationalities' => 'required|array',
        // 'present_nationalities.*.value' => 'required|integer',
        'preferred_field_of_work' => 'required|array',
        'preferred_sector' => 'required|array',
        'preferred_field_of_work.*.label' => 'required|string',
        'preferred_field_of_work.*.addedBy' => 'sometimes|nullable|string',
        'preferred_sector.*.label' => 'required|string',
        'preferred_sector.*.addedBy' => 'sometimes|nullable|string',
        // 'permanent_address.permanent_address' => 'required|string',
        // 'permanent_address.permanent_country' => 'required',
        // 'permanent_address.permanent_city' => 'required|string',
        // 'permanent_address.permanent_postcode' => 'sometimes|nullable|string',
        // 'permanent_address.permanent_telephone' => 'sometimes|nullable|string',
        // 'permanent_address.permanent_fax' => 'sometimes|nullable|string',
        // 'sameWithPermanent' => 'required|boolean',
        // 'present_address.present_address' => 'sometimes|nullable|string',
        // 'present_address.present_country' => 'sometimes|nullable',
        // 'present_address.present_city' => 'sometimes|nullable|string',
        // 'present_address.present_postcode' => 'sometimes|nullable|string',
        // 'present_address.present_telephone' => 'sometimes|nullable|string',
        // 'present_address.present_fax' => 'sometimes|nullable|string',
        // 'country_residence' => 'required',
        // 'country)residence.value' => 'required|integer|exists:countries,id',
        'office_telephone' => 'sometimes|nullable|string',
        // 'skype' => 'sometimes|nullable|string',
        'office_email' => 'sometimes|nullable|string',
        'accept_employment_less_than_six_month' => 'required|boolean',
        'objections_making_inquiry_of_present_employer' => 'required|boolean',
        'objection_name' => 'required_if:objections_making_inquiry_of_present_employer,1',
        'objection_email' => 'required_if:objections_making_inquiry_of_present_employer,1',
        'objection_position' => 'sometimes|nullable|string',
        'objection_organization' => 'sometimes|nullable|string'
    ];

    const UPDATE_BIODATA_ADDRESS_AND_NATIONALITIES_FILLABLE = [
        'office_telephone', 'office_email', 'accept_employment_less_than_six_month', 'objections_making_inquiry_of_present_employer',
        'objection_name', 'objection_email', 'objection_position', 'objection_organization'
    ];

    const UPDATE_CV_RULES = [
        'cv_file' => 'required|mimes:pdf'
    ];

    const UPDATE_SIGNATURE_RULES = [
        'signature_file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048',
    ];

    protected $authentication, $authUser, $authProfileId, $authProfile, $model, $singular, $defaultRosterProcess;

    public function __construct(AuthenticationController $authentication, RosterProcess $rosterProcess)
    {
        $this->authentication = $authentication;
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
        $this->model = self::MODEL;
        $this->singular = self::SINGULAR;
        $this->defaultRosterProcess = $rosterProcess::where('is_default', 1)->first();
    }

    protected function saveP11Completed($profile)
    {
        $user = $profile->user;
        $user->p11Completed = 1;
        $user->status = 'Active';
        $user->inactive_user_has_been_reminded = 'false';
        $user->inactive_user_has_been_reminded_date = NULL;
        $user->inactive_date = NULL;
        $user->save();
    }

    private function syncNationalitiesData($profile, $column, $nationalities, $time)
    {
        if (count($nationalities)) {
            $nationalities = array_map(function ($val) use ($time) {
                return ['time' => $time];
            }, array_flip($nationalities));
            $profile->{$column}()->sync($nationalities);
        }
    }

    private function getNationalitiesData(Profile $profile)
    {
        $profile->birth_nationalities = $profile->birth_nationalities()->select('country_id as value', 'nationality as label')->get();
        $profile->present_nationalities = $profile->present_nationalities()->select('country_id as value', 'nationality as label')->get();

        return $profile;
    }

    protected function savePreferredFieldOfWork($profile, $slugs, $names)
    {
        $profile_field_of_works = [];
        foreach ($slugs as $index => $slug) {
            $fieldOfWork = FieldOfWork::where('slug', $slug)->first();
            if (empty($fieldOfWork)) {
                // $fieldOfWork = FieldOfWork::create([
                //     'field' => $names[$index]['label'],
                //     'slug' => $slug,
                //     'addedBy' => $names[$index]['addedBy']
                // ]);
            } else {
                array_push($profile_field_of_works, $fieldOfWork->id);
            }
        }

        if (count($profile_field_of_works)) {
            $profile->field_of_works()->sync($profile_field_of_works);
        }
    }

    protected function savePreferredSector($profile, $slugs, $names)
    {
        $profile_sectors = [];
        foreach ($slugs as $index => $slug) {
            $sector = Sector::where('slug', $slug)->first();
            if (empty($sector)) {
                // $sector = Sector::create([
                //     'name' => $names[$index]['label'],
                //     'slug' => $slug,
                //     'addedBy' => $names[$index]['addedBy']
                // ]);
            } else {
                array_push($profile_sectors, $sector->id);
            }
        }

        if (count($profile_sectors)) {
            $profile->sectors()->sync($profile_sectors);
        }
    }

    protected function saveSkills($record, $slugs, $names)
    {
        $employment_record_skills = [];
        foreach ($slugs as $index => $slug) {
            $skill = Skill::where('slug', $slug)->first();
            if (empty($skill)) {
                // $skill = Skill::create([
                //     'skill' => $names[$index],
                //     'slug' => $slug,
                // ]);
            } else {
                array_push($employment_record_skills, $skill->id);
            }
        }

        if (count($employment_record_skills)) {
            $record->skills()->sync($employment_record_skills);
        }
    }

    protected function deleteFiles($profile, $id_name, $collection_name, $relation_name = null)
    {
        $oldAttachment = Attachment::find($profile->{$id_name});
        if (!empty($oldAttachment)) {
            $oldMedia = $oldAttachment->getMedia($collection_name);
            $oldMedia = $oldMedia->first();
            if (!empty($oldMedia)) {
                $oldMedia->delete();
                if (!is_null($relation_name)) {
                    $profile->{$relation_name}()->dissociate()->save();
                }
            }
            $oldAttachment->delete();
        }
    }

    protected function saveFiles($profile, $validated_file, $file, $id_name, $collection_name, $relation_name = null)
    {
        if (!empty($validated_file)) {
            if (!empty($profile->{$id_name})) {
                $this->deleteFiles($profile, $id_name, $collection_name, $relation_name);
            }

            $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
            $attachment->addMedia($file)->toMediaCollection($collection_name, 's3');

            $profile->{$relation_name}()->associate($attachment)->save();
        }
    }

    protected function savePhoto($profile, $validated_photo_file, $photo_file)
    {
        if (!empty($validated_photo_file)) {
            if (!empty($profile->getMedia('photos'))) {
                $oldMedia = $profile->getMedia('photos');
                $oldMedia = $oldMedia->first();
                if (!empty($oldMedia)) {
                    $oldMedia->delete();
                }
            }

            return $profile->addMedia($photo_file)->toMediaCollection('photos', 's3');
        }

        return false;
    }

    // protected function savePassport($profile, $validated_passport_file, $passport_file)
    // {
    //     if (!empty($validated_passport_file)) {
    //         if (!empty($profile->passport_id)) {
    //             $oldAttachment = Attachment::find($profile->passport_id);
    //             if (!empty($oldAttachment)) {
    //                 $oldMedia = $oldAttachment->getMedia('passport_files');
    //                 $oldMedia = $oldMedia->first();
    //                 if (!empty($oldMedia)) {
    //                     $oldMedia->delete();
    //                     $profile->p11_passport()->dissociate()->save();
    //                 }
    //                 $oldAttachment->delete();
    //             }
    //         }

    //         $attachment = Attachment::create();
    //         $attachment->addMedia($passport_file)->toMediaCollection('passport_files', 'public');

    //         $profile->p11_passport()->associate($attachment)->save();
    //     }
    // }

    // protected function saveAddress($profile, $validatedData)
    // {
    //     // dd($validatedData);
    //     $profileAddress = [];
    //     if (
    //         !is_null($validatedData['permanent_address']) &&
    //         !is_null($validatedData['permanent_city']) &&
    //         // !is_null($validatedData['permanent_postcode']) &&
    //         // !is_null($validatedData['permanent_telephone']) &&
    //         // !is_null($validatedData['permanent_fax']) &&
    //         !is_null($validatedData['permanent_country'])
    //     ) {
    //         $permanentAddress = [
    //             'address' => $validatedData['permanent_address'],
    //             'city' => $validatedData['permanent_city'],
    //             'postcode' => $validatedData['permanent_postcode'],
    //             'telephone' => $validatedData['permanent_telephone'],
    //             'fax' => $validatedData['permanent_fax'],
    //             'country_id' => $validatedData['permanent_country']['value'],
    //             'type' => 'permanent'
    //         ];

    //         if ($validatedData['sameWithPermanent']) {
    //             $permanentAddress['type'] = 'both';
    //         }

    //         array_push($profileAddress, $permanentAddress);

    //         if (
    //             !$validatedData['sameWithPermanent'] &&
    //             !is_null($validatedData['present_address']) &&
    //             !is_null($validatedData['present_city']) &&
    //             // !is_null($validatedData['present_postcode']) &&
    //             // !is_null($validatedData['present_telephone']) &&
    //             // !is_null($validatedData['present_fax']) &&
    //             !is_null($validatedData['present_country']['value'])
    //         ) {
    //             array_push($profileAddress, [
    //                 'address' => $validatedData['present_address'],
    //                 'city' => $validatedData['present_city'],
    //                 'postcode' => $validatedData['present_postcode'],
    //                 'telephone' => $validatedData['present_telephone'],
    //                 'fax' => $validatedData['present_fax'],
    //                 'country_id' => $validatedData['present_country']['value'],
    //                 'type' => 'present'
    //             ]);
    //         }
    //     }

    //     // dd($profileAddress);
    //     if (count($profileAddress)) {
    //         if (count($profile->p11_addresses)) {
    //             foreach ($profile->p11_addresses as $address) {
    //                 $address->delete();
    //             }
    //         }

    //         $profile->p11_addresses()->createMany($profileAddress);
    //     }
    // }

    // GET P11 FORM
    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-1",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 1] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_1, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_1()
    {
        $profile = $this->model::select(
            'id',
            'family_name',
            'first_name',
            'middle_name',
            // 'gender',
            DB::raw('(CASE WHEN gender IS NULL THEN "empty" ELSE gender END) AS gender'),
            'is_immaper',
            'immap_email',
            'is_immap_inc',
            'is_immap_france',
            'immap_office_id',
            'job_title',
            'duty_station',
            'line_manager',
            'line_manager_id',
            'start_of_current_contract',
            'end_of_current_contract',
            'immap_contract_international',
            'office_email',
            'skype',
            'office_telephone',
            'country_residence_id'
        )->with([
            'present_nationalities' => function ($query) {
                $query->select('country_id as value', 'nationality as label');
            },
            'phones',
            'p11_immap_office',
            'p11_immap_office.country',
        ])->with(['country_residence' => function ($query) {
            $query->select('id', 'id as value', 'name as label');
        }])->withCount('phones as phone_counts')->findOrFail($this->authProfileId);

        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-2",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 2] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_2, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_2()
    {
        $profile = $this->model::select(
            'id',
            'accept_employment_less_than_six_month',
            'previously_submitted_application_for_UN'
        )->with([
            'field_of_works' => function ($query) {
                $query->select('field_of_works.id as value', 'field as label');
            },
            'sectors' => function ($query) {
                $query->select('sectors.id as value', 'sectors.name as label');
            }
        ])->withCount([
            'p11_submitted_application_for_un as previously_submitted_application_for_UN_counts',
        ])->findOrFail($this->authProfileId);

        $profile->preferred_field_of_work = $profile->field_of_works;
        $profile->preferred_sector = $profile->sectors;
        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-3",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 3] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_3, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_3()
    {
        $profile = $this->model::select('id')->withCount([
            'p11_languages as knowledge_of_language_counts',
        ])->findOrFail($this->authProfileId);

        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-4",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 4] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_4, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_4()
    {
        $profile = $this->model::select('id')->withCount([
            'p11_education_universities as education_universities_counts',
            'p11_education_schools as education_schools_counts',
        ])->findOrFail($this->authProfileId);

        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-5",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 5] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_5, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_5()
    {
        $profile = $this->model::select(
            'id',
            'objections_making_inquiry_of_present_employer',
            'permanent_civil_servant',
            'objection_name',
            'objection_email',
            'objection_position',
            'objection_organization',
            'has_publications'
        )->withCount([
            'p11_employment_records as employment_records_counts',
            'p11_permanent_civil_servants as permanent_civil_servants_counts',
            'p11_publications as publications_counts'
        ])->findOrFail($this->authProfileId);

        $profile->objection_name = is_null($profile->objection_name) ? '' : $profile->objection_name;
        $profile->objection_email = is_null($profile->objection_email) ? '' : $profile->objection_email;
        $profile->objection_position = is_null($profile->objection_position) ? '' : $profile->objection_position;
        $profile->objection_organization = is_null($profile->objection_organization) ? '' : $profile->objection_organization;
        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-6",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 6] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_6, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_6()
    {
        $profile = $this->model::select(
            'id',
            'relevant_facts',
            'reference_notice_read',
        )->withCount([
            'p11_references as references_counts',
        ])->findOrFail($this->authProfileId);

        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-7",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 7] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_7, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_7()
    {
        $profile = $this->model::select(
            'id'
        )->withCount([
            'p11_portfolios as portfolios_counts',
            'skills as skills_counts'
        ])->findOrFail($this->authProfileId);

        $profile->skills = $profile->skills->pluck('skill');
        $profile->p11Status = $this->authUser->p11Status;

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-profile-form-8",
     *   tags={"Profile Creation"},
     *   summary="Get Profile Data [Step 8] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_profile_form_8, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_profile_form_8()
    {
        $profile = $this->model::select('id', 'cv_id', 'signature_id', 'linkedin_url', 'become_roster', 'selected_roster_process', 'share_profile_consent', 'hear_about_us_from', 'other_text')->findOrFail($this->authProfileId);

        // $profile->skills = $profile->skills->pluck('skill');
        $profile->p11Status = $this->authUser->p11Status;

        if (!empty($profile->p11_cv)) {
            $media = $profile->p11_cv->getMedia('cv_files');
            $media = $profile->p11_cv->media->first();
            if ($media) {
                $profile->cv = new \StdClass();
                $profile->cv->id = $media->id;
                $profile->cv->filename = $media->file_name;
                $profile->cv->download_url = $media->getFullUrlFromS3();
                $profile->cv->file_url = $media->getFullUrlFromS3();
                $profile->cv->mime = $media->mime_type;
            }
        }

        if (!empty($profile->p11_signature)) {
            $media = $profile->p11_signature->getMedia('signature_files');
            $media = $profile->p11_signature->media->first();
            if ($media) {
                $profile->signature = new \StdClass();
                $profile->signature->id = $media->id;
                $profile->signature->filename = $media->file_name;
                $profile->signature->download_url = $media->getFullUrlFromS3();
                $profile->signature->file_url = $media->getFullUrlFromS3('p11-thumb');
                $profile->signature->mime = $media->mime_type;
            }
        }

        if (count($profile->getMedia('photos'))) {
            $media = $profile->getMedia('photos');
            $media = $media->first();
            if ($media) {
                $profile->photo = new \StdClass();
                $profile->photo->id = $media->id;
                $profile->photo->filename = $media->file_name;
                $profile->photo->download_url = $media->getFullUrlFromS3();
                $profile->photo->file_url = $media->getFullUrlFromS3('p11-thumb');
                $profile->photo->mime = $media->mime_type;
            }
        }

        if (!empty($profile->selected_roster_process)) {
            $profile['selected_roster_process'] = json_decode($profile->selected_roster_process);
        }

        unset($profile->p11_cv);
        unset($profile->p11_signature);

        return response()->success(__('profile.success.default'), $profile->getAttributes());
    }

    // UPDATE P11 FORM
    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-1",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 1] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_1, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "first_name", "family_name", "gender", "is_immaper"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="first_name", type="string", description="First Name", example="John"),
     *              @SWG\Property(property="middle_name", type="string", description="Middle Name", example="Michael"),
     *              @SWG\Property(property="family_name", type="string", description="Family Name", example="Doe"),
     *              @SWG\Property(property="present_nationalities", type="array", description="User Nationalities (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="gender", type="integer", enum={0,1,2,3}, description="0: Female, 1: Male, 2: Do not want to specify, 3: Others", example=0),
     *              @SWG\Property(property="is_immaper", type="integer", enum={0,1}, description="0: Not iMMAPer (false), 1: iMMAPer (true)", example=0),
     *              @SWG\Property(property="immap_email", format="email", type="string", description="Put your iMMAP email if you are an iMMAPer (is_immaper == 1)", example="careers@organization.org"),
     *              @SWG\Property(property="immap_office", type="array", description="Select your iMMAP Office if you are an iMMAPer (is_immaper == 1) [Array length should be one only]",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="Value should be id exists in immap_offices table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="is_immap_inc", type="integer", enum={0,1}, description="0: Not Under iMMAP US (false), 1: Under iMMAP US (true)", example=1),
     *              @SWG\Property(property="is_immap_framce", type="integer", enum={0,1}, description="0: Not Under iMMAP France (false), 1: Under iMMAP France (true)", example=0),
     *              @SWG\Property(property="job_title", type="string", description="Put your Job Title in iMMAP if you are an iMMAPer (is_immaper == 1)", example="Finance Director"),
     *              @SWG\Property(property="duty_station", type="string", description="Put your Duty Station in iMMAP if you are an iMMAPer (is_immaper == 1)", example="Washington"),
     *              @SWG\Property(property="line_manager", type="string", description="Put your Line Manager in iMMAP if you are an iMMAPer (is_immaper == 1)", example="William Barron"),
     *              @SWG\Property(property="start_of_current_contract", format="date", type="string", description="Put your Start of current contract in iMMAP if you are an iMMAPer (is_immaper == 1) [Date Format: 2020-05-20]", example="2020-01-01"),
     *              @SWG\Property(property="end_of_current_contract", format="date", type="string", description="Put your End of current contract in iMMAP if you are an iMMAPer (is_immaper == 1) [Date Format: 2020-05-20", example="2020-12-31"),
     *              @SWG\Property(property="country_residence", type="object", description="Country of Residence (Can be empty)",
     *                  @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *              ),
     *              @SWG\Property(property="office_telephone", type="string", description="Your office telephone (if any)", example="+62-99999999"),
     *              @SWG\Property(property="office_email", format="email", type="string", description="Your office email (if any)", example="office@mail.com"),
     *              @SWG\Property(property="skype", type="string", description="Your skype (if any)", example="live:johndoe"),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_1(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);

        $validatedData = $this->validate($request, self::P11FORM1_RULES);
        $updateData = $request->only(self::P11FORM1_FILLABLE);

        if (!empty($updateData['immap_email'])) {
            if (preg_match("/@organization.org*$/", $updateData['immap_email']) == 0) {
                $updateData['immap_email'] = NULL;
            }
        }

        $userData = [
            'first_name' => $validatedData['first_name'],
            'middle_name' => $validatedData['middle_name'],
            'family_name' => $validatedData['family_name']
        ];
        $userData = $this->getFullName($userData);

        $user = $profile->user;
        $user->first_name = $userData['first_name'];
        $user->middle_name = $userData['middle_name'];
        $user->family_name = $userData['family_name'];
        $user->full_name = $userData['full_name'];

        if ($validatedData['is_immaper'] == 1) {
            if (!empty($validatedData['immap_email'])) {
                if (preg_match("/@organization.org*$/", $validatedData['immap_email']) == 1) {
                    $user->immap_email = $validatedData['immap_email'];
                } else {
                    $user->immap_email = NULL;
                }
            }
        }

        if ($validatedData['is_immaper'] == 0) {
            $user->immap_email = NULL;
        }

        $user->save();

        $present_nationalities = array_pluck($validatedData['present_nationalities'], 'value');

        $this->syncNationalitiesData($profile, 'present_nationalities', $present_nationalities, 'present');

        if ($validatedData['is_immaper'] == 1) {
            $immap_office_save = $profile->fill([
                'immap_office_id' => $validatedData['immap_office']['value'],
            ])->save();

            if (!$immap_office_save) {
                return response()->error(__('profile.error.update_default'), 500);
            }
        }

        if (isset($validatedData['country_residence']['value'])){
            $updateData['country_residence_id'] = $validatedData['country_residence']['value'];
        }


        $saved = $profile->fill($updateData)->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-2",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 4] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_4, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "accept_employment_less_than_six_month", "previously_submitted_application_for_UN"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="preferred_field_of_work", type="array",
     *                  description="List of Areas of Expertise (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="value",
     *                          type="string",
     *                          description="Value can be id exists in field_of_works table or string with format: others-2020-12-03,13:11:43",
     *                          example=1
     *                      ),
     *                      @SWG\Property(
     *                          property="label",
     *                          type="string",
     *                          description="Label of area of expertise shown in the chip",
     *                          example="Database Design"
     *                      ),
     *                      @SWG\Property(
     *                          property="addedBy",
     *                          type="string",
     *                          description="Can be empty, only exists if area of expertise not in the field_of_works table",
     *                          enum={"others"},
     *                          example="others"
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="accept_employment_less_than_six_month", type="integer", enum={0,1},
     *                  description="Accept Employment for less then six months, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *              @SWG\Property(property="previously_submitted_application_for_UN", type="integer", enum={0,1},
     *                  description="previously worked for iMMAP, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_2(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);

        $validatedData = $this->validate($request, self::P11FORM4_RULES);

        // preferred_field_of_work
        if (!empty($validatedData['preferred_field_of_work'])) {
            $preferred_field_of_work_slug = array_map(function ($value) {
                return Str::slug($value['label'], '-');
            }, $validatedData['preferred_field_of_work']);

            $this->savePreferredFieldOfWork($profile, $preferred_field_of_work_slug, $validatedData['preferred_field_of_work']);
        }

        if (!empty($validatedData['preferred_sector'])) {
            $preferred_sector_slug = array_map(function ($value) {
                return Str::slug($value['label'], '-');
            }, $validatedData['preferred_sector']);

            $this->savePreferredSector($profile, $preferred_sector_slug, $validatedData['preferred_sector']);
        }

        $saved = $profile->fill($request->only(self::P11FORM4_FILLABLE))->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-preferred-field-of-works",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Preferred Area of expertise in Step 4] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@update_preferred_field_of_works, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "preferred_field_of_work"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="preferred_field_of_work", type="array",
     *                  description="List of Areas of Expertise (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="value",
     *                          type="string",
     *                          description="Value can be id exists in field_of_works table or string with format: others-2020-12-03,13:11:43",
     *                          example=1
     *                      ),
     *                      @SWG\Property(
     *                          property="label",
     *                          type="string",
     *                          description="Label of area of expertise shown in the chip",
     *                          example="Database Design"
     *                      ),
     *                      @SWG\Property(
     *                          property="addedBy",
     *                          type="string",
     *                          description="Can be empty, only exists if area of expertise not in the field_of_works table",
     *                          enum={"others"},
     *                          example="others"
     *                      )
     *                  )
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_preferred_field_of_works(Request $request)
    {
        $validatedData = $this->validate($request, self::P11_UPDATE_PREFERRED_FIELD_OF_WORKS);
        $profile = $this->model::findOrFail(auth()->user()->profile->id);

        if (!empty($validatedData['preferred_field_of_work'])) {
            $preferred_field_of_work_slug = array_map(function ($value) {
                return Str::slug($value['label'], '-');
            }, $validatedData['preferred_field_of_work']);

            $this->savePreferredFieldOfWork($profile, $preferred_field_of_work_slug, $validatedData['preferred_field_of_work']);
        } else {
            $profile->field_of_works()->detach();
        }


        return response()->success(__('profile.success.update_default'));
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-3",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 5] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_5, Permission: P11 Access, Info: right now is empty, it can be change based on new request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"})
     *          ),
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_3(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-4",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 6] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_6, Permission: P11 Access, Info: right now is empty, it can be change based on new request",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"})
     *          ),
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_4(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-5",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 8] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_8, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "objections_making_inquiry_of_present_employer", "permanent_civil_servant"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="objections_making_inquiry_of_present_employer", type="integer", enum={0,1},
     *                  description="Any objections to our making inquiries of your present or former employer, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *              @SWG\Property(property="objection_name", type="string",
     *                  description="Present / Last Employer Name, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="John Doe"
     *              ),
     *              @SWG\Property(property="objection_email", type="string",
     *                  description="Present / Last Employer Email, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="johndoe@mail.com"
     *              ),
     *              @SWG\Property(property="objection_position", type="string",
     *                  description="Present / Last Employer Position, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="CTO"
     *              ),
     *              @SWG\Property(property="objection_organization", type="string",
     *                  description="Present / Last Employer Organization, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="Organization Name"
     *              ),
     *              @SWG\Property(property="permanent_civil_servant", type="integer", enum={0,1},
     *                  description="User have ever been a permanent civil servant in your government's employ, (0 == no, 1 == yes)",
     *                  example=0
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_5(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);
        $validatedData = $this->validate($request, self::P11FORM8_RULES);
        // permanent civil servant check
        if (!$validatedData['permanent_civil_servant']) {
            $profile->p11_permanent_civil_servants()->delete();
        }

        $saved = $profile->fill($request->only(self::P11FORM8_FILLABLE))->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-6",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 9] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_9, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="references_counts", type="integer", description="References counts (can be emoty)", example=0),
     *              @SWG\Property(property="relevant_facts", type="string", description="Relevant Facts (can be empty)", example=""),
     *              @SWG\Property(property="has_publications", type="integer", enum={0,1},
     *                  description="User has publications, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_6(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);
        $validatedData = $this->validate($request, self::P11FORM9_RULES);
        $saved = $profile->fill($request->only(self::P11FORM9_FILLABLE))->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-7",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 10] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_10, Permission: P11 Access, Info: right now is empty, it can be change based on new request, the old one get the skills and portolio count",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="skills", type="array",
     *                  description="List of Skills (Can be empty)",
     *                  @SWG\Items(
     *                      type="string",
     *                      example="Laravel"
     *                  )
     *              ),
     *              @SWG\Property(property="portfolios_counts", type="integer", description="Portfolios counts from the table", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_7(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);
        $validatedData = $this->validate($request, self::P11FORM10_RULES);
        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-form-8",
     *   tags={"Profile Creation"},
     *   summary="Update Profile Data [Step 11] for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_form_11, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="become_roster", type="integer", enum={0,1}, description="Value if the user want to be the part of roster, (0 == no, 1 == yes)", example=1),
     *              @SWG\Property(property="linkedin_url", type="string", description="Your linkedin profile (if any)", example="https://linkedin.com/in/johndoe"),
     *              @SWG\Property(property="hear_about_us_from", type="string", description="Pletform", example="Browers"),
     *              @SWG\Property(property="other_text", type="string", description="Source", example="From a friend"),
     *
     *              @SWG\Property(property="selected_roster_process", type="array",
     *                  description="List of Selected Roster that the user pick if they agree to become our roster member (Can be empty)",
     *                  @SWG\Items(
     *                      type="integer",
     *                      description="The integer file should be exists on roster_processess table in id column",
     *                      example=5
     *                  )
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_form_8(Request $request)
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);
        $validatedData = $this->validate($request, self::P11FORM11_RULES);

        $profileData = [
            'linkedin_url' => $validatedData['linkedin_url'],
            'hear_about_us_from' => $validatedData['hear_about_us_from'],
            'other_text' => $validatedData['other_text'],
        ];

        $roster_proses = $profile->fill($profileData)->save();

        if (!$roster_proses) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    //p11_submit_finished > When people submitting his profile
    /**
     * @SWG\Post(
     *   path="/api/p11-submit-finished",
     *   tags={"Profile Creation"},
     *   summary="Submit his/her completed Profile, in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_submit_finished, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="become_roster", type="integer", enum={0,1}, description="Value if the user want to be the part of roster, (0 == no, 1 == yes)", example=1),
     *              @SWG\Property(property="linkedin_url", type="string", description="Your linkedin profile (if any)", example="https://linkedin.com/in/johndoe"),
     *              @SWG\Property(property="selected_roster_process", type="array",
     *                  description="List of Selected Roster that the user pick if they agree to become our roster member (Can be empty)",
     *                  @SWG\Items(
     *                      type="integer",
     *                      description="The integer file should be exists on roster_processess table in id column",
     *                      example=5
     *                  )
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_submit_finished()
    {
        $profile = $this->model::findOrFail(auth()->user()->profile->id);

        if ($profile->is_immaper == 1) {
            Mail::to($profile->immap_email)->send(new ImmapVerification($profile->user->full_name, $profile->user->id));
        }

        $this->saveP11Completed($profile);

        $role_id = $profile->user->roles->first()->id;
        $immap_offices = Role::findOrFail($role_id)->immap_offices->pluck('id')->toArray();

        $userData = [
            'data' => $profile->user,
            'permissions' => $profile->user->getPermissionsViaRoles()->pluck('name'),
            'isVerified' => ($profile->user->hasVerifiedEmail()) ? true : false,
            'p11Completed' => ($profile->user->p11Completed == 1) ? true : false,
            'isIMMAPER' => $this->checkIMMAPerFromSelectedUser($profile->user),
            'isSbpRosterMember' => $this->isAcceptedSbpRosterMemberFromSelectedUser($profile->user),
            'iMMAPFamily' => $this->checkPartOfIMMAPFromSelectedUser($profile->user),
            'offices' => $immap_offices
        ];

        $token = auth()->setTTL(config('jwt.cookie_token_time'))->claims([
            'data' => [
                'id' => $profile->user->id,
                'email' => $profile->user->email,
                'fullname' => $profile->user->fullname
            ]
        ])->refresh();

        return response()->json([
            'status' => 'success',
            'message' => __('profile.success.update_default'),
            'data' => $userData
        ])->withCookie(cookie('token', $token, config('jwt.cookie_token_time')));
    }


    public function p11_update_passport_file()
    {
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-cv",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Update CV for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_cv, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="CV File in PDF Format",
     *      ),
     *   @SWG\Parameter(
     *          name="collection_name",
     *          in="formData",
     *          type="string",
     *          description="Collection Name to be stored on Media Table",
     *          enum={"cv_files"},
     *          default="cv_files"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_cv(Request $request)
    {

        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, ['file' => 'required|mimes:pdf|max:2048']);

        $this->saveFiles($profile, $validatedData['file'], $request->file('file'), 'cv_id', 'cv_files', 'p11_cv');

        if (!empty($profile->p11_cv)) {
            $media = $profile->p11_cv->getMedia('cv_files');
            $media = $profile->p11_cv->media->first();
            if ($media) {
                $attachment = new \stdClass();
                $attachment->id = $media->id;
                $attachment->filename = $media->file_name;
                $attachment->download_url = $media->getFullUrlFromS3();
                $attachment->file_url = $media->getFullUrlFromS3();
                $attachment->mime = $media->mime_type;

                return response()->success(__('profile.success.upload'), $attachment);
            }
        }

        return response()->error(__('profile.error.upload'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-signature",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Update Signature for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_signature, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="Signature File in Image Format [jpg,jpeg,png,webp,JPG,PNG,JPEG]",
     *      ),
     *   @SWG\Parameter(
     *          name="collection_name",
     *          in="formData",
     *          type="string",
     *          description="Collection Name to be stored on Media Table",
     *          enum={"signature_files"},
     *          default="signature_files"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_signature(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, ['file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048']);

        $this->saveFiles($profile, $validatedData['file'], $request->file('file'), 'signature_id', 'signature_files', 'p11_signature');

        if (!empty($profile->p11_signature)) {
            $media = $profile->p11_signature->getMedia('signature_files');
            $media = $profile->p11_signature->media->first();
            if ($media) {
                $attachment = new \stdClass();
                $attachment->id = $media->id;
                $attachment->filename = $media->file_name;
                $attachment->download_url = $media->getFullUrlFromS3();
                $attachment->file_url = $media->getFullUrlFromS3('p11-thumb');
                $attachment->mime = $media->mime_type;

                return response()->success(__('profile.success.upload'), $attachment);
            }
        }

        return response()->error(__('profile.error.upload'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-photo",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Update Profile Photo for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_photo, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="Photo in Image Format [jpg,jpeg,png,webp,JPG,PNG,JPEG]",
     *      ),
     *   @SWG\Parameter(
     *          name="collection_name",
     *          in="formData",
     *          type="string",
     *          description="Collection Name to be stored on Media Table",
     *          enum={"photos"},
     *          default="photos"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_photo(Request $request)
    {
        $validatedData = $this->validate($request, ['file' => 'required|mimes:jpg,jpeg,png,webp,JPG,PNG,JPEG|max:2048']);

        $updated_photo = $this->savePhoto($this->authProfile, $validatedData['file'], $request->file('file'));

        if ($updated_photo) {
            $profile = $this->model::findOrFail($this->authProfileId);
            $media = $profile->getFirstMedia('photos'); //->media->first();

            if (!empty($media)) {
                $attachment = new \stdClass();
                $attachment->id = $media->id;
                $attachment->filename = $media->file_name;
                $attachment->download_url = $media->getFullUrlFromS3();
                $attachment->file_url = $media->getFullUrlFromS3('p11-thumb');
                $attachment->mime = $media->mime_type;

                return response()->success(__('profile.success.upload'), $attachment);
            }
        }

        return response()->error(__('profile.error.upload'), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-delete-cv",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Delete Profile CV for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_delete_cv, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_delete_cv()
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        if (!empty($profile->cv_id)) {
            $this->deleteFiles($profile, 'cv_id', 'cv_files', 'p11_cv');

            return response()->success(__('profile.success.delete_cv'));
        }

        return response()->error(__('profile.error.delete_cv'), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-delete-signature",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Delete Profile Signature for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_delete_signature, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_delete_signature()
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        if (!empty($profile->signature_id)) {
            $this->deleteFiles($profile, 'signature_id', 'signature_files', 'p11_signature');

            return response()->success(__('profile.success.delete_signature'));
        }

        return response()->error(__('profile.error.delete_signature'), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-delete-photo",
     *   tags={"Profile Creation", "Profile"},
     *   summary="Delete Profile Photo for logged in user in Profile Creation page or Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_delete_photo, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_delete_photo()
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $media = $profile->getMedia('photos')->first();

        if (!empty($media)) {
            $media->delete();

            return response()->success(__('profile.success.delete_photo'));
        }

        return response()->error(__('profile.error.delete_photo'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-update-p11-status",
     *   tags={"Profile Creation"},
     *   summary="Update P11 Status for logged in User in Profile Creation page",
     *   description="File: app\Http\Controllers\API\ProfileController@p11_update_p11_status, Permission: P11 Access, Info: update the step status while user filling profile data in profile creation page",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "p11Status"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}),
     *              @SWG\Property(property="p11Status", type="string",
     *                  description="P11 Status: Step Status in json string format like in the example;
     *                  form1 means step1 ... form11 means step11;
     *                  if each step has errors or incomplete data then the step value should be 0 [form1: 0] otherwise become 1 [form1: 1];
     *                  the value from each step only 0 or 1",
     *                  example="{form1: 1, form2: 0, form3: 0, form4: 0, form5: 0, form6: 0, form7: 0, form8: 0, form9: 0, form10: 0,form11: 0}",
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function p11_update_p11_status(Request $request)
    {
        $validatedData = $this->validate($request, ['p11Status' => 'required|json']);
        $this->authUser->fill(['p11Status' => $validatedData['p11Status']]);
        if ($this->authUser->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }
        $updated = $this->authUser->save();
        if (!$updated) {
            return response()->error(__('profile.error.updateP11Status'), 500);
        }
        return response()->success(__('crud.success.default'), ['p11Status' => $this->authUser->p11Status]);
    }

    // GET FOR PROFILE PAGE
    /**
     * @SWG\Get(
     *   path="/api/profile-biodata",
     *   tags={"Profile"},
     *   summary="Get Profile Biodata for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_biodata, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-biodata/{id}",
     *   tags={"Profile"},
     *   summary="Get Profile Biodata for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_biodata, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_biodata($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select(
            'id',
            'first_name',
            'middle_name',
            'family_name',
            'gender',
            'user_id',
            'linkedin_url',
            // 'become_roster',
            'skype',
            'country_residence_id',
            'verified_immaper',
            'immap_email',
            'updated_at'
        )->with([
            'user:id,full_name,email,last_login_at',
            'present_nationalities' => function ($query) {
                $query->select('country_id as value', 'nationality as label', 'country_code');
            },
            'country_residence:id,name'
        ])->findOrFail($profileID);

        $media = $profile->getMedia('photos')->first();

        if ($media) {
            $profile->photo = $media->getFullUrlFromS3('thumb');
        }

        unset($profile->media);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-already-immaper",
     *   tags={"Profile"},
     *   summary="Get Already iMMAPer Data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_already_immaper, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-already-immaper/{id}",
     *   tags={"Profile"},
     *   summary="Get Already iMMAPer Data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_already_immaper, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_already_immaper($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select(
            'is_immaper',
            'verified_immaper',
            'immap_email',
            'is_immap_inc',
            'is_immap_france',
            'immap_office_id',
            'line_manager',
            'line_manager_id',
            'job_title',
            'duty_station',
            'start_of_current_contract',
            'end_of_current_contract',
            'immap_contract_international',
            'user_id'
        )->findOrFail($profileID);

        if (!empty($profile->p11_immap_office)) {
            $profile->immap_office = [
                'value' => $profile->p11_immap_office->id,
                'label' => $profile->p11_immap_office->country->name . ' - (' . $profile->p11_immap_office->city . ')'
            ];
        } else {
            $profile->immap_office = '';
        }
        unset($profile->p11_immap_office);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-languages",
     *   tags={"Profile"},
     *   summary="Get Profile Language List for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_languages, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token, Permission: P11 Access"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-languages/{id}",
     *   tags={"Profile"},
     *   summary="Get Profile Language List for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_languages, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_languages($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_languages',
            'p11_languages.language',
            'p11_languages.language_level'
        ])->withCount([
            'p11_languages as languages_counts'
        ])->findOrFail($profileID);

        $profile->languages = $profile->p11_languages;
        unset($profile->p11_languages);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-education-universities",
     *   tags={"Profile"},
     *   summary="Get Education Universities data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_education_universities, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token, Permission: P11 Access"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-education-universities/{id}",
     *   tags={"Profile"},
     *   summary="Get Education Universities data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_education_universities, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_education_universities($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_education_universities' => function ($query) {
                return $query->select(
                    'id',
                    'name',
                    'place',
                    'attended_from',
                    'attended_to',
                    'degree',
                    'study',
                    'country_id',
                    'degree_level_id',
                    'diploma_file_id',
                    'profile_id'
                )->orderBy('attended_to', 'desc');
            },
            'p11_education_universities.country:id,name,slug,country_code',
            'p11_education_universities.degree_level:id,name,slug',
        ])->withCount('p11_education_universities as education_universities_counts')->findOrFail($profileID);

        $profile->p11_education_universities->each(function ($educationUniv) {
            $attachment = $educationUniv->attachment;
            if ($attachment) {
                $attachment = $attachment->getMedia('diploma_files')->first();
                if (!empty($attachment)) {
                    $educationUniv->diploma_certificate = collect([
                        'url' => $attachment->getFullUrlFromS3(),
                        'mime_type' => $attachment->mime_type,
                        'file_name' => $attachment->file_name,
                    ]);
                    $educationUniv->setHidden(['media', 'attachment']);
                }
            }
        });

        $profile->education_universities = $profile->p11_education_universities;
        unset($profile->p11_education_universities);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-education-schools",
     *   tags={"Profile"},
     *   summary="Get Formal Training data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_education_schools, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-education-schools/{id}",
     *   tags={"Profile"},
     *   summary="Get Formal Training data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_education_schools, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_education_schools($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_education_schools' => function ($query) {
                return $query->select(
                    'id',
                    'name',
                    'place',
                    'attended_from',
                    'attended_to',
                    'type',
                    'certificate',
                    'country_id',
                    'certificate_file_id',
                    'profile_id'
                )->orderBy('attended_to', 'desc');
            },
            'p11_education_schools.country:id,name,slug,country_code',
        ])->withCount('p11_education_schools as education_schools_counts')->findOrFail($profileID);

        $profile->p11_education_schools->each(function ($educationSchool) {
            $attachment = $educationSchool->attachment;
            if ($attachment) {
                $attachment = $attachment->getMedia('certificate_files')->first();
                if (!empty($attachment)) {
                    $educationSchool->school_certificate = collect([
                        'url' => $attachment->getFullUrlFromS3(),
                        'mime_type' => $attachment->mime_type,
                        'file_name' => $attachment->file_name,
                    ]);
                    $educationSchool->setHidden(['media', 'attachment']);
                }
            }
        });

        $profile->education_schools = $profile->p11_education_schools;
        unset($profile->p11_education_schools);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-skills",
     *   tags={"Profile"},
     *   summary="Get Skills data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_skills, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-skills/{id}",
     *   tags={"Profile"},
     *   summary="Get Skills data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_skills, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_skills($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_skills:id,profile_id,skill_id,proficiency,years,has_portfolio',
        ])->withCount('p11_skills as skills_counts')->findOrFail($profileID);

        $profile->p11_skills->each(function ($profileSkill) {
            $skill = $profileSkill->skill;
            unset($profileSkill->skill);
            $profileSkill->skill = $skill->skill;
            $profileSkill->category = $skill->category;
            $profileSkill->slug = $skill->slug;
        });

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-employment-records",
     *   tags={"Profile"},
     *   summary="Get Skills data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_employment_records, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-employment-records/{id}",
     *   tags={"Profile"},
     *   summary="Get Skills data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_employment_records, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_employment_records($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_employment_records' => function ($query) {
                $query->orderBy('to', 'DESC');
            },
            'p11_employment_records.country',
            'p11_employment_records.employment_skills:skills.id,skill,slug',
            'p11_employment_records.employment_sectors:sectors.id,name,slug',
        ])->withCount('p11_employment_records as employment_records_counts')->findOrFail($profileID);

        $profile->employment_records = $profile->p11_employment_records;
        unset($profile->p11_employment_records);

        return response()->success(__('profile.success.default'), $profile);
    }

    public function profile_professional_societies($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_professional_societies:id,name,description,attended_from,attended_to,country_id,profile_id',
            'p11_professional_societies.country:id,name,slug,country_code',
            'p11_professional_societies.sectors:sectors.id,name,slug',
        ])->withCount('p11_professional_societies as professional_societies_counts')->findOrFail($profileID);

        $profile->professional_societies = $profile->p11_professional_societies;
        unset($profile->p11_professional_societies);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-portfolios",
     *   tags={"Profile"},
     *   summary="Get Portfolio data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_portfolios, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-portfolios/{id}",
     *   tags={"Profile"},
     *   summary="Get Portfolio data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_portfolios, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_portfolios($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_portfolios:id,title,description,url,attachment_id,profile_id',
            'p11_portfolios.portfolio_skills:skills.id,skill,slug',
            'p11_portfolios.sectors:sectors.id,name,slug',
        ])->withCount('p11_portfolios as portfolios_counts')->findOrFail($profileID);

        $profile->p11_portfolios->each(function ($portfolio) {
            $attachment = $portfolio->attachment;
            if ($attachment) {
                $attachment = $attachment->getMedia('portfolios')->first();
                if (!empty($attachment)) {
                    $portfolio->portfolio_file = collect([
                        'url' => $attachment->getFullUrlFromS3(),
                        'mime_type' => $attachment->mime_type,
                        'file_name' => $attachment->file_name,
                    ]);
                    $portfolio->setHidden(['media', 'attachment']);
                }
            }
        });

        $profile->portfolios = $profile->p11_portfolios;
        unset($profile->p11_portfolios);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-publications",
     *   tags={"Profile"},
     *   summary="Get Publications data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_publications, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-publications/{id}",
     *   tags={"Profile"},
     *   summary="Get Publications data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_publications, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_publications($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_publications:id,title,url,year,profile_id,publication_file_id'
        ])->withCount('p11_publications as publications_counts')->findOrFail($profileID);

        $profile->p11_publications->each(function ($publication) {
            $attachment = $publication->attachment;

            if ($attachment) {
                $attachment = $attachment->getMedia('publication_files')->first();
                if (!empty($attachment)) {
                    $publication->publication_file = collect([
                        'url' => $attachment->getFullUrlFromS3(),
                        'mime_type' => $attachment->mime_type,
                        'file_name' => $attachment->file_name,
                    ]);
                    $publication->setHidden(['media', 'attachment']);
                }
            }
        });

        $profile->publications = $profile->p11_publications;
        unset($profile->p11_publications);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-legal-permanent-residence-status",
     *   tags={"Profile"},
     *   summary="Get 'Have you taken up legal permanent residence status in any country other than that of your nationality?' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_legal_permanent_residence_status, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-legal-permanent-residence-status/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Have you taken up legal permanent residence status in any country other than that of your nationality?' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_legal_permanent_residence_status, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_legal_permanent_residence_status($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'legal_permanent_residence_status')->with([
            'p11_legal_permanent_residence_status:id,country_id,profile_id',
            'p11_legal_permanent_residence_status.country:id,name,slug,country_code',
        ])->withCount('p11_legal_permanent_residence_status as legal_permanent_residence_status_counts')->findOrFail($profileID);

        $profile->legal_permanent_residence_status_countries = $profile->p11_legal_permanent_residence_status;
        unset($profile->p11_legal_permanent_residence_status);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-legal-step-changing-nationality",
     *   tags={"Profile"},
     *   summary="Get 'Have you taken any legal steps towards changing your present nationality?' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_legal_step_changing_nationality, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-legal-step-changing-nationality/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Have you taken any legal steps towards changing your present nationality?' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_legal_step_changing_nationality, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_legal_step_changing_nationality($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'legal_step_changing_present_nationality', 'legal_step_changing_present_nationality_explanation')->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-relatives-employed",
     *   tags={"Profile"},
     *   summary="Get 'Relatives currently worked with iMMAP' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_relatives_employed, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-relatives-employed/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Relatives currently worked with iMMAP' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_relatives_employed, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_relatives_employed($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_relatives_employed_by_int_org:id,first_name,middle_name,family_name,full_name,relationship,job_title,country_id,profile_id',
            'p11_relatives_employed_by_int_org.country:id,name,slug,country_code',
        ])->withCount('p11_relatives_employed_by_int_org as relatives_employed_counts')->findOrFail($profileID);

        $profile->relatives_employed = $profile->p11_relatives_employed_by_int_org;
        unset($profile->p11_relatives_employed_by_int_org);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-previously-submitted-for-un",
     *   tags={"Profile"},
     *   summary="Get 'Previously Worked with iMMAP' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_previously_submitted_for_un, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-previously-submitted-for-un/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Previously Worked with iMMAP' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_previously_submitted_for_un, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_previously_submitted_for_un($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'previously_submitted_application_for_UN')->with([
            'p11_submitted_application_for_un:id,starting_date,ending_date,country_id,project,profile_id,position,immap_office_id,duty_station,line_manager',
            'p11_submitted_application_for_un.country:id,name,slug,country_code,nationality',
            'p11_submitted_application_for_un.immap_office:id,city,country_id',
            'p11_submitted_application_for_un.immap_office.country:id,name,country_code'
        ])->withCount('p11_submitted_application_for_un as previously_submitted_for_un_counts')->findOrFail($profileID);

        $profile->previously_submitted_for_un = $profile->p11_submitted_application_for_un;
        unset($profile->p11_submitted_application_for_un);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-permanent-civil-servants",
     *   tags={"Profile"},
     *   summary="Get 'Are you or have you ever been a permanent civil servant in your government's employ?' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_permanent_civil_servants, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-permanent-civil-servants/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Are you or have you ever been a permanent civil servant in your government's employ?' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_permanent_civil_servants, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_permanent_civil_servants($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'permanent_civil_servant')->with([
            'p11_permanent_civil_servants' => function ($query) {
                $query->select('id', 'from', 'to', 'is_now', 'institution', 'profile_id')->orderBy('to', 'DESC')->orderBy('is_now', 'DESC');
            }
        ])->withCount('p11_permanent_civil_servants as permanent_civil_servants_counts')->findOrFail($profileID);

        $profile->permanent_civil_servants = $profile->p11_permanent_civil_servants;
        unset($profile->p11_permanent_civil_servants);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-references",
     *   tags={"Profile"},
     *   summary="Get References List data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_references, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-references/{id}",
     *   tags={"Profile"},
     *   summary="Get References List data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_references, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_references($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'p11_references:id,full_name,organization,country_id,phone,email,job_position,profile_id',
            'p11_references.country:id,name,slug,country_code',
        ])->withCount('p11_references as references_counts')->findOrFail($profileID);

        $profile->references = $profile->p11_references;
        unset($profile->p11_references);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-relevant-facts",
     *   tags={"Profile"},
     *   summary="Get 'State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality?' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_relevant_facts, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-relevant-facts/{id}",
     *   tags={"Profile"},
     *   summary="Get 'State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality?' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_relevant_facts, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_relevant_facts($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'relevant_facts')->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-biodata-address-and-nationalities",
     *   tags={"Profile"},
     *   summary="Get 'Areas of expertise, office information, accept employment less than six months and Do you have any objections to our making inquiries of your present or last employer?' data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_biodata_address_and_nationalities, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-biodata-address-and-nationalities/{id}",
     *   tags={"Profile"},
     *   summary="Get 'Areas of expertise, office information, accept employment less than six months and Do you have any objections to our making inquiries of your present or last employer?' data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_biodata_address_and_nationalities, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_biodata_address_and_nationalities($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select(
            'id',
            'relevant_facts',
            'objections_making_inquiry_of_present_employer',
            'objection_name',
            'objection_email',
            'objection_position',
            'objection_organization',
            'accept_employment_less_than_six_month',
            'office_telephone',
            'office_email',
            'skype',
            'share_profile_consent',
            'hear_about_us_from',
            'other_text'
        )->with([
            'field_of_works' => function ($query) {
                $query->select('field_of_works.id as value', 'field as label');
            },
            'sectors' => function ($query) {
                $query->select('sectors.id as value', 'sectors.name as label');
            },
        ])->withCount([
            'p11_field_of_works as field_of_works_counts'
        ])->findOrFail($profileID);

        unset($profile->p11_field_of_works);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-cv-and-signature",
     *   tags={"Profile"},
     *   summary="Get CV and Signature data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_cv_and_signature, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-cv-and-signature/{id}",
     *   tags={"Profile"},
     *   summary="Get CV and Signature data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_cv_and_signature, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_cv_and_signature($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id', 'cv_id', 'signature_id')->findOrFail($profileID);

        $photo =  $profile->getMedia('photos')->first();
        if (!empty($photo)) {
            $profile->photo = $photo->getFullUrlFromS3('thumb');
        }
        if (!is_null($profile->cv_id)) {
            $cv = $profile->p11_cv->getMedia('cv_files')->first();
            if ($cv) {
                $profile->cv = collect([
                    'file_url' => $cv->getFullUrlFromS3(),
                    'mime' => $cv->mime_type,
                    'filename' => $cv->file_name
                ]);
            }
            unset($profile->p11_cv);
        }

        if (!is_null($profile->signature_id)) {
            $signature = $profile->p11_signature;
            if (!empty($signature)) {
                $signature = $signature->getMedia('signature_files')->first();
                if ($signature) {
                    $profile->signature = collect([
                        'file_url' => $signature->getFullUrlFromS3(),
                        'mime' => $signature->mime_type,
                        'filename' => $signature->file_name
                    ]);
                }
            }
            unset($profile->p11_signature);
        }

        unset($profile->media);

        return response()->success(__('profile.success.default'), $profile);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-verified-roster",
     *   tags={"Profile"},
     *   summary="Get Verified roster data for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_verified_roster, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    /**
     * @SWG\Get(
     *   path="/api/profile-verified-roster/{id}",
     *   tags={"Profile"},
     *   summary="Get Verified roster data for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_verified_roster, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_verified_roster($id = NULL)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::select('id')->with([
            'roster_processes' => function ($query) {
                $query->select('roster_processes.id', 'name', 'under_sbp_program')->where('under_sbp_program', "yes")->wherePivot('is_completed', 1);
            }
        ])->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-roster-process",
     *   tags={"Profile"},
     *   summary="Get All Roster Process data that the user applied for logged in User",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_roster_process, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    /**
     * @SWG\Get(
     *   path="/api/profile-roster-process/{id}",
     *   tags={"Profile"},
     *   summary="Get All Roster Process data that the user applied for Seeing other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_roster_process, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_roster_process($id = NULL)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::with([
            'roster_processes' => function ($query) {
                $query->select('roster_processes.id', 'name', 'campaign_is_open');
            },
            'roster_processes.roster_steps' => function ($query) {
                $query->select('id', 'order', 'roster_process_id', 'step', 'set_rejected');
            }
        ])->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/current-profile-roster-process/v2/roster-process/{rosterProcessID}",
     *   tags={"Profile"},
     *   summary="Get Specific Roster Process that the user applied in on process status",
     *   description="File: app\Http\Controllers\API\ProfileController@current_profile_roster_process_v2, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="rosterProcessID",
     *          in="path",
     *          type="integer",
     *          description="roster process id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function current_profile_roster_process_v2($rosterProcessID = NULL)
    {
        $profileID = $this->authProfileId;

        $profile = $this->model::with([
            'roster_processes' => function ($query) use ($rosterProcessID) {
                $query->select('roster_processes.id', 'name', 'campaign_is_open')
                    ->wherePivot('roster_process_id', $rosterProcessID)
                    ->wherePivot('set_as_current_process', 1);
            },
            'roster_processes.roster_steps' => function ($query) {
                $query->select('id', 'order', 'roster_process_id', 'step', 'set_rejected');
            }
        ])->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/view-current-profile-roster-process/v2/{id}/roster-process/{rosterProcessID}",
     *   tags={"Profile"},
     *   summary="Get Specific Roster Process that the user applied in on process status [Seeing other profile]",
     *   description="File: app\Http\Controllers\API\ProfileController@current_profile_roster_process_v2, Permission: View Applicant Profile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Parameter(
     *          name="rosterProcessID",
     *          in="path",
     *          type="integer",
     *          description="roster process id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function view_current_profile_roster_process_v2($id = NULL, $rosterProcessID = NULL)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;

        $profile = $this->model::with([
            'roster_processes' => function ($query) use ($rosterProcessID) {
                $query->select('roster_processes.id', 'name', 'campaign_is_open')
                    ->wherePivot('roster_process_id', $rosterProcessID)
                    ->wherePivot('set_as_current_process', 1);
            },
            'roster_processes.roster_steps' => function ($query) {
                $query->select('id', 'order', 'roster_process_id', 'step', 'set_rejected');
            }
        ])->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/history-profile-roster-process/v2/roster-process/{rosterProcessID}",
     *   tags={"Profile"},
     *   summary="Get History of Specific Roster Process that the user applied",
     *   description="File: app\Http\Controllers\API\ProfileController@history_profile_roster_process_v2, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="rosterProcessID",
     *          in="path",
     *          type="integer",
     *          description="roster process id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function history_profile_roster_process_v2($rosterProcessID = NULL)
    {
        $profileID = $this->authProfileId;
        $profile = $this->model::with([
            'roster_processes' => function ($query) use ($rosterProcessID) {
                $query->select(
                    'roster_processes.id',
                    'name',
                    'campaign_is_open',
                    'profile_roster_processes.created_at',
                    'profile_roster_processes.updated_at'
                )->wherePivot('roster_process_id', $rosterProcessID);
            },
            'roster_processes.roster_steps' => function ($query) {
                $query->select('id', 'order', 'roster_process_id', 'step', 'set_rejected');
            }
        ])->findOrFail($profileID);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/view-history-profile-roster-process/v2/{id}/roster-process/{rosterProcessID}",
     *   tags={"Profile"},
     *   summary="Get History of Specific Roster Process that the user applied [Seeing other profile]",
     *   description="File: app\Http\Controllers\API\ProfileController@history_profile_roster_process_v2, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Parameter(
     *          name="rosterProcessID",
     *          in="path",
     *          type="integer",
     *          description="roster process id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function view_history_profile_roster_process_v2($id = NULL, $rosterProcessID = NULL)
    {
        $profile = $this->model::with([
            'roster_processes' => function ($query) use ($rosterProcessID) {
                $query->select(
                    'roster_processes.id',
                    'name',
                    'campaign_is_open',
                    'profile_roster_processes.created_at',
                    'profile_roster_processes.updated_at'
                )->wherePivot('roster_process_id', $rosterProcessID);
            },
            'roster_processes.roster_steps' => function ($query) {
                $query->select('id', 'order', 'roster_process_id', 'step', 'set_rejected');
            }
        ])->findOrFail($id);

        return response()->success(__('profile.success.default'), $profile->roster_processes);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-last-update",
     *   tags={"Profile"},
     *   summary="Get Profile last update data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_last_update, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_last_update()
    {
        $date = new DateTime($this->authProfile->updated_at);
        return response()->success(__('profile.success.default'), $date->format('Y-m-d H:i:s'));
    }

    /**
     * @SWG\Post(
     *   path="/api/apply-roster",
     *   tags={"Profile", "Roster"},
     *   summary="Apply Roster Process for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@applyRoster, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="rosterData",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"roster_process_id"},
     *              @SWG\Property(property="roster_process_id", type="integer", description="Roster Process ID", example=1
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function applyRoster(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process_id' => 'required|integer|exists:roster_processes,id'
        ]);

        $profileID = $this->authProfileId;
        $rosterInvitation = RosterInvitation::where('profile_id', $this->authProfileId)
        ->where('roster_process_id', $validatedData['roster_process_id'])
        ->where('active', 1)
        ->first();

        $selectedRosterProcess = RosterProcess::findOrFail($validatedData['roster_process_id']);
        if ($selectedRosterProcess->campaign_is_open == "no" && !$rosterInvitation) {
            return response()->error(__('profile.error.roster_close'), 422);
        }

        // $default_process = RosterProcess::where('is_default', 1)->first();
        // if (empty($default_process)) {
        //     return response()->error(__('profile.error.update_default'), 500);
        // }

        $default_process = RosterProcess::where('id', $validatedData['roster_process_id'])->first();
        if (empty($default_process)) {
            return response()->error(__('profile.error.update_default'), 500);
        }


        $profile = $this->model::whereHas('roster_processes', function ($query) use ($default_process) {
            $query->where('profile_roster_processes.roster_process_id', $default_process->id)->where(function($subquery) {
                $subquery->where('profile_roster_processes.set_as_current_process', 1)->orWhere(function($q) {
                    $q->where('profile_roster_processes.set_as_current_process', 0)->where('profile_roster_processes.is_completed', 1);
                });
            });
        })->find($profileID);

        $selectedRosterProcess = RosterProcess::where('id', $validatedData['roster_process_id'])->first();

        $rejectedStepFromSelectedRosterProcess = $selectedRosterProcess->roster_steps()->where('set_rejected', 1)->first();
        $rejectedStepFromDefaultProcess = $default_process->roster_steps()->where('set_rejected', 1)->first();

        $tablePivotData = ($this->authUser->archived_user == "yes") ? [
            'set_as_current_process' => 0,
            'current_step' => $rejectedStepFromDefaultProcess->order,
            'is_rejected' => 1
        ] : ['set_as_current_process' => 1];

        if (empty($profile)) {
            $profile = $this->authProfile;
            $profile->fill(['become_roster' => 1])->save();

            if ($default_process->id == $validatedData['roster_process_id']) {
                $profile->roster_processes()->attach($validatedData['roster_process_id'], $tablePivotData);
            } else {
                $profile->roster_processes()->attach($default_process->id, $tablePivotData);

                if ($this->authUser->archived_user == "yes") {
                    $tablePivotData['current_step'] = $rejectedStepFromSelectedRosterProcess->order;
                }
                $profile->roster_processes()->attach($validatedData['roster_process_id'], $tablePivotData);
            }
            if($rosterInvitation) $rosterInvitation->update(['active' => 0]);
            return response()->success(__('profile.success.default'), []);
        }

        $profile->fill(['become_roster' => 1])->save();

        if ($this->authUser->archived_user == "yes") {
            $tablePivotData['current_step'] = $rejectedStepFromSelectedRosterProcess->order;
        }

        $profile->roster_processes()->attach($validatedData['roster_process_id'], $tablePivotData);
        if($rosterInvitation) $rosterInvitation->update(['active' => 0]);
        return response()->success(__('profile.success.default'), []);
    }

    /**
     * @SWG\Post(
     *   path="/api/profile/check-roster-invitation",
     *   tags={"Profile", "Roster"},
     *   summary="Check Roster Invitation for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@checkExistingRosterInvitation, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="roster",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"roster_process_id"},
     *              @SWG\Property(property="roster_process_id", type="integer", description="Roster Process ID", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function checkExistingRosterInvitation(Request $request)
    {
        $validatedData = $this->validate($request, [
            'roster_process_id' => 'required|integer|exists:roster_processes,id'
        ]);

        $profileID = $this->authProfileId;
        $rosterInvitation = RosterInvitation::where('profile_id', $this->authProfileId)
        ->where('roster_process_id', $validatedData['roster_process_id'])
        ->where('active', 1)
        ->first();

        if ($rosterInvitation) {
            return response()->success(__('profile.success.default'), $rosterInvitation);
        } else {
            return response()->error(__('profile.error.roster_invitation'), 404);
        }
    }

    /**
     * @SWG\Post(
     *   path="/api/apply-roster-from-job",
     *   tags={"Profile", "Roster"},
     *   summary="Apply Roster Process from job posting for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@applyRosterFromJob, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="rosterData",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"skillset"},
     *              @SWG\Property(property="skillset", type="string", enum={"IM","M&E","GIS"}, description="Roster Process Skillset", example="GIS")
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function applyRosterFromJob(Request $request)
    {
        // validate the skillset
        $validatedData = $this->validate($request, [
            'job_id' => 'required|integer|exists:jobs,id',
            'skillset' => $this->rosterSkillsetValidationRule()
        ]);

        // check if the user is eligible to apply
        $isEligible = $this->isEligibleToApplyRoster($this->authProfileId, $validatedData['skillset']);
        if(!$isEligible) {
            return response()->error(__('roster.error.hasActiveRecruitment'), 403);
        }

        // check if the roster process exist
        $rosterProcess = RosterProcess::where('under_sbp_program', 'yes')->where('skillset', $validatedData['skillset'])->first();
        if(!$rosterProcess) {
            // ADD LOG AND MAIL NOTIFICATION
            return response()->error(__('roster.error.noRosterWhenApplyingRosterFromJob'), 404);
        }

        // applied to roster
        $this->authProfile->fill(['become_roster' => 1])->save();
        $this->authProfile->roster_processes()->attach($rosterProcess->id, [
            'set_as_current_process' => 1,
            'coming_from_job_id' => $validatedData['job_id']
        ]);

        return response()->success(__('profile.success.default'), ['roster_process_id' => $rosterProcess->id]);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile-phones",
     *   tags={"Profile"},
     *   summary="Get Profile phones data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@profile_phones, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_phones($id = null)
    {
        $profileID = (!empty($id)) ? $id : $this->authProfileId;
        $profile = $this->model::findOrFail($profileID);
        $data = ['phones' => $profile->phones, "phone_counts" => count($profile->phones)];
        return response()->success(__('profile.success.default'), $data);
    }

    // UPDATE PROFILE PAGE
    /**
     * @SWG\Post(
     *   path="/api/update-profile-biodata",
     *   tags={"Profile"},
     *   summary="Update Biodata Profile for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_biodata, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "first_name", "family_name", "gender", "present_nationalities", "country_residence"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="first_name", type="string", description="First Name", example="John"),
     *              @SWG\Property(property="middle_name", type="string", description="Middle Name", example="Michael"),
     *              @SWG\Property(property="family_name", type="string", description="Family Name", example="Doe"),
     *              @SWG\Property(property="gender", type="integer", enum={0,1,2,3}, description="Gender (0: Female, 1: Male, 2: Do not want to specify, 3: Others)", example=1),
     *              @SWG\Property(property="linkedin_url", type="string", description="linkedin profile", example="https://linkedin.com/in/johndoe"),
     *              @SWG\Property(property="skype", type="string", description="Skype name", example="live:johndoe"),
     *              @SWG\Property(property="present_nationalities", type="array", description="User Nationalities",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="country_residence", type="object", description="Country of Residence",
     *                  @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_biodata(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_BIODATA_RULES);
        $updateData = $request->only(self::UPDATE_BIODATA_FILLABLE);
        $updateData['country_residence_id'] = $validatedData['country_residence']['value'];
        $userData = [
            'first_name' => $validatedData['first_name'],
            'middle_name' => $validatedData['middle_name'],
            'family_name' => $validatedData['family_name']
        ];
        $userData = $this->getFullName($userData);

        $user = $profile->user;
        $user->first_name = $userData['first_name'];
        $user->middle_name = $userData['middle_name'];
        $user->family_name = $userData['family_name'];
        $user->full_name = $userData['full_name'];

        $user->save();

        $present_nationalities = array_pluck($validatedData['present_nationalities'], 'value');

        $this->syncNationalitiesData($profile, 'present_nationalities', $present_nationalities, 'present');

        $saved = $profile->fill($updateData)->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-already-immaper",
     *   tags={"Profile"},
     *   summary="Update Already iMMAPer data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_already_immaper, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "is_immaper"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="is_immaper", type="integer", enum={0,1}, description="0: Not iMMAPer (false), 1: iMMAPer (true)", example=1),
     *              @SWG\Property(property="immap_email", format="email", type="string", description="Put your iMMAP email if you are an iMMAPer (is_immaper == 1)", example="careers@organization.org"),
     *              @SWG\Property(property="immap_office_id", type="integer", description="Select your iMMAP Office (should be exists in immap_offices table) if you are an iMMAPer (is_immaper == 1)"),
     *              @SWG\Property(property="is_immap_inc", type="integer", enum={0,1}, description="0: Not Under iMMAP US (false), 1: Under iMMAP US (true)", example=1),
     *              @SWG\Property(property="is_immap_framce", type="integer", enum={0,1}, description="0: Not Under iMMAP France (false), 1: Under iMMAP France (true)", example=0),
     *              @SWG\Property(property="job_title", type="string", description="Put your Job Title in iMMAP if you are an iMMAPer (is_immaper == 1)", example="Finance Director"),
     *              @SWG\Property(property="duty_station", type="string", description="Put your Duty Station in iMMAP if you are an iMMAPer (is_immaper == 1)", example="Washington"),
     *              @SWG\Property(property="line_manager", type="string", description="Put your Line Manager in iMMAP if you are an iMMAPer (is_immaper == 1)", example="William Barron"),
     *              @SWG\Property(property="line_manager_id", type="integer", description="Line Manager id (user id) if you are an iMMAPer (is_immaper == 1)", example="3"),
     *              @SWG\Property(property="start_of_current_contract", format="date", type="string", description="Put your Start of current contract in iMMAP if you are an iMMAPer (is_immaper == 1) [Date Format: 2020-05-20]", example="2020-01-01"),
     *              @SWG\Property(property="end_of_current_contract", format="date", type="string", description="Put your End of current contract in iMMAP if you are an iMMAPer (is_immaper == 1) [Date Format: 2020-05-20", example="2020-12-31"),
     *              @SWG\Property(property="immap_contract_international", type="integer", enum={0,1}, description="0: National Contract (false), 1: International Contract (true)", example=1),
     *          )
     *      ),
     *   @SWG\Parameter(
     *          name="profileID",
     *          in="path",
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_already_immaper(Request $request, $profileID = null)
    {
        $profile = $this->model::findOrFail($profileID ? $profileID : $this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_ALREADY_IMMAPER);

        $oldIMMAPEmail = $profile->immap_email;
        $saved = $profile->fill($validatedData)->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }
        try {
            if ($validatedData['is_immaper'] == 1) {
                if ($oldIMMAPEmail !== $validatedData['immap_email'] || (date('Y-m-d') > date($validatedData['end_of_current_contract']))) {
                    $profile->fill(['verified_immaper' => 0])->save();
                }

                $profile->user->fill(['immap_email' => $validatedData['immap_email']])->save();
                unset($profile->user);

                $profile = $this->model::findOrFail($this->authProfileId);
            }

            if ($validatedData['is_immaper'] == 0) {
                $profile->fill(['verified_immaper' => 0])->save();
                $profile->user->fill(['immap_email' => NULL])->save();
                unset($profile->user);
                $profile = $this->model::findOrFail($this->authProfileId);
            }
        } catch (Exception $e) {
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/send-verification-immap-email",
     *   tags={"Profile"},
     *   summary="Send iMMAP Email Verification for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@send_verification_immap_email, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=403, description="Forbidden"),
     *   @SWG\Response(response=404, description="Sorry, data not found")
     * )
     *
     */
    public function send_verification_immap_email(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);

        if ($this->checkUnverifiedIMMAPerFromSelectedProfile($profile)) {
            Mail::to($profile->immap_email)->send(new ImmapVerification($profile->user->full_name, $profile->user->id));
        } elseif ($this->checkVerifiedIMMAPerFromSelectedProfile($profile)) {
            return response()->success(__('user.success.immaper_already_verified'), []);
        } else {
            return response()->error(__('user.error.not_immaper'), 403);
        }

        return response()->success(__('user.success.immaper_verification_mail'), []);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-legal-permanent-residence-status",
     *   tags={"Profile"},
     *   summary="Update 'Have you taken up legal permanent residence status in any country other than that of your nationality?' for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_legal_permanent_residence_status, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "legal_permanent_residence_status"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="legal_permanent_residence_status", type="integer", enum={0,1},
     *                  description="Have you taken up legal permanent residence status in any country other than that of your nationality? (0 == no, 1 == yes)",
     *                  example=1
     *              ),
     *              @SWG\Property(property="legal_permanent_residence_status_countries", type="array",
     *                  description="List of legal permanent residence status country(ies) other than nationality (required if legal_permanent_residence_status == 1)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="Value should be id exists in countries table", example=1)
     *                  )
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_legal_permanent_residence_status(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_LEGAL_PERMANENT_RESIDENCE_STATUS_RULES);

        // legal permanent residence status
        if (!$validatedData['legal_permanent_residence_status']) {
            $profile->p11_legal_permanent_residence_status()->delete();
        }

        if ($validatedData['legal_permanent_residence_status']) {
            $p11_legal = array_pluck($request->legal_permanent_residence_status_countries, 'value');
            $profile->p11_legal_permanent_residence_status_countries()->sync($p11_legal);
        }

        $saved = $profile->fill($request->only(self::UPDATE_LEGAL_PERMANENT_RESIDENCE_STATUS_FILLABLE))->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-legal-step-changing-nationality",
     *   tags={"Profile"},
     *   summary="Update 'Have you taken any legal steps towards changing your present nationality?' for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_legal_step_changing_nationality, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "legal_step_changing_present_nationality"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="legal_step_changing_present_nationality", type="integer", enum={0,1},
     *                  description="Have you taken any legal steps towards changing your present nationality? (0 == no, 1 == yes)",
     *                  example=1
     *              ),
     *              @SWG\Property(property="legal_step_changing_present_nationality_explanation", type="string",
     *                  description="Explanation why take a legal step to changing your nationality (required if legal_step_changing_present_nationality == 1)",
     *                  example="explanation"
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_legal_step_changing_nationality(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_LEGAL_STEP_CHANGING_NATIONALITY_RULES);

        $saved = $profile->fill($validatedData)->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-relevant-facts",
     *   tags={"Profile"},
     *   summary="Update 'State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality?' for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_relevant_facts, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="relevant_facts", type="string",
     *                  description="State Any Other Relevant Facts, Including Information Regarding Any Residence Outside The Country of Your Nationality?",
     *                  example="explanation"
     *              )
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function update_profile_relevant_facts(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_RELEVANT_FACTS_RULES);

        $saved = $profile->fill($validatedData)->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-biodata-address-and-nationalities",
     *   tags={"Profile"},
     *   summary="Update 'Areas of expertise, office information, accept employment less than six months and Do you have any objections to our making inquiries of your present or last employer?' data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_biodata_address_and_nationalities, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "preferred_field_of_work", "accept_employment_less_than_six_month", "objections_making_inquiry_of_present_employer"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="preferred_field_of_work", type="array",
     *                  description="List of Areas of Expertise (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      required={"label", "addedBy"},
     *                      @SWG\Property(
     *                          property="value",
     *                          type="string",
     *                          description="Value can be id exists in field_of_works table or string with format: others-2020-12-03,13:11:43",
     *                          example=1
     *                      ),
     *                      @SWG\Property(
     *                          property="label",
     *                          type="string",
     *                          description="Label of area of expertise shown in the chip",
     *                          example="Database Design"
     *                      ),
     *                      @SWG\Property(
     *                          property="addedBy",
     *                          type="string",
     *                          description="Can be empty, only exists if area of expertise not in the field_of_works table",
     *                          enum={"others"},
     *                          example="others"
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="office_telephone", type="string", description="Your office telephone (if any)", example="+62-99999999"),
     *              @SWG\Property(property="office_email", format="email", type="string", description="Your office email (if any)", example="office@mail.com"),
     *              @SWG\Property(property="accept_employment_less_than_six_month", type="integer", enum={0,1},
     *                  description="Accept Employment for less then six months, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *              @SWG\Property(property="objections_making_inquiry_of_present_employer", type="integer", enum={0,1},
     *                  description="Any objections to our making inquiries of your present or former employer, (0 == no, 1 == yes)",
     *                  example=0
     *              ),
     *              @SWG\Property(property="objection_name", type="string",
     *                  description="Present / Last Employer Name, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="John Doe"
     *              ),
     *              @SWG\Property(property="objection_email", type="string",
     *                  description="Present / Last Employer Email, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="johndoe@mail.com"
     *              ),
     *              @SWG\Property(property="objection_position", type="string",
     *                  description="Present / Last Employer Position, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="CTO"
     *              ),
     *              @SWG\Property(property="objection_organization", type="string",
     *                  description="Present / Last Employer Organization, required if objections_making_inquiry_of_present_employer == 1",
     *                  example="Organization Name"
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_biodata_address_and_nationalities(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_BIODATA_ADDRESS_AND_NATIONALITIES_RULES);

        //nationalities modification
        // $birth_nationalities = array_pluck($validatedData['birth_nationalities'], 'value');
        // $present_nationalities = array_pluck($validatedData['present_nationalities'], 'value');

        // $this->syncNationalitiesData($profile, 'birth_nationalities', $birth_nationalities, 'birth');
        // $this->syncNationalitiesData($profile, 'present_nationalities', $present_nationalities, 'present');

        // preferred_field_of_work
        if (!empty($validatedData['preferred_field_of_work'])) {
            $preferred_field_of_work_slug = array_map(function ($value) {
                return Str::slug($value['label'], '-');
            }, $validatedData['preferred_field_of_work']);

            $this->savePreferredFieldOfWork($profile, $preferred_field_of_work_slug, $validatedData['preferred_field_of_work']);
        }

        if (!empty($validatedData['preferred_sector'])) {
            $preferred_sector_slug = array_map(function ($value) {
                return Str::slug($value['label'], '-');
            }, $validatedData['preferred_sector']);

            $this->savePreferredSector($profile, $preferred_sector_slug, $validatedData['preferred_sector']);
        }

        // $addressData = [
        //     'sameWithPermanent' => $validatedData['sameWithPermanent'],
        // ];
        // if (!empty($validatedData['permanent_address'])) {
        //     $addressData = array_merge($addressData, $validatedData['permanent_address']);
        // }
        // if (!empty($validatedData['present_address'])) {
        //     $addressData = array_merge($addressData, $validatedData['present_address']);
        // }
        // $this->saveAddress($profile, $addressData);

        $saved = $profile->fill($request->only(self::UPDATE_BIODATA_ADDRESS_AND_NATIONALITIES_FILLABLE))->save();

        if (!$saved) {
            return response()->error(__('profile.error.update_default'), 500);
        }

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-cv",
     *   tags={"Profile"},
     *   summary="Update CV for logged in user in Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_cv, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="_method", in="formData", type="string", required=true, enum={"PUT"}),
     *   @SWG\Parameter(
     *          name="cv_file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="CV File in PDF Format",
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_cv(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_CV_RULES);

        // cv file
        $this->saveFiles($profile, $validatedData['cv_file'], $request->file('cv_file'), 'cv_id', 'cv_files', 'p11_cv');

        return response()->success(__('profile.success.update_default'), $profile);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-profile-signature",
     *   tags={"Profile"},
     *   summary="Update Signature for logged in user in Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_signature, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="_method", in="formData", type="string", required=true, enum={"PUT"}),
     *   @SWG\Parameter(
     *          name="signature_file",
     *          in="formData",
     *          required=true,
     *          type="file",
     *          description="Signature File in Image Format [jpg,jpeg,png,webp,JPG,PNG,JPEG]",
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_profile_signature(Request $request)
    {
        $profile = $this->model::findOrFail($this->authProfileId);
        $validatedData = $this->validate($request, self::UPDATE_SIGNATURE_RULES);

        // signature file
        $this->saveFiles($profile, $validatedData['signature_file'], $request->file('signature_file'), 'signature_id', 'signature_files', 'p11_signature');

        return response()->success(__('profile.success.update_default'), $profile);
    }

    // YES NO FIELD
    protected function update_yes_no_with_relation(Request $request, array $rules, string $updated_field, string $relation, string $updated_count)
    {
        $validatedData = $this->validate($request, $rules);

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if (!$validatedData[$updated_field]) {
            $this->authProfile->{$relation}()->delete();
        }

        $returnData = [
            $updated_field => $this->authProfile->{$updated_field},
            $updated_count => count($this->authProfile->{$relation})
        ];

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $returnData);
    }

    protected function update_yes_no(Request $request, array $rules, string $updated_field, string $updated_related_field)
    {
        $validatedData = $this->validate($request, $rules);

        if (!$validatedData[$updated_field]) {
            $validatedData[$updated_related_field] = '';
        }

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            $updated_field => $this->authProfile->{$updated_field},
            $updated_related_field => $this->authProfile->{$updated_related_field}
        ]);
    }

    // public function update_has_disabilities(Request $request, $updated_field = 'has_disabilities', $updated_related_field = 'disabilities')
    // {
    //     // $this->update_yes_no($request, ['has_disabilities' => 'required|boolean'], 'has_disabilities', 'disabilities');
    //     $validatedData = $this->validate($request, ['has_disabilities' => 'required|boolean']);

    //     if ($validatedData[$updated_field]) {
    //         $validatedData[$updated_related_field] = null;
    //     }

    //     $this->authProfile->fill($validatedData);

    //     if ($this->authProfile->isClean()) {
    //         return response()->error(__('crud.error.update_not_clean'), 422);
    //     }

    //     $updated = $this->authProfile->save();

    //     if (!$updated) {
    //         return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    //     }

    //     return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
    //         $updated_field => $this->authProfile->{$updated_field},
    //         $updated_related_field => $this->authProfile->{$updated_related_field}
    //     ]);
    // }

    /**
     * @SWG\Post(
     *   path="/api/update-objections-making-inquiry-of-present-employer",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update 'Do you have any objections to our making inquiries of your present or last employer?' for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_objections_making_inquiry_of_present_employer, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "objections_making_inquiry_of_present_employer"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="objections_making_inquiry_of_present_employer", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_objections_making_inquiry_of_present_employer(Request $request)
    {
        $rules = ['objections_making_inquiry_of_present_employer' => 'required|boolean'];
        $validatedData = $this->validate($request, $rules);

        if (!$validatedData['objections_making_inquiry_of_present_employer']) {
            $validatedData['objection_name'] = null;
            $validatedData['objection_email'] = null;
            $validatedData['objection_position'] = null;
            $validatedData['objection_organization'] = null;
        }

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'objections_making_inquiry_of_present_employer' => $this->authProfile->objections_making_inquiry_of_present_employer,
            'objection_name' => $this->authProfile->objection_name,
            'objection_email' => $this->authProfile->objection_email,
            'objection_telephone' => $this->authProfile->objection_telephone
        ]);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-is-immaper",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update is_immaper data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_is_immaper, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "is_immaper"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="is_immaper", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_is_immaper(Request $request)
    {
        $validatedData = $this->validate($request, ['is_immaper' => 'required|boolean']);

        if (!$validatedData['is_immaper']) {
            $validatedData['immap_email'] = '';
            $validatedData['immap_office_id'] = null;
            $validatedData['project'] = '';
            $validatedData['is_immap_inc'] = 0;
            $validatedData['is_immap_france'] = 0;
            $validatedData['job_title'] = null;
            $validatedData['duty_station'] = null;
            $validatedData['line_manager'] = null;
            $validatedData['start_of_current_contract'] = null;
            $validatedData['end_of_current_contract'] = null;
        }

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }


        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'is_immaper' => $this->authProfile->is_immaper,
            'immap_email' => $this->authProfile->immap_email,
            // 'project' => $this->authProfile->project,
            // 'immap_office' => empty($immap_office) ? '' : collect(['value' => $immap_office->id, 'label' => $immap_office->country->name . ' - (' . $immap_office->city . ')']),
            'is_immap_inc' => $this->authProfile->is_immap_inc,
            'is_immap_france' => $this->authProfile->is_immap_france,
            'job_title' => $this->authProfile->job_title,
            'duty_station' => $this->authProfile->duty_station,
            'line_manager' => $this->authProfile->line_manager,
            'start_of_current_contract' => $this->authProfile->start_of_current_contract,
            'end_of_current_contract' => $this->authProfile->end_of_current_contract
        ]);
    }

    // public function update_same_with_permanent(Request $request)
    // {
    //     $validatedData = $this->validate($request, ['sameWithPermanent' => 'required|boolean']);

    //     if ($validatedData['sameWithPermanent']) {
    //         foreach ($this->authUser->profile->p11_addresses as &$p11Address) {
    //             if ($p11Address->type == "present") {
    //                 $p11Address->delete();
    //             }

    //             if ($p11Address->type == "permanent") {
    //                 $p11Address->type = "both";
    //                 $p11Address->save();
    //             }
    //         }
    //     } else {
    //         foreach ($this->authUser->profile->p11_addresses as &$p11Address) {
    //             if ($p11Address->type == "present") {
    //                 $p11Address->delete();
    //             }

    //             if ($p11Address->type == "both") {
    //                 $p11Address->type = "permanent";
    //                 $p11Address->save();
    //             }
    //         }
    //     }

    //     return response()->success(__('crud.success.default'), $this->authUser->profile->p11_addresses);
    // }

    // public function update_has_dependents(Request $request)
    // {
    //     return $this->update_yes_no_with_relation($request, ['has_dependents' => 'required|boolean'], 'has_dependents', 'p11_dependents', 'dependents_count');
    // }

    /**
     * @SWG\Post(
     *   path="/api/update-is-international-contract",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update immap_contract_international data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_is_international_contract, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "immap_contract_international"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="immap_contract_international", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_is_international_contract(Request $request)
    {
        $validatedData = $this->validate($request, ['immap_contract_international' => 'required|boolean']);


        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }



        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'immap_contract_international' => $this->authProfile->immap_contract_international
        ]);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-is-international-contract/{id}",
     *   tags={"Profile"},
     *   summary="Update immap_contract_international data for other people profile",
     *   description="File: app\Http\Controllers\API\ProfileController@update_is_international_contract_single, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "immap_contract_international"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="immap_contract_international", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_is_international_contract_single(Request $request, $id)
    {

        $validatedData = $this->validate($request, ['immap_contract_international' => 'required|boolean']);

        $record = $this->model::findOrFail($id);
        $record->immap_contract_international = $validatedData['immap_contract_international'];
        $updated =  $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }
        if ($updated) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record->immap_contract_international);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-permanent-civil-servant",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update permanent_civil_servant [Are you or have you ever been a permanent civil servant in your government's employ?] data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_permanent_civil_servant, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "permanent_civil_servant"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="permanent_civil_servant", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_permanent_civil_servant(Request $request)
    {
        return $this->update_yes_no_with_relation($request, ['permanent_civil_servant' => 'required|boolean'], 'permanent_civil_servant', 'p11_permanent_civil_servants', 'permanent_civil_servants_counts');
    }

    /**
     * @SWG\Post(
     *   path="/api/update-has-professional-societies",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update has_professional_societies data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_has_professional_societies, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "has_professional_societies"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="has_professional_societies", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_has_professional_societies(Request $request)
    {
        $validatedData = $this->validate($request, ['has_professional_societies' => 'required|boolean']);

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if (!$validatedData['has_professional_societies']) {
            foreach ($this->authProfile->p11_professional_societies as $professional_society) {
                $professional_society->sectors()->detach();
            };
            $this->authProfile->p11_professional_societies()->delete();
        }

        $returnData = [
            'has_professional_societies' => $this->authProfile->has_professional_societies,
            'professional_societies_counts' => count($this->authProfile->p11_professional_societies)
        ];

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $returnData);
    }

    /**
     * @SWG\Post(
     *   path="/api/update-has-publications",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update has_publications data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_has_publications, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "has_publications"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="has_publications", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_has_publications(Request $request)
    {
        return $this->update_yes_no_with_relation($request, ['has_publications' => 'required|boolean'], 'has_publications', 'p11_publications', 'publications_counts');
    }

    /**
     * @SWG\Post(
     *   path="/api/update-previously-submitted",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update previously_submitted_application_for_UN [Previouly Worked with iMMAP] data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_previously_submitted, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "previously_submitted_application_for_UN"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="previously_submitted_application_for_UN", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_previously_submitted(Request $request)
    {
        return $this->update_yes_no_with_relation($request, ['previously_submitted_application_for_UN' => 'required|boolean'], 'previously_submitted_application_for_UN', 'p11_submitted_application_for_un', 'previously_submitted_application_for_UN_counts');
    }

    /**
     * @SWG\Post(
     *   path="/api/update-legal-step",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update legal_step_changing_present_nationality [Have you taken any legal steps towards changing your present nationality?] data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_legal_step, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "legal_step_changing_present_nationality"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="legal_step_changing_present_nationality", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_legal_step(Request $request)
    {
        return $this->update_yes_no($request, ['legal_step_changing_present_nationality' => 'required|boolean'], 'legal_step_changing_present_nationality', 'legal_step_changing_present_nationality_explanation');
    }

    /**
     * @SWG\Post(
     *   path="/api/update-legal-permanent-residence",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update legal_permanent_residence_status [Have you taken up legal permanent residence status in any country other than that of your nationality?] data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_legal_permanent_residence, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "legal_permanent_residence_status"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="legal_permanent_residence_status", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_legal_permanent_residence(Request $request)
    {
        return $this->update_yes_no_with_relation($request, ['legal_permanent_residence_status' => 'required|boolean'], 'legal_permanent_residence_status', 'p11_legal_permanent_residence_status', 'legal_permanent_residence_status_counts');
    }

    /**
     * @SWG\Post(
     *   path="/api/update-relatives-employed",
     *   tags={"Profile", "Profile Creation"},
     *   summary="Update relatives_employed_by_public_international_organization [Relatives currently working in iMMAP] data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_relatives_employed, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "relatives_employed_by_public_international_organization"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="relatives_employed_by_public_international_organization", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_relatives_employed(Request $request)
    {
        return $this->update_yes_no_with_relation(
            $request,
            ['relatives_employed_by_public_international_organization' => 'required|boolean'],
            'relatives_employed_by_public_international_organization',
            'p11_relatives_employed_by_int_org',
            'relatives_employed_by_public_international_organization_counts'
        );
    }

    // upgrade database p11 p11_profiles_skills and p11_profiles_sectors
    public function updateSkillsAndSectors()
    {
        $profiles = $this->model::all();
        foreach ($profiles as $profile) {
            $profile_skills = $profile->skills;
            foreach ($profile_skills->pluck('id') as $skill_id) {
                $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill_id) {
                    $query->where('skill_id', $skill_id);
                })->first();

                if (!empty($p11_employment_records_skills)) {
                    $from = new DateTime($p11_employment_records_skills['min_from']);
                    $to = new DateTime($p11_employment_records_skills['max_to']);
                    $interval = $to->diff($from);

                    $profile_skill = $profile->p11_skills()->where('skill_id', $skill_id)->first();
                    if (!empty($profile_skill)) {
                        $profile_skill->fill(['years' => $interval->y])->save();
                    } else {
                        $profile->p11_skills()->create(['years' => $interval->y, 'skill_id' => $skill_id]);
                    }
                }
            }

            $profile_employment_records = $profile->p11_employment_records;
            foreach ($profile_employment_records as $employmentRecord) {
                foreach ($employmentRecord->p11_employment_records_sectors as $employmentSector) {
                    $exist = $profile->p11_sectors()->where('sector_id', $employmentSector->sector_id)->get();

                    if (count($exist) == 0) {
                        $profile->p11_sectors()->create([
                            'sector_id' => $employmentSector->sector_id
                        ]);
                    }
                }
            }

            $sectors = $profile->sectors;
            foreach ($sectors->pluck('id') as $sector_id) {
                $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sector_id) {
                    $query->where('sector_id', $sector_id);
                })->first();

                if (!empty($p11_employment_records_sectors)) {
                    $from = new DateTime($p11_employment_records_sectors['min_from']);
                    $to = new DateTime($p11_employment_records_sectors['max_to']);
                    $interval = $to->diff($from);

                    $profile_sector = $profile->p11_sectors()->where('sector_id', $sector_id)->first();
                    if (!empty($profile_sector)) {
                        $profile_sector->fill(['years' => $interval->y])->save();
                    } else {
                        $profile->p11_sectors()->create(['years' => $interval->y, 'sector_id' => $sector_id]);
                    }
                }
            }
        }
    }

    /**
     * @SWG\Get(
     *   path="/api/get-skype",
     *   tags={"Profile"},
     *   summary="Get Skype data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@getSkype, Permission: Approve Roster|Change Applicant Status",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getSkype()
    {
        return response()->success(__('crud.success.default'), $this->authProfile->skype);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-accept-disclaimer",
     *   tags={"Profile"},
     *   summary="Accept disclaimer for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@accept_disclaimer, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"disclaimer_agree", "disclaimer_open"},
     *              @SWG\Property(property="disclaimer_agree", type="integer", enum={0,1}, example=1),
     *              @SWG\Property(property="disclaimer_open", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function accept_disclaimer(Request $request)
    {
        $validatedData = $this->validate($request, ['disclaimer_agree' => 'required|boolean', 'disclaimer_open' => 'required|boolean']);

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        $returnData = [
            'disclaimer_agree' => $this->authProfile->disclaimer_agree,
            'disclaimer_open' => $this->authProfile->disclaimer_open,
        ];

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $returnData);
    }

    /**
     * @SWG\Get(
     *   path="/api/p11-disclaimer-status",
     *   tags={"Profile Creation"},
     *   summary="Get Disclaimer data data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@disclaimer_status, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function disclaimer_status()
    {
        $returnData = [
            'disclaimer_agree' => $this->authProfile->disclaimer_agree,
            'disclaimer_open' => $this->authProfile->disclaimer_open,
        ];

        return response()->success(__('crud.success.default'), $returnData);
    }

    /**
     * @SWG\Post(
     *   path="/api/profile-roster-dashboard/{id}",
     *   tags={"Dashboard > [iMMAP / SBP IM] Roster Page"},
     *   summary="Get List of profiles that already been accepted as roster member and with filter parameter",
     *   description="
     *      File: app\Http\Controllers\API\ProfileController@profile_roster_dashboard,
     *      Permission: [P11 Access, Index Roster Dashboard],
     *      Page: Dashboard > Roster [iMMAP Roster: http://localhost:8000/dashboard/roster/immap-roster / SBP IM Roster: http://localhost:8000/dashboard/roster/sbp-im-roster]",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="Roster process id"
     *      ),
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              @SWG\Property(property="chosen_sector", type="array", description="Filter - chosen sector (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="id should be id exists in sectors table", example=1),
     *                      @SWG\Property(property="years", type="integer", description="years", example=3)
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_skill", type="array", description="Filter - chosen skill (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="id should be id exists in skills table", example=1),
     *                      @SWG\Property(property="years", type="integer", description="years", example=3),
     *                      @SWG\Property(property="rating", type="integer", description="skill rating", example=4)
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_language", type="array", description="Filter - chosen language (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="is_mother_tongue", type="integer", description="mother tongue?", enum={0,1}, example=1),
     *                      @SWG\Property(property="language_level", type="object",
     *                          @SWG\Property(property="value", type="integer", description="Value should be id exists in language_levels table", example=1)
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_degree_level", type="array", description="Filter - chosen degree level(s) (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="degree", type="string", description="degree"),
     *                      @SWG\Property(property="study", type="string", description="study"),
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_field_of_work", type="array", description="Filter - chosen area of expertise(s) (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="id should be id exists in field_of_works table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_nationality", type="array", description="Filter - chosen nationality(ies) (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="id should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="chosen_country", type="array", description="Filter - working experience in specific country (Can be empty)",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="id", type="integer", description="id should be id exists in countries table", example=1),
     *                      @SWG\Property(property="years", type="integer", description="years", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="experience", type="integer", description="minimum work experience", example=1),
     *              @SWG\Property(property="chosen_country_of_residence", type="object", description="Filter - Country of Residence (Can be empty)",
     *                  example={"value": 1},
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="value", type="integer", description="value should be id exists in countries table", example=1)
     *                  )
     *              ),
     *              @SWG\Property(property="immaper_status", type="array",
     *                  description="Filter - iMMAPer / Not iMMAPer (Can be empty, Can only is_immaper, Can only not_immaper, or both is_immaper and not_immaper)",
     *                  example={"is_immaper", "not_immaper"},
     *                  @SWG\Items(
     *                      type="string",
     *                      enum={"is_immaper","not_immaper"},
     *                  )
     *              ),
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function profile_roster_dashboard(Request $request, $id)
    {
        $validatedData = $this->validate($request, [
            'chosen_sector' => 'sometimes|nullable|array',
            'chosen_sector.*.id' => 'sometimes|nullable|integer',
            'chosen_sector.*.years' => 'sometimes|nullable|integer',
            'chosen_skill' => 'sometimes|nullable|array',
            'chosen_skill.*.id' => 'sometimes|nullable|integer',
            'chosen_skill.*.years' => 'sometimes|nullable|integer',
            'chosen_skill.*.rating' => 'sometimes|nullable|integer',
            'chosen_language' => 'sometimes|nullable|array',
            'chosen_language.*.is_mother_tongue' => 'sometimes|nullable|boolean',
            'chosen_language.*.language_level.value' => 'sometimes|nullable|integer',
            'chosen_degree_level' => 'sometimes|nullable|array',
            'chosen_degree_level.*.degree' => 'sometimes|nullable|string',
            'chosen_degree_level.*.study' => 'sometimes|nullable|string',
            'chosen_field_of_work' => 'sometimes|nullable|array',
            'chosen_field_of_work.*.id' => 'sometimes|nullable|integer|exists:field_of_works,id',
            'chosen_nationality' => 'sometimes|nullable|array',
            'chosen_nationality.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country' => 'sometimes|nullable|array',
            'chosen_country.*.id' => 'sometimes|nullable|integer|exists:countries,id',
            'chosen_country.*.years' => 'sometimes|nullable|integer',
            'experience' => 'sometimes|nullable|integer|min:0|max:10',
            'chosen_country_of_residence' => 'sometimes|nullable|array',
            'chosen_country_of_residence.*.value' => 'sometimes|nullable|integer|exists:countries,id',
            'immaper_status' => 'sometimes|nullable|array',
            'immaper_status.*' => 'sometimes|nullable|in:is_immaper,not_immaper,both',
            'is_available' => 'sometimes|nullable|array',
            'is_available.*' => 'sometimes|nullable|in:available,not_available,both'
        ]);

        $profiles = $this->model::select('id', 'email', 'user_id')
        ->whereHas('user', function ($query) {
            $query->where('users.archived_user', 'no');
        })
        ->whereHas('roster_processes', function ($query) use ($id) {
            return $query->where([['is_completed', '=', 1], ['roster_process_id', '=', $id]]);
        })->with(['roster_processes' => function ($query) use ($id) {
            return $query->where([['is_completed', '=', 1], ['roster_process_id', '=', $id]])->select(['roster_processes.id', 'roster_processes.name', 'roster_processes.slug', 'is_completed']);
        }])->with(['user' => function ($query) {
            $query->select('id', 'full_name');
        }]);

        if ($validatedData['experience'] > 0) {
            $profiles = $profiles->where('work_experience_years', '>=', $validatedData['experience']);
        }

        if (!empty($validatedData['immaper_status'])) {
            if (count($validatedData['immaper_status']) < 2) {

                foreach ($validatedData['immaper_status'] as $immaper) {
                    if ($immaper == "is_immaper") {
                        $profiles = $this->iMMAPerFromProfileQuery($profiles);
                    } else if ($immaper == "not_immaper") {
                        $profiles = $this->nonIMMAPerFromProfileQuery($profiles);
                    }
                }
            }
        }

        if (!empty($validatedData['is_available'])) {
            if (count($validatedData['is_available']) == 1 && in_array("available", $validatedData['is_available'])) {
                $profiles = $profiles->whereDoesntHave('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }

            if (count($validatedData['is_available']) == 1 && in_array("not_available", $validatedData['is_available'])) {
                $profiles = $profiles->whereHas('p11_employment_records', function ($query) {
                    $query->where('untilNow', 1);
                });
            }
        }

        if (!empty($validatedData['chosen_country_of_residence'])) {
            $profiles = $profiles->where('country_residence_id', $validatedData['chosen_country_of_residence']['value']);
        }

        if (!empty($validatedData['chosen_language'])) {
            $profiles = $profiles->whereHas('p11_languages', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_language'] as $key => $language) {
                    $whereRaw = '( language_id = ' . $language['id'];

                    if ($language['is_mother_tongue'] == 1) {
                        $whereRaw = $whereRaw . " AND " . 'is_mother_tongue = ' . $language['is_mother_tongue'];
                    }

                    if (!empty($language['language_level']['value'])) {
                        $whereRaw = $whereRaw . " AND " . 'language_level_id >= ' . $language['language_level']['value'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_degree_level'])) {
            $degree_levels = $validatedData['chosen_degree_level'];
            $profiles = $profiles->whereHas('p11_education_universities', function ($query) use ($degree_levels) {
                foreach ($degree_levels as $key => $degree_level) {
                    $whereRaw = '( degree_level_id = ' . $degree_level['id'];

                    if (!empty($degree_level['degree'])) {
                        $whereRaw = $whereRaw . " AND " . '`degree` LIKE "%' . $degree_level['degree'] . '%" ';
                    }

                    if (!empty($degree_level['study'])) {
                        $whereRaw = $whereRaw . " AND " . '`study` LIKE "%' . $degree_level['study'] . '%" ';
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_sector'])) {
            $profiles = $profiles->whereHas('p11_sectors', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_sector'] as $key => $sector) {
                    $whereRaw = '( sector_id = ' . $sector['id'];

                    if ($sector['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $sector['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_country'])) {
            $profiles = $profiles->whereHas('p11_country_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_country'] as $key => $country) {
                    $whereRaw = '( country_id = ' . $country['id'];

                    if ($country['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $country['years'];
                    }

                    $whereRaw = $whereRaw . ' )';

                    if ($key == 0) {
                        $query->whereRaw($whereRaw);
                    } else {
                        $query->orWhereRaw($whereRaw);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_skill'])) {
            foreach ($validatedData['chosen_skill'] as $key => $skill) {
            $profiles = $profiles->whereHas('p11_skills', function ($query) use ($validatedData, $skill) {
                    $whereRaw = '( skill_id = ' . $skill['id'];

                    if ($skill['years'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'years >= ' . $skill['years'];
                    }

                    if ($skill['rating'] > 0) {
                        $whereRaw = $whereRaw . " AND " . 'proficiency >= ' . $skill['rating'];
                    }

                    $whereRaw = $whereRaw . ' )';
                    $query->whereRaw($whereRaw);
                });
            }

        }

        if (!empty($validatedData['chosen_field_of_work'])) {
            $profiles = $profiles->whereHas('p11_field_of_works', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_field_of_work'] as $key => $field_of_work) {
                    if ($key == 0) {
                        $query->where('field_of_work_id', '=', $field_of_work['id']);
                    } else {
                        $query->orWhere('field_of_work_id', '=', $field_of_work['id']);
                    }
                }
            });
        }

        if (!empty($validatedData['chosen_nationality'])) {
            $profiles = $profiles->whereHas('present_nationalities', function ($query) use ($validatedData) {
                foreach ($validatedData['chosen_nationality'] as $key => $nationality) {
                    if ($key == 0) {
                        $query->where('country_id', '=', $nationality['id']);
                    } else {
                        $query->orWhere('country_id', '=', $nationality['id']);
                    }
                }
            });
        }


        $profiles = $profiles->orderBy('profiles.created_at', 'desc')->get();

        if (!empty($profiles)) {
            foreach ($profiles as $key => &$profile) {
                $title = \App\Models\P11\P11EmploymentRecord::select(['job_title', 'untilNow'])->where('profile_id', $profile->id)->orderBy('to', 'desc')
                    ->first();
                if (empty($title['job_title'])) {
                    $profile['job_title'] = '';
                    $profile['untilNow'] = $title['untilNow'];
                } else {
                    $profile['job_title'] = $title['job_title'];
                    $profile['untilNow'] = $title['untilNow'];
                }
                if ($title['untilNow'] == 1) {
                    $profile['untilNow'] = "Under Contract";
                } else {
                    $profile['untilNow'] = "Available";
                }
                unset($profile->roster_processes);
            }
        }

        return response()->success(__('profile.success.default'), $profiles);
    }

    /**
     * @SWG\Get(
     *   path="/api/get-name/{id}",
     *   tags={"Profile"},
     *   summary="Get Full name data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@getName",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          type="integer",
     *          description="profile id"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, not found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getName($id)
    {
        $profile = $this->model::findOrFail($id);

        return response()->success(__('profile.success.default'), $profile->user->full_name);
    }

    /**
     * @SWG\Get(
     *   path="/api/job-applications_by_profile_id/{status_id}/{profileId}",
     *   tags={"Profile"},
     *   summary="Get user job by status_id",
     *   description="File: app\Http\Controllers\API\ProfileController@jobApplications, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="status_id",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function jobApplications($status_id, $profileId)
    {
        $profile = $this->model::findOrFail($profileId);
        $userid = $profile->user_id;
        $jobs = array();
        $jobs = $profile->user->jobs();
        $jobs = $jobs->wherePivot('job_status_id', $status_id)
            ->with([
                'country',
                'job_user' => function ($q) use ($userid) {
                    return $q
                        ->where('user_id', $userid);
                },
            ])
            ->get();
        return response()->success(__('crud.success.default'), $jobs);
    }

    /**
     * @SWG\Get(
     *   path="/api/job-applications_by_id/{profileId?}",
     *   tags={"Profile"},
     *   summary="Get all user's job applications",
     *   description="File: app\Http\Controllers\API\ProfileController@jobApplicationByProfileId, User: Profile, Permission: Dashboard Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */

    public function jobApplicationByProfileId($profileId = null)
    {
        $profile =  $profileId !== null ? $this->model::findOrFail($profileId) : $this->authProfile;
        $userid = $profile->user_id;
        $jobs = array();
        $jobs = $profile->user->jobs();
        $jobs = $jobs
            ->with([
                'country' => function ($q) {
                    return $q->select('countries.id', 'countries.name');
                },
                'jobHistory' => function ($q) use ($userid) {
                    return $q->select('id', 'job_status_id', 'job_id', 'user_move_id', 'created_at')->where('user_id', $userid)->orderBy('created_at', 'asc');
                },
                'jobHistory.order_status:id,status,status_under_sbp_program',
                'jobHistory.mover:id,full_name,immap_email',
                'job_user' => function ($q) use ($userid) {
                    return $q->select('job_user.id', 'job_user.created_at', 'job_user.job_status_id', 'job_user.user_id', 'job_user.job_id', 'job_user.interview_date', 'panel_interview')
                    ->where('user_id', $userid)->orderBy('created_at', 'desc');
                },
                'job_user.job_status' => function ($q) {
                    return $q->select(
                        'job_status.id',
                        'job_status.last_step',
                        'job_status.is_interview',
                        'job_status.default_status',
                        'job_status.set_as_shortlist',
                        'job_status.set_as_rejected',
                        'job_status.status',
                        'job_status.status_under_sbp_program'
                    );
                },
                'job_user.user:users.id',
                'job_user.user.profile:profiles.id,is_immaper,verified_immaper,user_id',
                'job_user.job_interview_scores',
                'job_user.job_interview_scores.interviewQuestion',
                'job_manager',
                'interview_questions',
                'interviewScore' => function ($q) use ($userid) {
                    return $q->select('id', 'job_id', 'file_name', 'user_interview_name', 'user_interview_email', 'media_id')
                        ->where('user_id', $userid);
                },
                'job_user.job_interview_global_impression',
                'tor:id,job_standard_id',
                'tor.job_standard:id,under_sbp_program'
            ])
            ->select('jobs.id', 'jobs.title', 'jobs.country_id', 'jobs.status', 'jobs.tor_id')
            ->orderBy('job_user.created_at', 'desc')
            ->get()->paginate(self::APPLICATION_PAGINATE);
        return response()->success(__('crud.success.default'), $jobs);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile/star-archive-status/{profileId?}",
     *   tags={"Profile"},
     *   summary="Get star and archive data for the profile",
     *   description="File: app\Http\Controllers\API\ProfileController@getStarArchiveStatus, Permission:View Applicant Profile|Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=false,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function getStarArchiveStatus($id)
    {
        $profile = $this->model::findOrFail($id);

        return response()->success(__('crud.success.default'), [
            'user_id' => $profile->user_id,
            'archived_user' => $profile->user->archived_user,
            'starred_user' => $profile->user->starred_user
        ]);
    }

    /**
     * @SWG\Get(
     *   path="/api/profile/download-resume/{profileId?}",
     *   tags={"Profile"},
     *   summary="Download profile resume",
     *   description="File: app\Http\Controllers\API\ProfileController@downloadResume, Permission:View Applicant Profile|Set as Admin|See Completed Profiles",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function downloadResume(int $id)
    {
        $validatedData = $this->validate(new Request(['id' => $id]), ['id' => 'required|integer|exists:profiles,id']);

        $profile = $this->model::find($id);

        $media = $profile->getMedia('photos')->first();
        debug($media);
        $photo = '';

        if ($media) {
            $thumb = $media->getPathFromS3('thumb');
            $type = pathinfo($thumb, PATHINFO_EXTENSION);
            $data = file_get_contents($thumb);
            $photo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $view = view('profile.resume', ['profile' => $profile, 'photo' => $photo])->render();

        $time = date('Y-m-d-H-i-s');
        $filePath = storage_path("app/resume-generated/resume-$profile->id-$time.pdf");

        $pdf = Browsershot::html($view)
            ->showBackground()
            ->format('A4')
            ->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }



    /**
     * @SWG\Get(
     *   path="/api/profile/download-anonymized-resume/{profileId?}",
     *   tags={"Profile"},
     *   summary="Download and anymized profile resume",
     *   description="File: app\Http\Controllers\API\ProfileController@downloadAnonymizedResume, Permission:View Applicant Profile|Set as Admin|See Completed Profiles",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profileId",
     *          in="path",
     *          required=true,
     *          type="integer"
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */

    public function downloadAnonymizedResume(int $id)
    {
        $validatedData = $this->validate(new Request(['id' => $id]), ['id' => 'required|integer|exists:profiles,id']);

        $profile = $this->model::find($id);

        $media = $profile->getMedia('photos')->first();
        $photo = '';

        if ($media) {
            $thumb = $media->getPathFromS3('thumb');
            $type = pathinfo($thumb, PATHINFO_EXTENSION);
            $data = file_get_contents($thumb);
            $photo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $profileLink = url("/profile/{$id}");

        $view = view('profile.anonymizedResume', ['profile' => $profile, 'photo' => $photo, 'profileLink' => $profileLink])->render();

        $time = date('Y-m-d-H-i-s');
        $filePath = storage_path("app/resume-generated/resume-$profile->id-$time.pdf");

        $pdf = Browsershot::html($view)
            ->showBackground()
            ->format('A4')
            ->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    /**
     * @SWG\GET(
     *   path="/api/check-profile/{id}",
     *   tags={"Profile"},
     *   summary="Check if profile can be shown on Profile page",
     *   description="File: app\Http\Controllers\API\ProfileController@checkProfile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="profile id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function checkProfile(int $id)
    {
        $profile = $this->model::find($id);

        if (!$profile) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), [
            'authProfileId' => auth()->user()->profile->id,
            'canAccess' => ($profile->user->status == 'Hidden' || $profile->user->status == 'Not Submitted') ? false : true,
            'archived_user' => $profile->user->archived_user
        ]);
    }

    /**
     * @SWG\GET(
     *   path="/api/check-current-profile",
     *   tags={"Profile"},
     *   summary="Check if profile is an archived user or not",
     *   description="File: app\Http\Controllers\API\ProfileController@checkCurrentProfile",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function checkCurrentProfile()
    {
        return response()->success(__('crud.success.default'), [
            'archived_user' => $this->authUser->archived_user
        ]);
    }

    /**
     * @SWG\GET(
     *  path="/api/profile/{id}/check-roster-access",
     *  tags={"Profile"},
     *  summary="Get roster recruitment data from the profile",
     *  description="File: app\Http\Controllers\API\ProfileController@checkRosterAccess",
     *  security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *  @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="profile id"
     *  ),
     *  @SWG\Response(response=200, description="Success"),
     *  @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    /**
     * @SWG\GET(
     *  path="/api/profile/check-roster-access",
     *  tags={"Profile"},
     *  summary="Get roster recruitment data from the profile",
     *  description="File: app\Http\Controllers\API\ProfileController@checkRosterAccess",
     *  security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *  @SWG\Response(response=200, description="Success"),
     *  @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function checkRosterAccess($id = '')
    {
        $profileId = $id == '' ? $this->authProfileId : $id;
        $recruitmentData = ProfileRosterProcess::select('roster_process_id')->where('profile_id',$profileId)
            ->whereHas('roster_process', function($query) {
                $query->where('under_sbp_program', 'yes');
            })
            ->orderBy('roster_process_id', 'asc')
            ->distinct('roster_process_id')
            ->with(['roster_process' => function($query) {
                $query->select('id', 'id as value', 'name as label');
                // $query->selectRaw('CONVERT(`id`, char)' .' id, id as value, name as label');
            }])
            ->get();

        return response()->success(__('crud.success.default'), $recruitmentData->count() > 0 ? $recruitmentData->pluck('roster_process')->all() : []);
    }

     /**
     * @SWG\Post(
     *   path="/api/update-share-profile-consent",
     *   tags={"Profile", "Profile Creation"},
     *   summary="update_share_profile_consent data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_share_profile_consent, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "share_profile_consent"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="share_profile_consent", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function update_share_profile_consent(Request $request)
    {
        $validatedData = $this->validate($request, ['share_profile_consent' => 'required|boolean']);

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'share_profile_consent' => $this->authProfile->share_profile_consent
        ]);
    }

     /**
     * @SWG\GET(
     *   path="/api/get-profile/{id}",
     *   tags={"Profile"},
     *   summary="Get user profile by user id",
     *   description="File: app\Http\Controllers\API\ProfileController@getProfile, Permission:Index Immaper",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="user id"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Not Found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    public function getProfile(int $id)
    {
        $profile = User::where('id', $id)->with('profile:id,immap_email,user_id')->first();

        if (!$profile) {
            return response()->error(__('crud.error.not_found'), 404);
        }

        return response()->success(__('crud.success.default'), $profile);
    }

/**
     * @SWG\PUT(
     *  path="/api/profile/update-reference-notice-read",
     * tags={"Profile"},
     * summary="Update reference notice read status",
     * description="File: app\Http\Controllers\API\ProfileController@updateReferenceNoticeRead, Permission: P11 Access",
     * security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     * @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "reference_notice_read"},
     *              @SWG\Property(property="reference_notice_read", type="integer", enum={0,1}, example=0)
     *              )
     *          ),
     * @SWG\Response(response=200, description="Success"),
     * @SWG\Response(response=422, description="Validation Error"),
     * @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function updateReferenceNoticeRead(Request $request)
    {
        $validatedData = $this->validate($request, ['reference_notice_read' => 'required|boolean']);

        $this->authProfile->fill($validatedData);

        if ($this->authProfile->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'reference_notice_read' => $this->authProfile->reference_notice_read
        ]);
    }


/**
     * @SWG\Post(
     *   path="/api/update-profile-reminder",
     *   tags={"Profile", "Update profile reminder"},
     *   summary="updated_profile data for logged in user",
     *   description="File: app\Http\Controllers\API\ProfileController@update_profile_reminder, Permission: P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *          name="profile",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "updated_profile"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="updated_profile", type="integer", enum={0,1}, example=0)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     */
    public function update_profile_reminder(Request $request)
    {
        $validatedData = $this->validate($request, ['updated_profile' => 'required|boolean']);

        $this->authProfile->fill($validatedData);
        $updated = $this->authProfile->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), [
            'updated_profile' => $this->authProfile->updated_profile
        ]);
    }
}
