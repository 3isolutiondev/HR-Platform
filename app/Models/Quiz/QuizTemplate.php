<?php

namespace App\Models\Quiz;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class QuizTemplate extends Model
{
    use HasSlug;

    protected $table = 'quiz_templates';

    protected $fillable = ['title', 'slug', 'is_default', 'is_im_test', 'im_test_template_id', 'duration', 'pass_score'];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function im_test_template() {
        return $this->belongsTo('App\Models\Imtest\IMTestTemplate', 'im_test_template_id');
    }

    public function multiple_choice_questions() {
        return $this->hasMany('App\Models\Quiz\QuizTemplateMultipleChoiceQuestion', 'quiz_template_id');
    }

    public function multiple_choice_answers() {
        return $this->hasManyThrough('App\Models\Quiz\QuizTemplateMultipleChoiceAnswer', 'App\Models\Quiz\QuizTemplateMultipleChoiceQuestion', 'quiz_template_id', 'quiz_template_mcq_id','id','id');
    }

    public function essay_questions() {
        return $this->hasMany('App\Models\Quiz\QuizTemplateEssayQuestion', 'quiz_template_id');
    }


    // mutate value if null
    public function getDurationAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getPassScoreAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

}
