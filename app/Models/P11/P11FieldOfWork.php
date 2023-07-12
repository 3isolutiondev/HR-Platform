<?php

namespace App\Models\P11;

use Illuminate\Database\Eloquent\Model;

class P11FieldOfWork extends Model
{
    protected $table = "p11_field_of_works";

    protected $fillable = ['field_of_work_id','profile_id','created_at','updated_at'];

    public function field_of_work()
    {
        return $this->belongsTo('App\Models\FieldOfWork');
    }

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile');
    }
}
