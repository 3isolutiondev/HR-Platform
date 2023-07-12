<?php

namespace App\Models\Quiz;

use Illuminate\Database\Eloquent\Model;

class QuizTemplateMultipleChoiceQuestion extends Model
{
    protected $table = 'quiz_templates_mc_questions';

    protected $fillable = ['quiz_template_id', 'question', 'score'];

    public function quiz_template() {
        return $this->belongsTo('App\Models\Quiz\QuizTemplate', 'quiz_template_id');
    }

    public function multiple_choice_answers() {
        return $this->hasMany('App\Models\Quiz\QuizTemplateMultipleChoiceAnswer', 'quiz_template_mcq_id');
    }
}
