<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Snappy PDF / Image Configuration
    |--------------------------------------------------------------------------
    |
    | This option contains settings for PDF generation.
    |
    | Enabled:
    |
    |    Whether to load PDF / Image generation.
    |
    | Binary:
    |
    |    The file path of the wkhtmltopdf / wkhtmltoimage executable.
    |
    | Timout:
    |
    |    The amount of time to wait (in seconds) before PDF / Image generation is stopped.
    |    Setting this to false disables the timeout (unlimited processing time).
    |
    | Options:
    |
    |    The wkhtmltopdf command options. These are passed directly to wkhtmltopdf.
    |    See https://wkhtmltopdf.org/usage/wkhtmltopdf.txt for all options.
    |
    | Env:
    |
    |    The environment variables to set while running the wkhtmltopdf process.
    |
    */

    'pdf' => [
        'enabled' => true,
        'binary'  => '/usr/local/bin/wkhtmltopdf',
        // 'binary' => base_path('vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64'),
        'timeout' => false,
        'options' => (env('SNAPPY_ACCESS_CSS_AND_IMAGE_FOR_DEV') == true || env('SNAPPY_ACCESS_CSS_AND_IMAGE_FOR_DEV') == 'true') ? 
        [
          'enable-local-file-access' => true,
          'orientation'   => 'landscape',
          'encoding'      => 'UTF-8'
        ] : [],
        'env'     => [],
    ],

    'image' => [
        'enabled' => true,
        'binary'  => '/usr/local/bin/wkhtmltoimage',
        // 'binary' => base_path('vendor/h4cc/wkhtmltoimage-amd64/bin/wkhtmltoimage-amd64'),
        'timeout' => false,
        'options' => (env('SNAPPY_ACCESS_CSS_AND_IMAGE_FOR_DEV') == true || env('SNAPPY_ACCESS_CSS_AND_IMAGE_FOR_DEV') == 'true') ? 
          [
            'enable-local-file-access' => true,
            'orientation'   => 'landscape',
            'encoding'      => 'UTF-8'
          ] : [],
        'env'     => [],
    ],
];