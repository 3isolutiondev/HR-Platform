<?php

namespace App\Services;

use App\Traits\UseExternalService;

class ContractService
{
    use UseExternalService;

    public $baseUri, $secret;

    public function __construct()
    {
        $this->baseUri = config('services.contracts.base_uri');
        $this->secret = config('services.contracts.secret');
    }

    public function index()
    {
        return $this->sendRequest('GET', '/contracts');
    }

    public function show(int $id)
    {
        return $this->sendRequest('GET', "/contracts/{$id}");
    }

    public function store($data)
    {
        return $this->sendRequest('POST','/contracts', $data);
    }

    public function update($data, int $id)
    {
        return $this->sendRequest('PUT', "/contracts/{$id}", $data);
    }

    public function destroy(int $id)
    {
        return $this->sendRequest("DELETE", "/contracts/{$id}");
    }

    public function nationalitiesOptions()
    {
        return $this->sendRequest("GET", '/contracts/nationalities-options');
    }

    public function allCountriesOptions()
    {
        return $this->sendRequest('GET', '/contracts/all-options');
    }
}
