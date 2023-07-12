<?php

namespace App\Models\ThirdPartyClient;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class ThirdPartyClient extends Authenticatable implements JWTSubject
{
    protected $fillable = ['username', 'password'];
    protected $hidden = ['password','created_at', 'updated_at'];

    protected $table='third_party_clients';
    protected $guard_name = 'third-party-client-api';

     /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function thirdPartyPermissions()
    {
        return $this->hasMany('App\Models\ThirdPartyClient\ThirdPartyPermission', 'third_party_id');
    }
}
