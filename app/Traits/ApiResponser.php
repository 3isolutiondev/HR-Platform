<?php

namespace App\Traits;

use Illuminate\Http\Response;

trait ApiResponser
{
    public function successResponse($data, $code = Response::HTTP_OK)
    {
        return response($data, $code)->header('Content-Type', 'application/json');
    }

    public function errorResponse($message = "Error", $code, $errors = [])
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'code' => $code,
            'errors' => $errors
        ], $code);
    }

    public function errorMessage($message, $code, $errors = [])
    {
        return response($message, $code, $errors)->header('Content-Type', 'application/json');
    }

    public function errorNotFoundResponse($message = null, $errors = [])
    {
        return response()->json([
            'status' => 'error',
            'message' => (is_null($message) || empty($message)) ? trans('error.not_found') : $message,
            'errors' => $errors
        ], Response::HTTP_NOT_FOUND);

    }
}
