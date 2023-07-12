<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;
use App\Traits\iMMAPerTrait;

class LineManagerMiddleware
{
    use iMMAPerTrait;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $authUser = auth()->user();

        $isIMMAPER = $this->checkIMMAPerFromSelectedUser($authUser);
        $hasStaff = count($authUser->staff);

        if (!$isIMMAPER || !$hasStaff) {
            return response()->error(__('response.forbidden'), Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
