<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\Skill;
use App\Models\P11\P11Skill;
use App\Models\P11\P11EmploymentRecordSkill;
use App\Models\P11\P11PortfolioSkill;

class SkillImport implements ToCollection
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        $collection->shift();
        $updatedSkillList = $collection;
        $slugList = $updatedSkillList->map(function ($skill) {
            return strtolower(\str_replace(' ', '-', $skill[0]));
        });

        // Find skills to delete
        $nonExistingSkill = Skill::whereNotIn('slug', $slugList)->get();
        $nonExistingSkillIds = $nonExistingSkill->map(function ($skill) {
            return $skill->id;
        });

        $nonExistingSkillNames = $nonExistingSkill->map(function ($skill) {
            return $skill->skill;
        });

        // Add new skills

        foreach($updatedSkillList as $key => $skill) {
           
           $existing = Skill::where('slug', strtolower(\str_replace(' ', '-', $skill[0])))->first();
           if(!$existing) {
            $existing = Skill::create(['skill' => $skill[0], 'slug' => strtolower(\str_replace(' ', '-', $skill[0])), 'skill_for_matching' => 1, 'is_approved' => 1, 'category' => $skill[1]]);
           } else {
            $existing->update(['skill' => $skill[0], 'slug' => strtolower(\str_replace(' ', '-', $skill[0])), 'skill_for_matching' => 1, 'is_approved' => 1, 'category' => $skill[1]]);
           }


           if(isset($skill[2])) {
            $mergeSkills = explode(',', $skill[2]);
            foreach($mergeSkills as $mergeSkill) {
                $mergeSkill = trim($mergeSkill);
                $existingOld = Skill::where('slug', strtolower(\str_replace(' ', '-', $mergeSkill)))->first();
                if($existingOld) {
                    $record = P11Skill::where('skill_id', $existingOld->id)->update(['skill_id' => $existing->id]);
                    $rec = P11EmploymentRecordSkill::where('skill_id', $existingOld->id)->update(['skill_id' => $existing->id]);
                    P11PortfolioSkill::where('skill_id', $existingOld->id)->update(['skill_id' => $existing->id]);
                }
            }
           }
        }
        

        $record = P11Skill::whereIn('skill_id', $nonExistingSkillIds)->delete();
        $rec = P11EmploymentRecordSkill::whereIn('skill_id', $nonExistingSkillIds)->delete();
        P11PortfolioSkill::whereIn('skill_id', $nonExistingSkillIds)->delete();

        try{
            Skill::whereIn('id',$nonExistingSkillIds)->delete();
        }catch(\Exception $e){
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
    }
}
