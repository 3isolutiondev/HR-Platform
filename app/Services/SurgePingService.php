<?php

namespace App\Services;

use App\Traits\UseExternalService;

class SurgePingService
{
    use UseExternalService;

    public $baseUri;

    public function __construct()
    {
        $this->baseUri = env('SURGE_PLATFORM_URL') . env('SURGE_PLATFORM_SECURITY_TOKEN');
    }

    public function Ping()
    {
        return $this->sendRequest('GET', '', [], [], false);
    }
}
