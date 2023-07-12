<?php

return [
    'success' => [
        'accept_member' => 'Profile(s) successfully accepted as roster member(s)',
        'next_step' => 'Profile successfully moved to :step',
        'skype_invite' => 'Skype invitation successfully sent!',
        'im_test_invite' => 'IM Test invitation successfully sent!',
        'interview_invite' => 'Interview invitation successfully sent!',
        'reference_check_invite' => 'Reference Check successfully sent!',
    ],
    'error' => [
        'accept_member' => 'There is an error while accepting the profile as a roster member',
        'next_step' => 'There is an error while moving the profile to :step',
        'not_skype' => 'Not the correct roster step to send skype invitation',
        'not_im_test' => 'Not the correct roster step to send IM Test invitation',
        'not_interview' => 'Not the correct roster step to send Interview invitation',
        'not_reference_check' => 'Not the correct roster step to send Reference Check invitation',
        'hasActive' => 'Sorry, the profile has an active application in another step',
        'hasActiveWithStep' => 'Sorry, the profile has an active application in :step step',
        'alreadyAccepted' => 'Sorry, this profile has already been accepted',
        'alreadyRosterMember' => 'Sorry, this profile is already a roster member',
        'alreadyActiveInRosterCampaign' => 'Sorry, this profile has an active application in the roster recruitment campaign',
        // sbp recruitment campaign
        'noRosterWhenApplyingRosterFromJob' => "There was an error while applying your account to this vacancy. Please try again later.",
        'hasActiveRecruitment' => 'You have active recruitment for this surge roster vacancy',

    ]
];
