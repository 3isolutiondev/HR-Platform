<?php

namespace App\Services;

use Illuminate\Http\Request;
// use PhpOffice\PhpWord\TemplateProcessor;

class WordService 
{
    public static function fromTemplate($storage, $template, $values)
    {
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($template);
        $templateProcessor->setValues($values);
        $c = $templateProcessor->saveAs($storage);
    }
}