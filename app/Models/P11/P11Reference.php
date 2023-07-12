<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class P11Reference extends Model implements HasMedia
{
    use HasMediaTrait;
    protected $table = 'p11_references';

    protected $fillable = [
        'full_name', 'organization', 'country_id', 'phone', 'email', 'job_position', 'profile_id', 'attachment_id', 'reference_sender_id'
    ];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function country()
    {
        return $this->belongsTo('App\Models\Country');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'attachment_id');
    }

    public function referenceHistories()
    {
        return $this->hasMany('App\Models\ReferenceHistory', 'reference_id');
    }

    function question(){
        return $this->belongsToMany('\App\Models\Userreference\Question', 'user_answer_question_reference',
            'p11_references_id', 'question_reference_id')
            ->withPivot('answer', 'created_at', 'category_question_reference_id')
            ->as('answer');

    }

}
