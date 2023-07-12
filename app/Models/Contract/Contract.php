<?php

namespace App\Models\Contract;

//use Spatie\Sluggable\HasSlug;
//use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
//    use HasSlug;

    protected $fillable = ['id_name', 'date_start', 'date_end', 'date_ttd', 'contract', 'name_of_ceo', 'position_of_ceo', 'signature', 'position', 'title'];
    protected $hidden = ['created_at', 'updated_at'];

//    public function getSlugOptions() : SlugOptions
//    {
//        return SlugOptions::create()
//            ->generateSlugsFrom('id_nama')
//            ->saveSlugsTo('id_nama');
//    }

    function user(){
        return $this->belongsTo('App\Models\User', 'id_name');
    }
}
