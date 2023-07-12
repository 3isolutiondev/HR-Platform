<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Language extends Model
{
    protected $table = 'p11_languages';

    protected $fillable = [
        'language_id', 'language_level_id', 'profile_id', 'is_mother_tongue'
    ];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }
    public function language()
    {
        return $this->belongsTo('App\Models\Language');
    }

    public function language_level()
    {
        return $this->belongsTo('App\Models\LanguageLevel', 'language_level_id')->withDefault();
    }
}
