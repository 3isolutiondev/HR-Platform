<?php

namespace App\Traits\SecurityModule;

use App\Models\Country;
use Illuminate\Support\Str;

trait TravelRequestTrait
{
    /**
     *  $checkHighRiskCountry:
     *      => is return boolean value if the all country or the city is a high risk area   
     *   * ========================================================================
     */
    public function checkHighRiskCountry($country_id, $city)
    {
        $isHighRisk = false;
        $country = Country::select('id', 'name', 'is_high_risk')->with([
            'high_risk_cities' => function ($query) {
                $query->orderBy('id', 'desc');
            }
        ])->findOrFail($country_id);

        if ($country) {
            $isHighRisk  = $country->is_high_risk == 1 ? true : false;
            if ($country->high_risk_cities->count() > 0) {
                $check = $country->high_risk_cities->filter(function ($item, $key) use ($city) {
                    return Str::lower($item->city) == Str::lower($city);
                });
                $isHighRisk =  $check->count() > 0 ? true : false;
            }
        }

        return $isHighRisk;
    }
}
