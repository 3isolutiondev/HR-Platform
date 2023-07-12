<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Imtest extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $fillable = [
        'steps', 'title', 'text1', 'text2', 'text3', 'text4', 'file_dataset1', 'file_dataset2',
        'file_dataset3', 'im_test_templates_id'
    ];
    protected $hidden = ['created_at', 'updated_at'];

    protected $table = "im_test";

    // public function getFile_datAttribute($value)
    // {
    //     return ucfirst($value);
    // }

    function hasmanyapplicant()
    {
        return $this->belongsToMany('App\Models\User', 'Applicant');
    }

    function questions()
    {
        return $this->hasMany('App\Models\Imtest\Question_im_test', 'im_test_id');
    }

    function belongstemplate()
    {
        return $this->belongsTo('App\Models\Imtest\IMTestTemplate', 'im_test_templates_id');
    }

    function file_dataset1()
    {
        return $this->belongsTo('App\Models\Attachment', 'file_dataset1');
    }
    function file_dataset2()
    {
        return $this->belongsTo('App\Models\Attachment', 'file_dataset2');
    }

    function file_dataset3()
    {
        return $this->belongsTo('App\Models\Attachment', 'file_dataset3');
    }

    function belonging_profil () {
        return $this->belongsToMany('App\Models\Profile', 'follow_im_test', 
            'im_test_id', 'profil_id')->as('follow-imtest')->withPivot('text1', 'text2', 'text3', 'file1', 'file2', 'file3')
            ;
    }

    function im_test_answer() {
        return $this->hasMany('\App\Models\Imtest\Answer_im_test', 'im_test_id');
    }
}
