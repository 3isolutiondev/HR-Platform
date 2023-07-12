<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'These credentials do not match our records.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    'success' => [
        'default' => 'Success',
        'register' => 'Registration successful',
        'reset' => 'We have emailed your password reset link',
        'login' => 'Login successful',
        'logout' => 'Successfully logged out',
        'resetPassword' => 'Your password has been updated successfully',
        'hiddenUserRegister' => 'Welcome back, your account has been restored with a new password'
    ],
    'error' => [
        'default' => 'Error',
        'unauthorized' => 'Unauthorized',
        'register' => 'Registration Error',
        'resetTokenNotFound' => 'Password reset token is needed',
        'resetTokenInvalid' => 'This password reset token is invalid',
        'resetPassword' => 'There was an error while updating your password',
        'userNotFound' => "We cannot find a user with the email provided",
        'alreadyRegistered' => 'Your email is already registered. Please login with your email.'
    ]

];
