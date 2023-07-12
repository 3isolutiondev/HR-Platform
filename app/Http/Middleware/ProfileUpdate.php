<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use DateTime;

class ProfileUpdate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
    }

    public function terminate($request, $response) {
        if ($response->status() == "200") {
            if (!empty(auth()->user())) {
                $date = new DateTime();
                $user = auth()->user();

                if ($user->p11Completed == 1) {
                    $user->status = 'Active';
                    $user->inactive_user_has_been_reminded = 'false';
                    $user->inactive_user_has_been_reminded_date = NULL;
                    $user->inactive_date = NULL;
                    $user->save();
                }

                $profile = $user->profile;

                $profile->fill(['updated_at' => $date->format('Y-m-d H:i:s')])->save();
            }
        }
    }
}
