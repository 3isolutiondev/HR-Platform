<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

trait CRUDTrait
{
    protected $perPage = 2;
    protected $model = self::MODEL;
    protected $rules = self::RULES;
    protected $fillable = self::FILLABLE;
    protected $singular = self::SINGULAR;

    public function index(Request $request): JsonResponse
    {
        return response()->success(__('crud.success.default'), $this->model::orderBy('created_at','desc')->get());
    }

    public function show($id): JsonResponse
    {
        $record = $this->model::findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    public function store(Request $request): JsonResponse
    {
        $validate = $this->validate($request, $this->rules);
        $record = $this->model::create($request->only($this->fillable));

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validate = $this->validate($request, $this->rules);

        $record = $this->model::find($id);

        if (!$record) {
            return response()->not_found();
        }

        $record->fill($request->only($this->fillable));

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $record->save();

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    public function destroy($id): JsonResponse
    {
        $record = $this->model::find($id);
        if (!$record) {
            return response()->error(__('crud.error.not_found'), 404);
        }
        $record->delete();

        return response()->success(__('crud.success.delete', ['singular' => ucfirst($this->singular)]));
    }
}
