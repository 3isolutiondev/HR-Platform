<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;

class RosterInvitation extends Model
{
    protected $table = 'roster_invitations';

    protected $fillable = [
        'roster_process_id', 'profile_id', 'invited_by_profile_id', 'active'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function profile()
    {
        return $this->belongsTo('App\Models\Profile', 'profile_id');
    }

    public function roster_process()
    {
        return $this->belongsTo('App\Models\Roster\RosterProcess', 'roster_process_id');
    }
}
