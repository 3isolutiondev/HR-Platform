<?php

namespace App\Providers;

// use Illuminate\Http\Response;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Response as ResponseCode;


class ResponseServiceProvider extends ServiceProvider
{

    public function boot()
    {
        Response::macro('success', function ($message = null, $data = [], $status_code = ResponseCode::HTTP_OK) {
            return Response::json([
                'status' => 'success',
                'message' => (is_null($message) || empty($message)) ? __('response.success') : $message,
                'data' => $data,
            ], $status_code);
        });

        Response::macro('error', function ($message = null, $error_code = 500, $errors = []) {
            return Response::json([
                'status' => 'error',
                'message' => (is_null($message) || empty($message)) ? __('response.error') : $message,
                'errors' => $errors,
            ], $error_code);
        });

        Response::macro('not_found', function ($message = null) {
            return Response::json([
                'status' => 'error',
                'message' => (is_null($message) || empty($message)) ? __('response.not_found') : $message
            ], ResponseCode::HTTP_NOT_FOUND);
        });
    }


    public function register()
    {
        //
    }
}
