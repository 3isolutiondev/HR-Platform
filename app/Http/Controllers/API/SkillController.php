<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\P11\P11EmploymentRecordSkill;
use App\Models\P11\P11PortfolioSkill;
use App\Models\P11\P11Skill;
use App\Models\Skill;
use App\Traits\CRUDTrait;
use Spatie\Searchable\Search;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SkillController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Skill';
    const SINGULAR = 'skill';

    const FILLABLE = [ 'skill', 'slug', 'skill_for_matching', 'category' ];

    const RULES = [
        'skill' => 'required|string|max:255',
        'slug' => 'required|string|unique:skills',
        'skill_for_matching' => 'sometimes|nullable|boolean',
        'category' => 'required|string',
    ];

    const SUGGESTION_RULES  = [
        'skill' => 'required|string|max:255'
    ];

    /**
     * @SWG\GET(
     *   path="/api/skills",
     *   tags={"Skill"},
     *   summary="Get list of all skills",
     *   description="File: app\Http\Controllers\API\SkillController@index",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    public function index(Request $request) {
        if($request->has('isApproved') && $request->has('category')) {
            return response()->success(__('crud.success.default'), $this->model::where('skill_for_matching', $request->input('isApproved'))
            ->where('category', $request->input('category'))
            ->get());
        } else if($request->has('isApproved')) {
            return response()->success(__('crud.success.default'), $this->model::where('skill_for_matching', $request->input('isApproved'))->get());
        } else if($request->has('category')) {
            return response()->success(__('crud.success.default'), $this->model::where('category', $request->input('category'))->get());
        } else {
            return response()->success(__('crud.success.default'), $this->model::where('skill_for_matching', 1)->get());
        }
    }

     /**
     * @SWG\GET(
     *   path="/api/skills/{id}",
     *   tags={"Skill"},
     *   summary="list of skills",
     *   description="File: app\Http\Controllers\API\SkillController@show",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Skill id"
     *    )
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/skills",
     *   tags={"Skill"},
     *   summary="Store skill",
     *   description="File: app\Http\Controllers\API\SkillController@store",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="skill",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"skill", "skill_for_matching"},
     *           @SWG\Property(
     *              property="skill", type="string", description="Skill name", example="Adobe Lightroom"
     *           ),
     *           @SWG\Property(
     *              property="skill_for_matching", type="integer", enum={0,1}, description="Set skill so it can be use for matching profile purpose and it will be shown on ToR Form", example=1
     *           )
     *
     *       )
     *    )
     *
     * )
     *
     */
    public function store(Request $request) {
        $request['slug'] = Str::slug(strtolower($request['skill']), '-');

        $validatedData = $this->validate($request, $this->rules);
        $record = $this->model::create($validatedData);

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/skills/{id}",
     *   tags={"Skill"},
     *   summary="update skills",
     *   description="File: app\Http\Controllers\API\SkillController@update, permission:Edit Skill",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Skill id"
     *   ),
     *   @SWG\Parameter(
     *       name="skill",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"_method", "skill","skill_for_matching"},
     *           @SWG\Property(
     *               property="_method", type="string", enum={"PUT"}, example="PUT"
     *           ),
     *           @SWG\Property(
     *              property="skill", type="string", description="Skill name", example="Adobe Lightroom"
     *           ),
     *           @SWG\Property(
     *              property="skill_for_matching", type="integer", enum={0,1}, description="Set skill so it can be use for matching profile purpose and it will be shown on ToR Form", example=1
     *           )
     *       )
     *    )
     * )
     *
     */
    public function update(Request $request, $id) {
        $request['slug'] = Str::slug(strtolower($request['skill']), '-');

        $validatedData = $this->validate($request, [
            'skill' => 'required|string|max:255',
            'slug' => 'required|string|unique:skills,slug,'.$id,
            'skill_for_matching' => 'sometimes|nullable|boolean',
            'category' => 'sometimes|nullable|string',
        ]);

        $record = $this->model::findOrFail($id);

        $record->fill($request->only($this->fillable));

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/skills/suggestions",
     *   tags={"Skill"},
     *   summary="Get suggestions of skill",
     *   description="File: app\Http\Controllers\API\SkillController@suggestions, permission:Show Skill",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="skill",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"skill"},
     *           @SWG\Property(
     *              property="skill", type="string", description="Keyword of skill", example="Adob"
     *           )
     *       )
     *    )
     * )
     *
     */
    public function suggestions(Request $request) {

        $validatedData = $this->validate($request, self::SUGGESTION_RULES);
        $suggestions = (new Search())
        ->registerModel($this->model, 'skill')
        ->search($validatedData['skill']);

        return response()->success(__('crud.success.default'), $suggestions->pluck('searchable'));
    }

    /**
     * @SWG\GET(
     *   path="/api/skills/skills-for-matching",
     *   tags={"Skill"},
     *   summary="Get list of skills who are set for matching purpose",
     *   description="File: app\Http\Controllers\API\SkillController@skillsForMatching",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function skillsForMatching(Request $request) {
        if($request->has('category')) {
            $skills = $this->model::where('skill_for_matching', 1)->where('category', $request->input('category'))->get();
        } else {
            $skills = $this->model::where('skill_for_matching', 1)->orderBy('skill','asc')->get();
        }
        return response()->success(__('crud.success.default'), $skills);
    }

     /**
     * @SWG\Post(
     *   path="/api/skills/merge",
     *   tags={"Sectors"},
     *   summary="Merge Area of Sector",
     *   description="File: app\Http\Controllers\API\FieldOfWorkController@update, Permission: Edit Area of Expertise",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(name="id", in="path", type="integer", required=true, description="Area of expertise id"),
     *   @SWG\Parameter(
     *          name="fieldOfWork",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(
     *              required={"_method", "field"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="origin", type="integer", description="origin Area of expertise id", example="1"),
     *              @SWG\Property(property="destination", type="integer", description="destination Area of expertise id", example=1)
     *          )
     *      ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error")
     * )
     *
     */
    public function merge(Request $request)
    {
        $validatedData = $this->validate($request, [
            'origin' => 'required|integer',
            'destination' => 'required|integer',
        ]);

        $recordDestination = $this->model::findOrFail($validatedData['destination']);
        $recordOrigin = $this->model::findOrFail($validatedData['origin']);
        if (!$recordDestination) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        if (!$recordOrigin) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        $record = P11Skill::where('skill_id', $validatedData['origin'])->update(['skill_id' => $validatedData['destination']]);
        $rec = P11EmploymentRecordSkill::where('skill_id', $validatedData['origin'])->update(['skill_id' => $validatedData['destination']]);
        P11PortfolioSkill::where('skill_id', $validatedData['origin'])->update(['skill_id' => $validatedData['destination']]);
        try{
            Skill::where('id', $validatedData['origin'])->delete();
        }catch(\Exception $e){
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 400);
        }
        return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/skills/set-for-matching",
     *   tags={"Skill"},
     *   summary="Set skill for matching purpose, also it will be shown on ToR Form",
     *   description="File: app\Http\Controllers\API\SkillController@setForMatching, permission:Show Skill",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="skill",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *           required={"id"},
     *           @SWG\Property(
     *              property="id", type="integer", description="Skill id", example=2043
     *           )
     *
     *       )
     *    )
     * )
     *
     */
    public function setForMatching(Request $request) {
        $validatedData = $this->validate($request, [ 'id' => 'required|integer' ]);
        $record = $this->model::findOrFail($request->id);

        if ($record->skill_for_matching == 1) {
            $record->fill([ 'skill_for_matching' => 0 ]);
        } else {
            $record->fill([ 'skill_for_matching' => 1 ]);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.default'), 500);
        }

        if ($record) {
            return response()->success(__('crud.store.default'), $record);
        }

        return response()->error(__('crud.error.default'), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/skills/{id}",
     *   tags={"Skill"},
     *   summary="Delete skill",
     *   description="File: app\Http\Controllers\API\SkillController@destroy",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Skill id"
     *    ),
     * )
     *
     */
}
