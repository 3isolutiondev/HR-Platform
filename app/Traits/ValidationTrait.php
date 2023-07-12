<?php

namespace App\Traits;

use Validator;
use Illuminate\Http\Request;

trait ValidationTrait
{
    protected function validateRequest(Request $request, $rules = self::RULES)
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['status' => 'errors', 'errors' => $validator->errors()], 422);
        }

        return $validator->valid();
    }
}
