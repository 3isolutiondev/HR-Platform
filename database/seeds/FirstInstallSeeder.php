<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Country;
use App\Models\Language;
use App\Models\LanguageLevel;
use App\Models\UNOrganization;
use App\Models\FieldOfWork;
use App\Models\Duration;
use App\Models\DegreeLevel;
use App\Models\Skill;
use App\Models\Sector;
use App\Models\ImmapOffice;
use App\Models\HR\HRJobLevel;
use App\Models\HR\HRJobCategory;
use App\Models\HR\HRJobCategorySection;
use App\Models\HR\HRJobStandard;
use App\Models\JobStatus;
use App\Models\Roster\RosterProcess;
use App\Models\Roster\RosterStep;
use App\Models\Quiz\QuizTemplate;
use App\Models\imtest\IMTestTemplate;
use App\Models\Setting;

class FirstInstallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // CREATE COUNTRY
        $countries = array(
            array('name' => 'Indonesia','slug' => 'indonesia','country_code' => 'id','nationality' => 'Indonesian','phone_code' => '+62','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/id.svg'),
            array('name' => 'Malaysia','slug' => 'malaysia','country_code' => 'my','nationality' => 'Malaysian','phone_code' => '+60','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/my.svg'),
            array('name' => 'Afghanistan','slug' => 'afghanistan','country_code' => 'af','nationality' => 'Afghan','phone_code' => '+93','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/af.svg'),
            array('name' => 'Albania','slug' => 'albania','country_code' => 'al','nationality' => 'Albanian','phone_code' => '+355','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/al.svg'),
            array('name' => 'Algeria','slug' => 'algeria','country_code' => 'dz','nationality' => 'Algerian','phone_code' => '+213','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/dz.svg'),
            array('name' => 'Argentina','slug' => 'argentina','country_code' => 'ar','nationality' => 'Argentinian','phone_code' => '+54','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ar.svg'),
            array('name' => 'Australia','slug' => 'australia','country_code' => 'au','nationality' => 'Australian','phone_code' => '+61','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/au.svg'),
            array('name' => 'Austria','slug' => 'austria','country_code' => 'at','nationality' => 'Austrian','phone_code' => '+43','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/at.svg'),
            array('name' => 'Bangladesh','slug' => 'bangladesh','country_code' => 'bd','nationality' => 'Bangladeshi','phone_code' => '+880','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bd.svg'),
            array('name' => 'Belgium','slug' => 'belgium','country_code' => 'be','nationality' => 'Belgian','phone_code' => '+32','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/be.svg'),
            array('name' => 'Bolivia','slug' => 'bolivia','country_code' => 'bo','nationality' => 'Bolivian','phone_code' => '+591','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bo.svg'),
            array('name' => 'Bostwana','slug' => 'bostwana','country_code' => 'bw','nationality' => 'Bostwanan','phone_code' => '+267','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bw.svg'),
            array('name' => 'Brazil','slug' => 'brazil','country_code' => 'br','nationality' => 'Brazilian','phone_code' => '+55','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/br.svg'),
            array('name' => 'Bulgaria','slug' => 'bulgaria','country_code' => 'bg','nationality' => 'Bulgarian','phone_code' => '+359','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bg.svg'),
            array('name' => 'Cambodia','slug' => 'cambodia','country_code' => 'kh','nationality' => 'Cambodian','phone_code' => '+855','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kh.svg'),
            array('name' => 'Cameroon','slug' => 'cameroon','country_code' => 'cm','nationality' => 'Cameroonian','phone_code' => '+237','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cm.svg'),
            array('name' => 'Canada','slug' => 'canada','country_code' => 'ca','nationality' => 'Canadian','phone_code' => '+1','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ca.svg'),
            array('name' => 'Chile','slug' => 'chile','country_code' => 'cl','nationality' => 'Chilean','phone_code' => '+56','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cl.svg'),
            array('name' => 'China','slug' => 'china','country_code' => 'cn','nationality' => 'Chinese','phone_code' => '+86','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cn.svg'),
            array('name' => 'Colombia','slug' => 'colombia','country_code' => 'co','nationality' => 'Colombian','phone_code' => '+57','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/co.svg'),
            array('name' => 'Costa Rica','slug' => 'costa-rica','country_code' => 'cr','nationality' => 'Costa Rican','phone_code' => '+506','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cr.svg'),
            array('name' => 'Croatia','slug' => 'croatia','country_code' => 'hr','nationality' => 'Croatian','phone_code' => '+385','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/hr.svg'),
            array('name' => 'Cuba','slug' => 'cuba','country_code' => 'cu','nationality' => 'Cuban','phone_code' => '+53','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cu.svg'),
            array('name' => 'Czech Republic','slug' => 'czech-republic','country_code' => 'cz','nationality' => 'Czech','phone_code' => '+420','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cz.svg'),
            array('name' => 'Denmark','slug' => 'denmark','country_code' => 'dk','nationality' => 'Danish','phone_code' => '+45','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/dk.svg'),
            array('name' => 'Dominica','slug' => 'dominica','country_code' => 'dm','nationality' => 'Dominican','phone_code' => '+1767','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/dm.svg'),
            array('name' => 'Ecuador','slug' => 'ecuador','country_code' => 'ec','nationality' => 'Ecuadorian','phone_code' => '+593','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ec.svg'),
            array('name' => 'Egypt','slug' => 'egypt','country_code' => 'eg','nationality' => 'Egyptian','phone_code' => '+20','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/eg.svg'),
            array('name' => 'El Salvador','slug' => 'el-salvador','country_code' => 'sv','nationality' => 'Salvadorian','phone_code' => '+503','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sv.svg'),
            array('name' => 'United Kingdom','slug' => 'united-kingdom','country_code' => 'gb','nationality' => 'British','phone_code' => '+44','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gb.svg'),
            array('name' => 'Estonia','slug' => 'estonia','country_code' => 'ee','nationality' => 'Estonian','phone_code' => '+372','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ee.svg'),
            array('name' => 'Ethiopia','slug' => 'ethiopia','country_code' => 'et','nationality' => 'Ethiopian','phone_code' => '+251','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/et.svg'),
            array('name' => 'Fiji','slug' => 'fiji','country_code' => 'fj','nationality' => 'Fijian','phone_code' => '+679','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fj.svg'),
            array('name' => 'Finland','slug' => 'finland','country_code' => 'fi','nationality' => 'Finnish','phone_code' => '+358','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fi.svg'),
            array('name' => 'France','slug' => 'france','country_code' => 'fr','nationality' => 'French','phone_code' => '+33','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fr.svg'),
            array('name' => 'Germany','slug' => 'germany','country_code' => 'de','nationality' => 'German','phone_code' => '+49','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/de.svg'),
            array('name' => 'Ghana','slug' => 'ghana','country_code' => 'gh','nationality' => 'Ghanaian','phone_code' => '+233','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gh.svg'),
            array('name' => 'Greece','slug' => 'greece','country_code' => 'gr','nationality' => 'Greek','phone_code' => '+30','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gr.svg'),
            array('name' => 'Guatemala','slug' => 'guatemala','country_code' => 'gt','nationality' => 'Guatemalan','phone_code' => '+502','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gt.svg'),
            array('name' => 'Haiti','slug' => 'haiti','country_code' => 'ht','nationality' => 'Haitian','phone_code' => '+509','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ht.svg'),
            array('name' => 'Honduras','slug' => 'honduras','country_code' => 'hn','nationality' => 'Honduran','phone_code' => '+504','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/hn.svg'),
            array('name' => 'Hungary','slug' => 'hungary','country_code' => 'hu','nationality' => 'Hungarian','phone_code' => '+36','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/hu.svg'),
            array('name' => 'Iceland','slug' => 'iceland','country_code' => 'is','nationality' => 'Icelandic','phone_code' => '+354','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/is.svg'),
            array('name' => 'India','slug' => 'india','country_code' => 'in','nationality' => 'Indian','phone_code' => '+91','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/in.svg'),
            array('name' => 'Iran','slug' => 'iran','country_code' => 'ir','nationality' => 'Iranian','phone_code' => '+98','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ir.svg'),
            array('name' => 'Iraq','slug' => 'iraq','country_code' => 'iq','nationality' => 'Iraqi','phone_code' => '+964','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/iq.svg'),
            array('name' => 'Ireland','slug' => 'ireland','country_code' => 'ie','nationality' => 'Irish','phone_code' => '+353','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ie.svg'),
            array('name' => 'Israel','slug' => 'israel','country_code' => 'il','nationality' => 'Israeli','phone_code' => '+972','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/il.svg'),
            array('name' => 'Italy','slug' => 'italy','country_code' => 'it','nationality' => 'Italian','phone_code' => '+39','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/it.svg'),
            array('name' => 'Jamaica','slug' => 'jamaica','country_code' => 'jm','nationality' => 'Jamaican','phone_code' => '+1876','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/jm.svg'),
            array('name' => 'Japan','slug' => 'japan','country_code' => 'jp','nationality' => 'Japanese','phone_code' => '+81','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/jp.svg'),
            array('name' => 'Jordan','slug' => 'jordan','country_code' => 'jo','nationality' => 'Jordanian','phone_code' => '+962','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/jo.svg'),
            array('name' => 'Kenya','slug' => 'kenya','country_code' => 'ke','nationality' => 'Kenyan','phone_code' => '+254','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ke.svg'),
            array('name' => 'Kuwait','slug' => 'kuwait','country_code' => 'kw','nationality' => 'Kuwaiti','phone_code' => '+965','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kw.svg'),
            array('name' => 'Laos','slug' => 'laos','country_code' => 'la','nationality' => 'Lao','phone_code' => '+856','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/la.svg'),
            array('name' => 'Latvia','slug' => 'latvia','country_code' => 'lv','nationality' => 'Latvian','phone_code' => '+371','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lv.svg'),
            array('name' => 'Lebanon','slug' => 'lebanon','country_code' => 'lb','nationality' => 'Lebanese','phone_code' => '+961','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lb.svg'),
            array('name' => 'Libya','slug' => 'libya','country_code' => 'ly','nationality' => 'Libyan','phone_code' => '+218','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ly.svg'),
            array('name' => 'Lithuania','slug' => 'lithuania','country_code' => 'lt','nationality' => 'Lithuanian','phone_code' => '+370','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lt.svg'),
            array('name' => 'Mali','slug' => 'mali','country_code' => 'ml','nationality' => 'Malian','phone_code' => '+223','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ml.svg'),
            array('name' => 'Malta','slug' => 'malta','country_code' => 'mt','nationality' => 'Maltese','phone_code' => '+356','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mt.svg'),
            array('name' => 'Mexico','slug' => 'mexico','country_code' => 'mx','nationality' => 'Mexican','phone_code' => '+52','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mx.svg'),
            array('name' => 'Mongolia','slug' => 'mongolia','country_code' => 'mn','nationality' => 'Mongolian','phone_code' => '+976','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mn.svg'),
            array('name' => 'Morocco','slug' => 'morocco','country_code' => 'ma','nationality' => 'Moroccan','phone_code' => '+212','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ma.svg'),
            array('name' => 'Mozambique','slug' => 'mozambique','country_code' => 'mz','nationality' => 'Mozambican','phone_code' => '+258','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mz.svg'),
            array('name' => 'Namibia','slug' => 'namibia','country_code' => 'na','nationality' => 'Namibian','phone_code' => '+264','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/na.svg'),
            array('name' => 'Nepal','slug' => 'nepal','country_code' => 'np','nationality' => 'Nepalese','phone_code' => '+977','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/np.svg'),
            array('name' => 'Netherlands','slug' => 'netherlands','country_code' => 'nl','nationality' => 'Dutch','phone_code' => '+31','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/nl.svg'),
            array('name' => 'New Zealand','slug' => 'new-zealand','country_code' => 'nz','nationality' => 'New Zealander','phone_code' => '+64','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/nz.svg'),
            array('name' => 'Nicaragua','slug' => 'nicaragua','country_code' => 'ni','nationality' => 'Nicaraguan','phone_code' => '+505','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ni.svg'),
            array('name' => 'Nigeria','slug' => 'nigeria','country_code' => 'ng','nationality' => 'Nigerian','phone_code' => '+234','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ng.svg'),
            array('name' => 'Norway','slug' => 'norway','country_code' => 'no','nationality' => 'Norwegian','phone_code' => '+47','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/no.svg'),
            array('name' => 'Pakistan','slug' => 'pakistan','country_code' => 'pk','nationality' => 'Pakistani','phone_code' => '+92','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pk.svg'),
            array('name' => 'Panama','slug' => 'panama','country_code' => 'pa','nationality' => 'Panamanian','phone_code' => '+507','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pa.svg'),
            array('name' => 'Paraguay','slug' => 'paraguay','country_code' => 'py','nationality' => 'Paraguayan','phone_code' => '+595','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/py.svg'),
            array('name' => 'Peru','slug' => 'peru','country_code' => 'pe','nationality' => 'Peruvian','phone_code' => '+51','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pe.svg'),
            array('name' => 'Philippines','slug' => 'philippines','country_code' => 'ph','nationality' => 'Philippine','phone_code' => '+63','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ph.svg'),
            array('name' => 'Poland','slug' => 'poland','country_code' => 'pl','nationality' => 'Polish','phone_code' => '+48','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pl.svg'),
            array('name' => 'Portugal','slug' => 'portugal','country_code' => 'pt','nationality' => 'Portuguese','phone_code' => '+351','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pt.svg'),
            array('name' => 'Romania','slug' => 'romania','country_code' => 'ro','nationality' => 'Romanian','phone_code' => '+40','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ro.svg'),
            array('name' => 'Russia','slug' => 'russia','country_code' => 'ru','nationality' => 'Russian','phone_code' => '+7','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ru.svg'),
            array('name' => 'Saudi Arabia','slug' => 'saudi-arabia','country_code' => 'sa','nationality' => 'Saudi','phone_code' => '+966','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sa.svg'),
            array('name' => 'Senegal','slug' => 'senegal','country_code' => 'sn','nationality' => 'Senegalese','phone_code' => '+221','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sn.svg'),
            array('name' => 'Serbia','slug' => 'serbia','country_code' => 'rs','nationality' => 'Serbian','phone_code' => '+381','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/rs.svg'),
            array('name' => 'Singapore','slug' => 'singapore','country_code' => 'sg','nationality' => 'Singaporean','phone_code' => '+65','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sg.svg'),
            array('name' => 'Slovakia','slug' => 'slovakia','country_code' => 'sk','nationality' => 'Slovakian','phone_code' => '+421','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sk.svg'),
            array('name' => 'South Africa','slug' => 'south-africa','country_code' => 'za','nationality' => 'South African','phone_code' => '+27','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/za.svg'),
            array('name' => 'South Korea','slug' => 'south-korea','country_code' => 'kr','nationality' => 'South Korean','phone_code' => '+82','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kr.svg'),
            array('name' => 'Sri Lanka','slug' => 'sri-lanka','country_code' => 'lk','nationality' => 'Sri Lankan','phone_code' => '+94','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lk.svg'),
            array('name' => 'Sudan','slug' => 'sudan','country_code' => 'sd','nationality' => 'Sudanese','phone_code' => '+249','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sd.svg'),
            array('name' => 'Sweden','slug' => 'sweden','country_code' => 'se','nationality' => 'Swedish','phone_code' => '+46','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/se.svg'),
            array('name' => 'Switzerland','slug' => 'switzerland','country_code' => 'ch','nationality' => 'Swiss','phone_code' => '+41','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ch.svg'),
            array('name' => 'Syria','slug' => 'syria','country_code' => 'sy','nationality' => 'Syrian','phone_code' => '+963','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sy.svg'),
            array('name' => 'Taiwan','slug' => 'taiwan','country_code' => 'tw','nationality' => 'Taiwanese','phone_code' => '+886','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tw.svg'),
            array('name' => 'Tajikistan','slug' => 'tajikistan','country_code' => 'tj','nationality' => 'Tajikistani','phone_code' => '+992','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tj.svg'),
            array('name' => 'Thailand','slug' => 'thailand','country_code' => 'th','nationality' => 'Thai','phone_code' => '+66','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/th.svg'),
            array('name' => 'Tonga','slug' => 'tonga','country_code' => 'to','nationality' => 'Tongan','phone_code' => '+676','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/to.svg'),
            array('name' => 'Tunisia','slug' => 'tunisia','country_code' => 'tn','nationality' => 'Tunisian','phone_code' => '+216','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tn.svg'),
            array('name' => 'Turkey','slug' => 'turkey','country_code' => 'tr','nationality' => 'Turkish','phone_code' => '+90','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tr.svg'),
            array('name' => 'Ukraine','slug' => 'ukraine','country_code' => 'ua','nationality' => 'Ukrainian','phone_code' => '+380','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ua.svg'),
            array('name' => 'United Arab Emirates','slug' => 'united-arab-emirates','country_code' => 'ae','nationality' => 'Emirati','phone_code' => '+971','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ae.svg'),
            array('name' => 'United States','slug' => 'united-states','country_code' => 'us','nationality' => 'American','phone_code' => '+1','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/us.svg'),
            array('name' => 'Uruguay','slug' => 'uruguay','country_code' => 'uy','nationality' => 'Uruguayan','phone_code' => '+598','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/uy.svg'),
            array('name' => 'Venezuela','slug' => 'venezuela','country_code' => 've','nationality' => 'Venezuelan','phone_code' => '58','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ve.svg'),
            array('name' => 'Vietnam','slug' => 'vietnam','country_code' => 'vn','nationality' => 'Vietnamese','phone_code' => '+84','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/vn.svg'),
            array('name' => 'Zambia','slug' => 'zambia','country_code' => 'zm','nationality' => 'Zambian','phone_code' => '+260','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/zm.svg'),
            array('name' => 'Zimbabwe','slug' => 'zimbabwe','country_code' => 'zw','nationality' => 'Zimbabwean','phone_code' => '+263','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/zw.svg'),
            array('name' => 'American Samoa','slug' => 'american-samoa','country_code' => 'as','nationality' => 'American Samoan','phone_code' => '+1684','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/as.svg'),
            array('name' => 'Andorra','slug' => 'andorra','country_code' => 'ad','nationality' => 'Andorran','phone_code' => '+376','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ad.svg'),
            array('name' => 'Angola','slug' => 'angola','country_code' => 'ao','nationality' => 'Angolan','phone_code' => '+244','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ao.svg'),
            array('name' => 'Anguilla','slug' => 'anguilla','country_code' => 'ai','nationality' => 'Anguillian','phone_code' => '+1264','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ai.svg'),
            array('name' => 'Antigua & Barbuda','slug' => 'antigua-barbuda','country_code' => 'ag','nationality' => 'Antiguan and Barbudan','phone_code' => '+1268','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ag.svg'),
            array('name' => 'Armenia','slug' => 'armenia','country_code' => 'am','nationality' => 'Armenian','phone_code' => '+374','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/am.svg'),
            array('name' => 'Aruba','slug' => 'aruba','country_code' => 'aw','nationality' => 'Aruban','phone_code' => '+297','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/aw.svg'),
            array('name' => 'Azerbaijan','slug' => 'azerbaijan','country_code' => 'az','nationality' => 'Azerbaijani','phone_code' => '+994','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/az.svg'),
            array('name' => 'Bahamas, The','slug' => 'bahamas-the','country_code' => 'bs','nationality' => 'Bahamians','phone_code' => '+1242','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bs.svg'),
            array('name' => 'Bahrain','slug' => 'bahrain','country_code' => 'bh','nationality' => 'Bahraini','phone_code' => '+973','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bh.svg'),
            array('name' => 'Barbados','slug' => 'barbados','country_code' => 'bb','nationality' => 'Barbadians','phone_code' => '+1246','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bb.svg'),
            array('name' => 'Belarus','slug' => 'belarus','country_code' => 'by','nationality' => 'Belarusian','phone_code' => '+375','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/by.svg'),
            array('name' => 'Belize','slug' => 'belize','country_code' => 'bz','nationality' => 'Belizean','phone_code' => '+501','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bz.svg'),
            array('name' => 'Benin','slug' => 'benin','country_code' => 'bj','nationality' => 'Beninese','phone_code' => '+229','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bj.svg'),
            array('name' => 'Bermuda','slug' => 'bermuda','country_code' => 'bm','nationality' => 'Bermudian','phone_code' => '+1441','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bm.svg'),
            array('name' => 'Bhutan','slug' => 'bhutan','country_code' => 'bt','nationality' => 'Bhutanese','phone_code' => '+975','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bt.svg'),
            array('name' => 'Bosnia & Herzegovina','slug' => 'bosnia-herzegovina','country_code' => 'ba','nationality' => 'Bosnian','phone_code' => '+387','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ba.svg'),
            array('name' => 'British Virgin Island','slug' => 'british-virgin-island','country_code' => 'vg','nationality' => 'British Virgin Islander','phone_code' => '+1284','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/vg.svg'),
            array('name' => 'Brunei','slug' => 'brunei','country_code' => 'bn','nationality' => 'Bruneian','phone_code' => '+673','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bn.svg'),
            array('name' => 'Burkina Faso','slug' => 'burkina-faso','country_code' => 'bf','nationality' => 'Burkinabé','phone_code' => '+226','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bf.svg'),
            array('name' => 'Burma','slug' => 'burma','country_code' => 'mm','nationality' => 'Burmese','phone_code' => '+95','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mm.svg'),
            array('name' => 'Burundi','slug' => 'burundi','country_code' => 'bi','nationality' => 'Burundian','phone_code' => '+257','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/bi.svg'),
            array('name' => 'Cape Verde','slug' => 'cape-verde','country_code' => 'cv','nationality' => 'Cape Verdeans','phone_code' => '+238','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cv.svg'),
            array('name' => 'Chad','slug' => 'chad','country_code' => 'td','nationality' => 'Chadian','phone_code' => '+235','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/td.svg'),
            array('name' => 'Comoros','slug' => 'comoros','country_code' => 'cm','nationality' => 'Comoran','phone_code' => '+269','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cm.svg'),
            array('name' => 'Cyprus','slug' => 'cyprus','country_code' => 'cy','nationality' => 'Cypriot','phone_code' => '+357','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cy.svg'),
            array('name' => 'Djibouti','slug' => 'djibouti','country_code' => 'dj','nationality' => 'Djiboutian','phone_code' => '+253','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/dj.svg'),
            array('name' => 'Dominican Republic','slug' => 'dominican-republic','country_code' => 'do','nationality' => 'Dominican (Rep)','phone_code' => '+809','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/do.svg'),
            array('name' => 'East Timor','slug' => 'east-timor','country_code' => 'tl','nationality' => 'Timorese','phone_code' => '+670','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tl.svg'),
            array('name' => 'Equatorial Guinea','slug' => 'equatorial-guinea','country_code' => 'gq','nationality' => 'Equatoguinean','phone_code' => '+240','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gq.svg'),
            array('name' => 'Eritrea','slug' => 'eritrea','country_code' => 'er','nationality' => 'Eritrean','phone_code' => '+291','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/er.svg'),
            array('name' => 'Faroe Island','slug' => 'faroe-island','country_code' => 'fo','nationality' => 'Faroe Islanders','phone_code' => '+298','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fo.svg'),
            array('name' => 'French Guiana','slug' => 'french-guiana','country_code' => 'gf','nationality' => 'French Guianese','phone_code' => '+594','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fr.svg'),
            array('name' => 'French Polynesia','slug' => 'french-polynesia','country_code' => 'pf','nationality' => 'French Polynesian','phone_code' => '+689','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pf.svg'),
            array('name' => 'Gabon','slug' => 'gabon','country_code' => 'ga','nationality' => 'Gabonese','phone_code' => '+241','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ga.svg'),
            array('name' => 'Gambia, The','slug' => 'gambia-the','country_code' => 'gm','nationality' => 'Gambian','phone_code' => '+220','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gm.svg'),
            array('name' => 'Georgia','slug' => 'georgia','country_code' => 'ge','nationality' => 'Georgians','phone_code' => '+995','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ge.svg'),
            array('name' => 'Gibraltar','slug' => 'gibraltar','country_code' => 'gi','nationality' => 'Gibraltarians','phone_code' => '+350','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gi.svg'),
            array('name' => 'Greenland','slug' => 'greenland','country_code' => 'gl','nationality' => 'Greenlanders','phone_code' => '+299','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gl.svg'),
            array('name' => 'Grenada','slug' => 'grenada','country_code' => 'gd','nationality' => 'Grenadian','phone_code' => '+1473','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gd.svg'),
            array('name' => 'Guadeloupe','slug' => 'guadeloupe','country_code' => 'gp','nationality' => 'Guadeloupean','phone_code' => '+590','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gp.svg'),
            array('name' => 'Guam','slug' => 'guam','country_code' => 'gu','nationality' => 'Guamanians','phone_code' => '+1671','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gu.svg'),
            array('name' => 'Guernsey','slug' => 'guernsey','country_code' => 'gg','nationality' => 'Guernsey','phone_code' => '+441481','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gg.svg'),
            array('name' => 'Guinea','slug' => 'guinea','country_code' => 'gn','nationality' => 'Guinean','phone_code' => '+224','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gn.svg'),
            array('name' => 'Guinea-Bissau','slug' => 'guinea-bissau','country_code' => 'gw','nationality' => 'Guinea-Bissau nationals','phone_code' => '+245','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pf.svg'),
            array('name' => 'Guyana','slug' => 'guyana','country_code' => 'gy','nationality' => 'Guyanese','phone_code' => '+592','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/gy.svg'),
            array('name' => 'Hong Kong','slug' => 'hong-kong','country_code' => 'hk','nationality' => 'Hongkongers','phone_code' => '+852','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/hk.svg'),
            array('name' => 'Isle of Man','slug' => 'isle-of-man','country_code' => 'im','nationality' => 'Manx','phone_code' => '+441624','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/im.svg'),
            array('name' => 'Jersey','slug' => 'jersey','country_code' => 'je','nationality' => 'Jersey','phone_code' => '+441534','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/je.svg'),
            array('name' => 'Kazakhstan','slug' => 'kazakhstan','country_code' => 'kz','nationality' => 'Kazakhstani','phone_code' => '+7','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kz.svg'),
            array('name' => 'Kiribati','slug' => 'kiribati','country_code' => 'ki','nationality' => 'I-Kiribati','phone_code' => '+686','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ki.svg'),
            array('name' => 'North Korea','slug' => 'north-korea','country_code' => 'kp','nationality' => 'North Korean','phone_code' => '+850','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kp.svg'),
            array('name' => 'Kyrgyzstan','slug' => 'kyrgyzstan','country_code' => 'kg','nationality' => 'Kyrgyz','phone_code' => '+996','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kg.svg'),
            array('name' => 'Lesotho','slug' => 'lesotho','country_code' => 'ls','nationality' => 'Basotho','phone_code' => '+266','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ls.svg'),
            array('name' => 'Liberia','slug' => 'liberia','country_code' => 'lr','nationality' => 'Liberian','phone_code' => '+231','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lr.svg'),
            array('name' => 'Liechtenstein','slug' => 'liechtenstein','country_code' => 'li','nationality' => 'Liechtensteiner','phone_code' => '+423','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/li.svg'),
            array('name' => 'Luxembourg','slug' => 'luxembourg','country_code' => 'lu','nationality' => 'Luxembourgers','phone_code' => '+352','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lu.svg'),
            array('name' => 'Macau','slug' => 'macau','country_code' => 'mo','nationality' => 'Macanese','phone_code' => '+853','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mo.svg'),
            array('name' => 'Macedonia','slug' => 'macedonia','country_code' => 'mk','nationality' => 'Macedonian','phone_code' => '+389','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mk.svg'),
            array('name' => 'Madagascar','slug' => 'madagascar','country_code' => 'mg','nationality' => 'Madagascan','phone_code' => '+261','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mg.svg'),
            array('name' => 'Malawi','slug' => 'malawi','country_code' => 'mw','nationality' => 'Malawian','phone_code' => '+265','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mw.svg'),
            array('name' => 'Maldives','slug' => 'maldives','country_code' => 'mv','nationality' => 'Maldivian','phone_code' => '+960','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mv.svg'),
            array('name' => 'Marshall Islands','slug' => 'marshall-islands','country_code' => 'mh','nationality' => 'Marshallese','phone_code' => '+692','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mh.svg'),
            array('name' => 'Martinique','slug' => 'martinique','country_code' => 'mq','nationality' => 'Martinican','phone_code' => '+596','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mq.svg'),
            array('name' => 'Mauritania','slug' => 'mauritania','country_code' => 'mr','nationality' => 'Mauritanian','phone_code' => '+222','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mr.svg'),
            array('name' => 'Mauritius','slug' => 'mauritius','country_code' => 'mu','nationality' => 'Mauritian','phone_code' => '+230','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mu.svg'),
            array('name' => 'Mayotte','slug' => 'mayotte','country_code' => 'yt','nationality' => 'Mayotte','phone_code' => '+262','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/yt.svg'),
            array('name' => 'Micronesia, Fed. St.','slug' => 'micronesia-fed-st','country_code' => 'fm','nationality' => 'Micronesian','phone_code' => '+691','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/fm.svg'),
            array('name' => 'Moldova','slug' => 'moldova','country_code' => 'md','nationality' => 'Moldovan','phone_code' => '+373','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/md.svg'),
            array('name' => 'Monaco','slug' => 'monaco','country_code' => 'mc','nationality' => 'Monégasque','phone_code' => '+377','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mc.svg'),
            array('name' => 'Montserrat','slug' => 'montserrat','country_code' => 'ms','nationality' => 'Montserratian','phone_code' => '+1664','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ms.svg'),
            array('name' => 'Nauru','slug' => 'nauru','country_code' => 'nr','nationality' => 'Nauruan','phone_code' => '+674','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/nr.svg'),
            array('name' => 'New Caledonia','slug' => 'new-caledonia','country_code' => 'nc','nationality' => 'New Caledonian','phone_code' => '+687','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/nc.svg'),
            array('name' => 'Niger','slug' => 'niger','country_code' => 'ne','nationality' => 'Nigerien','phone_code' => '+227','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ne.svg'),
            array('name' => 'Northern Mariana Island','slug' => 'northern-mariana-island','country_code' => 'mp','nationality' => 'Northern Marianas','phone_code' => '+1670','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/mp.svg'),
            array('name' => 'Oman','slug' => 'oman','country_code' => 'om','nationality' => 'Omani','phone_code' => '+968','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/om.svg'),
            array('name' => 'Palau','slug' => 'palau','country_code' => 'pw','nationality' => 'Palauan','phone_code' => '+680','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pw.svg'),
            array('name' => 'Papua New Guinea','slug' => 'papua-new-guinea','country_code' => 'pg','nationality' => 'Papua New Guineans','phone_code' => '+675','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pg.svg'),
            array('name' => 'Puerto Rico','slug' => 'puerto-rico','country_code' => 'pr','nationality' => 'Puerto Ricans','phone_code' => '+1787','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pr.svg'),
            array('name' => 'Qatar','slug' => 'qatar','country_code' => 'qa','nationality' => 'Qatari','phone_code' => '+974','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/qa.svg'),
            array('name' => 'Reunion','slug' => 'reunion','country_code' => 're','nationality' => 'Reunionese','phone_code' => '+262','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/re.svg'),
            array('name' => 'Rwanda','slug' => 'rwanda','country_code' => 'rw','nationality' => 'Rwandan','phone_code' => '+250','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/rw.svg'),
            array('name' => 'Saint Helena','slug' => 'saint-helena','country_code' => 'sh','nationality' => 'Saint Helenian','phone_code' => '+290','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sh.svg'),
            array('name' => 'Saint Kitts & Nevis','slug' => 'saint-kitts-nevis','country_code' => 'kn','nationality' => 'Saint Kitts & Nevis','phone_code' => '+1869','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/kn.svg'),
            array('name' => 'Saint Lucia','slug' => 'saint-lucia','country_code' => 'lc','nationality' => 'Saint Lucian','phone_code' => '+1758','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/lc.svg'),
            array('name' => 'Saint Pierre & Miquelon','slug' => 'saint-pierre-miquelon','country_code' => 'pm','nationality' => 'Saint Pierre & Miquelon','phone_code' => '+508','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/pm.svg'),
            array('name' => 'Saint Vincent and the Grenadines','slug' => 'saint-vincent-and-the-grenadines','country_code' => 'vc','nationality' => 'Vincentians','phone_code' => '+1784','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/vc.svg'),
            array('name' => 'Samoa','slug' => 'samoa','country_code' => 'ws','nationality' => 'Samoan','phone_code' => '+685','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ws.svg'),
            array('name' => 'San Marino','slug' => 'san-marino','country_code' => 'sm','nationality' => 'Sammarinese','phone_code' => '+378','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sm.svg'),
            array('name' => 'Sao Tome & Principe','slug' => 'sao-tome-principe','country_code' => 'st','nationality' => 'Sao Tomean','phone_code' => '+239','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/st.svg'),
            array('name' => 'Seychelles','slug' => 'seychelles','country_code' => 'sc','nationality' => 'Seychellois','phone_code' => '+248','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sc.svg'),
            array('name' => 'Sierra Leone','slug' => 'sierra-leone','country_code' => 'sl','nationality' => 'Sierra Leonean','phone_code' => '+232','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sl.svg'),
            array('name' => 'Slovenia','slug' => 'slovenia','country_code' => 'si','nationality' => 'Slovenian','phone_code' => '+386','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/si.svg'),
            array('name' => 'Solomon Island','slug' => 'solomon-island','country_code' => 'sb','nationality' => 'Solomon Islander','phone_code' => '+677','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sb.svg'),
            array('name' => 'Somalia','slug' => 'somalia','country_code' => 'so','nationality' => 'Somalian','phone_code' => '+252','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/so.svg'),
            array('name' => 'Spain','slug' => 'spain','country_code' => 'es','nationality' => 'Spanish','phone_code' => '+34','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/es.svg'),
            array('name' => 'Surname','slug' => 'surname','country_code' => 'sr','nationality' => 'Surnamese','phone_code' => '+597','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sr.svg'),
            array('name' => 'Swaziland','slug' => 'swaziland','country_code' => 'sz','nationality' => 'Swazi','phone_code' => '+268','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/sz.svg'),
            array('name' => 'Tanzania','slug' => 'tanzania','country_code' => 'tz','nationality' => 'Tanzanian','phone_code' => '+255','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tz.svg'),
            array('name' => 'Togo','slug' => 'togo','country_code' => 'tg','nationality' => 'Togolese','phone_code' => '+228','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tg.svg'),
            array('name' => 'Trinidad and Tobago','slug' => 'trinidad-and-tobago','country_code' => 'tt','nationality' => 'Trinidadians and Tobagonians','phone_code' => '+1868','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tt.svg'),
            array('name' => 'Turkmenistan','slug' => 'turkmenistan','country_code' => 'tm','nationality' => 'Turkmen','phone_code' => '+993','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tm.svg'),
            array('name' => 'Turks and Caicos Island','slug' => 'turks-and-caicos-island','country_code' => 'tc','nationality' => 'Turks and Caicos Islanders','phone_code' => '+1649','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tc.svg'),
            array('name' => 'Tuvalu','slug' => 'tuvalu','country_code' => 'tv','nationality' => 'Tuvaluan','phone_code' => '+688','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/tv.svg'),
            array('name' => 'Uganda','slug' => 'uganda','country_code' => 'ug','nationality' => 'Ugandan','phone_code' => '+256','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ug.svg'),
            array('name' => 'Uzbekistan','slug' => 'uzbekistan','country_code' => 'uz','nationality' => 'Uzbek','phone_code' => '+998','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/uz.svg'),
            array('name' => 'Vanuatu','slug' => 'vanuatu','country_code' => 'vu','nationality' => 'Vanuatuan','phone_code' => '+678','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/vu.svg'),
            array('name' => 'Yemen','slug' => 'yemen','country_code' => 'ye','nationality' => 'Yemeni','phone_code' => '+967','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ye.svg'),
            array('name' => 'US Virgin Island','slug' => 'us-virgin-island','country_code' => 'vi','nationality' => 'US Virgin Islanders','phone_code' => '+1340','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/vi.svg'),
            array('name' => 'Wallis and Futuna','slug' => 'wallis-and-futuna','country_code' => 'wf','nationality' => 'Wallisian and Futunan','phone_code' => '+681','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/wf.svg'),
            array('name' => 'Palestina','slug' => 'palestina','country_code' => 'ps','nationality' => 'Palestinian','phone_code' => '+970','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ps.svg'),
            array('name' => 'Western Sahara','slug' => 'western-sahara','country_code' => 'eh','nationality' => 'Sahrawi','phone_code' => '+212','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/eh.svg'),
            array('name' => 'South Sudan','slug' => 'south-sudan','country_code' => 'ss','nationality' => 'South Sudanese','phone_code' => '+211','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ss.svg'),
            array('name' => 'Ivory Coast','slug' => 'ivory-coast','country_code' => 'ci','nationality' => 'Ivorian','phone_code' => '+225','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/ci.svg'),
            array('name' => 'Republic of the Congo (Congo-Brazzaville)','slug' => 'republic-of-the-congo-congo-brazzaville','country_code' => 'cg','nationality' => 'Congolese','phone_code' => '+242','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cg.svg'),
            array('name' => 'Democratic Republic of the Congo','slug' => 'democratic-republic-of-the-congo','country_code' => 'cd','nationality' => 'Congolese','phone_code' => '+243','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cd.svg'),
            array('name' => 'Central African Republic','slug' => 'central-african-republic','country_code' => 'cf','nationality' => 'Central African','phone_code' => '+236','flag' => 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/cf.svg'),
            array('name' => 'Home Based', 'slug' => 'home-based', 'country_code' => 'n/a', 'nationality' => 'n/a', 'phone_code' => 'n/a', 'flag' => 'https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/1.28.0/icons/home.svg')
        );

        Country::insert($countries);

        // IMMAP OFFICE
        $immap_offices = [
            ['city' => 'Kabul', 'is_active' => 1, 'is_hq' => 0],
            ['city' => "Cox's Bazar", 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Bogota', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Addis Ababa', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Marseille', 'is_active' => 1, 'is_hq' => 1],
            ['city' => 'Erbil/Basra', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Amman', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Abuja/Maiduguri', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Geneva', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Syria', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Bangkok', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Washington DC', 'is_active' => 1, 'is_hq' => 1],
            ['city' => "Sana'a", 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Home Based', 'is_active' => 1, 'is_hq' => 0],
            ['city' => 'Turkey', 'is_active' => 0, 'is_hq' => 0]
        ];

        $ceo_immap_offices = [];
        $sbpp_immap_offices = [];
        $admin_immap_offices = [];
        $manager_immap_offices = [];

        foreach($immap_offices as $office) {
            if ($office['city'] == 'Kabul') {
                $country = Country::where('slug', 'afghanistan')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == "Cox's Bazar") {
                $country = Country::where('slug', 'bangladesh')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Bogota') {
                $country = Country::where('slug', 'colombia')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Addis Ababa') {
                $country = Country::where('slug', 'ethiopia')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Marseille') {
                $country = Country::where('slug', 'france')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Erbil/Basra') {
                $country = Country::where('slug', 'iraq')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Amman') {
                $country = Country::where('slug', 'jordan')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
            }

            if ($office['city'] == 'Abuja/Maiduguri') {
                $country = Country::where('slug', 'nigeria')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Geneva') {
                $country = Country::where('slug', 'switzerland')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Syria') {
                $country = Country::where('slug', 'syria')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Bangkok') {
                $country = Country::where('slug', 'thailand')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Washington DC') {
                $country = Country::where('slug', 'united-states')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == "Sana'a") {
                $country = Country::where('slug', 'yemen')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Home Based') {
                $country = Country::where('slug', 'home-based')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($ceo_immap_offices, $record->id);
                array_push($sbpp_immap_offices, $record->id);
                array_push($manager_immap_offices, $record->id);
                array_push($admin_immap_offices, $record->id);
            }

            if ($office['city'] == 'Turkey') {
                $country = Country::where('slug', 'turkey')->first();
                $office['country_id'] = $country->id;
                $record = ImmapOffice::create($office);
                array_push($admin_immap_offices, $record->id);
            }

        }


        // JOB STATUS
        $job_status_data = [
            [ 'status' => 'Accepted', 'slug' => 'accepted', 'default_status' => 0, 'last_step' => 1, 'order' => 3, 'is_interview' => 0 ],
            [ 'status' => 'Interview', 'slug' => 'interview', 'default_status' => 0, 'last_step' => 0, 'order' => 2, 'is_interview' => 1 ],
            [ 'status' => 'Rejected', 'slug' => 'rejected', 'default_status' => 0, 'last_step' => 0, 'order' => 4, 'is_interview' => 0 ],
            [ 'status' => 'Active', 'slug' => 'active', 'default_status' => 1, 'last_step' => 0, 'order' => 0, 'is_interview' => 0 ],
            [ 'status' => 'Shortlisted', 'slug' => 'shortlisted', 'default_status' => 0, 'last_step' => 0, 'order' => 1, 'is_interview' => 0 ]
        ];

        JobStatus::insert($job_status_data);

        // LANGUAGE
        $languages = array(
            array('name' => 'Bahasa','slug' => 'bahasa'),
            array('name' => 'English','slug' => 'english'),
            array('name' => 'Spanish','slug' => 'spanish'),
            array('name' => 'French','slug' => 'french'),
            array('name' => 'Arabic','slug' => 'arabic'),
            array('name' => 'Mandarin Chinese','slug' => 'mandarin-chinese'),
            array('name' => 'German','slug' => 'german'),
            array('name' => 'Russian','slug' => 'russian'),
            array('name' => 'Portuguese','slug' => 'portuguese'),
            array('name' => 'Akan','slug' => 'akan'),
            array('name' => 'Albanian','slug' => 'albanian'),
            array('name' => 'Amis','slug' => 'amis'),
            array('name' => 'Arabic, Algerian Spoken','slug' => 'arabic-algerian-spoken'),
            array('name' => 'Arabic, Baharna Spoken','slug' => 'arabic-baharna-spoken'),
            array('name' => 'Arabic, Egyptian Spoken','slug' => 'arabic-egyptian-spoken'),
            array('name' => 'Armenian','slug' => 'armenian'),
            array('name' => 'Australian','slug' => 'australian'),
            array('name' => 'Azerbaijani, North','slug' => 'azerbaijani-north'),
            array('name' => 'Bavarian','slug' => 'bavarian'),
            array('name' => 'Belarusan','slug' => 'belarusan'),
            array('name' => 'Bengali','slug' => 'bengali'),
            array('name' => 'Beti','slug' => 'beti'),
            array('name' => 'Bosnian','slug' => 'bosnian'),
            array('name' => 'Bribi','slug' => 'bribi'),
            array('name' => 'Bube','slug' => 'bube'),
            array('name' => 'Bulgarian','slug' => 'bulgarian'),
            array('name' => 'Burmese','slug' => 'burmese'),
            array('name' => 'Carib','slug' => 'carib'),
            array('name' => 'Central Algonquian','slug' => 'central-algonquian'),
            array('name' => 'Central K\'iche\' (Mayan)','slug' => 'central-kiche-mayan'),
            array('name' => 'Cherokee','slug' => 'cherokee'),
            array('name' => 'Chibchan','slug' => 'chibchan'),
            array('name' => 'Chimborazo Highland Quichua','slug' => 'chimborazo-highland-quichua'),
            array('name' => 'Comorian','slug' => 'comorian'),
            array('name' => 'Croatian','slug' => 'croatian'),
            array('name' => 'Cusco Quechua','slug' => 'cusco-quechua'),
            array('name' => 'Czech','slug' => 'czech'),
            array('name' => 'Danish','slug' => 'danish'),
            array('name' => 'Dutch','slug' => 'dutch'),
            array('name' => 'Dzonghka','slug' => 'dzonghka'),
            array('name' => 'Estonian','slug' => 'estonian'),
            array('name' => 'Ewe','slug' => 'ewe'),
            array('name' => 'Fijian','slug' => 'fijian'),
            array('name' => 'Finnish','slug' => 'finnish'),
            array('name' => 'Ganda','slug' => 'ganda'),
            array('name' => 'Georgian','slug' => 'georgian'),
            array('name' => 'Greek','slug' => 'greek'),
            array('name' => 'Hausa','slug' => 'hausa'),
            array('name' => 'Hindi','slug' => 'hindi'),
            array('name' => 'Hungarian','slug' => 'hungarian'),
            array('name' => 'Icelandic','slug' => 'icelandic'),
            array('name' => 'Irish','slug' => 'irish'),
            array('name' => 'Island Carib','slug' => 'island-carib'),
            array('name' => 'Italian','slug' => 'italian'),
            array('name' => 'Japanese','slug' => 'japanese'),
            array('name' => 'Javanese','slug' => 'javanese'),
            array('name' => 'Kalanga','slug' => 'kalanga'),
            array('name' => 'Kazah','slug' => 'kazah'),
            array('name' => 'Khmer, Central','slug' => 'khmer-central'),
            array('name' => 'Kikuyu','slug' => 'kikuyu'),
            array('name' => 'Kirgyz','slug' => 'kirgyz'),
            array('name' => 'Koongo','slug' => 'koongo'),
            array('name' => 'Korean','slug' => 'korean'),
            array('name' => 'Lao','slug' => 'lao'),
            array('name' => 'Latvian','slug' => 'latvian'),
            array('name' => 'Lenca','slug' => 'lenca'),
            array('name' => 'Liberia Kpelle','slug' => 'liberia-kpelle'),
            array('name' => 'Lithuanian','slug' => 'lithuanian'),
            array('name' => 'Luba-Kasai','slug' => 'luba-kasai'),
            array('name' => 'Luxembourgeois','slug' => 'luxembourgeois'),
            array('name' => 'Macedonian','slug' => 'macedonian'),
            array('name' => 'Makhuwa','slug' => 'makhuwa'),
            array('name' => 'Malagasy','slug' => 'malagasy'),
            array('name' => 'Malay','slug' => 'malay'),
            array('name' => 'Maltese','slug' => 'maltese'),
            array('name' => 'Mandinka','slug' => 'mandinka'),
            array('name' => 'Maninka','slug' => 'maninka'),
            array('name' => 'Manza','slug' => 'manza'),
            array('name' => 'Maori','slug' => 'maori'),
            array('name' => 'Mapudungun','slug' => 'mapudungun'),
            array('name' => 'Mayan','slug' => 'mayan'),
            array('name' => 'Mbere','slug' => 'mbere'),
            array('name' => 'Mbundu','slug' => 'mbundu'),
            array('name' => 'Miskito','slug' => 'miskito'),
            array('name' => 'Mongolian, Halh','slug' => 'mongolian-halh'),
            array('name' => 'MÒORÉ','slug' => 'moore'),
            array('name' => 'Nahuatl','slug' => 'nahuatl'),
            array('name' => 'Nepali','slug' => 'nepali'),
            array('name' => 'Ngabere','slug' => 'ngabere'),
            array('name' => 'Ngambay','slug' => 'ngambay'),
            array('name' => 'Norwegian','slug' => 'norwegian'),
            array('name' => 'Nyanja','slug' => 'nyanja'),
            array('name' => 'Oromo','slug' => 'oromo'),
            array('name' => 'Panjabi','slug' => 'panjabi'),
            array('name' => 'Papuan','slug' => 'papuan'),
            array('name' => 'Pashto','slug' => 'pashto'),
            array('name' => 'Pipil','slug' => 'pipil'),
            array('name' => 'Polish','slug' => 'polish'),
            array('name' => 'Pulaar','slug' => 'pulaar'),
            array('name' => 'Quechua','slug' => 'quechua'),
            array('name' => 'Rarotongan','slug' => 'rarotongan'),
            array('name' => 'Romanian','slug' => 'romanian'),
            array('name' => 'Rundi','slug' => 'rundi'),
            array('name' => 'Russian','slug' => 'russian-1'),
            array('name' => 'Rwanda','slug' => 'rwanda'),
            array('name' => 'Samoan','slug' => 'samoan'),
            array('name' => 'Senoufo','slug' => 'senoufo'),
            array('name' => 'Serbian','slug' => 'serbian'),
            array('name' => 'Shona','slug' => 'shona'),
            array('name' => 'Sinhala','slug' => 'sinhala'),
            array('name' => 'Slovak','slug' => 'slovak'),
            array('name' => 'Slovenian','slug' => 'slovenian'),
            array('name' => 'Somali','slug' => 'somali'),
            array('name' => 'Sotho','slug' => 'sotho'),
            array('name' => 'Sukuma','slug' => 'sukuma'),
            array('name' => 'Swedish','slug' => 'swedish'),
            array('name' => 'Swiss German','slug' => 'swiss-german'),
            array('name' => 'Tagalog','slug' => 'tagalog'),
            array('name' => 'Tajiki','slug' => 'tajiki'),
            array('name' => 'Temne','slug' => 'temne'),
            array('name' => 'Tetun','slug' => 'tetun'),
            array('name' => 'Thai','slug' => 'thai'),
            array('name' => 'Tigrinya','slug' => 'tigrinya'),
            array('name' => 'Tongan','slug' => 'tongan'),
            array('name' => 'Tupi-Guarani','slug' => 'tupi-guarani'),
            array('name' => 'Turkish','slug' => 'turkish'),
            array('name' => 'Turkmen','slug' => 'turkmen'),
            array('name' => 'Ukrainian','slug' => 'ukrainian'),
            array('name' => 'Uzbek','slug' => 'uzbek'),
            array('name' => 'Vietnamese','slug' => 'vietnamese'),
            array('name' => 'Wayuu','slug' => 'wayuu'),
            array('name' => 'Wolof','slug' => 'wolof'),
            array('name' => 'Zulu','slug' => 'zulu'),
            array('name' => 'Dari','slug' => 'dari'),
            array('name' => 'Kurdish','slug' => 'kurdish'),
          );

        Language::insert($languages);

        LanguageLevel::insert([
            ['name' => 'Basic', 'slug' => 'basic', 'order' => 0],
            ['name' => 'Intermediate', 'slug' => 'intermediate', 'order' => 1],
            ['name' => 'Advanced', 'slug' => 'advanced', 'order' => 2]
        ]);


        // UN Org
        $un_organizations = array(
            array('name' => 'Food and Agriculture Organization','slug' => 'food-and-agriculture-organization','abbreviation' => 'FAO'),
            array('name' => 'International Civil Aviation Organization','slug' => 'international-civil-aviation-organization','abbreviation' => 'ICAO'),
            array('name' => 'International Fund for Agricultural Development','slug' => 'international-fund-for-agricultural-development','abbreviation' => 'IFAD'),
            array('name' => 'International Labour Organization','slug' => 'international-labour-organization','abbreviation' => 'ILO'),
            array('name' => 'International Maritime Organization','slug' => 'international-maritime-organization','abbreviation' => 'IMO'),
            array('name' => 'International Monetary Fund','slug' => 'international-monetary-fund','abbreviation' => 'IMF'),
            array('name' => 'International Telecommunication Union','slug' => 'international-telecommunication-union','abbreviation' => 'ITU'),
            array('name' => 'United Nations Educational, Scientific and Cultural Organization','slug' => 'united-nations-educational-scientific-and-cultural-organization','abbreviation' => 'UNESCO'),
            array('name' => 'United Nations Industrial Development Organization','slug' => 'united-nations-industrial-development-organization','abbreviation' => 'UNIDO'),
            array('name' => 'Universal Postal Union','slug' => 'universal-postal-union','abbreviation' => 'UPU'),
            array('name' => 'World Bank Group','slug' => 'world-bank-group','abbreviation' => 'WBG'),
            array('name' => 'World Health Organization','slug' => 'world-health-organization','abbreviation' => 'WHO'),
            array('name' => 'World Intellectual Property Organization','slug' => 'world-intellectual-property-organization','abbreviation' => 'WIPO'),
            array('name' => 'World Meteorological Organization','slug' => 'world-meteorological-organization','abbreviation' => 'WMO'),
            array('name' => 'World Tourism Organization','slug' => 'world-tourism-organization','abbreviation' => 'UNWTO'),
            array('name' => 'United Nations','slug' => 'united-nations','abbreviation' => 'UN'),
            array('name' => 'International Organization for Migration','slug' => 'international-organization-for-migration','abbreviation' => 'IOM'),
            array('name' => 'World Trade Organization','slug' => 'world-trade-organization','abbreviation' => 'WTO'),
            array('name' => 'International Atomic Energy Agency','slug' => 'international-atomic-energy-agency','abbreviation' => 'IAEA'),
            array('name' => 'UN Habitat','slug' => 'un-habitat','abbreviation' => 'UNH')
          );

        UNOrganization::insert($un_organizations);

        // SECTOR
        $sectors = array(
            array('name' => 'Nutrition','slug' => 'nutrition','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'WASH','slug' => 'wash','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Health','slug' => 'health','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Education','slug' => 'education','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Food Security','slug' => 'food-security','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Agriculture','slug' => 'agriculture','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Cash','slug' => 'cash','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Early Recovery','slug' => 'early-recovery','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Camp Management','slug' => 'camp-management','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Logistics','slug' => 'logistics','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Shelter','slug' => 'shelter','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Emergency Telecommunication','slug' => 'emergency-telecommunication','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Mine Action','slug' => 'mine-action','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Public Health Information Services','slug' => 'public-health-information-services','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Development','slug' => 'development','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Inter-sector Coordination','slug' => 'inter-sector-coordination','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Protection','slug' => 'protection','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Private Sector','slug' => 'private-sector','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Climate Change and Environment','slug' => 'climate-change-and-environment','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Coordination','slug' => 'coordination','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Disaster Management','slug' => 'disaster-management','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Food and Nutrition','slug' => 'food-and-nutrition','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'HIV / AIDS','slug' => 'hiv-aids','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Peacekeeping and Peacebuilding','slug' => 'peacekeeping-and-peacebuilding','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Protection and Human Rights','slug' => 'protection-and-human-rights','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Recovery and Reconstruction','slug' => 'recovery-and-reconstruction','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Safety and Security','slug' => 'safety-and-security','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Shelter and Non-Food Items','slug' => 'shelter-and-non-food-items','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Water Sanitation Hygiene','slug' => 'water-sanitation-hygiene','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Research and analysis','slug' => 'research-and-analysis','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Population monitoring','slug' => 'population-monitoring','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Early warning','slug' => 'early-warning','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Market Analysis','slug' => 'market-analysis','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Urban Profiling','slug' => 'urban-profiling','is_approved' => 1,'addedBy' => 'immap'),
            array('name' => 'Gender-based violence','slug' => 'gender-based-violence','is_approved' => 1,'addedBy' => 'immap')
          );

        Sector::insert($sectors);

        //Field of Works
        $field_of_works = array(
            array('field' => 'economy','slug' => 'economy','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'health','slug' => 'health','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'wash','slug' => 'wash','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'eco','slug' => 'eco','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'ecology','slug' => 'ecology','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'education','slug' => 'education','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'computer','slug' => 'computer','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'software development','slug' => 'software-development','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'software','slug' => 'software','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'information technology','slug' => 'information-technology','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'information system','slug' => 'information-system','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'HR','slug' => 'hr','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'Administration','slug' => 'administration','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Finance','slug' => 'finance','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'gis','slug' => 'gis','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'Communications','slug' => 'communications','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Design','slug' => 'design','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Clerk','slug' => 'clerk','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'ednsfkljgnsd','slug' => 'ednsfkljgnsd','is_approved' => 0,'addedBy' => 'immap'),
            array('field' => 'Data Management','slug' => 'data-management','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'gRPC','slug' => 'grpc','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Data Collections','slug' => 'data-collections','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Data Entry','slug' => 'data-entry','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Coordination','slug' => 'coordination','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Cartography','slug' => 'cartography','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Infography','slug' => 'infography','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Strategy','slug' => 'strategy','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Engineering','slug' => 'engineering','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Management','slug' => 'management','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Data Visualisation','slug' => 'data-visualisation','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Legal','slug' => 'legal','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Logistics','slug' => 'logistics','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Web Development','slug' => 'web-development','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Capacity Building','slug' => 'capacity-building','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Business Development','slug' => 'business-development','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Monitoring and Evaluation','slug' => 'monitoring-and-evaluation','is_approved' => 1,'addedBy' => 'immap'),
            array('field' => 'Painting','slug' => 'painting','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Modelisme','slug' => 'modelisme','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'gardening','slug' => 'gardening','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Electronic','slug' => 'electronic','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'swimming','slug' => 'swimming','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Data Mining','slug' => 'data-mining','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Readings','slug' => 'readings','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Hiking','slug' => 'hiking','is_approved' => 0,'addedBy' => 'others'),
            array('field' => 'Coding','slug' => 'coding','is_approved' => 0,'addedBy' => 'others')
          );

        FieldOfWork::insert($field_of_works);

        // DURATION
        $durations = array(
            array('name' => 'Part Time'),
            array('name' => 'Full Time')
          );

        Duration::insert($durations);

        // DEGREE LEVEL
        $degree_levels = array(
            array('name' => 'Diploma','slug' => 'diploma','order' => 0),
            array('name' => 'Bachelor','slug' => 'bachelor','order' => 1),
            array('name' => 'Master','slug' => 'master','order' => 2),
            array('name' => 'Doctor','slug' => 'doctor','order' => 3)
          );

        DegreeLevel::insert($degree_levels);

        // SKILL
        $skills = array(
            array('skill' => 'Communications','slug' => 'communications','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'reactjs','slug' => 'reactjs','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'webGIS','slug' => 'webgis','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'angular','slug' => 'angular','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'react','slug' => 'react','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'react native','slug' => 'react-native','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'ArcGIS','slug' => 'arcgis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'computer','slug' => 'computer','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'management','slug' => 'management','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'python','slug' => 'python','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'R','slug' => 'r','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'C++','slug' => 'c','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'PHP','slug' => 'php','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'vuejs','slug' => 'vuejs','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'laravel','slug' => 'laravel','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'website development','slug' => 'website-development','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'software','slug' => 'software','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'software development','slug' => 'software-development','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'web development','slug' => 'web-development','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'Project Management','slug' => 'project-management','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'django','slug' => 'django','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'r language','slug' => 'r-language','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'Microsoft Office Suites','slug' => 'microsoft-office-suites','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'HR','slug' => 'hr','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'QGIS','slug' => 'qgis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Microsoft Word','slug' => 'microsoft-word','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Microsoft Excel','slug' => 'microsoft-excel','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'wordpress','slug' => 'wordpress','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'ubuntu','slug' => 'ubuntu','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'iOS','slug' => 'ios','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'Android','slug' => 'android','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'Cuisine','slug' => 'cuisine','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'multivariate','slug' => 'multivariate','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'data','slug' => 'data','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'IM','slug' => 'im','skill_for_matching' => 0,'addedBy' => 'immap'),
            array('skill' => 'Coordination','slug' => 'coordination','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Leadership','slug' => 'leadership','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Market analysis','slug' => 'market-analysis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Contextual analysis','slug' => 'contextual-analysis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Experience in humanitarian crises','slug' => 'experience-in-humanitarian-crises','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Experience in development','slug' => 'experience-in-development','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Kobo','slug' => 'kobo','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'IMSMA','slug' => 'imsma','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'SPSS','slug' => 'spss','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'GIS','slug' => 'gis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Data analysis','slug' => 'data-analysis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Adobe Illustrator','slug' => 'adobe-illustrator','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'MySQL','slug' => 'mysql','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Capacity strengthening','slug' => 'capacity-strengthening','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Web design','slug' => 'web-design','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Database design','slug' => 'database-design','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Software solutions','slug' => 'software-solutions','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Conducting trainings on the use and development of information management tools and platforms','slug' => 'conducting-trainings-on-the-use-and-development-of-information-management-tools-and-platforms','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Liaising with counterparts in government','slug' => 'liaising-with-counterparts-in-government','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Teamwork','slug' => 'teamwork','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'ESRI technical products and tools','slug' => 'esri-technical-products-and-tools','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Microsoft SQL Server','slug' => 'microsoft-sql-server','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'SAS','slug' => 'sas','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'PowerBI','slug' => 'powerbi','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'ONA','slug' => 'ona','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'ODK','slug' => 'odk','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'PostGIS','slug' => 'postgis','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'CSS3','slug' => 'css3','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Openlayers','slug' => 'openlayers','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Linux servers (SLES and Centos)','slug' => 'linux-servers-sles-and-centos','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'JQuery','slug' => 'jquery','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Bootstrap','slug' => 'bootstrap','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Leaflet','slug' => 'leaflet','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Mapserver','slug' => 'mapserver','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'PostgreSQL','slug' => 'postgresql','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Adobe Photoshop','slug' => 'adobe-photoshop','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Planning and Organising','slug' => 'planning-and-organising','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Client Orientation','slug' => 'client-orientation','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Technological awareness','slug' => 'technological-awareness','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Representation','slug' => 'representation','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Flexible','slug' => 'flexible','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Technical writing','slug' => 'technical-writing','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Self drive','slug' => 'self-drive','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Networking and Coordination','slug' => 'networking-and-coordination','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Self Reliant','slug' => 'self-reliant','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Cultural Awareness','slug' => 'cultural-awareness','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Gender Awareness','slug' => 'gender-awareness','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Analytical Skills','slug' => 'analytical-skills','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'Creativity','slug' => 'creativity','skill_for_matching' => 1,'addedBy' => 'immap'),
            array('skill' => 'painting','slug' => 'painting','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'swimming','slug' => 'swimming','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'data mining','slug' => 'data-mining','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'litterature','slug' => 'litterature','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'writting','slug' => 'writting','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'fishing','slug' => 'fishing','skill_for_matching' => 0,'addedBy' => 'others'),
            array('skill' => 'accontancy','slug' => 'accontancy','skill_for_matching' => 0,'addedBy' => 'others')
          );

        Skill::insert($skills);

        // Job Level
        $hr_job_levels = array(
            array('name' => 'Officer','slug' => 'officer'),
            array('name' => 'Manager','slug' => 'manager'),
            array('name' => 'Coordinator','slug' => 'coordinator'),
            array('name' => 'Advisor','slug' => 'advisor'),
            array('name' => 'Assistant','slug' => 'assistant'),
            array('name' => 'Clerck','slug' => 'clerck')
          );

        HRJobLevel::insert($hr_job_levels);

         // JOB CATEGORY
         $hr_job_categories = array(
            array('name' => 'Information Management','slug' => 'information-management'),
            array('name' => 'Developer','slug' => 'developer'),
            array('name' => 'Geographic Information System','slug' => 'geographic-information-system'),
            array('name' => 'Data Analyst','slug' => 'data-analyst'),
            array('name' => 'Data Entry Clerk','slug' => 'data-entry-clerk'),
            array('name' => 'Field Security','slug' => 'field-security'),
            array('name' => 'Capacity Building','slug' => 'capacity-building'),
            array('name' => 'Context analyst / Political and conflict analyst','slug' => 'context-analyst-political-and-conflict-analyst'),
            array('name' => 'Programme / Business Development','slug' => 'programme-business-development'),
            array('name' => 'Communications','slug' => 'communications'),
            array('name' => 'Country Representative','slug' => 'country-representative'),
            array('name' => 'Administration','slug' => 'administration')
          );

          $hr_job_category_sections = [
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Presentation','sub_section_content' => '<p><em>Additionally, the IMO is tasked to improve the accuracy of the data held by iMMAP and to improve and effectiveness the distribution of materials.</em></p><p><em>The IMO will support all goals and strategies of the iMMAP programme in its work with national partners, international partners and applicable donor agencies.</em></p><p><em>The IMO will develop and maintain constant and good contacts with humanitarian partners.</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">The IMO will proactively gather information from sector partners, government authorities which may be of use to the sector for informing decisions;</li><li class="ql-indent-1">The IMO will identify gaps in current implementing partner participants and will engage with NGOs, humanitarian and development organisations to restore renew or join participation in data sharing or IM support.</li><li class="ql-indent-1">The IMO will identify barriers for information collection, collation, analysis and sharing.</li><li class="ql-indent-1">The IMO will ensure timely preparation and generation of information products, and support on information sharing and dissemination through web platforms to all relevant humanitarian implementing partners.</li><li class="ql-indent-1">The IMO will adapt appropriate existing IM tools including those available in-country (including from other sectors) and global level. As appropriate, design of data collection forms, ensuring that the purpose and use of all data collected is clear, collectable and easily collectable, highlighting where potential problems might arise; organise and manage the data input and initial analysis and presentation of data for the sector;</li><li class="ql-indent-1">The IMO will develop standard formats for, and regular output of publication of materials and statistics highlighting the humanitarian situation in country upon request.</li><li class="ql-indent-1">The IMO will facilitate mobile data collection, form development and data management.</li><li class="ql-indent-1">The IMO will generate statistical reports, graphs, maps and follow up on cluster specific trends.</li><li class="ql-indent-1">The IMO will support new and ongoing assessments.</li><li class="ql-indent-1">Collect and consolidate data from various partners, prepare and submit reports on regular bases</li><li class="ql-indent-1">Manage, analyse, document data and information from INGOs interventions in North East Syria</li><li class="ql-indent-1">Map assistance coverage in specified area, analyse and report the potential gaps</li><li class="ql-indent-1">Produce, share maps illustrating scale/coverage of assistance</li><li class="ql-indent-1">Record, document and share coordination meeting minutes</li><li class="ql-indent-1">Maintain data bases, provide data entry if required</li><li class="ql-indent-1">Establish and maintain filing and documentation system accessible for humanitarian partners working in the area</li></ul><p><br></p><p><br></p><ul><li><strong>Mapping - specific</strong></li><li class="ql-indent-1">The IMO will develop maps of 4Ws, sector resources, needs, Gaps per location;</li><li class="ql-indent-1">The IMO will maintain geospatial databases and ensure data quality and integrity through the use of automated and manual techniques to enter, edit and process data sets;&nbsp;</li></ul><p><br></p><p><br></p><ul><li><strong>Representation</strong></li><li class="ql-indent-1">The IMO will attend periodic information management meetings with the 3iSolution IMO team and country director to share updates on ongoing IM products and activities and promote good practices in the organisation.</li><li class="ql-indent-1">The IMO will participate in XXXXX cluster meetings and/or the IM working group.</li><li class="ql-indent-1">The IMO will provide specific, sometimes dedicated, support to other agencies, when required.</li></ul><p><br></p><p><br></p><ul><li><strong>National capacity building / Training - specific</strong></li><li class="ql-indent-1">The IMO will mentor iMMAP national staff to build capacity to include but not be limited to:</li><li class="ql-indent-2">GIS and data management</li><li class="ql-indent-2">Geospatial analysis and data analysis</li><li class="ql-indent-1">The IMO will work to build a national staff trained to be able to fulfil the information management duties assigned to him/her, through guidance, training and technical support.</li><li class="ql-indent-1">The IMO will conduct iMMAP demonstrations and training sessions.</li></ul><p><br></p><p><br></p><ul><li><strong>Cluster – specific</strong></li><li class="ql-indent-1">The IMO will integrate cluster‐related and partners’ data on the information system developed by iMMAP.</li><li class="ql-indent-1">The IMO will creation and develop of custom reports and map layers requested by either the clusters or the implementing partners or country director.</li><li class="ql-indent-1">The IMO will advise on the design, developing and/or customisation of databases/dashboard from the reporting clusters or implementing partners or country director.</li><li class="ql-indent-1">The IMO will ensure that all support requirements of iMMAP and other organisations are met in a timely and efficient manner.</li><li class="ql-indent-1">The IMO will maintain Contact directories of sector humanitarian partners.</li><li class="ql-indent-1">The IMO will create or maintain the who does What Where When (4W) database and derivative products, such as maps.</li><li class="ql-indent-1">The IMO will aggregate and maintain inter-country information for education sector partners including data needed for situation analysis, response monitoring reports and common Sector data sets, including population data disaggregated by age and sex.</li><li class="ql-indent-1">The IMO will identify needs and gaps for the sector.</li><li class="ql-indent-1">The IMO will support development of sector monitoring reporting (PMR, humanitarian dashboard, etc.) in consultation with the sector coordinator, partners and other key stakeholders.</li></ul><p><br></p><p><br></p><ul><li><strong>Mine Action – specific</strong></li><li class="ql-indent-1">The IMO will develop country base maps as it relates to mine and ERW data.</li><li class="ql-indent-1">Liaise with the mine action implementing partners’ information technology and information management unit to ensure that the minimum information technology infrastructure requirements of IMSMA are supported by all HMA offices.</li><li class="ql-indent-1">The IMO will develop IMSMA analytical products and reports for stakeholders.</li></ul><p><br></p><p><br></p><ul><li><strong>Health – specific</strong></li><li class="ql-indent-1">The IMO will maintain updated databases on the health situation</li><li class="ql-indent-1">The IMO will prepare a monthly sitrep on the health situation of people in need related to the XXX crisis in XXXX, including highlights in priority areas</li></ul>','level' => '2')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<ul><li><strong>Operational</strong></li><li class="ql-indent-1">Develop visualisation tools based on the Ushahidi platform related to the Venezuela crisis in Colombia.</li><li class="ql-indent-1">Provide maintenance, support, development and improvements to the Integrated Information System. sidi.umaic.org (login: demo, pass: demo), prioritizing the 4W project module</li><li><strong>Maintenance – specific</strong></li><li class="ql-indent-1">Implement and execute a database backup plan (MySQL) of all systems</li><li class="ql-indent-1">Implement some type of profiler for Apache, PHP and MySQL to improve the performance of the systems</li><li><strong>Online reporting tool – specific</strong></li><li class="ql-indent-1">Configure and maintain the online reporting tool, ReportHub, for target county implementations to support humanitarian reporting of partners including;</li><li><strong>Full stack– specific</strong></li><li class="ql-indent-1">Configure and maintain the online reporting tool, ReportHub, for target county implementations to support humanitarian reporting of partners including;</li><li class="ql-indent-2">Country and cluster level indicators, beneficiary groups, facility types and site level reporting locations</li><li class="ql-indent-2">User interface and database updates.</li><li class="ql-indent-1">Further extend and develop additional data collection and analysis modules, RestAPIs and features into ReportHub as required by stakeholders to support humanitarian reporting.</li><li class="ql-indent-1">Design and develop training materials and conduct training and capacity building of partners to ensure partners are able to successfully report on activities.</li><li class="ql-indent-1">Requirements gathering and implementation for real-time reporting and statistical analysis in country level contexts based on the country level Humanitarian Response Plan (HRP).</li><li class="ql-indent-1">Server setup, administration, management and optimization including documentation.</li><li class="ql-indent-1">Data Platform software development under TDD approach following the Agile process with task breakdowns, sprint goals and sprint reviews.</li><li class="ql-indent-1">Identification of new technologies and methods to improve the maintainability and scalability of the application.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">University degree in Information Technology, mathematics, statistics or related area.</li><li class="ql-indent-1"><strong>Full stack – specific:</strong></li><li class="ql-indent-2">University degree in Information Technology, mathematics, statistics or related area.</li><li class="ql-indent-1"><strong>Experience</strong></li><li class="ql-indent-2">Mastery of the principles of data handling and processing.</li><li class="ql-indent-2">Minimum XXX years’ experience in web development</li><li class="ql-indent-3">frontend / backend.</li><li class="ql-indent-2">Extensive experience in:</li><li class="ql-indent-3">PHP</li><li class="ql-indent-3">MySQL</li><li class="ql-indent-3">Linux servers (SLES and Centos)</li><li class="ql-indent-3">JQuery</li><li class="ql-indent-3">CSS3</li><li class="ql-indent-3">Bootstrap</li><li class="ql-indent-3">Openlayers</li><li class="ql-indent-3">Leaflet</li><li class="ql-indent-3">Mapserver</li><li class="ql-indent-3">PostgreSQL</li><li class="ql-indent-3">PostGIS</li><li class="ql-indent-2">Experience in bash Linux programming and proactivity to automate scripting repetitive office tasks.</li><li class="ql-indent-2"><strong>Web – specific:</strong></li><li class="ql-indent-3">XXX years of relevant work experience in the design and implementation of web development applications</li><li class="ql-indent-2"><strong>Full stack – specific:</strong></li><li class="ql-indent-3">XXX years of relevant work experience in the design and implementation of web development applications.</li><li class="ql-indent-3">Experience developing, documenting and maintaining RESTful API data services.</li><li class="ql-indent-3">Experience in the design and implementation training and capacity building.</li><li class="ql-indent-3">Experience with Agile development and Test-Driven Development (TDD) approach.</li><li class="ql-indent-3">Experience with HTML, CSS, Material Design, JavaScript, ES6, TypeScript, Gulp, Bower, xlsForms (Kobo, ONA, ODK).</li><li class="ql-indent-3">Experience with location-based data storage, data formats, manipulation and analysis.</li><li class="ql-indent-3">Experience with training and capacity building.</li><li class="ql-indent-3">Knowledge of UN cluster approach.</li><li class="ql-indent-3">Knowledge of PostGIS, and spatial coordinate reference systems</li><li class="ql-indent-2"><strong>Soft skills</strong></li><li class="ql-indent-3">Ability to work in an organized manner, can carry several projects at the same time, work under pressure and meet deadlines.</li><li class="ql-indent-3">Ability to communicate, in an effective and visually creative way, information and ideas in a written and oral manner.</li><li class="ql-indent-2"><strong>Programmes</strong></li><li class="ql-indent-3"><strong>﻿</strong>Experience with Git, Linux, PostgreSQL / PostGIS, MongoDB, Node.js, AngularJS</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<ul><li><strong>Operational</strong></li><li class="ql-indent-1">Complete the qualitative and quantitative database cleanup process</li><li class="ql-indent-1">Perform a monthly audit of information to ensure data completeness, integrity and quality.</li><li class="ql-indent-1">Coordinate the installation of the IMSMA system, developing the database and making sure that the overall system is operational and meets the operational needs.</li><li class="ql-indent-1">Prepare maps to show all YYY activity integrated with related factors and data analysis on GIS.</li><li class="ql-indent-1">Provide monthly data analysis maps based on monthly standard reports for current hazards area contamination.</li><li class="ql-indent-1">Coordination and control of all GIS functionalities with all the YYY staff and iMMAP staff.</li><li class="ql-indent-1">Provide direction and GIS guidance to the YYY director.</li><li class="ql-indent-1">Ensure the successful implementation of the standard working procedures for information management and GIS within national mine action office.</li><li class="ql-indent-1">Assist the Technical Advisor with the development of GIS training packages and conducting different level for national mine action staff.</li><li class="ql-indent-1">Ability to visit remote provinces whenever required for any Information Management technical issues.</li><li class="ql-indent-1">Assist the information management technical advisor in developing the work plan and highlight technical requirements to improve capacity building.</li><li class="ql-indent-1">Complete additional tasks assigned by the information management technical advisor and Country representative.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Graduate of an Institute or University in the field of Information Technology, Information Management or Computer Sciences.</li><li class="ql-indent-1">At least XXX years of working experience with GIS on field operational level and in a multi-cultural environment.</li><li><strong>Experience</strong></li><li class="ql-indent-1">In-depth knowledge of database and GIS software, and computer networks, Good knowledge of related hardware and peripheral equipment.</li><li class="ql-indent-1">Very good ability in topographical map reading.</li><li class="ql-indent-1">Understanding of data QA/QC processes for information management are essential.</li><li class="ql-indent-1">Possess advanced skills in MS-Access, MS SQL Server, Web design.</li><li class="ql-indent-1">Advanced knowledge of software engineering theory and applications would be an asset.</li><li class="ql-indent-1">Advanced knowledge of programming theory and relational database principles.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Ability to coordinate with local administrators, government, NGOs working with community projects and agencies involved in mine-action.</li><li class="ql-indent-1">Ability to work under pressure and long hours at different locations.</li><li class="ql-indent-1">Flexible and adaptable to any situation.</li><li class="ql-indent-1">Self-reliant and able to work independently.</li><li><strong>Programmes</strong></li><li class="ql-indent-1">ArcGIS</li><li class="ql-indent-1">QGIS</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The data analyst will support coordination in the collection of information on XXXX, prepare reports, products and narratives of the situation of mixed flows.</p><p><br></p><p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">Compilation and processing of information on the flows and sectoral needs.</li><li class="ql-indent-1">Prepare relevant data analysis</li><li class="ql-indent-1">Identify and manage information exchange flows with key organisations or institutions that provide context information</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Bachelor\'s degree in economics, statistics, political science, social sciences and other similar areas</li><li><strong>Experience</strong></li><li class="ql-indent-1">Background in the construction of information exchange agreements</li><li class="ql-indent-1">A minimum of XX years of work experience, experience with the United Nations system and humanitarian work is desirable.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Excellent analytical capacity and clear writing</li><li class="ql-indent-1">Effective communication skills to work among clusters, agencies and the government</li><li class="ql-indent-1">Training capabilities to teach partners how to use the necessary tools</li><li class="ql-indent-1">Good organizational skills to deliver products on time and with quality</li><li><strong>Programmes</strong></li><li class="ql-indent-1"><strong>﻿</strong>Microsoft Office, especially Excel, the knowledge in other tools and data programme is valued</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">Receiving and verifying reports from officers and enter data into database.</li><li class="ql-indent-1">Maintain a high standard for the database and GIS capabilities.</li><li class="ql-indent-1">Perform checks of all operation reports to ensure the quality of data.</li><li class="ql-indent-1">Assist the staff in completing and updating all the data fields in database.</li><li class="ql-indent-1">Prepare all weekly and monthly reports on data entry section in database for the office review.</li><li class="ql-indent-1">Complete additional tasks assigned by the line manager.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Graduate or under graduate of an Institute or University in related field with at least 1 years or work experience in the field of data management</li><li><strong>Experience</strong></li><li class="ql-indent-1">Excellent computer skills in the Windows and Microsoft Office especially MS Excel and MS Access.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Ability to work independently while under pressure and during long hours.</li><li class="ql-indent-1">Have excellent work habits with a willingness to work in a multi-cultural environment</li><li class="ql-indent-1">Able to travel to all provinces in Iraq for any data entry support.</li><li><strong>Programmes</strong></li><li class="ql-indent-1">Basic skills in using ArcGIS software.</li><li class="ql-indent-1">Flexible and adaptable to any situation.</li><li><strong>Languages</strong></li><li class="ql-indent-1"><strong>﻿</strong>Ability to translate Arabic to English and English to Arabic</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p>iMMAP is an international non governmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The Field Security Officer (FSO) will work with the iMMAP team to ensure the safety and security of all in-country staff.&nbsp;</p><p>The primary function of the FSO is to provide assistance to XXX on all safety and security issues, and accompany XXX on travel inside XXX and countries in the region. The FSO will monitor and assess local security conditions and make recommendations to XXX and the Global Security Manager as appropriate.</p><p>The FSO is committed to implementing and maintaining the highest standards of security and contingency planning in order to ensure the safety of all staff in country.</p><p><br></p><p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">The FSO will monitor the security situation in country, and provide sound and timely advice to staff and management on safety and security matters.</li><li class="ql-indent-1">The FSO will conduct risk assessments prior to travel, and accompany XXX during travel in country, and internationally.</li><li class="ql-indent-1">The FSO will assist with the authorisation process of field visits, and assist in tracking of staff movements.</li><li class="ql-indent-1">The FSO will maintain contacts with local and national authorities and international state and non-state actors, compiling threat analysis, incident reports and routine security reports.</li><li class="ql-indent-1">The FSO will liaise and coordinate timely and efficiently with the line manager and the Global Security Manager regarding security incidents, threats or deficiencies which potentially could affect operations.</li><li class="ql-indent-1">The FSO will ensure the implementation of safety and security policies and standard operating procedures (SOPs) as detailed by the Global Security Manager.</li><li class="ql-indent-1">The FSO will conduct security induction briefs for new staff, and security update briefs for existing staff.</li><li class="ql-indent-1">The FSO shall assist with monitoring all staff movements in country in close coordination with the iMMAP HQ Security Coordinator and ensure that staff follow travel authorisation protocols. In case of emergencies, the FSO shall liaise with local actors and the iMMAP Security Department.</li><li class="ql-indent-1">The FSO will design and practice emergency systems, emergency communications and provisioning of emergency supplies for all staff.</li><li class="ql-indent-1">The FSO will maintain the validity of emergency &amp; contingencies protocols based on the applicable Evacuation &amp; Contingency level, and conduct security training, exercise immediate action drills and regularly conduct emergency drills as prescribed in the Project Security Plan.</li><li class="ql-indent-1">The FSO will ensure that communication protocols are implemented, and project warden lists are up to date.</li><li class="ql-indent-1">The FSO will liaise with other humanitarian and emergency actors as well as international and national governments on safety and security matters.</li><li class="ql-indent-1">The FSO will perform other duties as assigned by the line manager Global Security Manager.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Ability to provide a clear Criminal Record Check,</strong></li><li><strong>Ability to provide honourable discharge papers, if a previous member of Armed Forces or Police Service.</strong></li><li><strong>Experience</strong></li><li class="ql-indent-1"><strong>Considerable practical experience of managing security in complex contexts and high-risk environments;</strong></li><li class="ql-indent-1"><strong>A minimum of </strong>XXX years of relevant experience with demonstrated knowledge and understanding of working in the safety and security sector</li><li class="ql-indent-1">Former military or police, or extensive experience as an NGO security officer or with a Private Security Company;</li><li class="ql-indent-1">Previous experience working in international non-governmental organisation is preferred;</li><li class="ql-indent-1">Strong analytical skills and ability to interpret and analyse data and translate into effective information;</li><li><strong>Soft skills </strong></li><li><strong>Ability to interact effectively with international and national personnel;</strong></li><li><strong>Ability to work well in a small team, operate under pressure, prioritise and deliver high quality work within deadlines, and meet team objectives; </strong></li></ul><p><br></p><p><br></p><ul><li class="ql-indent-1"><strong> </strong></li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p>Country specific</p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The incumbent will support and effectively contribute to the initiation, planning, design, development and implementation of humanitarian capacity building program in country. The role also involves support to the effective coordination of training and capacity building interventions at the different stages of the humanitarian training cycle.</p><p>Guided by XXX and under the supervision of XXX, the capacity building officer will provide support to capacity building activities such as organisation of training workshops and learning sessions to transfer knowledge, skills and techniques for effective humanitarian response.</p><p><br></p><p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">Conduct of training needs assessments to establish priority needs and gaps in humanitarian information management capacity;</li><li class="ql-indent-1">Planning and scheduling of capacity building activities in consultation with key stakeholders</li><li class="ql-indent-1">Development of training and session plans, goals and objectives for humanitarian capacity building programmes based on identified gaps and capacity building priorities;&nbsp;</li><li class="ql-indent-1">Design and develop capacity building curricula, syllabi, and learning materials;</li><li class="ql-indent-1">Organize and deliver/co-facilitate core and advanced training and capacity building activities consistent to the needs of the humanitarian partners;&nbsp;</li><li class="ql-indent-1">Research, identify and develop appropriate training packages on emerging tools and innovative technologies that enhance partner ability for effective utilization of IM tools;</li><li class="ql-indent-1">Develop or identify training content and/or supporting reference resources such as presentations, practical exercises, and handouts to facilitate learning;</li><li class="ql-indent-1">Conduct pre-training, in-training and post-training evaluations for feedback, address challenges and impediments to effective learning, document and share lessons learnt;</li><li class="ql-indent-1">Liaise with other iMMAP capacity building programmes and ensure consistency and standardization of activities and material where possible;</li><li class="ql-indent-1">Facilitate staff\'s ability to use existing and emerging technology to achieve organization\'s mission and objectives;</li><li class="ql-indent-1">Train and provide technical support to the identified staff as needed on all Information Management tools and processes;</li><li class="ql-indent-1">Provide mentorship and support within the scope of iMMAP capacity building plan;</li><li class="ql-indent-1">Any other duties as required.</li><li class="ql-indent-1">Draft humanitarian capacity building success stories for inclusion in iMMAP’s reports, newsletters and social media platforms;</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">An advanced university degree or equivalent experience in the fields of education and information management;</li><li><strong>Experience</strong></li><li class="ql-indent-1">At least XXX years of relevant work experience and a background in non-profit, internationally-focused organisations;</li><li class="ql-indent-1">Experience in humanitarian, crisis recovery and resilience aspects is highly desirable;</li><li class="ql-indent-1">An appreciation of considerations in designing training content focused on the needs of adult learners;</li><li class="ql-indent-1">Progressively responsible experience in designing needs assessments, data management, mapping and visualization, coaching and training.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Understanding of the UN cluster/sector system and how it operates.</li><li class="ql-indent-1"><u>Communication:</u> Speaks and writes clearly and effectively; listens to others, exhibits interest in having two-way communication; tailor’s language, tone, style and format to match audience; demonstrates openness in sharing information and keeping people informed;</li><li class="ql-indent-1"><u>Teamwork:</u> Works collaboratively with colleagues to achieve organisational goals; is willing to learn from others;&nbsp;</li><li class="ql-indent-1"><u>Planning &amp; Organising:</u> Develops clear goals that are consistent with agreed strategies. Identifies priority activities and assignments; adjusts priorities as required. Allocates appropriate amount of time and resources for completing work. Foresees risks and allows for contingencies when planning. Monitors and adjusts plans and actions as necessary. Uses time efficiently.</li><li class="ql-indent-1"><u>Client Orientation:</u> Considers all those to whom services are provided to be “clients” and seeks to see things from clients’ point of view; establishes and maintains productive partnerships with clients by gaining their trust and respect; identifies clients’ needs and matches them with appropriate solutions; monitors ongoing developments inside and outside the clients’ environment to keep informed and anticipate problems; meets timeline for delivery of products or services to client;</li><li class="ql-indent-1"><u>Technological awareness:</u> Keeps abreast of available technology; understands applicability and limitation of technology to the work of the office; actively seeks to apply technology to appropriate tasks; shows willingness to learn new technology;</li><li class="ql-indent-1"><u>Representation:</u> Where appropriate, represent the iMMAP in various fora. Maintain effective and positive contacts with the national and local government officials, international non-governmental organisations (NGOs), and donor agency officials, when required.</li><li class="ql-indent-1">Ability to understand and adapt to complex and dynamic situations;</li><li class="ql-indent-1">Ability to work under pressure;</li><li class="ql-indent-1">Takes initiatives, manages own use of time and is self-motivating;</li><li class="ql-indent-1">Proven ability to work in teams;</li><li class="ql-indent-1">Flexible and creative.</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The context analyst will work with the iMMAP analysis team to provide in-depth analysis on the changing situation in various geographic regions of the country. These include, but not limited to, analysis of the changing political and conflict situation; analysis of local stakeholders; analysis of local governance structures; local stakeholder capacity assessments.</p><p><br></p><p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">The Context Analyst will primarily be involved in tracking atmospheric data and conducting analysis, composing contextual reports based upon said analysis, supporting the production of reporting products, composing sub-district profiles, meeting with, and briefing, partners and stakeholders.</li><li class="ql-indent-1">Produce regular reports and analysis while shaping tracking outputs to best fit the information needs of iMMAP partners and the humanitarian architecture;</li><li class="ql-indent-1">Stay aware of political, social, economic and cultural developments that have an impact on the protection environment for inclusion in analysis and timely alerting of appropriate actors;</li><li class="ql-indent-1">Contribute to survey design to ensure the most relevant information is collected at the appropriate level of disaggregation;</li><li class="ql-indent-1">In coordination with iMMAP’s IM and analysis teams, develop a reporting matrix and follow up throughout life of project to ensure timely and regular publishing of high-quality reports and information;</li><li class="ql-indent-1">Develop report outlines and work with the IM team to enhance and automate regular reporting functions;</li><li class="ql-indent-1">Provide high quality research and analysis to the iMMAP analysis team enabling evidence-based representation from the field and ensure documentation is supported;</li><li class="ql-indent-1">Actively tracking and monitoring political, security/conflict, economic, social, and infrastructure related developments and dynamics in country that directly or indirectly affect refugee return scenarios.</li><li class="ql-indent-1">Develop and maintain a network of key informants for the purpose of attaining and triangulating sensitive information pertaining to the local context.</li><li class="ql-indent-1">Manage relations with any potential sub-partners conducting research on the local context.</li><li class="ql-indent-1">Closely monitor and analyse open source media and reporting pertaining to the local context.</li><li class="ql-indent-1">Work closely with iMMAP technical specialists in support of data visualisation, imagery, and GIS and keep concerned counterparts fully briefed on project implementation and progress from the functional and technical standpoints.</li><li class="ql-indent-1">Support and document the review and development of the project strategy, and projected targets, and indicators per the proposal submission.</li><li class="ql-indent-1">Coordinate with subcontractors inside/outside country on deliverables feeding into projects.</li></ul><p><br></p>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Bachelor’s degree in politics, economics, international relations or related field required;</li><li><strong>Experience</strong></li><li class="ql-indent-1">XX years’ experience with reporting, preferably in the field of humanitarian information management an asset;</li><li class="ql-indent-1">Advanced prior knowledge of local context required;</li><li class="ql-indent-1">Prior experience in refugee context required;</li><li class="ql-indent-1">Familiarity with the aid system and an understanding of donor requirements;</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Ability to operate in cross-cultural environment and work independently;</li><li><strong>Programmes</strong></li><li class="ql-indent-1">Knowledge of Microsoft Excel;</li><li class="ql-indent-1">Knowledge of Open Data Kit surveying an asset;</li><li class="ql-indent-1">Knowledge of ArcGIS an asset.&nbsp;</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<ul><li><strong>Project Management</strong></li><li class="ql-indent-1">Develop programming through writing of project concept paper, proposal and budget for iMMAP using best practices in coordination with appropriate program units.</li><li class="ql-indent-1">Oversee the overall design of the program ensuring objectives are met within the required time frame and budget. Where necessary ensure preventative and corrective action is taken.</li><li class="ql-indent-1">Develop an implementation strategy which is appropriate to the country context and strategy.</li><li class="ql-indent-1">Plan the mobilisation of resources for the implementation of program activities.</li><li class="ql-indent-1">Manage a comprehensive activity plan, including resource needs analysis, covering the time frame.</li><li class="ql-indent-1">Proactively inform iMMAP Head of Office of identified opportunities, risks and risk mitigation relevant to the program planning and implementation.</li><li class="ql-indent-1">Maintain an overview of the national and regional context with a view to the strategic development of the project both in the current identified sites and potential of future program extension and expansion.</li><li class="ql-indent-1">Support programme implementation as needed, including: developing assessments, baselines, budgets, monitoring and evaluation systems, field visits to verify data, reporting and close-out.</li><li><strong>Financial Management</strong></li><li class="ql-indent-1">Plan and construct the program budget</li><li class="ql-indent-1">Ensure that budgets are spent according to donor proposals and regulations.</li><li class="ql-indent-1">Monitor the spending of designated programme funds in the pre-operational phase of the program.</li><li><strong>Staff Management</strong></li><li class="ql-indent-1">Ensure all identification, selection and contracting related issues for the staff of the designated project are carried out in accordance with iMMAP guidelines.</li><li class="ql-indent-1">Ensure that staff receive appropriate and adequate training by providing coaching.</li><li class="ql-indent-1">Through a consultative leadership style and a transparent and supportive communication structure, develop and build an effective iMMAP project team.</li><li><strong>Security Management</strong></li><li class="ql-indent-1">Assess and review the security status of identified areas of operation.</li><li class="ql-indent-1">Ensure security plans and protocols for the areas of operation are updated and implemented.</li><li><strong>Quality Management</strong></li><li class="ql-indent-1">Ensure designated projects are implemented in line with donor proposals and requirements.</li><li class="ql-indent-1">Regularly assess and provide feedback and recommendations on the quality of the programmes.</li><li><strong>Representation</strong></li><li class="ql-indent-1">Register iMMAP in requested countries.</li><li class="ql-indent-1">Build relationships on behalf of iMMAP with bilateral donors, international non-governmental organisations, implementation partners and other agencies relevant to the implementation of the programme.</li><li class="ql-indent-1">Represent iMMAP in relevant consultations and meetings.</li><li class="ql-indent-1">Ensure complete and timely reporting of activities to iMMAP, donor, and implementation partners.</li><li class="ql-indent-1">Assist iMMAP Head of Office with forward strategic planning, monitoring and evaluation.</li><li class="ql-indent-1">Other relevant duties as assigned by the Head of Office.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Bachelors or master\'s degree in international development studies preferred but not required;</li><li><strong>Experience</strong></li><li class="ql-indent-1">Minimum of XXX years’ experience in programme management required; or equivalent combination of education and experience.</li><li class="ql-indent-1">At least XXX years of work experience in similar management and/or advisor functions in international humanitarian or development aid.</li><li class="ql-indent-1">Demonstrated experience and knowledge in establishing systems and overseeing programme start-up under limited time constraints as well as plan programme close-out.</li><li class="ql-indent-1">Knowledge of basic programme development skills such as quantitative and qualitative monitoring and evaluation.</li><li class="ql-indent-1">Knowledge of national and regional dynamics of migration and actors, and an understanding of the functioning and policy-making dynamics of these actors;</li><li class="ql-indent-1">Proven and well-developed influencing and relationship-building skills in dealing with stakeholders at all levels.</li><li class="ql-indent-1">Demonstrable highly developed written and oral communication skills.</li><li class="ql-indent-1">Grant management experience with knowledge of the grant submission processes of major humanitarian and development donors such but not limited to the IOM, USAID, OFDA, PRM.</li><li class="ql-indent-1">Experience in data collection and population monitoring.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Strong analytical skills, and apt at turning abstract discussions into concrete ideas.</li><li class="ql-indent-1">Technical writing skills including developing proposals and reports.</li><li class="ql-indent-1">Ability to develop and carry out work plans and solve problems independently.</li><li class="ql-indent-1">Ability to perform well on tight deadlines, flexible attitude.</li><li class="ql-indent-1">Ability to select, develop and lead teams.</li><li class="ql-indent-1">Ability to work based on objectives.</li><li><strong>Programmes</strong></li><li class="ql-indent-1">Knowledge of computer applications, in particular proficiency required in MS Office.and Google Suites.</li><li class="ql-indent-1">Knowledge and experience working with Kobo Toolbox is an advantage.</li></ul>','level' => '3'),
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The communications officer (CO) assumes the primary responsibility for planning, developing and implementing communication strategies to promote iMMAPs’ programmes.</p><p><br></p><p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li><strong>Operational</strong></li><li class="ql-indent-1">Examine the work of iMMAP in country to assess the communication capacity of the organisation and its various programs and projects, and determine communication requirements (internal and external) that must be met to support the organization’s goals;</li><li class="ql-indent-1">Identify and detail approaches for fulfilling iMMAP’s communication requirements in country in a comprehensive and coordinated strategy that best promotes its programmes and mission;</li><li class="ql-indent-1">Propose and lead the development of media related products including print, electronic, and online that can be employed to promote the work of the organisation and maximise its awareness within the wider humanitarian community;</li><li class="ql-indent-1">Develop a monitoring and evaluation system to facilitate the measurement of the impact and efficiency of the new implemented communications strategy;</li><li class="ql-indent-1">Where appropriate, represent the iMMAP project team with partners, and participate in local community activities;</li><li class="ql-indent-1">Maintain effective and positive internal contacts with iMMAP regional officers and staff, and external contacts with national and local government officials, international non-governmental organisations (NGOs), donor agency officials, vendors, media, and the general public;</li><li class="ql-indent-1">Follow iMMAP\'s branding regulations required for marking, or branding, of all iMMAP products and correspondence.</li><li class="ql-indent-1">Serve as the main contributor of information regarding the Iraq program to the communications and outreach manager in HQ.</li><li class="ql-indent-1">Coordinate and collaborate with the communications and outreach manager in HQ on various projects as needed.</li><li class="ql-indent-1">Serve as the main contributor on iMMAP social media pages for the country related content.</li></ul><p><br></p>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">A university degree in communications, marketing or related field.</li><li><strong>Experience</strong></li><li class="ql-indent-1">Minimum of XX years’ experience in communication, public relations, advertising, communication analysis &amp; planning, social development communication, marketing;</li><li class="ql-indent-1">Thorough knowledge of the UN cluster system and how it operates</li><li class="ql-indent-1">Proven ability and experience interacting with a wide range of organisations while upholding humanitarian principles of impartiality and neutrality.</li></ul>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p>The Country Representative (CR) is the senior iMMAP management position in host country, with supervisory and managerial responsibility for all in-country personnel, programmes and policies. The CR is responsible for developing the overall iMMAP strategic direction for programming in concert with the iMMAP senior management team and local and international partners. S/He is also responsible for developing and implementing systems, policies and procedures for iMMAP operations in country. As the iMMAP senior manager in country, the CR is also responsible for financial oversight, strategic planning, monitoring and evaluation, staff safety and security, human resource management, and representation in the field. Working closely with the chief executive officer, the CR ensures that country programme operations meet the highest standard and are supportive of regional and global iMMAP strategies.</p><p><br></p><p><br></p><ul><li><strong>Strategy and Vision</strong></li><li class="ql-indent-1">Formulate and plan, in consultation with key stakeholders, a clear vision of present and future programme goals and strategies which can be clearly communicated to team members, local beneficiaries, international partners, governmental counterparts, and donors.</li><li class="ql-indent-1">Set direction by prioritising and organising actions and resources to achieve program and organisational objectives.</li><li class="ql-indent-1">Evaluate program priorities within the country and participate in regional prioritisation.</li><li class="ql-indent-1">Explore, evaluate and present new country and project funding opportunities that leverage impact and integrate initiatives and activities; support and direct related fund-raising activities with both institutional and private donors.</li><li><strong>Team Management</strong></li><li class="ql-indent-1">Develop and maintain an adequate human resource plan consistent with iMMAP’s policies, including current position descriptions for all iMMAP in country positions, personnel orientation and professional development plans, personnel evaluation system, field personnel policy manual, and personnel grievance procedure system.</li><li class="ql-indent-1">Recruit, manage and motivate an informed, skilled and efficient team with an emphasis on excellence and achievement; encourage a team culture of learning, creativity and innovation, incorporating staff development strategies and performance management systems into the team building process.</li><li class="ql-indent-1">Establish leadership and personal credibility with the iMMAP team, and implement and create an organisational culture of accountability, responsibility and quality of services.</li><li><strong>Reporting, Monitoring and Evaluation</strong></li><li class="ql-indent-1">Ensure the programme is based upon sound principles of design and utilise iMMAP and donor required monitoring and evaluation systems.</li><li><strong>Representation</strong></li><li class="ql-indent-1">Represent the iMMAP country programme with national and international donors, partners, media, and participate in local community activities as appropriate.</li><li class="ql-indent-1">Maintain effective and positive internal contacts with iMMAP headquarters officers and staff, and external contacts with the Embassies, national and local government officials, international non-governmental organisations (NGOs), donor agency officials, vendors, media, and the general public.</li><li><strong>Fiscal, Compliance Management and Accountability</strong></li><li class="ql-indent-1">Coordinate overall country budget; manage budget within approved spending levels and establish an annual cash flow plan to ensure a steady and adequate supply of funds for program activities.</li><li class="ql-indent-1">Oversee budget management of sub-grantees/sub-contractors if any.</li><li class="ql-indent-1">Build and maintain operational structures that ensure proper segregation of duties between finance, administration and logistics and fully support field programs.</li><li><strong>Security</strong></li><li class="ql-indent-1">Manage safety and security of the entire iMMAP country team and assets according to best practices, operating standards and field realities.</li><li class="ql-indent-1">Liaise with security officials of the local government and other humanitarian, relief and development stakeholders concerning crucial events, periods of increased risk, incident reporting, and security policy changes.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">Advanced university degree in Business Administration, Project Management, Information Science or other relevant fields;</li><li><strong>Experience</strong></li><li class="ql-indent-1">At least 15 years of experience with increasing responsibility in management positions, preferably within the UN or other humanitarian organizations;</li><li class="ql-indent-1">Complete understanding of the UN cluster system and its functioning;</li><li class="ql-indent-1">Proven ability and experience interacting with a wide range of organizations and stakeholders from the UN, donors, clusters, NGOs;</li><li class="ql-indent-1">Experience in emergency relief management and field coordination;</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Strong presentation and communication skills;</li><li class="ql-indent-1">Service orientated and ability to build consensus.</li><li class="ql-indent-1">Ability to understand and adapt to complex and dynamic situations;</li><li class="ql-indent-1">Ability to work in harsh operational environments;</li><li class="ql-indent-1">Takes initiatives, manages own use of time and is self-motivating;</li><li class="ql-indent-1">Self drive, flexibility and creativity.</li></ul><p><br></p>','level' => '3')
            ],
            [
                array('sub_section' => 'Organization','sub_section_content' => '<p><em>iMMAP is an international nongovernmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.</em></p>','level' => '0'),
                array('sub_section' => 'Background','sub_section_content' => '<p><em>Country specific</em></p>','level' => '1'),
                array('sub_section' => 'Description of Duties','sub_section_content' => '<p><em>À la carte, then listed in sub-categories:</em></p><p><br></p><p><br></p><ul><li>Supervise and coordinate the provision of all administrative, personnel and financial support require to the project, ensuring that appropriate control reporting structure are maintained in accordance with the organisation’s rules and regulations.</li><li>Manage projects accounting and financial system by ensuring that appropriate cashbook prepared for each month expenses.</li><li>Coordinate and act as focal point for issues relating to finance (including salary, payment of per diem, rent, hazardous, R &amp;R, process of invoices and receipt of funds).</li><li>Coordinate the asset inventory process, including procurement and reporting in established forms to iMMAP.</li><li>Manage admin/finance issues with iMMAP head quarter office when required.</li><li>Manage logistic issues for iMMAP activities support to national mine action offices.</li><li>Undertake other duties as requested by the line manager.</li><li>Prepare all finance reports and monthly cashbook for iMMAP Syria with scanning all receipts.</li></ul>','level' => '2'),
                array('sub_section' => 'Requirements','sub_section_content' => '<ul><li><strong>Education</strong></li><li class="ql-indent-1">University an Institute degree in business administration, finance or relevant field</li><li><strong>Experience</strong></li><li class="ql-indent-1">With at least XXX years or work experience in Administration field.</li><li><strong>Soft skills</strong></li><li class="ql-indent-1">Flexible and adaptable to any situation.</li><li class="ql-indent-1">Ability to translate XX to XX and XX to XX</li><li class="ql-indent-1">Ability to work independently while under pressure and during long hours.</li><li class="ql-indent-1">Excellent work habits with a willingness to work in a multi-cultural environment.</li><li class="ql-indent-1">Excellent organizational skills, including proven ability in administration, financial and logistics.</li><li class="ql-indent-1">Excellent communication skills, including drafting documents;</li><li><strong>Programmes</strong></li><li class="ql-indent-1"><strong>﻿</strong>Excellent computer skills in the Windows and Microsoft Office especially MS Excel and MS Access.</li></ul>','level' => '3')
            ]
        ];

        foreach($hr_job_categories as $arrIndex => $job_category) {
            $jobCategory = HRJobCategory::create($job_category);
            $jobCategory->sub_sections()->createMany($hr_job_category_sections[$arrIndex]);
        }

        // JOB STANDARD
        $hr_job_standards = array(
            array('name' => 'Surge Program','slug' => 'surge-program'),
            array('name' => 'iMMAP Standard','slug' => 'immap-standard'),
            array('name' => 'New Standard','slug' => 'new-standard')
          );

        HRJobStandard::insert($hr_job_standards);

        // QUIZ TEMPLATES
        $quiz_template = [
            'title' => 'IM Test',
            'slug' => 'im-test',
            'is_default' => 1,
            'is_im_test' => 1,
            'im_test_template_id' => NULL,
            'duration' => NULL,
            'pass_score' => NULL
        ];

        $qtemplate = QuizTemplate::create($quiz_template);

        // ROSTER PROCESS
        $roster_processes = [
            [ 'name' => 'SBP IM Roster', 'slug' => 'sbp-im-roster',
                'description' => '<p>“<span style="color: rgb(76, 76, 76);">The Standby Partnership (SBP) is a network of bilateral agreements between organizations and United Nations (UN) agencies. The partnership commenced in 1991 in response to the humanitarian crisis in Iraq where&nbsp;it was necessary for the United Nations (UN) to rapidly increase its human resources at short notice.</span></p><p><span style="color: rgb(76, 76, 76);">Today it comprises a range of partners which provide support to UN agencies responding to humanitarian emergencies throughout the world via the secondment of gratis personnel. Each Standby Partner maintains its own roster of humanitarian experts who are called upon to fill staffing needs and gaps in UN operations</span>.”</p><p>Standby Partnership Program website</p><p><span style="color: rgb(76, 76, 76);">As an active and long stand member of the Standby Partnership Program, iMMAP deploys Information Management Experts on demand from United Nations Agencies. The goal is to have a pool of experts deployable within 72 hours. Therefore, if you apply for this roster, you accept to be deployed to the field with short notice and often for short time contract.&nbsp;Thus, if you are selected, your profile will have to be frequently updated in terms of availability, travel and medical documentations, skill and experience.</span></p>',
                'is_default' => 0
            ],
            [ 'name' => 'iMMAP Roster', 'slug' => 'immap-roster',
                'description' => '<p><span style="color: rgb(76, 76, 76);">The iMMAP Roster aims to gather a pool of talented people willing to work with iMMAP. If you apply and your profile is selected as a match for our needs and project, you will integrate our records and will be one of the first in line in the selection process when iMMAP opens a new position for one of its numerous projects around the world. Information Management, GIS, web or tool development, communications, capacity strengthening, project management, field coordination are part of the many job categories present among the iMMAP Family, so if you think your profile and expertise may be interesting assets for iMMAP, apply for the iMMAP</span><span style="color: rgb(102, 102, 102);"> </span><span style="color: rgb(76, 76, 76);">Roster and be sure you will be informed as soon as a job position matches your profile and expectations.</span></p>',
                'is_default' => 1
            ]
        ];

        $roster_step = [
            [
                ['step' => 'CV Checking', 'slug' => 'cv-checking', 'default_step' => 1, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 0],
                ['step' => '3 Heads Questions', 'slug' => '3-heads-questions', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 1, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 1],
                ['step' => 'IM Test', 'slug' => 'im-test', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 1, 'has_im_test' => 1, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => $qtemplate->id, 'order' => 2],
                ['step' => 'Interview', 'slug' => 'interview', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 1, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 3],
                ['step' => 'Reference Check', 'slug' => 'reference-check', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 1, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 4],
                ['step' => 'Accepted', 'slug' => 'accepted', 'default_step' => 0, 'last_step' => 1, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 5],
                ['step' => 'Rejected', 'slug' => 'rejected', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 1, 'quiz_template_id' => NULL, 'order' => 6]
            ],
            [
                ['step' => 'CV Checking', 'slug' => 'cv-checking-1', 'default_step' => 1, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 0],
                ['step' => 'Interview', 'slug' => 'interview-1', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 1, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 1],
                ['step' => 'Reference Check', 'slug' => 'reference-check-1', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 1, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 2],
                ['step' => 'Accepted', 'slug' => 'accepted-1', 'default_step' => 0, 'last_step' => 1, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 0, 'quiz_template_id' => NULL, 'order' => 3],
                ['step' => 'Rejected', 'slug' => 'rejected-1', 'default_step' => 0, 'last_step' => 0, 'has_quiz' => 0, 'has_im_test' => 0, 'has_skype_call' => 0, 'has_interview' => 0, 'has_reference_check' => 0, 'set_rejected' => 1, 'quiz_template_id' => NULL, 'order' => 4]
            ]
        ];

        foreach($roster_processes as $arrIndex => $process) {
            $rosterProcess = RosterProcess::create($process);
            $rosterProcess->roster_steps()->createMany($roster_step[$arrIndex]);
        }

        // IM TEST TEMPLATES
        $im_test_template = [
            'name' => 'IM Test',
            'slug' => 'im-test',
            'limit_time_hour' => 4,
            'limit_time_minutes' => 0,
            'is_default' => 1
        ];

        $im_tests_for_template = [
            [
                'steps' => 1,
                'title' => "Welcom to iMMAP Roster IM Test",
                'text1' => "<p>You will have 4 hours to complete on this test.</p><p><strong>This test includes 4 Exercises:</strong></p><ul><li>Data analysis (60 min)</li><li>Mapping (60 min)</li><li>Humanitarian Needs Assessment (30 min)</li><li>Communication with partners (30 min)</li></ul><p><br></p><p>Into brackets is the estimated time for completion of each exercise.</p><p>You can use any tools that you and know how to use.</p><p>The timer up there will be activated when you will have clicked on \"Start\" Button</p><p>For the 2 first exercises you will have to upload your results/products and for the 2 others, you will have to type your answer.</p><p>Do no share this test with any other colleages!</p><p>Good Luck!</p>",
                'text2' => NULL,
                'text3' => NULL,
                'file_dataset1' => NULL,
                'file_dataset2' => NULL,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => NULL
                // '/ "im_test_templates_id' => 2
            ],
            [
                'steps' => 2,
                'title' => "Part 1 - Data Analysis",
                'text1' => "<p><strong>Here are two 4W datasets from two different sources. Luckily, the datasets are in the same format.</strong></p><p><strong>Combine them into one, clean the dataset and make it ready for analysis.</strong></p>",
                'created_at' => "2019-12-16 09:52:19",
                'updated_at' => "2019-12-16 09:52:19",
                'text2' => "<p><strong>Based on the new Dataset you just created, answer the following questions:</strong></p>",
                'text3' => "<p><strong>Create a simple dashboard</strong></p><p><br></p><p><br></p><ul><li>Beneficiaries by organisation</li><li>Top 3 Activities</li><li>Activities per month</li><li>Add at least 2 more pieces of information that you think are relevant</li></ul>",
                'file_dataset1' => NULL, //409,
                'file_dataset2' => NULL, //410,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => NULL
                // '/ "im_test_templates_id' => 2
            ],
            [
                'steps' => 3,
                'title' => "Part 2 - Mapping",
                'text1' => "<p>Create 2 maps:</p>",
                'created_at' => "2019-12-16 09:52:19",
                'updated_at' => "2019-12-16 09:52:19",
                'text2' => "<p>Use the linked dataset to find all health facilities of the type \"HOPITAL GENERAL DE REFERENCE\" that are within 3 km of a primary road.</p><p>Show all facilities that fit the criteria on a map with a label for each one of them.</p>",
                'text3' => "<p>Create a simple map that shows where the concentration of health facilities</p>",
                'file_dataset1' => NULL, //411,
                'file_dataset2' => NULL, //412,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => "<p>Extra task (Optional) :</p><p>Create an interactive map using the same datasets.</p>"
                // '/ "im_test_templates_id' => 2
            ],
            [
                'steps' => 3,
                'title' => "Part 2 - Mapping",
                'text1' => "<p>Create 2 maps:</p>",
                'created_at' => "2019-12-16 09:52:19",
                'updated_at' => "2019-12-16 09:52:19",
                'text2' => "<p>Use the linked dataset to find all health facilities of the type \"HOPITAL GENERAL DE REFERENCE\" that are within 3 km of a primary road.</p><p>Show all facilities that fit the criteria on a map with a label for each one of them.</p>",
                'text3' => "<p>Create a simple map that shows where the concentration of health facilities</p>",
                'file_dataset1' => NULL, //411,
                'file_dataset2' => NULL, //412,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => "<p>Extra task (Optional) :</p><p>Create an interactive map using the same datasets.</p>"
                // '/ "im_test_templates_id' => 2
            ],
            [
                'steps' => 4,
                'title' => "Part 3 - Humanitarian Needs Assesment",
                'text1' => "<p>You are tasked to run a needs assessment in a region that was affected by a natural disaster.</p><p>What steps will you take to get a good idea of the humanitarian needs ?</p><p><strong>Describe your approach in bullet points</strong></p>",
                'created_at' => "2019-12-16 09:52:19",
                'updated_at' => "2019-12-16 09:52:19",
                'text2' => NULL,
                'text3' => NULL,
                'file_dataset1' => NULL,
                'file_dataset2' => NULL,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => NULL
                // "im_test_templates_id": 2
            ],
            [
                'steps' => 5,
                'title' => "Part 4 - Communications with Partners",
                'text1' => "<p>You are workin as an Information Management Officer for a cluster in a country affected by a natural disaster.</p><p>Your cluster coordinator made you aware that of your 37 partners only 12 have been reporting their activities on time and using the correct format. The others were either late or used an outdated reporting format.</p><p>He / she asks you to write a message that can be circulated to improve the reporting.</p><p><strong>Write a message to the partners to improve the reporting.</strong></p>",
                'created_at' => "2019-12-16 09:52:19",
                'updated_at' => "2019-12-16 09:52:19",
                'text2' => NULL,
                'text3' => NULL,
                'file_dataset1' => NULL,
                'file_dataset2' => NULL,
                'file_dataset3' => NULL,
                'file_user_up1' => NULL,
                'file_user_up2' => NULL,
                'file_user_up3' => NULL,
                'text4' => NULL
                // '/ "im_test_templates_id' => 2
            ]];

        $im_templates = IMTestTemplate::create($im_test_template);
        $im_templates->imtes()->createMany($im_tests_for_template);

        // SETTING
        $settings = array(
            array('name' => 'Organization','slug' => 'organization','value' => 'iMMAP is an international non governmental organisation that provides information management services to humanitarian and development organizations. Through information management, we help our partners target assistance to the world’s most vulnerable populations. Our core philosophy is that better data leads to better decisions and that better decisions lead to better outcomes. iMMAP’s critical support to information value chains helps to solve operational and strategic challenges of our partners in both emergency and development contexts by enabling evidence-based decision-making for better outcomes.'),
            array('name' => 'Mailing Address','slug' => 'mailing-address','value' => 'RRB / ITC, 1300 Pennsylvania Avenue NW, Suite 470, Washington, DC 20004 USA')
          );

        Setting::insert($settings);

        // CREATE PERMISSION
        $all_permissions = [
            ['name' => 'Index Permission'],
            ['name' => 'Show Permission'],
            ['name' => 'Add Permission'],
            ['name' => 'Edit Permission'],
            ['name' => 'Delete Permission'],

            ['name' => 'Index User'],
            ['name' => 'Show User'],
            ['name' => 'Add User'],
            ['name' => 'Edit User'],
            ['name' => 'Delete User'],

            ['name' => 'Index Role'],
            ['name' => 'Show Role'],
            ['name' => 'Add Role'],
            ['name' => 'Edit Role'],
            ['name' => 'Delete Role'],

            ['name' => 'Dashboard Access'],

            ['name' => 'P11 Access'],

            ['name' => 'Index Country'],
            ['name' => 'Show Country'],
            ['name' => 'Add Country'],
            ['name' => 'Edit Country'],
            ['name' => 'Delete Country'],

            ['name' => 'Index Language'],
            ['name' => 'Show Language'],
            ['name' => 'Add Language'],
            ['name' => 'Edit Language'],
            ['name' => 'Delete Language'],

            ['name' => 'Index UN Org'],
            ['name' => 'Show UN Org'],
            ['name' => 'Add UN Org'],
            ['name' => 'Edit UN Org'],
            ['name' => 'Delete UN Org'],

            ['name' => 'View Applicant Profile'],
            ['name' => 'View Applicant List'],
            ['name' => 'Change Applicant Status'],

            ['name' => 'Apply Job'],

            ['name' => 'Add Job'],
            ['name' => 'Edit Job'],
            ['name' => 'Delete Job'],

            ['name' => 'Index Job Status'],
            ['name' => 'Show Job Status'],
            ['name' => 'Add Job Status'],
            ['name' => 'Edit Job Status'],
            ['name' => 'Delete Job Status'],

            ['name' => 'Index Sector'],
            ['name' => 'Show Sector'],
            ['name' => 'Add Sector'],
            ['name' => 'Edit Sector'],
            ['name' => 'Delete Sector'],
            ['name' => 'Approve Sector'],

            ['name' => 'Index Degree Level'],
            ['name' => 'Show Degree Level'],
            ['name' => 'Add Degree Level'],
            ['name' => 'Edit Degree Level'],
            ['name' => 'Delete Degree Level'],

            ['name' => 'Index HR Job Level'],
            ['name' => 'Show HR Job Level'],
            ['name' => 'Add HR Job Level'],
            ['name' => 'Edit HR Job Level'],
            ['name' => 'Delete HR Job Level'],

            ['name' => 'Index HR Job Category'],
            ['name' => 'Show HR Job Category'],
            ['name' => 'Add HR Job Category'],
            ['name' => 'Edit HR Job Category'],
            ['name' => 'Delete HR Job Category'],

            ['name' => 'Index HR Job Standard'],
            ['name' => 'Show HR Job Standard'],
            ['name' => 'Add HR Job Standard'],
            ['name' => 'Edit HR Job Standard'],
            ['name' => 'Delete HR Job Standard'],

            ['name' => 'Index Setting'],
            ['name' => 'Show Setting'],
            ['name' => 'Add Setting'],
            ['name' => 'Edit Setting'],
            ['name' => 'Delete Setting'],

            ['name' => 'Index ToR'],
            ['name' => 'Show ToR'],
            ['name' => 'Add ToR'],
            ['name' => 'Edit ToR'],
            ['name' => 'Delete ToR'],

            ['name' => 'Index Roster'],
            ['name' => 'Approve Roster'],

            ['name' => 'Select Skill for Matching'],

            ['name' => 'Index Duration'],
            ['name' => 'Show Duration'],
            ['name' => 'Add Duration'],
            ['name' => 'Edit Duration'],
            ['name' => 'Delete Duration'],

            ['name' => 'Index Contract Template'],
            ['name' => 'Show Contract Template'],
            ['name' => 'Add Contract Template'],
            ['name' => 'Edit Contract Template'],
            ['name' => 'Delete Contract Template'],

            ['name' => 'Index Contract'],
            ['name' => 'Show Contract'],
            ['name' => 'Add Contract'],
            ['name' => 'Edit Contract'],
            ['name' => 'Delete Contract'],

            ['name' => 'Index Language Level'],
            ['name' => 'Show Language Level'],
            ['name' => 'Add Language Level'],
            ['name' => 'Edit Language Level'],
            ['name' => 'Delete Language Level'],

            ['name' => 'Index Field of Work'],
            ['name' => 'Show Field of Work'],
            ['name' => 'Add Field of Work'],
            ['name' => 'Edit Field of Work'],
            ['name' => 'Delete Field of Work'],
            ['name' => 'Approve Field of Work'],


            ['name' => 'Edit Roster Step'],
            ['name' => 'Delete Roster Step'],

            ['name' => 'Index Roster Process'],
            ['name' => 'Show Roster Process'],
            ['name' => 'Add Roster Process'],
            ['name' => 'Edit Roster Process'],
            ['name' => 'Delete Roster Process'],

            ['name' => 'Index Immap Office'],
            ['name' => 'Show Immap Office'],
            ['name' => 'Add Immap Office'],
            ['name' => 'Edit Immap Office'],
            ['name' => 'Delete Immap Office'],
            ['name' => 'Approve Immap Office'],

            ['name' => 'Index IM Test Template'],
            ['name' => 'Show IM Test Template'],
            ['name' => 'Add IM Test Template'],
            ['name' => 'Edit IM Test Template'],
            ['name' => 'Delete IM Test Template'],

            ['name' => 'Index Quiz'],
            ['name' => 'Show Quiz'],
            ['name' => 'Add Quiz'],
            ['name' => 'Edit Quiz'],
            ['name' => 'Delete Quiz'],

            ['name' => 'Index Quiz Template'],
            ['name' => 'Show Quiz Template'],
            ['name' => 'Add Quiz Template'],
            ['name' => 'Edit Quiz Template'],
            ['name' => 'Delete Quiz Template'],

            ['name' => 'Index Platform Log'],

            ['name' => 'Index Immaper'],
            ['name' => 'Show Immaper'],
            ['name' => 'Edit Immaper'],

            ['name' => 'Index Roster Dashboard'],
            ['name' => 'Show Roster Dashboard'],

            ['name' => 'Set as Admin'],
            ['name' => 'Set as Manager'],

            ['name' => 'Index Repository'],
            ['name' => 'Show Repository'],
            ['name' => 'Add Repository'],
            ['name' => 'Edit Repository'],
            ['name' => 'Delete Repository'],
            ['name' => 'Share Repository'],

            ['name' => 'See Completed Profiles'],

            ['name' => 'Can Make Travel Request']
        ];

        foreach($all_permissions as $permission) {
            Permission::create($permission);
        }

        // CREATE ROLES
        // ADMIN
        $adminRole = Role::create(['name' => 'Admin']);

        $admin_permissions = Arr::where($all_permissions, function ($value) {
            return $value !== 'Set as Manager';
        });

        $adminRole->givePermissionTo($admin_permissions);
        $adminRole->immap_offices()->attach($admin_immap_offices);

        // USER
        $userRole = Role::create(['name' => 'User']);
        $userRole->givePermissionTo(['Apply Job', 'P11 Access', 'Index Repository', 'Show Repository', 'Can Make Travel Request']);

        // CEO
        $ceoRole = Role::create(['name' => 'CEOs and Operations Managers']);
        $ceoRole->givePermissionTo([
            'See Completed Profiles', 'Index Repository', 'Show Repository', 'Set as Manager', 'Show Immaper',
            'Index Immaper', 'Index Platform Log', 'Show Immap Office', 'Index Roster Process', 'Index Immap Office',
            'Show Roster Process', 'Show Field of Work', 'Index Field of Work', 'Show Language Level', 'Index Language Level',
            'Index Duration', 'Select Skill for Matching', 'Approve Roster', 'Index Roster', 'Delete ToR', 'Edit ToR',
            'Add ToR', 'Show ToR', 'Index ToR', 'Delete Setting', 'Edit Setting', 'Add Setting', 'Show HR Job Standard',
            'Index HR Job Standard', 'Show HR Job Category', 'Index HR Job Category',
            'Show HR Job Level', 'Index HR Job Level', 'Show Degree Level',
            'Index Degree Level', 'Show Sector', 'Index Sector', 'Show Job Status', 'Index Job Status', 'View Applicant List',
            'Change Applicant Status', 'Apply Job', 'View Applicant Profile', 'Show UN Org', 'Index UN Org', 'Index Language',
            'Show Country', 'Index Country', 'P11 Access', 'Can Make Travel Request'
        ]);
        $ceoRole->immap_offices()->attach($ceo_immap_offices);

        // SBPP MANAGER
        $sbppRole = Role::create(['name' => 'SBPP Manager']);
        $sbppRole->givePermissionTo([
            'See Completed Profiles', 'Index Repository', 'Show Repository', 'Show Roster Dashboard', 'Index Roster Dashboard',
            'Show Immaper', 'Index Immaper', 'Add IM Test Template', 'Show IM Test Template', 'Index IM Test Template',
            'Index Immap Office', 'Show Roster Process', 'Index Roster Process', 'Select Skill for Matching', 'Approve Roster',
            'Index Roster', 'Delete ToR', 'Edit ToR', 'Add ToR', 'Show ToR', 'Index ToR', 'Index HR Job Standard',
            'Index HR Job Category', 'View Applicant List',
            'Change Applicant Status', 'Apply Job', 'View Applicant Profile', 'Index Language', 'Index Country', 'P11 Access',
            'Index User', 'Can Make Travel Request'
        ]);
        $sbppRole->immap_offices()->attach($sbpp_immap_offices);

        // MANAGER
        $managerRole = Role::create(['name' => 'Manager']);
        $managerRole->givePermissionTo([
            'See Completed Profiles', 'Index Repository', 'Show Repository', 'Set as Manager', 'Show Immaper',
            'Index Immaper', 'Delete ToR', 'Edit ToR', 'Add ToR', 'Show ToR', 'Index ToR', 'Index HR Job Standard',
            'Index HR Job Category', 'Edit Job',  'View Applicant List', 'Change Applicant Status', 'Apply Job',
            'View Applicant Profile', 'P11 Access', 'Dashboard Access', 'Can Make Travel Request'
        ]);
        $managerRole->immap_offices()->attach($manager_immap_offices);
    }

}
