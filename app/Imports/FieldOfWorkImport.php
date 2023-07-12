<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\FieldOfWork;
use App\Models\P11\P11FieldOfWork;

class FieldOfWorkImport implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        $collection->shift();
        $updatedFieldOfWorkList = $collection;
        $slugList = $updatedFieldOfWorkList->map(function ($fieldOfWork) {
            return strtolower(\str_replace(' ', '-', $fieldOfWork[0]));
        });

        // Find fieldOfWorks to delete
        $nonExistingFieldOfWork = FieldOfWork::whereNotIn('slug', $slugList)->get();
        $nonExistingFieldOfWorkIds = $nonExistingFieldOfWork->map(function ($fieldOfWork) {
            return $fieldOfWork->id;
        });

        $nonExistingFieldOfWorkNames = $nonExistingFieldOfWork->map(function ($fieldOfWork) {
            return $fieldOfWork->fieldOfWork;
        });

        // Add new fieldOfWorks

        foreach($updatedFieldOfWorkList as $key => $fieldOfWork) {
           $existing = FieldOfWork::where('slug', strtolower(\str_replace(' ', '-', $fieldOfWork[0])))->first();
           if(!$existing) {
            $existing = FieldOfWork::create(['field' => $fieldOfWork[0], 'slug' => strtolower(\str_replace(' ', '-', $fieldOfWork[0])), 'is_approved' => 1]);
           } else {
            $existing->update(['is_approved' => 1]);
           }

           if(isset($fieldOfWork[1])) {
            $mergeFieldOfWorks = explode(',', $fieldOfWork[1]);
            foreach($mergeFieldOfWorks as $mergeFieldOfWork) {
                $mergeFieldOfWork = trim($mergeFieldOfWork);
                $existingOld = FieldOfWork::where('slug', \str_replace(',', '',(strtolower(\str_replace(' ', '-', $mergeFieldOfWork)))))->first();
                if($existingOld) {
                    $record = P11FieldOfWork::where('field_of_work_id', $existingOld->id)->update(['field_of_work_id' => $existing->id]);
                }
            }
            }
        }

        $record = P11FieldOfWork::whereIn('field_of_work_id', $nonExistingFieldOfWorkIds)->delete();

        try{
            FieldOfWork::whereIn('id',$nonExistingFieldOfWorkIds)->delete();
        }catch(\Exception $e){
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
    }
}