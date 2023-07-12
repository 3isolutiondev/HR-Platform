<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        if (env('APP_ENV') == 'production' || env('APP_ENV') == "staging") {
            if (app()->bound('sentry') && $this->shouldReport($exception)) {
                app('sentry')->captureException($exception);
            }
        }

        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof HttpException) {
            $error_code = $exception->getStatusCode();
            $errors = Response::$statusTexts[$error_code];

            return response()->error('', $error_code, $errors);
        }

        if ($exception instanceof ModelNotFoundException) {
            return response()->not_found();
        }

        if ($exception instanceof AuthorizationException) {
            return response()->error($exception->getMessage(), Response::HTTP_FORBIDDEN);
        }

        if ($exception instanceof AuthenticationException) {
            return response()->error($exception->getMessage(), Response::HTTP_UNAUTHORIZED);
        }

        if ($exception instanceof ValidationException) {
            $errors = $exception->validator->errors()->getMessages();

            return response()->error('Validation Error', Response::HTTP_UNPROCESSABLE_ENTITY, $errors);
        }

        if (env('APP_DEBUG', false)) {
            return parent::render($request, $exception);
        }

        return response()->error('Unexpected Error, Please Try Again', Response::HTTP_INTERNAL_SERVER_ERROR);
        // return parent::render($request, $exception);
    }
}
