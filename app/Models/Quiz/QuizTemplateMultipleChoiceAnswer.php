<?php

namespace App\Models\Quiz;

use Illuminate\Database\Eloquent\Model;

class QuizTemplateMultipleChoiceAnswer extends Model
{
    protected $table = 'quiz_templates_mc_question_answers';

    protected $fillable = ['quiz_template_mcq_id', 'answer', 'is_correct'];

    public function multiple_choice_question() {
        return $this->belongsTo('App\Models\Quiz\QuizTemplateMultipleChoiceQuestion', 'quiz_template_mcq_id');
    }
}
