<?php

namespace App\Http\Middleware;

use App\Models\ThirdPartyClient\ThirdPartyClient;
use Illuminate\Http\Response;
use Closure;

class CheckManageOnboardingPermission
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
        $authClient = auth('third-party-client-api')->user();

        $client = ThirdPartyClient::where('id', $authClient->id)->whereHas('thirdPartyPermissions', function($query) {
            $query->where('name', 'Manage Onboarding List Sharepoint');
        })->first();

        if (empty($client)) {
            return response()->error(__('response.forbidden'), Response::HTTP_FORBIDDEN, "You don't have the right permission to access this endpoint");
        }

        return $next($request);
    }
}
