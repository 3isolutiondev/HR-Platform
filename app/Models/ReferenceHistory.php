<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class ReferenceHistory extends Model implements HasMedia
{
    use HasMediaTrait;

    protected $table = "reference_history";

    protected $fillable = ['reference_id', 'code', 'job_id', 'reference_sender_id', 'roster_process_id', 'attachment_id'];

    public function job()
    {
        return $this->belongsTo('App\Models\Job');
    }

    public function reference()
    {
        return $this->belongsTo('App\Models\P11\P11Reference');
    }

    public function referenceSender()
    {
        return $this->belongsTo('App\Models\User', 'reference_sender_id');
    }

    public function roster_process()
    {
        return $this->belongsTo('App\Models\Roster\RosterProcess');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment', 'attachment_id');
    }

}