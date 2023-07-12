<?php

return [
    'success' => [
        'default' => 'Success',
        'store' => ':singular successfully created',
        'update' => ':singular successfully updated',
        'delete' => ':singular successfully deleted',
    ],
    'error' => [
        'default' => 'Error',
        'not_found' => 'Sorry, We cannot found your data',
        'update_not_clean' => 'At least one of the data should be changed, Please Try Again',
        'store' => 'There is an error while creating :singular',
        'update' => 'There is an error while updating :singular',
        'delete' => 'There is an error while deleting :singular',
    ]
];
