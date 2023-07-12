<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class RosterStep extends Model
{
    use HasSlug;

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = ['step', 'slug', 'default_step', 'last_step', 'has_quiz', 'has_im_test', 'has_skype_call', 'has_interview', 'has_reference_check', 'set_rejected', 'roster_process_id', 'quiz_template_id', 'order'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('step')
            ->saveSlugsTo('slug');
    }

    public function getQuizTemplateIdAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function roster_process()
    {
        return $this->belongsTo('App\Models\Roster\RosterProcess', 'roster_process_id');
    }

    public function quiz_template()
    {
        return $this->belongsTo('App\Models\Quiz\QuizTemplate', 'quiz_template_id')->withDefault();
    }
}
