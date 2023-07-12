<?php

namespace App\Models\Quiz;

use Illuminate\Database\Eloquent\Model;

class QuizTemplateEssayQuestion extends Model
{
    protected $table = 'quiz_templates_essay_questions';

    protected $fillable = ['quiz_template_id', 'question', 'score'];

    public function quiz_template() {
        return $this->belongsTo('App\Models\Quiz\QuizTemplate', 'quiz_template_id');
    }

}
