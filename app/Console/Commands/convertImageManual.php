<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\DB;
use App\Models\Profile;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Console\Command;

class convertImageManual extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'convert-image:profile';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'convert image profile manually';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */

    function convert_to_normal_text($text) {

        $normal_characters = "a-zA-Z0-9\s`~!@#$%^&*()_+-={}|:;<>?,.\/\"\'\\\[\]";
        $normal_text = preg_replace("/[^$normal_characters]/", '', $text);
    
        return $normal_text;
    }

    public function cleanNonAsciiCharactersInString($orig_text) {

        $text = $orig_text;
    
        // Single letters
        $text = preg_replace("/[∂άαáàâãªä]/u",      "a", $text);
        $text = preg_replace("/[∆лДΛдАÁÀÂÃÄ]/u",     "A", $text);
        $text = preg_replace("/[ЂЪЬБъь]/u",           "b", $text);
        $text = preg_replace("/[βвВ]/u",            "B", $text);
        $text = preg_replace("/[çς©с]/u",            "c", $text);
        $text = preg_replace("/[ÇС]/u",              "C", $text);        
        $text = preg_replace("/[δ]/u",             "d", $text);
        $text = preg_replace("/[éèêëέëèεе℮ёєэЭ]/u", "e", $text);
        $text = preg_replace("/[ÉÈÊË€ξЄ€Е∑]/u",     "E", $text);
        $text = preg_replace("/[₣]/u",               "F", $text);
        $text = preg_replace("/[НнЊњ]/u",           "H", $text);
        $text = preg_replace("/[ђћЋ]/u",            "h", $text);
        $text = preg_replace("/[ÍÌÎÏ]/u",           "I", $text);
        $text = preg_replace("/[íìîïιίϊі]/u",       "i", $text);
        $text = preg_replace("/[Јј]/u",             "j", $text);
        $text = preg_replace("/[ΚЌК]/u",            'K', $text);
        $text = preg_replace("/[ќк]/u",             'k', $text);
        $text = preg_replace("/[ℓ∟]/u",             'l', $text);
        $text = preg_replace("/[Мм]/u",             "M", $text);
        $text = preg_replace("/[ñηήηπⁿ]/u",            "n", $text);
        $text = preg_replace("/[Ñ∏пПИЙийΝЛ]/u",       "N", $text);
        $text = preg_replace("/[óòôõºöοФσόо]/u", "o", $text);
        $text = preg_replace("/[ÓÒÔÕÖθΩθОΩ]/u",     "O", $text);
        $text = preg_replace("/[ρφрРф]/u",          "p", $text);
        $text = preg_replace("/[®яЯ]/u",              "R", $text); 
        $text = preg_replace("/[ГЃгѓ]/u",              "r", $text); 
        $text = preg_replace("/[Ѕ]/u",              "S", $text);
        $text = preg_replace("/[ѕ]/u",              "s", $text);
        $text = preg_replace("/[Тт]/u",              "T", $text);
        $text = preg_replace("/[τ†‡]/u",              "t", $text);
        $text = preg_replace("/[úùûüџμΰµυϋύ]/u",     "u", $text);
        $text = preg_replace("/[√]/u",               "v", $text);
        $text = preg_replace("/[ÚÙÛÜЏЦц]/u",         "U", $text);
        $text = preg_replace("/[Ψψωώẅẃẁщш]/u",      "w", $text);
        $text = preg_replace("/[ẀẄẂШЩ]/u",          "W", $text);
        $text = preg_replace("/[ΧχЖХж]/u",          "x", $text);
        $text = preg_replace("/[ỲΫ¥]/u",           "Y", $text);
        $text = preg_replace("/[ỳγўЎУуч]/u",       "y", $text);
        $text = preg_replace("/[ζ]/u",              "Z", $text);
    
        // Punctuation
        $text = preg_replace("/[‚‚]/u", ",", $text);        
        $text = preg_replace("/[`‛′’‘]/u", "'", $text);
        $text = preg_replace("/[″“”«»„]/u", '"', $text);
        $text = preg_replace("/[—–―−–‾⌐─↔→←]/u", '-', $text);
        $text = preg_replace("/[  ]/u", ' ', $text);
    
        $text = str_replace("…", "...", $text);
        $text = str_replace("≠", "!=", $text);
        $text = str_replace("≤", "<=", $text);
        $text = str_replace("≥", ">=", $text);
        $text = preg_replace("/[‗≈≡]/u", "=", $text);
    
    
        // Exciting combinations    
        $text = str_replace("ыЫ", "bl", $text);
        $text = str_replace("℅", "c/o", $text);
        $text = str_replace("₧", "Pts", $text);
        $text = str_replace("™", "tm", $text);
        $text = str_replace("№", "No", $text);        
        $text = str_replace("Ч", "4", $text);                
        $text = str_replace("‰", "%", $text);
        $text = preg_replace("/[∙•]/u", "*", $text);
        $text = str_replace("‹", "<", $text);
        $text = str_replace("›", ">", $text);
        $text = str_replace("‼", "!!", $text);
        $text = str_replace("⁄", "/", $text);
        $text = str_replace("∕", "/", $text);
        $text = str_replace("⅞", "7/8", $text);
        $text = str_replace("⅝", "5/8", $text);
        $text = str_replace("⅜", "3/8", $text);
        $text = str_replace("⅛", "1/8", $text);        
        $text = preg_replace("/[‰]/u", "%", $text);
        $text = preg_replace("/[Љљ]/u", "Ab", $text);
        $text = preg_replace("/[Юю]/u", "IO", $text);
        $text = preg_replace("/[ﬁﬂ]/u", "fi", $text);
        $text = preg_replace("/[зЗ]/u", "3", $text); 
        $text = str_replace("£", "(pounds)", $text);
        $text = str_replace("₤", "(lira)", $text);
        $text = preg_replace("/[‰]/u", "%", $text);
        $text = preg_replace("/[↨↕↓↑│]/u", "|", $text);
        $text = preg_replace("/[∞∩∫⌂⌠⌡]/u", "", $text);
    
    
        //2) Translation CP1252.
        $trans = get_html_translation_table(HTML_ENTITIES);
        $trans['f'] = '&fnof;';    // Latin Small Letter F With Hook
        $trans['-'] = array(
            '&hellip;',     // Horizontal Ellipsis
            '&tilde;',      // Small Tilde
            '&ndash;'       // Dash
            );
        $trans["+"] = '&dagger;';    // Dagger
        $trans['#'] = '&Dagger;';    // Double Dagger         
        $trans['M'] = '&permil;';    // Per Mille Sign
        $trans['S'] = '&Scaron;';    // Latin Capital Letter S With Caron        
        $trans['OE'] = '&OElig;';    // Latin Capital Ligature OE
        $trans["'"] = array(
            '&lsquo;',  // Left Single Quotation Mark
            '&rsquo;',  // Right Single Quotation Mark
            '&rsaquo;', // Single Right-Pointing Angle Quotation Mark
            '&sbquo;',  // Single Low-9 Quotation Mark
            '&circ;',   // Modifier Letter Circumflex Accent
            '&lsaquo;'  // Single Left-Pointing Angle Quotation Mark
            );
    
        $trans['"'] = array(
            '&ldquo;',  // Left Double Quotation Mark
            '&rdquo;',  // Right Double Quotation Mark
            '&bdquo;',  // Double Low-9 Quotation Mark
            );
    
        $trans['*'] = '&bull;';    // Bullet
        $trans['n'] = '&ndash;';    // En Dash
        $trans['m'] = '&mdash;';    // Em Dash        
        $trans['tm'] = '&trade;';    // Trade Mark Sign
        $trans['s'] = '&scaron;';    // Latin Small Letter S With Caron
        $trans['oe'] = '&oelig;';    // Latin Small Ligature OE
        $trans['Y'] = '&Yuml;';    // Latin Capital Letter Y With Diaeresis
        $trans['euro'] = '&euro;';    // euro currency symbol
        ksort($trans);
    
        foreach ($trans as $k => $v) {
            $text = str_replace($v, $k, $text);
        }
    
        // 3) remove <p>, <br/> ...
        $text = strip_tags($text);
    
        // 4) &amp; => & &quot; => '
        $text = html_entity_decode($text);
    
    
        return $text;
    }
    
    public function handle() {

        $path = storage_path()."/app/public";
       
        $result = scandir($path);
        foreach ($result as $dd) {
            
            if('.'!=$dd && '..'!=$dd && '.DS_Store'!=$dd && '.gitignore'!=$dd) {

                $getprofileid = DB::table('media')
                    ->select('id' ,'model_id', 'custom_properties', 'collection_name')
                    ->where('id', $dd)->get();

                foreach ($getprofileid as $ed) {
                    $decode = json_decode($ed->custom_properties);
                   //
                    if(empty($decode->generated_conversions) && $ed->collection_name=='photos') {
                        //read folder
                        $getfile = scandir($path.'/'.$dd);
                        // //loop file
                        foreach ($getfile as $file) {
                            
                            if('.'!=$file && '..'!=$file && '.DS_Store'!=$file && '.gitignore'!=$file) {
                                
                                if(mb_detect_encoding($file)!='ASCII') {

                                    $nfile = $this->convert_to_normal_text($file);
                                    rename($path.'/'.$dd.'/'.$file, $path.'/'.$dd.'/'.$nfile);
                                } else {
                                    $nfile = $file;
                                }

                                $filepath = $path.'/'.$dd.'/'.$nfile;
                                echo $dd.'-'.$nfile.PHP_EOL;
                              
                                $profile = Profile::findOrFail($ed->model_id);
                               
                                $profile->addMediaFromUrl($filepath)->toMediaCollection('photos', 's3'); 
                                
                                DB::table('media')->where('id', '=', $dd)->delete();
                                
                                File::deleteDirectory($path.'/'.$dd);
                               
                            }
                        }
                       
                    }
                    
                }
                
            }
            
        }
    }
}

