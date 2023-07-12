<?php

namespace App\Http\Middleware;

use Closure;

class DocumentationMiddleware
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
        if (env('APP_ENV') == 'production' || env('APP_ENV') == 'staging') {
            return redirect('/404');
        }
        return $next($request);
    }
}
