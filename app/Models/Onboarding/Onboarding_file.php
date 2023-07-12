<?php

namespace App\Models\Onboarding;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait; 

class Onboarding_file extends Model implements HasMedia {
   
    use HasMediaTrait;
    
    protected $fillable = ['contact_id', 'media_id', 'file_type', 'file_name', 'name'];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table='onboarding_file';
    
    function contact(){
        return $this->belongsTo('App\Models\Onboarding\Contact_information', 'contact_id');
    }

}
