<?php

namespace App\Models\Roster;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class RosterProcess extends Model
{
    use HasSlug;

    protected $table = "roster_processes";

    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = [
        'name', 'slug', 'description', 'is_default', 'read_more_text', 'under_sbp_program',
        'campaign_is_open', 'campaign_open_at_quarter', 'campaign_open_at_year', 'skillset', 'interview_order'
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getCampaignOpenAtQuarter($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getCampaignOpenAtYear($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getHrJobCategoryIdAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getReadMoreTextAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function getSkillsetAttribute($value)
    {
        return is_null($value) ? '' : $value;
    }

    public function roster_steps()
    {
        return $this->hasMany('App\Models\Roster\RosterStep', 'roster_process_id')->orderBy('order', 'asc');
    }

    public function profiles()
    {
        return $this->belongsToMany('App\Models\Profile', 'profile_roster_processes', 'roster_process_id', 'profile_id')
            ->withPivot(
                'set_as_current_process',
                'current_step',
                'is_completed',
                'is_rejected',
                'skype',
                'skype_date',
                'skype_timezone',
                'skype_invitation_done',
                'im_test_template_id',
                'im_test_timezone',
                'im_test_invitation_done',
                'im_test_submit_date',
                'interview_skype',
                'interview_date',
                'interview_timezone',
                'interview_invitation_done',
                'reference_check_id',
                'im_test_done',
                'im_test_end_time',
                'im_test_start_time',
                'panel_interview',
                'interview_type',
                'interview_address'
            )->withTimestamps();
    }

    public function interview_questions() {
        return $this->hasMany('App\Models\InterviewQuestions', 'roster_process_id');
    }
    
    public function applicants_data()
    {
        return $this->hasMany('App\Models\Roster\ProfileRosterProcess', 'roster_process_id');
    }
}
