<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\URL;
use Closure;
use App;


class Logservice {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        return $next($request);
    }

    public function terminate($request, $response) {

        if (env('APP_ENV') == 'production') {

            if (preg_match("/api/i", URL::current()) && !preg_match("/logs/i", URL::current())) {

                $mroute='-';
                $nroute='-';
                $method='-';
                $payload='-';
                $controller='-';
                $controller_function='-';
                $action='-';
                $ip='-';
                $user_agent='-';
                $userid=0;
                $username='';
                $response_status='-';
                $response_status_code=0;
                $response_data_or_error='-';

                if(is_string($response)) {

                } else {

                    if(!empty($response->original['message'])) {
                        if($response->original['message']=='Not Found.') {

                        } else {

                            $mroute=$request->path();
                            $nroute=app('request')->route()->getAction()['controller'];
                            $method=$request->method();
                            $ip=$request->ip();

                            list($controller, $action) = explode('@', $nroute);
                            $controller=$controller;
                            $controller_function=$action;
                            $user_agent=$request->server('HTTP_USER_AGENT');
                            if(!empty($response->original['status'])) {
                                $response_status=$response->original['status'];
                            }

                            $user = auth()->user();
                            if(!empty($user)) {
                                $userid = $user->id;
                                $username=$user->full_name;
                            }

                            if ($controller_function=='login' || $controller_function=='register') {
                                $payload=json_encode($request->all()['email']);
                            }
                            elseif ($controller_function=='reset' || $controller_function=='resetPassword') {
                                $payload=json_encode(['payload' => 'ResetPassword']);
                            } else {

                                $payload=json_encode($request->all());

                                if(!empty($response->original['data'])) {
                                    $response_data_or_error=$response->original['data'];
                                }
                            }

                        }

                        if($method=='GET' || $mroute=='api/roster/profiles' || $mroute=='api/jobs/search-filter' || $mroute === 'api/completed-profiles') {

                        } else {

                            $client = new Client();
                            $url = config('logservice.LogService_Base_Url')."/log";

                            if ($this->ping(config('logservice.LogService_Base_Url'))==true){
                                $res = $client->request('POST', $url, [
                                    'headers' => ['AccessToken' => config('logservice.SECRET')],
                                    'form_params' => [
                                        'route' => $mroute,
                                        'method' => $method,
                                        'payload' => $payload,
                                        'controller' => $controller,
                                        'controller_function' => $action,
                                        'ip' => $ip,
                                        'user_agent' => $user_agent,
                                        'user' => $userid,
                                        'username' => $username,
                                        'response_status' => $response_status,
                                        'response_status_code' => $response_status_code,
                                        'response_message' => $response->original['message'],
                                        'response_data_or_error' => json_encode($response_data_or_error)
                                    ]
                                ]);
                                return $res->getStatusCode();
                            }
                        }

                    }

                }

            } else {
                // Log::debug('.....');
            }
        }
    }

    function ping($host){

        $ch = curl_init($host);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if($httpcode>=200 && $httpcode<300){
            return true;
        } else {
            return false;
        }

    }
}
