<?php

namespace App\Models\Imtest;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class IMTestTemplate extends Model
{
    use HasSlug;

    protected $table = 'im_test_templates';

    protected $fillable = ['name', 'slug', 'is_default', 'limit_time_hour', 'limit_time_minutes'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function quiz_templates()
    {
        return $this->hasMany('App\Models\Quiz\QuizTemplate', 'im_test_template_id');
    }

    public function imtes()
    {
        return $this->hasMany('App\Models\Imtest\Imtest', 'im_test_templates_id');
    }
    // public function attachment()
}
