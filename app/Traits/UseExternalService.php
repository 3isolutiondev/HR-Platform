<?php

namespace App\Traits;

use GuzzleHttp\Client;

trait UseExternalService
{
    public function sendRequest($method, $requestUrl, $formParams = [],  $headers = [], bool $needResponse = true)
    {
        $client = new Client([
            'base_uri' => $this->baseUri,
        ]);

        if(isset($this->secret)) {
            $headers['Authorization'] = "Bearer " . $this->secret;
        }

        if ($needResponse) {
            $response = $client->request($method, $requestUrl, ['form_params' => $formParams, 'headers' => $headers]);

            return $response->getBody()->getContents();
        }

        $client->request($method, $requestUrl, ['form_params' => $formParams, 'headers' => $headers]);

        return true;
    }
}
