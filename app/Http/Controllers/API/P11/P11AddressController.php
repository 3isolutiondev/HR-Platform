<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

class P11AddressController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Address';
    const SINGULAR = 'p11 address';

    const FILLABLE = ['address','city','postcode','telephone','fax','country_id','type','profile_id'];

    const RULES = [
        'address' => 'required|string',
        'city' => 'required|string|max:255',
        'postcode' => 'required|string|max:255',
        'telephone' => 'required|string|max:255',
        'fax' => 'sometimes|nullable',
        'country_id' => 'required|integer',
        'type' => 'required|in:present,permanent,both'
    ];

    public function store(Request $request)
    {
        $addressData = $this->validate($request, $this->rules);

        // $addressData = $request->only($this->fillable);
        $addressData['profile_id'] = auth()->user()->profile->id;

        $record = $this->model::create($addressData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

}
