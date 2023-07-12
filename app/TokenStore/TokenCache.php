<?php

namespace App\TokenStore;

class TokenCache {

  public $baseUri, $secret;

  public function getAccessToken($graphKeys) {
    $now = time() + 300;
    $token = [];
    $token['access_token'] =  $graphKeys->microsoft_access_token;
    if(empty($graphKeys->microsoft_refresh_token)) return $token;
    if ($graphKeys->microsoft_token_expire <= $now) {
      $oauthClient = new \League\OAuth2\Client\Provider\GenericProvider([
        'clientId'                => config('microsoft_graph.CLIENT_ID'),
        'clientSecret'            => config('microsoft_graph.CLIENT_SECRET'),
        'redirectUri'             => config('microsoft_graph.REDIRECT_URI'),
        'urlAuthorize'            => config('microsoft_graph.URL_AUTHORIZE'),
        'urlAccessToken'          => config('microsoft_graph.URL_ACCESS_TOKEN'),
        'urlResourceOwnerDetails' => '',
        'scopes'                  => config('microsoft_graph.SCOPES')
      ]);

      try {
        $newToken = $oauthClient->getAccessToken('refresh_token', [
          'refresh_token' => $graphKeys->microsoft_refresh_token
        ]);

        $token['access_token'] = $newToken->getToken();
        $token['refresh_token'] = $newToken->getRefreshToken();
        $token['expires_in'] = $newToken->getExpires();
      }
      catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
        return '';
      }
    }

    return $token;
  }
}
