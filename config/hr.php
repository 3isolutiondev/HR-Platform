<?php

return [
    'requirements' => [
        'skill' => [
            'model' => 'App\Models\Skill',
            'search' => [
                'skill_id',
                'proficiency',
                'experience'
            ],
            'component' => 'ParameterSkill'
        ],
        'sector' => [
            'model' => 'App\Models\Sector',
            'search' => [
                'sector_id',
                'experience'
            ],
            'component' => 'ParameterSector'
        ],
        'language' => [
            'model' => 'App\Models\Language',
            'search' => [
                'language_id',
                'language_level_id',
                'is_mother_tongue',
            ],
            'component' => 'ParameterLanguage'
        ],
        'degree_level' => [
            'model' => 'App\Models\DegreeLevel',
            'search' => [
                'degree_level_id',
                'degree',
                'study'
            ], // degree and study from education university
            'component' => 'ParameterDegreeLevel'
        ]
    ],
    'retention_periods' => 5 // period in years
];
