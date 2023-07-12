<?php

namespace App\Http\Controllers\API\Repository;

use App\Models\Contract\Contract;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Traits\iMMAPerTrait;
use Illuminate\Support\Facades\View;
use App\Models\Repository\Repository;
use App\Models\Repository\Repository_section;
use App\Models\Repository\Repository_holiday;
use App\Models\Repository\Repository_role;
use App\Models\Repository\Repository_country_permission;
use App\Models\Repository\Repository_permission;
use App\Models\Repository\Repository_category;
use PDF;
use Illuminate\Support\Facades\Storage;
use App\Models\Attachment;
use App\Models\Profile;
use App\Models\ImmapOffice;
use Illuminate\Support\Facades\Mail;

use App\Mail\DocumentNotification;

class RepositoryController extends Controller {
    use CRUDTrait, iMMAPerTrait;

    const MODEL = 'App\Models\Repository\Repository';

    const SINGULAR = 'Policy Document';

    const FILLABLE = ['category_id', 'status'];

    const RULES = [
        'category_id' => 'required|integer',
        'status' => 'required|string',
    ];

    const UPDATEx_RULES = [
        'category_id' => 'required|integer',
        'status' => 'required|string',
    ];

    const TRANSLATION = [
        'success' => [
            'default' => 'crud.success.default',
            'store' => 'crud.success.store',
            'update' => 'crud.success.update',
            'delete' => 'crud.success.delete'
        ],
        'error' => [
            'default' => 'crud.error.default',
            'store' => 'crud.error.store',
            'update_not_clean' => 'crud.error.update_not_clean',
            'update' => 'crud.error.update',
            'delete' => 'crud.error.delete'
        ],

    ];

    /**
     * @SWG\Get(
     *   path="/api/repository",
     *   tags={"Policy"},
     *   summary="Get all policy document data",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@index, permission:Index Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function index() {

        $repo= Repository::get();

        return response()->success(__('crud.success.default'), $repo);

    }

    /**
     * @SWG\Get(
     *   path="/api/repository/getImmapOffice",
     *   tags={"Policy"},
     *   summary="Get iMMAP office data for policy repository",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@getImmapOffice, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function getImmapOffice() {
        $ImmapOffice=ImmapOffice::orderBy('city')->get();
        return response()->success(__('crud.success.default'), $ImmapOffice);
    }

    /**
     * @SWG\Get(
     *   path="/api/repository/getRoleRepo",
     *   tags={"Policy"},
     *   summary="Get policy repository role data",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@getRoleRepo, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function getRoleRepo () {
        $role=Repository_role::orderBy('id')->get();
        return response()->success(__('crud.success.default'), $role);
    }

     /**
     * @SWG\Get(
     *   path="/api/repository/getDocById/{id}",
     *   tags={"Policy"},
     *   summary="Get specific policy document data",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@getDocById, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function getDocById($id) {

        $repo= Repository::where('id', $id)->with('section')->first();

        if (!is_null($repo->category->parent_id)) {
            $catid = $repo->category->id;
            unset($repo->category);
            $repo->category = Repository_category::withDepth()->find($catid);
            if ($repo->category->depth > 0) {
                for($i = 1; $i <= $repo->category->depth; $i++) {
                    $repo->category->name = '&emsp;' . $repo->category->name;
                }
            }
        }
    
        $s3Media = $repo->getMediaFromS3();
        if(!$s3Media) {
            return response()->error(__('crud.error.not_found'), 404);
        }
        $fileUrl = $s3Media->getFullUrl();

        $repo->download_url = $fileUrl;
        $repo->file_url = $fileUrl;
        $repo->mime = $repo->media->mime_type;
        unset($repo->media);

        return response()->success(__('crud.success.default'), $repo);
    }

    /**
     * @SWG\Get(
     *   path="/api/repository/{id}/{type}",
     *   tags={"Policy"},
     *   summary="Get Policy Document",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@show, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Policy category id"
     *    ),
     *    @SWG\Parameter(
     *       name="type",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="[type: 1 == national policies, 2 == global policies]"
     *    ),
     * )
     *
     */
    function show($id, $status){

        $users = User::role('Admin')->where('id', auth()->user()->id)->get();

        if($users->count()>0) {
            $repo= Repository::where(['category_id' => $id, 'type' => $status])->with(['media' => function($query) {
                $query->select('id', 'mime_type');
            }])->limit(50)->get();
        } else {
            $repo= Repository::where(['category_id' => $id, 'type' => $status, 'status' => 2])->with(['media' => function($query) {
                $query->select('id', 'mime_type');
            }])->limit(50)->get();
        }

        return response()->success(__('crud.success.default'), $repo);

    }

    /**
     * @SWG\Post(
     *    path="/api/repository/",
     *    tags={"Policy"},
     *    summary="Store Policy Document through form, So ignore the policy_files and set is_upload = 0",
     *    description="File: app\Http\Controllers\API\Repository\RepositoryController@store, permission:Store Repository|Set as Admin",
     *    security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *    @SWG\Response(response=200, description="Success"),
     *    @SWG\Response(response=422, description="Validation Error"),
     *    @SWG\Response(response=500, description="Internal server error"),
     *    @SWG\Parameter(
     *       name="Policy",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"category", "is_upload", "status", "type"},
     *              @SWG\Property(property="category", type="integer", description="Policy category id", example=""),
     *              @SWG\Property(property="is_upload", type="integer", enum={0,1}, description="Is the document being upload or document created using the form ? (1 = upload, 0 = form)", example=0),
     *              @SWG\Property(property="type", type="integer", description="[type: 1 == national policies, 2 == global policies]", example=2),
     *              @SWG\Property(property="status", type="integer", description="Status, (1 = draft, 2 = publish)", example=1),
     *              @SWG\Property(property="name", type="string", description="Document name (required if is_upload = 0)", example="Holiday Policy"),
     *              @SWG\Property(
     *                  property="addsection",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="sub_section",
     *                          type="string", description="Sub section title", example="policy title part 1"
     *                      ),
     *                      @SWG\Property(
     *                          property="sub_section_content",
     *                          type="string", description="Sub section description", example="content"
     *                      )
     *                  )
     *              )
     *           )
     *         ),
     *
     *       )
     *    ),
     * )
     *
     */
    function store(Request $request) {

        $validatedData = $this->validate($request,
            [
                'category' => 'required|integer',
                'addsection' => 'required_if:is_upload,==,0',
                'name' => 'required_if:is_upload,==,0',
                'status' => 'required|string',
                'type' => 'required|string',
                'setrole' => '',
                'idOffice' =>'',
                'OfficePermission'=>'',
                'is_upload'=>'required',
                'policy_files'=>'required_if:is_upload,==,1'
            ]
        );

        if($validatedData['is_upload']==0) {
            $contract = Repository::create([
                'category_id' => $validatedData['category'],
                'status' => $validatedData['status'],
                'type' => $validatedData['type'],
                'name' => $validatedData['name'],
                'is_upload' => 0
            ]);


            foreach($validatedData['addsection'] as $section) {

                Repository_section::create([
                    'sub_section' => $section['sub_section'],
                    'sub_section_content' => $section['sub_section_content'],
                    'repository_id' => $contract->id
                ]);

            }

            $this->toPdf($contract['id'], $validatedData['name'], $validatedData['addsection']);

        } else {

            foreach($validatedData['policy_files'] as $files){
                // $filesjson=json_decode($files);

                $cfiles = Repository::create([
                    'category_id' => $validatedData['category'],
                    'media_id' => $files['file_id'],
                    'status' => $validatedData['status'],
                    'type' => $validatedData['type'],
                    'name' => $files['filename'],
                    'file_name' => $files['filename'],
                    'download_url' => $files['download_url'],
                    'file_url' => $files['file_url'],
                    'is_upload' => 1,
                    'can_be_downloaded' => $files['can_be_downloaded'],
                ]);

            }
        }

        return response()->success(__('crud.success.default'));

    }

    function clearfilename($nm){

        $re=preg_replace("/[^a-zA-Z]+/", "_", $nm);
        return str_replace('_pdf', '',$re);

    }

    /**
     * @SWG\Post(
     *   path="/api/repository/search/",
     *   tags={"Policy"},
     *   summary="Search policy document",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@search, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="txtSearch",
     *       in="body",
     *       @SWG\Schema(
     *              required={"txtSearch"},
     *              @SWG\Property(
     *                  property="txtSearch", type="string", description="Keyword for searching name of the document", example="polic"
     *              ),
     *      )
     *   )
     * )
     *
     */

    function search(Request $request) {

        $validatedData = $this->validate($request,
            [
                'txtSearch' => 'required',

            ]
        );

        $txtSearch = $validatedData['txtSearch'];

        $authUser = auth()->user();

        $repo = Repository::where('name', 'like', '%'.$txtSearch.'%');

        if (!$authUser->hasAnyPermission(['Edit Repository','Add Repository', 'Delete Repository', 'Set as Admin'])) {
            $repo = $repo->where('status', 2)->whereHas('category', function($query) {
                $query->where('status',1);
            });
        }
        $repo = $repo->with([
            'category' => function($query) {
                $query->with('ancestors');
            },
            'media' => function($query) {
                $query->select('id', 'mime_type');
            }])->get();

        foreach($repo as $i => &$document) {
            $ancestors = $document->category->ancestors->count() ? implode(' > ', $document->category->ancestors->pluck('name')->toArray()) . ' > '  : '';
            $document->full_category =  $ancestors . $document->category->name;
        }

        return response()->success(__('crud.success.default'), $repo);
    }

    /**
     * @SWG\Post(
     *   path="/api/repository/notify/",
     *   tags={"Policy"},
     *   summary="Notify Policy To Immaper",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@notify, permission:Share Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="notify",
     *       in="body",
     *       @SWG\Schema(
     *              required={"documentID", "share"},
     *              @SWG\Property(
     *                  property="documentID", type="integer", description="Document id (Repository Model)", example=11
     *              ),
     *              @SWG\Property(
     *                  property="share", type="string", enum={"All", "Managers", "Country"}, description="Share level (All iMMAPer, Managerial Level, or Country Level)", example="Managers"
     *              ),
     *              @SWG\Property(
     *                  property="idOffice", type="array",
     *                  @SWG\Items(
     *                      type="integer", description="iMMAP office id (required if share = country)", example=2
     *                  )
     *              )
     *      )
     *   )
     * )
     *
     */

    function notify(Request $request) {

        $validatedData = $this->validate($request,
            [
                'documentID' => 'required|integer',
                'share' => 'required',
                'idOffice' => 'nullable',
            ]
        );

        if($validatedData['share']=='All') {
            $this->sendToAllMapper($validatedData['documentID']);
        } else if($validatedData['share']=='Managers') {
            $this->sendToManagers($validatedData['documentID']);
        } else if($validatedData['share']=='Country') {
            $this->sendToCountry($validatedData['documentID'], $validatedData['idOffice']);
        }

        return response()->success(__('crud.success.default'));
    }


    /**
     * IT'S RELATED TO SHARE FEATURE ON POLICY PAGE -> NEED TO DISCUSS MORE ABOUT THIS
     */
    function sendToAllMapper($documentID) {

        $document=Repository::where('id', $documentID)->first()->toArray();

        Mail::to(config('immapemail.allImmaperEmail'))->send(new DocumentNotification('All Immapers', $document, '', 'all'));
    }


    /**
     * IT'S RELATED TO SHARE FEATURE ON POLICY PAGE -> NEED TO DISCUSS MORE ABOUT THIS
     */
    function sendToManagers($documentID) {
        // $users = User::role('HR Manager')->select('immap_email', 'full_name')->get();

        // if($users->count()>0) {
        //     $document=Repository::where('id', $documentID)->first()->toArray();
        //     $manager=$users->toArray();

        //     foreach($manager as $em) {
        //         Mail::to($em['immap_email'])->send(new DocumentNotification($em['full_name'], $document));

        //     }
        // }

        $users = $this->iMMAPerFromUserQuery(User::where('p11Completed', 1))->get();

        $managers = $users->reject(function($user, $key) {
            return !$user->can("Set as Manager");
        });

        if ($managers->count() > 0) {
            $document = Repository::where('id', $documentID)->first()->toArray();
            foreach($managers as $oo) {
                Mail::to($oo['immap_email'])->send(new DocumentNotification($oo['full_name'], $document, '', 'manager'));

            }
        }

    }

    /**
     * IT'S RELATED TO SHARE FEATURE ON POLICY PAGE -> NEED TO DISCUSS MORE ABOUT THIS
     */
    function sendToCountry($documentID, $idOffice) {

        $document=Repository::where('id', $documentID)->first()->toArray();

        // $profile = Profile::select('id', 'immap_email', 'user_id')->whereIn('immap_office_id', $idOffice)//->where('id', 1)
        //     ->with(['user'=>function($q){
        //         return $q->select('id', 'full_name');
        //     }])
            // ->get();
        // $profile = Profile::select('id', 'immap_email', 'user_id')->where('is_immaper', 1)
        //     ->where('verified_immaper', 1)->whereIn('immap_office_id', $idOffice)//->where('id', 1)
        //     ->with(['user'=>function($q){
        //         return $q->select('id', 'full_name');
        //     }])
        //     ->get();


        foreach($idOffice as $idc){
            $ImmapOffice=ImmapOffice::select('city')->where('id', $idc)->get();

            $profile = $this->iMMAPerFromProfileQuery(Profile::select('immap_email')->where('immap_office_id', $idc))->get();

            $xbcc=[];
            foreach($profile as $p){
                array_push($xbcc, $p['immap_email']);
            }

            if (count($xbcc) > 90) {
                $newBcc = array_chunk($xbcc, 90);
                foreach($newBcc as $batchBcc) {
                    Mail::to(config('mail.from.address'))
                    ->send(new DocumentNotification($ImmapOffice[0]['city'], $document, $batchBcc, 'country'));
                }
            } else {
                Mail::to(config('mail.from.address'))
                    ->send(new DocumentNotification($ImmapOffice[0]['city'], $document, $xbcc, 'country'));
            }


        }

    }

    /**
     * Generate PDF File from document builder in Policy page
     *
     * @param integer   $id         policy(repository) id
     * @param string    $name       pdf name
     * @param array     $content    sub sections data
     */
    function toPdf($id, $name, $content) {

        $header=view('repository.header')->render();
        $footer=view('repository.footer')->render();
        $view = view('repository.repo', [
            'content' => $content
        ])->render();

        $pdf = PDF::loadHTML($view)
            ->setPaper('a4')
            ->setOption('margin-top', '38.1mm')
            ->setOption('margin-bottom', '27.4mm')
            ->setOption('margin-left', '25.4mm')
            ->setOption('margin-right', '25.4mm')
            ->setOption('footer-html', $footer)
            ->setOption('header-html', $header);

        $path = storage_path("app/public/repository/".$name.".pdf");
        $pdf->save($path);

        $this->createMedia($id, $path);

    }

    /**
     * Create relation between pdf file generated from toPdf function with attachment and policy(repository) data
     *
     * @param integer   $id         policy(repository) id
     * @param string    $path       pdf path
     */
    function createMedia($id, $path) {
        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($path)->toMediaCollection('repository', 's3');

        if ($attachment) {
            $media = $attachment->media->first();
            if ($media) {

                $repository = Repository::find($id);
                $repository->attachments_id = $media->model_id;
                $repository->media_id = $media->id;
                $repository->file_name = $media->file_name;
                $repository->download_url = $media->getFullUrlFromS3();
                $repository->file_url = $media->getFullUrlFromS3();

                $repository->save();

            }
        }

    }

    /**
     * @SWG\Post(
     *   path="/api/repository/{id}",
     *   tags={"Policy"},
     *   summary="Update Policy Document through form that also accept document / policy file data",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@update, permission:Index Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="Document id (repository table id)"),
     *   @SWG\Parameter(
     *       name="Policy",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method" ,"categoryd", "is_upload", "status", "type"},
     *              @SWG\Property(
     *                  property="_method", type="string", enum={"PUT"}, example="PUT"
     *              ),
     *              @SWG\Property(property="category", type="integer", description="Policy category id", example=""),
     *              @SWG\Property(property="is_upload", type="integer", enum={0,1}, description="Is the document being upload or document created using the form ? (1 = upload, 0 = form)", example=0),
     *              @SWG\Property(property="type", type="integer", description="[type: 1 == national policies, 2 == global policies]", example=2),
     *              @SWG\Property(property="status", type="integer", description="Status, (1 = draft, 2 = publish)", example=1),
     *              @SWG\Property(property="name", type="string", description="Document name (required if is_upload = 0)", example="Holiday Policy"),
     *              @SWG\Property(
     *                  property="addsection",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="sub_section",
     *                          type="string", description="Sub section title", example="policy title part 1"
     *                      ),
     *                      @SWG\Property(
     *                          property="sub_section_content",
     *                          type="string", description="Sub section description", example="content"
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="policy_files", type="array", description="Put only one data inside the array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="file_id", type="integer", description="Attachment id"),
     *                      @SWG\Property(property="download_url", type="string", description="Download URL"),
     *                      @SWG\Property(property="file_url", type="string", description="File URL")
     *                  )
     *              )
     *           )
     *         ),
     *
     *       )
     *    )
     * )
     *
     */
    function update(Request $request, int $id){

        $validatedData = $this->validate($request,
            [
                // 'category' => 'required|integer',
                // 'addsection' => 'required',
                // 'name' => 'required|string',
                // 'status' => 'required|string',
                // 'type' => 'required|string',
                'category' => 'required|integer',
                'addsection' => 'required_if:is_upload,==,0',
                'name' => 'required_if:is_upload,==,0',
                'status' => 'required|string',
                'type' => 'required|string',
                'setrole' => '',
                'idOffice' =>'',
                'OfficePermission'=>'',
                'is_upload'=>'required',
                'policy_files'=>'required_if:is_upload,==,1'
            ]
        );

        if($validatedData['is_upload']==0) {

            Repository::where('id', '=', $id)
            ->update(
                array(
                    'category_id' => $validatedData['category'],
                    'status' => $validatedData['status'],
                    'type' => $validatedData['type'],
                    'name' => $validatedData['name'],
                    'is_upload' => 0
                )
            );

            foreach($validatedData['addsection'] as $section) {

                if(!empty($section['id'])) {
                    Repository_section::where('id', '=', $section['id'])
                        ->update(
                            array(
                                'sub_section' => $section['sub_section'],
                                'sub_section_content' => $section['sub_section_content'],
                                'repository_id' => $id
                            )
                    );
                } else {
                    Repository_section::create([
                        'sub_section' => $section['sub_section'],
                        'sub_section_content' => $section['sub_section_content'],
                        'repository_id' => $id
                    ]);
                }


            }

            $this->toPdf($id, $validatedData['name'], $validatedData['addsection']);
        } else {
            $record = Repository::findOrFail($id);
            $files = $validatedData['policy_files'][0];
            $record->fill([
                'category_id' => $validatedData['category'],
                'media_id' => $files['file_id'],
                'status' => $validatedData['status'],
                'type' => $validatedData['type'],
                'name' => $files['filename'],
                'file_name' => $files['filename'],
                'download_url' => $files['download_url'],
                'file_url' => $files['file_url'],
                'is_upload' => 1,
                'can_be_downloaded' => $files['can_be_downloaded']
            ])->save();
            // foreach($validatedData['policy_files'] as $files){
                // $filesjson=json_decode($files);
                // $cfiles = Repository::create([
                //     'category_id' => $validatedData['category'],
                //     'media_id' => $files['file_id'],
                //     'status' => $validatedData['status'],
                //     'type' => $validatedData['type'],
                //     'name' => $files['filename'],
                //     'file_name' => $files['filename'],
                //     'download_url' => $files['download_url'],
                //     'file_url' => $files['file_url']
                // ]);

            // }
        }

        return response()->success(__('crud.success.default'));

    }

    /**
     * @SWG\Delete(
     *   path="/api/repository-delete-section/{id}",
     *   tags={"Policy"},
     *   summary="Delete document sub section",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@deletesection, permission:Delete Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     */
    function deletesection($id){

        $record = Repository_section::findOrFail($id);
        $deleted = $record->delete();

        if ($deleted) {
            return response()->success(__('crud.success.delete'));
        }

        return response()->error(__('crud.error.delete'), 500);

    }

    /**
     * @SWG\Post(
     *   path="/api/upload-policy-repository",
     *   tags={"Policy"},
     *   summary="Upload Policy Document (Bulk File)",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@upload_files, permission:Add Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="file",
     *      in="formData",
     *      required=true,
     *      type="file",
     *      description="Policy document file in PDF Format",
     *   )
     * )
     *
     */
    function upload_files(Request $request) {
        $validatedData = $this->validate($request, ['file' => 'required|mimes:pdf,doc,docx,xls,xlsx,xltx,ppt,pot,ppsx,pptx,potx,ppam,pptm,potm,zip,jpg,jpeg,png']);

        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($request->file('file'))->toMediaCollection('repository', 'public');

        if ($attachment) {
            $media = $attachment->media->first();
            if ($media) {

                $fileData = new \stdClass();
                $fileData->id = $media->id;
                $fileData->name = $media->file_name;
                $fileData->attachments_id = $media->model_id;
                $fileData->media_id = $media->id;
                $fileData->file_name = $media->file_name;
                $fileData->download_url = $media->getFullUrlFromS3();
                $fileData->file_url = $media->getFullUrlFromS3();
                $fileData->mime = $media->mime_type;

                return response()->success(__('profile.success.upload'), $fileData);
            }
        }

        return response()->error(__('profile.error.upload'), 500);
    }

    /**
     * @SWG\Get(
     *   path="/api/repository/pdf/{id}",
     *   tags={"Policy"},
     *   summary="Get specific policy document data in pdf file",
     *   description="File: app\Http\Controllers\API\Repository\RepositoryController@getPdf, permission:Show Repository|Set as Admin",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Parameter(
     *      name="id",
     *      in="path",
     *      type="integer",
     *      required=true,
     *      description="Document id (repository table id)"
     *   ),
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    function getPdf($id) {

        $record = Repository::where('id', $id)->firstOrFail();
        $s3Media = $record->getMediaFromS3();
        if(!$s3Media) {
            return response()->error(__('crud.error.not_found'), 404);
        }
        $fileUrl = $s3Media->getFullUrl();

        return response()->success(__('crud.success.default'), $fileUrl);
    }
}
