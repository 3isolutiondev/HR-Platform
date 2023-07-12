<?php

namespace App\Services;

use Microsoft\Graph\Model;
use Microsoft\Graph\Graph;

use App\TokenStore\TokenCache;
use Exception;
use Illuminate\Support\Facades\Log;

class CalendarService
{
  public function createNewEvent($event, $graphKeys)
  {
    $graphData = $this->getGraph($graphKeys);
    $graph = $graphData['graph'];
    $token = $graphData['token'];
    $attendees = [];
    $eventAttendees = env('APP_ENV') != "production" ? ['jchishugi@organization.org', 'mmetre@organization.org'] : $event->eventAttendees;

    foreach(array_unique($eventAttendees) as $attendeeAddress)
    {
      array_push($attendees, [
        'emailAddress' => [
          'address' => $attendeeAddress
        ],
        "Type" => "Resource"
      ]);
    }

    // Build the event
    $theNewEv = [
      'subject' => $event->eventSubject,
      'attendees' => $attendees,
      'start' => [
        'dateTime' => $event->eventStart,
        'timeZone' => $event->timezone
      ],
      'end' => [
        'dateTime' => $event->eventEnd,
        'timeZone' => $event->timezone
      ],
      'body' => [
        'content' => $event->eventBody,
        'contentType' => 'html'
      ],
      'isOnlineMeeting' => $event->isOnline,
      'onlineMeetingProvider' => "teamsForBusiness",
    ];

    if(isset($event->address)) {
      $theNewEv['location'] = [
        'displayName' => $event->address,
      ];
    }

    try {
      // POST /me/events
      $graph->createRequest('POST', '/me/events')
        ->attachBody($theNewEv)
        ->setReturnType(Model\Event::class)
        ->execute();
      return $token;
    } catch(Exception $err) {
      Log::info($err);
      return '';
    }
  }


  private function getGraph($graphKeys)
  {
    // Get the access token from the cache
    $tokenCache = new TokenCache();
    $token = $tokenCache->getAccessToken($graphKeys);
    // Create a Graph client
    $graph = new Graph();
    $graph->setAccessToken($token['access_token']);
    $data = [];
    $data['graph'] = $graph;
    $data['token'] = $token;
    return $data;
  }
}
