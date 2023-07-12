<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\UserTrait;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;

class P11DependentController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Dependent';
    const SINGULAR = 'dependent';

    const FILLABLE = [
        'first_name', 'middle_name', 'family_name',
        'full_name', 'bdate', 'bmonth', 'byear',
        'date_of_birth', 'relationship',
        'profile_id'
    ];

    const RULES = [
        'first_name' => 'required|string|max:255',
        'middle_name' => 'sometimes|nullable',
        'family_name' => 'required|string|max:255',
        // 'slug' => 'required|alpha_dash|unique:countries',
        'bdate' =>
        'required|in:01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,
            21,22,23,24,25,26,27,28,29,30,31',
        'bmonth' =>
        'required|in:01,02,03,04,05,06,07,08,09,10,11,12',
        'byear' => 'required|date_format:Y',
        // 'date_of_birth' => 'required|date',
        'relationship' => 'required|string|max:255'
    ];

    protected $authUser, $authProfileId, $authProfile;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
    }

    protected function getDateOfBirth($dependentData)
    {
        return $dependentData['byear'] . '-' . $dependentData['bmonth'] . '-' . $dependentData['bdate'];
    }

    public function show($id)
    {
        $dependent = $this->model::findOrFail($id);

        if (empty($dependent['middle_name'])) {
            $dependent['middle_name'] = '';
        }

        return response()->success(__('crud.store.default'), $dependent);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);
        $dependentData = $request->only($this->fillable);
        $dependentData = $this->getFullName($dependentData);
        $dependentData['date_of_birth'] = $this->getDateOfBirth($dependentData);
        $dependentData['profile_id'] = $this->authProfileId;
        // $profile = Profile::findOrFail($this->authProfileId);

        if (!$this->authProfile->has_dependents) {
            $this->authProfile->fill(['has_dependents' => 1])->save();
        }

        if ($this->authProfile->has_dependents) {
            $record = $this->model::create($dependentData);

            if (!$record) {
                return response()->error(__('crud.error.store', ['singular' => ucfirst($this->singular)]) . '1', 500);
            }

            $dependent_saved = $this->authProfile->p11_dependents()->save($record);

            if ($dependent_saved) {
                return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
            }

            return response()->error(__('crud.error.store', ['singular' => $this->singular]) . '2', 500);
        }



        return response()->error(__('crud.error.store', ['singular' => $this->singular]) . '3', 500);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);
        $dependentData = $request->only($this->fillable);
        $dependentData = $this->getFullName($dependentData);
        $dependentData['date_of_birth'] = $this->getDateOfBirth($dependentData);

        $record = $this->model::findOrFail($id);

        $record->fill($dependentData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    public function lists()
    {
        $dependentLists = $this->authProfile->p11_dependents;

        if (!$dependentLists) {
            return response()->not_found();
        }

        return response()->success(__('crud.success.default'), $dependentLists);
    }
}
