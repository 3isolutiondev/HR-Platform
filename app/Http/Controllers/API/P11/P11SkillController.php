<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Skill;
use DateTime;

class P11SkillController extends Controller
{
    use CRUDTrait;
    const MODEL = 'App\Models\P11\P11Skill';
    const SINGULAR = 'Skill';
    const FILLABLE = [
        'profile_id', 'skill_id', 'proficiency', 'days', 'months', 'years', 'has_portfolio'
    ];
    const RULES = [
        'skill' => 'required|array',
        'skill.0' => 'required|string',
        'proficiency' => 'required|integer'
    ];

    protected $authUser, $authProfile, $authProfileId;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-skills",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Get list of all p11 skill data inside table",
     *   description="File: app\Http\Controllers\API\P11SkillController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\GET(
     *   path="/api/p11-skills/lists",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Get list of all p11 skill data related to the logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11SkillController@lists, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::with('skill')->where('profile_id', $this->authProfileId)->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-skills/{id}",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Get specific p11 skill data",
     *   description="File: app\Http\Controllers\API\P11SkillController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 skill id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with('skill:id,skill,category')->findOrFail($id);

        $record->employment_records = $record->skill->p11_employment_records()->select('p11_employment_record_id as id', 'job_title')->get();

        if ($record->skill->has('p11_portfolios')) {
            $record->portfolios = $record->skill->p11_portfolios()->select('p11_portfolio_id as id', 'title')->get();
            unset($record->skill->p11_portfolios);
        }
        unset($record->skill->p11_employment_records);

        return response()->success(__("crud.success.default"), $record);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-skills",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Store p11 skill data",
     *   description="File: app\Http\Controllers\API\P11SkillController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Skill",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"skill", "proficiency"},
     *          @SWG\Property(
     *              property="skill",
     *              type="array",
     *              description="only contain one value",
     *              @SWG\Items(
     *                  type="string",
     *                  description="Skill [required]",
     *                  example="Database Design"
     *              )
     *          ),
     *          @SWG\Property(property="proficiency", type="integer", description="Proficiency of the skill", example=5)
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $request->validate($this->rules);
        $skillData = [
            'proficiency' => $validatedData['proficiency'],
            'profile_id' => $this->authProfileId,
        ];
        $skill = Skill::where('slug', Str::slug($validatedData['skill'][0]))->first();
        if (empty($skill)) {
            $skill = Skill::create([
                'skill' => strtolower($validatedData['skill'][0]),
                'slug' => strtolower(Str::slug($validatedData['skill'][0], '-')),
                'addedBy' => 'others'
            ]);
            $skillData['skill_id'] = $skill->id;
        } else {
            $skillData['skill_id'] = $skill->id;
        }
        $record = $this->model::create($skillData);
        $years = 0;
        $hasPortfolio = 0;
        foreach ($this->authProfile->p11_employment_records as $eRecords) {
            $profile_skills = $eRecords->p11_employment_records_skills;
            foreach ($profile_skills as $pSkills) {
                if ($pSkills->skill_id == $skill->id) {
                    $from = new DateTime($eRecords->from);
                    $to = new DateTime($eRecords->to);
                    $interval = $to->diff($from);
                    $interval = $interval->m + ($interval->y * 12);
                    $years = $years + $interval;
                }
            }
        }
        $years = intval($years / 12);
        foreach ($this->authProfile->p11_portfolios as $p11Portfolio) {
            foreach ($p11Portfolio->p11_portfolio_skills as $p11PortfolioSkill) {
                if ($p11PortfolioSkill->skill_id == $skill->id) {
                    $hasPortfolio = 1;
                }
            }
        }
        $record->fill(['years' => $years, 'has_portfolio' => $hasPortfolio])->save();

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-skills/{id}",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Update p11 skill data",
     *   description="File: app\Http\Controllers\API\P11SkillController@update, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 skill id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Skill",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "skill", "proficiency"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(
     *              property="skill",
     *              type="array",
     *              description="only contain one value",
     *              @SWG\Items(
     *                  type="string",
     *                  description="Skill [required]",
     *                  example="Database Design"
     *              )
     *          ),
     *          @SWG\Property(property="proficiency", type="integer", description="Proficiency of the skill", example=5)
     *      )
     *   )
     *
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate($this->rules);
        $record = $this->model::findOrFail($id);
        $skillData = [
            'proficiency' => $validatedData['proficiency']
        ];
        $skill = Skill::where('slug', Str::slug($validatedData['skill'][0]))->first();
        if (empty($skill)) {
            $skill = Skill::create([
                'skill' => strtolower($validatedData['skill'][0]),
                'slug' => strtolower(Str::slug($validatedData['skill'][0], '-'))
            ]);
            $skillData['skill_id'] = $skill->id;
        } else {
            $skillData['skill_id'] = $skill->id;
        }
        $skillData['days'] = 0;
        $skillData['months'] = 0;
        $skillData['years'] = 0;
        $skillData['hasPortfolio'] = 0;
        foreach ($this->authProfile->p11_employment_records as $eRecords) {
            $profile_skills = $eRecords->p11_employment_records_skills;
            foreach ($profile_skills as $pSkills) {
                if ($pSkills->skill_id == $skill->id) {
                    $from = new DateTime($eRecords->from);
                    $to = new DateTime($eRecords->to);
                    $interval = $to->diff($from);
                    $skillData['days'] = $skillData['days'] + $interval->days;
                }
            }
        }
        $skillData['months'] = intval($skillData['days'] / 30);
        $skillData['years'] = intval($skillData['days'] / 365);

        foreach ($this->authProfile->p11_portfolios as $p11Portfolio) {
            foreach ($p11Portfolio->p11_portfolio_skills as $p11PortfolioSkill) {
                if ($p11PortfolioSkill->skill_id == $skill->id) {
                    $skillData['has_portfolio'] = 1;
                }
            }
        }
        $record->fill($skillData);

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $updated = $record->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Delete(
     *   path="/api/p11-skills/{id}",
     *   tags={"P11 Skills / Profile Skill List"},
     *   summary="Delete p11 skill data",
     *   description="File: app\Http\Controllers\API\P11SkillController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 skill id"
     *    ),
     * )
     *
     */
}
