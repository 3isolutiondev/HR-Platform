<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Notifications\VerifyEmail;
use App\Traits\SearchableTrait;
// use App\Notifications\ResetPassword;
use Laravel\Scout\Searchable;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    // use HasApiTokens, Notifiable, HasRoles;
    use Notifiable, HasRoles, Searchable, SearchableTrait;

    protected $guard_name = 'api';

     /**
     * The attributes that are eligible for searchable in SearchableTrait.
     *
     * @var array
     */
     public $searchable = ['full_name'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'middle_name','family_name', 'full_name','email', 'password', 'p11Completed', 'p11Status',
        'immap_email','last_login_at', 'archived_user', 'starred_user','access_platform', 'status', 'inactive_user_has_been_reminded',
        'inactive_user_has_been_reminded_date', 'inactive_date'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'created_at', 'updated_at', 'email_verified_at', 'roles'
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        return array_only($this->toArray(), ['id', 'first_name', 'middle_name', 'family_name', 'full_name']);
    }

    public function getImmapEmailAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }
    public function getMiddleNameAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }
    public function getLastLoginAtAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail($this->full_name)); // my notification
    }


    public function profile()
    {
        return $this->hasOne('App\Models\Profile');
    }

    public function photo()
    {
        return $this->hasOne('App\Models\Attachment', 'user_id');
    }

    public function jobs()
    {
        return $this->belongsToMany('App\Models\Job')->withPivot('job_status_id');
    }

    public function job_user()
    {
        return $this->hasMany('App\Models\JobUser');
    }

    public function lastApplyJob()
    {
        return $this->hasOne('App\Models\JobUser')->latest();
    }

    function contract()
    {
        return $this->hasOne('App\Models\Contract');
    }

    function applicant()
    {
        return $this->belongsToMany('App\Models\Imtest\Imtest', 'Applicant');
    }

    public function user_interview_files(){
        return $this->hasMany('App\Models\JobInterviewFiles', 'user_id');
    }

    public function user_comments(){
        return $this->hasMany('App\Models\JobManagerComment', 'user_id');
    }

    public function job_user_history_status(){
        return $this->hasMany('App\Models\Job_user_move_status_history', 'user_id');
    }

    public function managerComments(){
        return $this->hasMany('App\Models\JobManagerComment', 'user_id');
    }

    public function commentby(){
        return $this->hasMany('App\Models\JobManagerComment', 'comment_by_id');
    }

    public function jobManager()
    {
        return $this->hasMany('App\Models\JobManager', 'user_id');
    }

    public function travel_request()
    {
        return $this->hasMany('App\Models\SecurityModule\TARRequest', 'user_id');
    }

    public function movement_requests()
    {
        return $this->hasMany('App\Models\SecurityModule\MRFRequest', 'user_id');
    }

    // relation between national security officer and country
    public function officer_country()
    {
        return $this->belongsToMany('App\Models\Country', 'security_module_officer_countries', 'user_id', 'country_id');
    }

   /**
    * Get all of the employment records for the User
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
    */
   public function p11_employment_records()
   {
       return $this->hasManyThrough('App\Models\P11\P11EmploymentRecord', 'App\Models\Profile')->orderBy('p11_employment_records.to', "DESC");
   }

   // history of archive/unarchive complete profile
   public function user_archive_histories()
   {
       return $this->hasMany('App\Models\UserArchiveHistory', 'user_id');
   }

   // history of contracts 
    public function user_contract_histories()
    {
         return $this->hasMany('App\Models\UserContractHistory', 'user_id');
    }

   // history of star/unstar complete profile
   public function user_star_histories()
   {
       return $this->hasMany('App\Models\UserArchiveHistory', 'user_id');
   }

   // Domestic Travel Request
   public function domestic_travels()
   {
       return $this->hasMany('App\Models\SecurityModule\MRFRequest', 'user_id');
   }

   // International Travel Request
   public function international_travels()
   {
       return $this->hasMany('App\Models\SecurityModule\TARRequest', 'user_id');
   }

   // Staff
   public function staff()
   {
        return $this->hasMany('App\Models\Profile', 'line_manager_id');
   }
}
