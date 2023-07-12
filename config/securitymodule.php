<?php

return [
    'travelPurposes' => [
        [ 'value' => 'start-of-contract', 'label' => 'Start of Contract', 'has_round_trip' => 0 ],
        [ 'value' => 'end-of-contract', 'label' => 'End of Contract', 'has_round_trip' => 0 ],
        [ 'value' => 'leave', 'label' => 'Leave', 'has_round_trip' => 1 ],
        [ 'value' => 'work-related', 'label' => 'Work Related', 'has_round_trip' => 1 ],
        [ 'value' => 'rr', 'label' => 'R&R', 'has_round_trip' => 1 ],
        [ 'value' => 'personal-reason', 'label' => 'Personal Reason', 'has_round_trip' => 1 ]
    ],
    'criticalMovements' => [
        [ 'value' => 'routine', 'label' => 'Routine' ],
        [ 'value' => 'essential', 'label' => 'Essential' ],
        [ 'value' => 'critical', 'label' => 'Critical' ]
    ],
    'movementStates' => [
        [ 'value' => 'low-risk', 'label' => 'Low Risk' ],
        [ 'value' => 'moderate-risk', 'label' => 'Moderate risk' ],
        [ 'value' => 'high-risk', 'label' => 'High Risk' ],
        [ 'value' => 'lock-down', 'label' => 'Lock Down' ]
    ],
    'securityMeasures' => [
        [ 'value' => 'single-vehicle-movement', 'label' => 'Single Vehicle Movement', 'is_multi_vehicle' => 0 ],
        [ 'value' => 'multiple-vehicle-movements', 'label' => 'Multiple Vehicle Movements', 'is_multi_vehicle' => 1 ],
        [ 'value' => 'use-of-hire-car', 'label' => 'Use of Hire Car', 'is_multi_vehicle' => 1 ]
    ],
    'labelByValue' => [
        'travelPurposes' => [
            'start-of-contract' => 'Start of Contract',
            'end-of-contract' => 'End of Contract',
            'leave' => 'Leave',
            'work-related' => 'Work Related',
            'rr' => 'R&R',
            'personal-reason' => 'Personal Reason'
        ],
        'criticalMovements' => [
            'routine' => 'Routine',
            'essential' => 'Essential',
            'critical' => 'Critical'
        ],
        'movementStates' => [
            'low-risk' => 'Low Risk',
            'moderate-risk' => 'Moderate risk',
            'high-risk' => 'High Risk',
            'lock-down' => 'Lock Down'
        ],
        'securityMeasures' => [
            'single-vehicle-movement' => 'Single Vehicle Movement',
            'multiple-vehicle-movements' => 'Multiple Vehicle Movements',
            'use-of-hire-car' => 'Use of Hire Car'
        ]
    ],
    'emailFooter' => 'iMMAP Security'
];
