<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11Publication extends Model
{
    protected $table = 'p11_publications';

    protected $fillable = ['title', 'year', 'profile_id', 'publication_file_id', 'url'];

    public function getUrlAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }

    public function attachment()
    {
        return $this->belongsTo('App\Models\Attachment','publication_file_id');
    }
}
