<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Address extends Model
{
    protected $table = 'p11_addresses';

    protected $fillable = ['address','city','postcode','telephone','fax','country_id','type','profile_id'];

    protected $hidden = ['profile_id'];

    public function getFaxAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }
    public function getPermanentFaxAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }
    public function getPresentFaxAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }
    public function getPostcodeAttribute($value){
        return is_null($value) ? '' : $value;
    }
    public function getTelephoneAttribute($value){
        return is_null($value) ? '' : $value;
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile','profile_id');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country','permanent_country');
    }

    public function permanent_country()
    {
        return $this->belongsTo('App\Models\Country','permanent_country');
    }

    public function present_country()
    {
        return $this->belongsTo('App\Models\Country','present_country');
    }
}
