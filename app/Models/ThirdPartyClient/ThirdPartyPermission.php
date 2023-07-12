<?php

namespace App\Models\ThirdPartyClient;

use Illuminate\Database\Eloquent\Model;

class ThirdPartyPermission extends Model
{
    protected $table = "third_party_permissions";

    protected $fillable = ['name', 'third_party_id'];
    protected $hidden = ['created_at', 'updated_at'];


    public function thirdPartyClient()
    {
        return $this->belongsTo('App\Models\ThirdPartyClient\ThirdPartyClient', 'third_party_id');
    }
}
