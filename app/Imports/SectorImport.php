<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\Sector;
use App\Models\P11\P11Sector;
use App\Models\P11\P11EmploymentRecordSector;
use App\Models\P11\P11Portfolio;
use Illuminate\Support\Facades\DB;

class SectorImport implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        $collection->shift();
        $updatedSectorList = $collection;
        $slugList = $updatedSectorList->map(function ($sector) {
            return \str_replace(',', '',(strtolower(\str_replace(' ', '-', $sector[0]))));
        });

        // Find sectors to delete
        $nonExistingSector = Sector::whereNotIn('slug', $slugList)->get();
        $nonExistingSectorIds = $nonExistingSector->map(function ($sector) {
            return $sector->id;
        });

        $nonExistingSectorNames = $nonExistingSector->map(function ($sector) {
            return $sector->sector;
        });


        // Add new sectors

        foreach($updatedSectorList as $key => $sector) {
           if(isset($sector[0]) && $sector[0] && $sector[0] !== null) {
            $existing = Sector::where('slug', \str_replace(',', '',(strtolower(\str_replace(' ', '-', $sector[0])))))->first();
            if(!$existing) {
                $existing = Sector::create(['name' => $sector[0], 'slug' => \str_replace(',', '',(strtolower(\str_replace(' ', '-', $sector[0])))), 'is_approved' => 1]);
            } else {
                $existing->update(['is_approved' => 1]);
            }

            if(isset($sector[1])) {
                $mergeSectors = explode(',', $sector[1]);
                foreach($mergeSectors as $mergeSector) {
                    $mergeSector = trim($mergeSector);
                    $existingOld = Sector::where('slug', \str_replace(',', '',(strtolower(\str_replace(' ', '-', $mergeSector)))))->first();
                    if($existingOld) {
                        P11Sector::where('sector_id', $existingOld->id)->update(['sector_id' => $existing->id]);
                        P11EmploymentRecordSector::where('sector_id', $existingOld->id)->update(['sector_id' => $existing->id]);
                        DB::table('p11_portfolios_sectors')->where('sector_id', $existingOld->id)->update(['sector_id' => $existing->id]);
                        try {
                            DB::table('p11_professional_societies_sectors')->where('sector_id', $existingOld->id)->update(['sector_id' => $existing->id]);
                        } catch(\Exception $e) {

                        }
                    }
                }
            }
          }
        }

        $record = P11Sector::whereIn('sector_id', $nonExistingSectorIds)->delete();
        P11EmploymentRecordSector::whereIn('sector_id', $nonExistingSectorIds)->delete();
        DB::table('p11_portfolios_sectors')->whereIn('sector_id', $nonExistingSectorIds)->delete();
        try {
            DB::table('p11_professional_societies_sectors')->whereIn('sector_id', $nonExistingSectorIds)->delete();
        } catch(\Exception $e) {

        }
        try{
            Sector::whereIn('id',$nonExistingSectorIds)->update(['is_approved' => 0]);
        }catch(\Exception $e){
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
    }
}