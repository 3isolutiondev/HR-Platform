<?php

return [
    'success' => [
        'default' => 'Success',
        'archive' => ':name archived',
        'unarchive' => ':name unarchived',
        'star' => ':name starred',
        'unstar' => ':name unstarred'
    ],
    'error' => [
        'default' => 'Error',
        // archive feature
        'archive_not_complete' => "Sorry, :name profile is not complete",
        'archive_server' => "Sorry, there is an error while archiving/unarchiving the user",
        'archive_has_active_recruitment' => "Sorry, the user has active recruitment process.",
        // star feature
        'star_not_complete' => "Sorry, :name profile is not complete",
        'star_server' => "Sorry, there is an error while starring/unstarring the user",
    ]
];
