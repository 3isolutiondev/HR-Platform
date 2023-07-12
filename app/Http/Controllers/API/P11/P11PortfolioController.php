<?php

namespace App\Http\Controllers\API\P11;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Attachment;
use App\Models\Skill;
use App\Models\Sector;
use Illuminate\Support\Str;
use DateTime;

class P11PortfolioController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\P11\P11Portfolio';
    const SINGULAR = 'Portfolio';

    const FILLABLE = [
        'title', 'description', 'url', 'attachment_id', 'profile_id'
    ];

    const RULES = [
        'title' => 'required|string|max:255',
        'description' => 'sometimes|nullable|string',
        'url' => 'sometimes|nullable|url',
        'attachment_id' => 'sometimes|nullable|integer|exists:attachments,id'
        // 'attachment_file' => 'sometimes|nullable|mimes:pdf,jpg,jpeg,png,webp',
        // 'skills' => 'required|json',
        // 'skills' => 'required|array',
        // 'sectors' => 'sometimes|nullable|array'
    ];

    protected $authUser, $authProfileId, $authProfile;

    public function __construct()
    {
        $this->authUser = auth()->user();
        $this->authProfile = ($this->authUser) ? $this->authUser->profile : null;
        $this->authProfileId = ($this->authUser) ? $this->authUser->profile->id : null;
    }

    // protected function saveSkills($record, $slugs, $names)
    // {
    // $portfolios_skills = [];
    // foreach($slugs as $index => $slug) {
    //     $skill = Skill::where('slug', $slug)->first();
    //     if (empty($skill)) {
    //         $skill = Skill::create([
    //             'skill' => $names[$index],
    //             'slug' => $slug,
    //         ]);
    //     }
    //     array_push($portfolios_skills, $skill->id);
    // }

    // if (count($portfolios_skills)) {
    //     $record->portfolio_skills()->sync($portfolios_skills);
    // }

    // }
    protected function updateSingleProfileSkill($skillId)
    {
        $p11_employment_records_skills = $this->authProfile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skillId) {
            $query->where('skill_id', $skillId);
        })->first();

        if (!empty($p11_employment_records_skills)) {
            $from = new DateTime($p11_employment_records_skills['min_from']);
            $to = new DateTime($p11_employment_records_skills['max_to']);
            $interval = $to->diff($from);

            $profile_skill = $this->authProfile->p11_skills()->where('skill_id', $skillId)->first();

            if (!empty($profile_skill)) {
                $profile_skill->fill(['has_portfolio' => '1'])->save();
            } else {
                $this->authProfile->p11_skills()->create(['has_portfolio' => '1', 'skill_id' => $skillId]);
            }
        }
    }

    protected function updateSingleProfileSector($sectorId)
    {
        $p11_employment_records_sectors = $this->authProfile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sectorId) {
            $query->where('sector_id', $sectorId);
        })->first();

        if (!empty($p11_employment_records_sectors)) {
            $from = new DateTime($p11_employment_records_sectors['min_from']);
            $to = new DateTime($p11_employment_records_sectors['max_to']);
            $interval = $to->diff($from);

            $profile_sector = $this->authProfile->p11_sectors()->where('sector_id', $sectorId)->first();
            if (!empty($profile_sector)) {
                $profile_sector->fill([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y
                ])->save();
            } else {
                $this->authProfile->p11_sectors()->create([
                    'days' => $interval->days,
                    'months' => $interval->m,
                    'years' => $interval->y,
                    'sector_id' => $sectorId,
                ]);
            }
        }
    }


    protected function saveSectors($record, $sectors)
    {
        $record->sectors()->detach();
        foreach ($sectors as $sector) {
            if (array_key_exists('addedBy', $sector)) {
                if ($sector['addedBy'] === "others") {
                    $newSector = Sector::create([
                        'name' => $sector['label'],
                        'slug' => Str::slug($sector['label'], '-'),
                        'addedBy' => $sector['addedBy'],
                    ]);
                    $record->sectors()->attach($newSector->id);
                    $this->updateSingleProfileSector($newSector->id);
                }
            } elseif (is_int((int) $sector['value'])) {
                $record->sectors()->attach($sector['value']);
                $this->updateSingleProfileSector((int) $sector['value']);
            }
        }
    }

    protected function saveSkills($record, $skills)
    {
        $record->portfolio_skills()->detach();
        foreach ($skills as $skill) {
            if (array_key_exists('addedBy', $skill)) {
                if ($skill['addedBy'] === "others") {
                    $skillSlug = Str::slug($skill['label'], '-');
                    $isExistSkill = Skill::where('slug', $skillSlug)->first();
                    if (!empty($isExistSkill)) {
                        $record->portfolio_skills()->attach($isExistSkill->id);
                        $this->updateSingleProfileSkill($isExistSkill->id);
                    } else {
                        $newSkill = Skill::create([
                            'skill' => $skill['label'],
                            'slug' => Str::slug($skill['label'], '-'),
                            'addedBy' => $skill['addedBy'],
                        ]);
                        $record->portfolio_skills()->attach($newSkill->id);
                        $this->updateSingleProfileSkill($newSkill->id);
                    }
                    // $newSkill = Skill::create([
                    //     'skill' => $skill['label'],
                    //     'slug' => Str::slug($skill['label'],'-'),
                    //     'addedBy' => $skill['addedBy'],
                    // ]);
                    // $record->portfolio_skills()->attach($newSkill->id);
                    // $this->updateSingleProfileSkill($newSkill->id);
                }
            } elseif (is_int((int)$skill['value'])) {
                $record->portfolio_skills()->attach($skill['value']);
                $this->updateSingleProfileSkill((int)$skill['value']);
            }
        }
    }


    protected function updateProfileSkill($profile, $slugs)
    {
        foreach ($slugs as $slug) {
            $skill = Skill::where('slug', $slug)->first();

            $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill) {
                $query->where('skill_id', $skill->id);
            })->first();

            if (!empty($p11_employment_records_skills)) {
                $profile_skill = $profile->p11_skills()->where('skill_id', $skill->id)->first();
                if (!empty($profile_skill)) {
                    $profile_skill->fill(['has_portfolio' => '1'])->save();
                } else {
                    $profile->p11_skills()->create(['has_portfolio' => '1', 'skill_id' => $skill->id]);
                }
            }
        }
    }

    protected function destroyProfileSkill($profile)
    {
        $profile_skills = $profile->skills;
        foreach ($profile_skills->pluck('id') as $skill_id) {
            $p11_employment_records_skills = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_skills', function ($query) use ($skill_id) {
                $query->where('skill_id', $skill_id);
            })->first();

            if (!empty($p11_employment_records_skills)) {
                $profile_skill = $profile->p11_skills()->where('skill_id', $skill_id)->first();
                if (!empty($profile_skill)) {
                    $profile_skill->fill(['has_portfolio' => '0'])->save();
                } else {
                    $profile->p11_skills()->create(['has_portfolio' => '0', 'skill_id' => $skill_id]);
                }
            }
        }
    }

    // protected function updateProfileSector($profile, $sectorIds)
    // {
    //     foreach($sectorIds as $sectorId) {

    //         $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sectorId) {
    //             $query->where('sector_id', $sectorId);
    //         })->first();

    //         if (!empty($p11_employment_records_sectors)) {
    //             $profile_sector = $profile->p11_sectors()->where('sector_id',$sectorId)->first();
    //             if (!empty($profile_sector)) {
    //                 $profile_sector->fill(['has_portfolio' => '1'])->save();
    //             } else {
    //                 $profile->p11_sectors()->create(['has_portfolio' => '1', 'sector_id' => $sectorId]);
    //             }
    //         }

    //     }
    // }

    protected function destroyProfileSector($profile)
    {
        $sectors = $profile->sectors;
        foreach ($sectors->pluck('id') as $sector_id) {
            $p11_employment_records_sectors = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->whereHas('p11_employment_records_sectors', function ($query) use ($sector_id) {
                $query->where('sector_id', $sector_id);
            })->first();

            if (!empty($p11_employment_records_sectors)) {
                $profile_sector = $profile->p11_sectors()->where('sector_id', $sector_id)->first();
                if (!empty($profile_sector)) {
                    $profile_sector->fill(['has_portfolio' => '0'])->save();
                } else {
                    $profile->p11_sectors()->create(['has_portfolio' => '0', 'sector_id' => $sector_id]);
                }
            }
        }
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-portfolios",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Get list of all p11 portfolio data inside the table",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@index, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\Post(
     *   path="/api/p11-portfolios",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Store p11 portfolio data",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@store, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="P11Portfolio",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"title", "description"},
     *          @SWG\Property(property="title", type="string", description="Portfolio title", example="The title of the portfolio"),
     *          @SWG\Property(property="description", type="string", description="Portfolio description", example="The description of the portfolio"),
     *          @SWG\Property(property="url", type="string", description="Website URL", example="https://mywebsite.org"),
     *          @SWG\Property(property="attachment_id", type="integer", description="Attachment id", example=139)
     *      )
     *   )
     * )
     *
     **/
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rules);

        $portfolioData = $request->only($this->fillable);
        $portfolioData['profile_id'] = $this->authProfileId;

        $record = $this->model::create($portfolioData);

        if (!empty($validatedData['attachment_file'])) {
            $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
            $attachment->addMedia($request->file('attachment_file'))->toMediaCollection('portfolios', 'public');

            $record->attachment()->associate($attachment)->save();
        }

        /**
         * The commented code below is the early version of profile creation page, when we gathered skill and sector inside portfolio. Used in the portfolio for analytics purpose
         * Still can be useful if it's needed again
         */

        // if(!empty($validatedData['sectors'])) {
        //     $record->sectors()->sync(json_decode($validatedData['sectors']));

        //     $this->updateProfileSector($record->profile, json_decode($validatedData['sectors']));
        // }

        // if (!empty($validatedData['skills'])) {
        //     $validatedData['skills'] = json_decode($validatedData['skills']);
        //     $skills_slug = array_map(function($value) {
        //         return Str::slug($value, '-');
        //     }, $validatedData['skills']);

        //     $this->saveSkills($record, $skills_slug, $validatedData['skills']);


        //     $this->updateProfileSkill($record->profile, $skills_slug);
        // }

        // if (count($validatedData['skills'])) {
        //     $this->saveSkills($record, $validatedData['skills']);
        // }

        // if (!empty($validatedData['sectors'])) {
        //     $this->saveSectors($record, $validatedData['sectors']);

        //     // $this->updateProfileSector($record->profile, $validatedData['sectors']);
        // }

        if ($record) {
            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/p11-portfolios/{id}",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Update p11 education schools data",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@update, permission:P11 Access",
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
     *       description="P11 portfolio id"
     *   ),
     *   @SWG\Parameter(
     *      name="P11Portfolio",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "title", "description"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="title", type="string", description="Portfolio title", example="The title of the portfolio"),
     *          @SWG\Property(property="description", type="string", description="Portfolio description", example="The description of the portfolio"),
     *          @SWG\Property(property="url", type="string", description="Website URL", example="https://mywebsite.org"),
     *          @SWG\Property(property="attachment_id", type="integer", description="Attachment id", example=139)
     *      )
     *   )
     * )
     *
     **/
    public function update(Request $request, $id)
    {
        $validatedData = $this->validate($request, $this->rules);

        $record = $this->model::findOrFail($id);
        $record->fill($request->only($this->fillable));

        $updated = $record->fill($request->only($this->fillable))->save();

        if (!$updated) {
            return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
        }

        if (!empty($validatedData['attachment_file'])) {
            if (!empty($record->attachment)) {
                $oldAttachment = $record->attachment;
                $oldMedia = $oldAttachment->getMedia('portfolios');
                $oldMedia[0]->delete();
                $record->attachment()->dissociate()->save();
                $oldAttachment->delete();
            }

            $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
            $attachment->addMedia($request->file('attachment_file'))->toMediaCollection('portfolios', 's3');

            $record->attachment()->associate($attachment)->save();
        }

        /**
         * The commented code below is the early version of profile creation page, when we gathered skill and sector inside used in the portfolio for analytics purpose
         * Still can be useful if it's needed again
         */

        // if (!empty($validatedData['skills'])) {
        //     $validatedData['skills'] = json_decode($validatedData['skills']);
        //     $skills_slug = array_map(function($value) {
        //         return Str::slug($value, '-');
        //     }, $validatedData['skills']);

        //     $this->saveSkills($record, $skills_slug, $validatedData['skills']);

        //     $this->updateProfileSkill($record->profile, $skills_slug);
        // }
        // if (count($validatedData['skills'])) {
        //     $this->saveSkills($record, $validatedData['skills']);
        // }

        // if(!empty($validatedData['sectors'])) {
        //     $record->sectors()->sync(json_decode($validatedData['sectors']));
        //     $this->updateProfileSector($record->profile, json_decode($validatedData['sectors']));
        // }
        // if (!empty($validatedData['sectors'])) {
        //     $this->saveSectors($record, $validatedData['sectors']);

        //     // $this->updateProfileSector($record->profile, $validatedData['sectors']);
        // }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/p11-portfolios/{id}",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Get specific p11 portfolio data",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@show, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 portfolio id"
     *   )
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with([
            'attachment',
            // 'skills',
            // 'sectors' => function ($query) {
            //     $query->select('sectors.id as value', 'name as label');
            // }
        ])->findOrFail($id);

        $media = $record->attachment;
        if (!empty($media)) {
            $media = $media->media->first();

            if (!empty($media)) {
                $record->attachment_file = new \stdClass;
                $record->attachment_file->file_id = $record->attachment_id;
                $record->attachment_file->filename = $media->file_name;
                $record->attachment_file->download_url = $media->getFullUrlFromS3();
                // $record->attachment_file->file_url = ($media->getFullUrl('p11_thumb')) ? $media->getFullUrl('p11_thumb') : $media->getFullUrl();
                $record->attachment_file->file_url = $media->getFullUrlFromS3();
                $record->attachment_file->mime = $media->mime_type;
            } else {
                $record->attachment_file = '';
            }
            unset($record->attachment);
        }

        if (is_null($record->url)) {
            $record->url = '';
        }


        return response()->success(__('crud.success.default'), $record);
    }


    /**
     * @SWG\GET(
     *   path="/api/p11-portfolios/lists",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Get list of all p11 portfolio data that related to the logged in user / profile",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@lists, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function lists()
    {
        return response()->success(__('crud.success.default'), $this->model::where('profile_id', $this->authProfileId)->get(), 200);
    }


    /**
     * @SWG\Delete(
     *   path="/api/p11-portfolios/{id}",
     *   tags={"P11 Portfolio / Profile Portfolio"},
     *   summary="Delete p11 portfolio data",
     *   description="File: app\Http\Controllers\API\P11PortfolioController@destroy, permission:P11 Access",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="P11 portfolio id"
     *    ),
     * )
     *
     */
    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $profile = $record->profile;
        if (!empty($record->attachment)) {
            $oldAttachment = $record->attachment;
            $oldMedia = $oldAttachment->getMedia('portfolios');
            $oldMedia[0]->delete();
            $record->attachment()->dissociate()->save();
            $oldAttachment->delete();
        }
        $record->portfolio_skills()->detach();
        $record->sectors()->detach();
        $deleted = $record->delete();

        if (!$deleted) {
            return response()->error(__('crud.error.delete', ['singular' => $this->singular]), 500);
        }

        $this->destroyProfileSkill($profile);
        $this->destroyProfileSector($profile);

        return response()->success(__('crud.success.delete', ['singular' => $this->singular]));
    }
}
