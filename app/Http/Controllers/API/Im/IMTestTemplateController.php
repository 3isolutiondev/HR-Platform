<?php

namespace App\Http\Controllers\API\Im;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;
use App\Models\Imtest\Imtest;
use App\Models\Attachment;
use Illuminate\Support\Facades\Validator;


class IMTestTemplateController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Imtest\IMTestTemplate';
    const SINGULAR = 'IM test template';

    const FILLABLE = [
        'name', 'is_default', 'limit_time_hour', 'limit_time_minutes'
    ];

    const DATA_SET_RULES = [
        'file' => 'required|mimes:pdf|max:2048',
        'collection_name' => 'required|string'
    ];

    const RULES = [
        'name' => 'required|string|max:255',
        'is_default' => 'required|boolean',
        'limit_time_hour' => 'required|integer',
        'limit_time_minutes' => 'required|integer',

        'step1' => 'required',
        'step1.text1' => 'required|string',
        'step1.title' => 'required|string',

        'step2' => 'required',
        'step2.title' => 'required|string',
        'step2.text1' => 'required|string',
        'step2.text2' => 'required|string',
        'step2.text3' => 'required|string',
        'step2.file_dataset1.model_id' => 'required|integer',
        'step2.file_dataset2.model_id' => 'required|integer',
        'step2.questions' => 'required|array',
        'step2.questions.*.question' => 'required|string',
        'step2.questions.*.answer' => 'required|array',
        'step2.questions.*.answer.*.choice' => 'required|string',
        'step2.questions.*.answer.*.true_false' => 'required|boolean',

        'step3' => 'required',
        'step3.file_dataset1.model_id' => 'required|integer',
        'step3.file_dataset2.model_id' => 'required|integer',
        'step3.title' => 'required|string',
        'step3.text1' => 'required|string',
        'step3.text2' => 'required|string',
        'step3.text3' => 'required|string',
        'step3.text4' => 'required|string',
        'step3.questions' => 'required|array',
        'step3.questions.*.question' => 'required|string',
        'step3.questions.*.answer' => 'required|array',
        'step3.questions.*.answer.*.choice' => 'required|string',
        'step3.questions.*.answer.*.true_false' => 'required|boolean',

        'step4' => 'required',
        'step4.title' => 'required|string',
        'step4.text1' => 'required|string',

        'step5' => 'required',
        'step5.title' => 'required|string',
        'step5.text1' => 'required|string',

        // "steps" => 'required|integer',
        // "stepData" => 'required|array',
        // 'stepData.title' => 'required|string',
        // 'stepData.text1' => 'required|string',
        // 'stepData.limit_time' => 'required_if:step,1|string',

    ];

    protected function saveQuestion($question, $idimtest)
    {
        $questionImTest = \App\Models\Imtest\Question_im_test::create([
            'question' => $question['question'],
            'im_test_id' => $idimtest
        ]);

        foreach ($question['answer'] as $answers) {
            \App\Models\Imtest\Multiple_choice::create([
                "choice" => $answers['choice'],
                "question_im_test_id" => $questionImTest->id,
                "true_false" => $answers['true_false']
            ]);
        }
    }

    function saveEditQuestion($question)
    {
        // dd($question['id']);
        $id_questionImTest = \App\Models\Imtest\Question_im_test::where('id', '=', $question['id'])->update(
            array(
                "question" => $question['question'],
            )
        );

        foreach ($question['answer'] as $answers) {
            \App\Models\Imtest\Multiple_choice::updateOrCreate([
                "id" => $answers['id']
            ], [
                "choice" => $answers['choice'],
                "true_false" => $answers['true_false']
            ]);
        }
    }

    public function updateImTest($newData)
    {

        $result = \App\Models\Imtest\Imtest::updateOrCreate([
            "id" => $newData['id']
        ], [
            "title" => $newData['title'],
            "text1" => $newData['text1'],
            "steps" => $newData['steps'],
            // "limit_time" => empty($newData['limit_time']) ? null : $newData['limit_time'],
            "text2" => empty($newData['text2']) ?  null : $newData['text2'],
            "text3" => empty($newData['text3']) ?   null : $newData['text3'],
            "text4" => empty($newData['text4']) ?  null : $newData['text4'],
            "file_dataset1" => empty($newData['file_dataset1']) ?  null : $newData['file_dataset1'],
            "file_dataset2" =>  empty($newData['file_dataset2']) ?  null : $newData['file_dataset2'],
            "file_dataset3" =>  empty($newData['file_dataset3']) ?  null : $newData['file_dataset3']
        ]);
        return $result;

        // foreach ($dataTempImTest as $imTest) {
        //     $result = \App\Models\Imtest\Imtest::updateOrCreate([
        //         "id" => $imTest['id']
        //     ], [
        //         "title" => $newData->title,
        //         "text1" => $newData->text1,
        //         "limit_time" => $newData['limit_time'] ? $newData['limit_time'] : null,
        //         "text2" =>$newData['text2'] ?$newData['text2'] : null,
        //         "text3" => $newData['text3'] ? $newData['text3'] : null,
        //         "text4" => $newData['text4'] ? $newData['text4'] : null,
        //         "file_dataset1" => $newData['file_dataset1'] ? $newData['file_dataset1'] : null,
        //         "file_dataset2" => $newData['file_dataset2'] ? $newData['file_dataset2'] : null,
        //         "file_dataset3" => $newData['file_dataset3'] ? $newData['file_dataset3'] : null,
        //     ]);
        //     return $result;
        // }
    }

    /**
     * @SWG\Post(
     *   path="/api/im-test-update-data-set",
     *   tags={"IM Test Template"},
     *   summary="Update data set on IM test templates",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@im_test_update_data_set, permission:Index IM Test Template|Edit IM Test Template|Apply Job",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="file",
     *       in="formData",
     *       required=true,
     *       type="file",
     *       description="Data set file"
     *  ),
     *  @SWG\Parameter(
     *       name="collection_name",
     *       in="formData",
     *       required=true,
     *       type="string",
     *       description="collection name"
     *   )
     *
     * )
     *
     **/
    public function im_test_update_data_set(Request $request)
    {
        $validatedData = $this->validate($request, self::DATA_SET_RULES);
        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($request->file)->toMediaCollection($validatedData['collection_name'], 's3');

        if ($attachment) {
            $media = $attachment->media->first(); // get media through attachment relation
            if ($media) {
                $attachment = new \stdClass(); // create empty class
                $attachment->id = $media->id;
                $attachment->filename = $media->file_name;
                $attachment->download_url = $media->getFullUrlFromS3();
                $attachment->file_url = $media->getFullUrlFromS3();
                $attachment->mime = $media->mime_type;
                $attachment->model_id = $media->model_id;

                return response()->success(__('attachment.success.upload'), $attachment);
            }
        }

        return response()->error(__('attachment.error.upload'), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/im-test-destroy-data-set/{id}",
     *   tags={"IM Test Template"},
     *   summary="Delete data set used in IM test templates",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@im_test_destroy_data_set, permission:Index IM Test Template|Edit IM Test Template|Delete IM Test Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="attachment id")
     *
     * )
     *
     **/
    public function im_test_destroy_data_set($id)
    {
        $record = Attachment::findOrFail($id);
        return response()->json($record);
        // $deleted = $record->delete();

        // if ($deleted) {
        //     return response()->success(__('attachment.success.delete'));
        // }

        return response()->error(__('attachment.error.delete'), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/im-test-templates/all-options",
     *   tags={"IM Test Template"},
     *   summary="Get list of IM Test templates in {value: 1, label: Template 1} format",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@allOptions, Permission: Index IM Test Template|Add Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions()
    {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'name as label')->orderBy('name', 'asc')->get());
    }

    /**
     * @SWG\Post(
     *   path="/api/im-test-templates",
     *   tags={"IM Test Template"},
     *   summary="Store IM test template",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@store, permission:Add IM Test Template, Please see the mockup to make it clear",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="IMTestTemplate",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"name", "is_default","limit_time_hour", "limit_time_minutes", "step1", "step2", "step3", "step4", "step5"},
     *          @SWG\Property(property="name", type="string", description="IM test template name", example="Template 1"),
     *          @SWG\Property(
     *              property="is_default",
     *              type="integer",
     *              enum={0,1},
     *              description="Boolean in 1 and 0 format, 1 == true, 0 == false, set the IM Test template as default",
     *              example="true"
     *          ),
     *          @SWG\Property(property="limit_time_hour", type="integer", description="Time limit example: 4 hours 30 minutes, save the hours in this field", example=4),
     *          @SWG\Property(property="limit_time_minutes", type="integer", description="Time limit example: 4 hours 30 minutes, save the minutes in this field", example=30),
     *          @SWG\Property(
     *              property="step1",
     *              type="object",
     *              @SWG\Property(property="text1", type="string", description="Body text in step 1", example="<p>Tutorial to do the test text</p>"),
     *              @SWG\Property(property="title", type="string", description="Title text in step 1", example="Welcome to the test")
     *          ),
     *          @SWG\Property(
     *              property="step2",
     *              type="object",
     *              @SWG\Property(property="title", type="string", description="Part 1 Data analysis - step 2", example="Part 1 - Data Analysis"),
     *              @SWG\Property(property="text1", type="string", description="Question and explanation about dataset in part 1 data analysis - step2",
     *                  example="<p>Here are two 4W datasets from two different sources. Luckily, the datasets are in the same format.<p><p>Combine them into one, clean the dataset and make it ready for analysis.</p>"
     *              ),
     *              @SWG\Property(property="file_dataset1", type="object",
     *                  @SWG\Property(
     *                      property="model_id",
     *                      type="integer",
     *                      description="First dataset (1) for part 1 data analysis (file saved in attachments, put attachment id here)",
     *                      example=1
     *                  )
     *              ),
     *              @SWG\Property(property="file_dataset2", type="object",
     *                  @SWG\Property(
     *                      property="model_id",
     *                      type="integer",
     *                      description="Second dataset (2) for part 1 data analysis (file saved in attachments, put attachment id here)",
     *                      example=2
     *                  )
     *              ),
     *              @SWG\Property(property="text2", type="string", description="Text below dataset - step2", example="<p>Based on the new Dataset you just created, answer the following questions:</p>"),
     *              @SWG\Property(property="questions", type="array", description="Multiple choice questions based on part 1 data analysis dataset",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="question", type="string", description="Multiple choice question", example="How many people did the organisation 'PARC' serve?"),
     *                      @SWG\Property(property="answer", type="array", description="List of choices options",
     *                          @SWG\Items(
     *                              type="object",
     *                              @SWG\Property(property="choice", type="string", description="Option of the question (max: 4)", example="Option 1"),
     *                              @SWG\Property(property="true_false", type="integer", enum={0,1}, description="Boolean, 1 as true, 0 as false, set true for the correct answer", example=1)
     *                          )
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="text3", type="string", description="Information - step 2",
     *                  example="<p>Create a simple dashboard</p><ul><li>Beneficiaries by organisation</li><li>Top 3 Activities</li><li>Activities per month</li></ul><p>Add at least 2 more pieces of information that you think are relevant</p>"
     *              ),
     *          ),
     *          @SWG\Property(property="step3", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 2 Data mapping - step 3", example="Part 2 - Data Mapping"),
     *              @SWG\Property(property="text1", type="string", description="Body text (question) - step 3", example="Create 2 maps:"),
     *              @SWG\Property(property="text2", type="string", description="Map A (question) - step 3", example="<p>Use the linked dataset to find all health facilities of the type 'HOPITAL GENERAL DE REFERENCE' that are within 3 km of a primary road.</p><p>Show all facilities that fit the criteria on a map with a label for each one of them.</p>"),
     *              @SWG\Property(property="file_dataset1", type="object",
     *                  @SWG\Property(property="model_id", type="integer", description="Map A dataset (file saved in attachments, put attachment id here)", example=10)
     *              ),
     *              @SWG\Property(property="text3", type="string", description="Map B (question) - step 3", example="<p>Create a simple map that shows where the concentration of health facilities</p>"),
     *              @SWG\Property(property="questions", type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="question", type="string", description="Multiple choice question", example="Count the number of Health Facilities for each Territory (Admin 2)."),
     *                      @SWG\Property(property="answer", type="array", description="List of choices options",
     *                          @SWG\Items(
     *                              type="object",
     *                              @SWG\Property(property="choice", type="string", description="Option of the question (max: 4)", example="Option 2"),
     *                              @SWG\Property(property="true_false", type="integer", enum={0,1}, description="Boolean, 1 as true, 0 as false, set true for the correct answer", example=1)
     *                          )
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="file_dataset2", type="object",
     *                  @SWG\Property(property="model_id", type="integer", description="Map B dataset (file saved in attachments, put attachment id here)", example=12)
     *              ),
     *              @SWG\Property(property="text4", type="string", description="Information text (extra question) - step 3", example="<p>Extra task (Optional) :</p><p>Create an interactive map using the same datasets.</p>")
     *          ),
     *          @SWG\Property(property="step4", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 3 Humanitarian Needs Assesment - step 4", example="Part 3 - Humanitarian Needs Assesment"),
     *              @SWG\Property(property="text1", type="string", description="Extra assessment - step 4", example="<p>You are tasked to run a needs assessment in a region that was affected by a natural disaster.</p><p>What steps will you take to get a good idea of the humanitarian needs ?</p><p>Describe your approach in bullet points</p>"),
     *          ),
     *          @SWG\Property(property="step5", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 4 Communications with Partners - step 5", example="Part 4 - Communications with Partners"),
     *              @SWG\Property(property="text1", type="string", description="Message Reporting - step 5", example="<p>You are workin as an Information Management Officer for a cluster in a country affected by a natural disaster.</p><p>Your cluster coordinator made you aware that of your 37 partners only 12 have been reporting their activities on time and using the correct format. The others were either late or used an outdated reporting format.</p><p>He / she asks you to write a message that can be circulated to improve the reporting.</p><p>Write a message to the partners to improve the reporting.</p>"),
     *          )
     *      )
     *   )
     * )
     *
     */
    public function store(Request $request)
    {

        $validatedData = Validator::make($request->json()->all(), $this->rules);
        $record = $this->model::create($request->only($this->fillable));

        if ($validatedData->fails()) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        if ($request['is_default'] == 1) {
            $this->model::where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        if ($record) {
            $imtest1 = [
                'steps' => '1',
                'title' => $request['step1.title'],
                'text1' => $request['step1.text1'],
                'im_test_templates_id' => $record['id']
                // 'limit_time' => $request['step1.limit_time'],

            ];

            $imtest2 = [
                'steps' => '2',
                'title' => $request['step2.title'],
                'text1' => $request['step2.text1'],
                'text2' => $request['step2.text2'],
                'text3' => $request['step2.text3'],
                'file_dataset1' => $request['step2.file_dataset1.model_id'],
                'file_dataset2' => $request['step2.file_dataset2.model_id'],
                'im_test_templates_id' => $record['id']
            ];

            $imtest3 = [
                'steps' => '3',
                'title' => $request['step3.title'],
                'text1' => $request['step3.text1'],
                'text2' => $request['step3.text2'],
                'text3' => $request['step3.text3'],
                'text4' => $request['step3.text4'],
                'file_dataset1' => $request['step3.file_dataset1.model_id'],
                'file_dataset2' => $request['step3.file_dataset2.model_id'],
                'im_test_templates_id' => $record['id']
            ];

            $imtest4 = [
                'steps' => '4',
                'title' => $request['step4.title'],
                'text1' => $request['step4.text1'],
                'im_test_templates_id' => $record['id']
            ];

            $imtest5 = [
                'steps' => '5',
                'title' => $request['step5.title'],
                'text1' => $request['step5.text1'],
                'im_test_templates_id' => $record['id']
            ];

            $im1 = Imtest::create($imtest1);
            $im2 = Imtest::create($imtest2);
            $im3 = Imtest::create($imtest3);
            $im4 = Imtest::create($imtest4);
            $im5 = Imtest::create($imtest5);



            $this->saveQuestion($request['step2.questions'][0], $im2->id);
            $this->saveQuestion($request['step2.questions'][1], $im2->id);
            $this->saveQuestion($request['step2.questions'][2], $im2->id);

            $this->saveQuestion($request['step3.questions'][0], $im3->id);

            $record->imtes = [$im1, $im2, $im3, $im4, $im5];

            return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/im-test-templates/{id}",
     *   tags={"IM Test Template"},
     *   summary="Update IM test templates",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@update, permission:Edit IM Test Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="IM test template id"),
     *   @SWG\Parameter(
     *      name="IMTestTemplate",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"_method", "name", "is_default","limit_time_hour", "limit_time_minutes", "step1", "step2", "step3", "step4", "step5"},
     *          @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *          @SWG\Property(property="name", type="string", description="IM test template name", example="Template 1"),
     *          @SWG\Property(
     *              property="is_default",
     *              type="integer",
     *              enum={0,1},
     *              description="Boolean in 1 and 0 format, 1 == true, 0 == false, set the IM Test template as default",
     *              example="true"
     *          ),
     *          @SWG\Property(property="limit_time_hour", type="integer", description="Time limit example: 4 hours 30 minutes, save the hours in this field", example=4),
     *          @SWG\Property(property="limit_time_minutes", type="integer", description="Time limit example: 4 hours 30 minutes, save the minutes in this field", example=30),
     *          @SWG\Property(
     *              property="step1",
     *              type="object",
     *              @SWG\Property(property="text1", type="string", description="Body text in step 1", example="<p>Tutorial to do the test text</p>"),
     *              @SWG\Property(property="title", type="string", description="Title text in step 1", example="Welcome to the test")
     *          ),
     *          @SWG\Property(
     *              property="step2",
     *              type="object",
     *              @SWG\Property(property="title", type="string", description="Part 1 Data analysis - step 2", example="Part 1 - Data Analysis"),
     *              @SWG\Property(property="text1", type="string", description="Question and explanation about dataset in part 1 data analysis - step2",
     *                  example="<p>Here are two 4W datasets from two different sources. Luckily, the datasets are in the same format.<p><p>Combine them into one, clean the dataset and make it ready for analysis.</p>"
     *              ),
     *              @SWG\Property(property="file_dataset1", type="object",
     *                  @SWG\Property(
     *                      property="model_id",
     *                      type="integer",
     *                      description="First dataset (1) for part 1 data analysis (file saved in attachments, put attachment id here)",
     *                      example=1
     *                  )
     *              ),
     *              @SWG\Property(property="file_dataset2", type="object",
     *                  @SWG\Property(
     *                      property="model_id",
     *                      type="integer",
     *                      description="Second dataset (2) for part 1 data analysis (file saved in attachments, put attachment id here)",
     *                      example=2
     *                  )
     *              ),
     *              @SWG\Property(property="text2", type="string", description="Text below dataset - step2", example="<p>Based on the new Dataset you just created, answer the following questions:</p>"),
     *              @SWG\Property(property="questions", type="array", description="Multiple choice questions based on part 1 data analysis dataset",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="question", type="string", description="Multiple choice question", example="How many people did the organisation 'PARC' serve?"),
     *                      @SWG\Property(property="answer", type="array", description="List of choices options",
     *                          @SWG\Items(
     *                              type="object",
     *                              @SWG\Property(property="choice", type="string", description="Option of the question (max: 4)", example="Option 1"),
     *                              @SWG\Property(property="true_false", type="integer", enum={0,1}, description="Boolean, 1 as true, 0 as false, set true for the correct answer", example=1)
     *                          )
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="text3", type="string", description="Information - step 2",
     *                  example="<p>Create a simple dashboard</p><ul><li>Beneficiaries by organisation</li><li>Top 3 Activities</li><li>Activities per month</li></ul><p>Add at least 2 more pieces of information that you think are relevant</p>"
     *              ),
     *          ),
     *          @SWG\Property(property="step3", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 2 Data mapping - step 3", example="Part 2 - Data Mapping"),
     *              @SWG\Property(property="text1", type="string", description="Body text (question) - step 3", example="Create 2 maps:"),
     *              @SWG\Property(property="text2", type="string", description="Map A (question) - step 3", example="<p>Use the linked dataset to find all health facilities of the type 'HOPITAL GENERAL DE REFERENCE' that are within 3 km of a primary road.</p><p>Show all facilities that fit the criteria on a map with a label for each one of them.</p>"),
     *              @SWG\Property(property="file_dataset1", type="object",
     *                  @SWG\Property(property="model_id", type="integer", description="Map A dataset (file saved in attachments, put attachment id here)", example=10)
     *              ),
     *              @SWG\Property(property="text3", type="string", description="Map B (question) - step 3", example="<p>Create a simple map that shows where the concentration of health facilities</p>"),
     *              @SWG\Property(property="questions", type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(property="question", type="string", description="Multiple choice question", example="Count the number of Health Facilities for each Territory (Admin 2)."),
     *                      @SWG\Property(property="answer", type="array", description="List of choices options",
     *                          @SWG\Items(
     *                              type="object",
     *                              @SWG\Property(property="choice", type="string", description="Option of the question (max: 4)", example="Option 2"),
     *                              @SWG\Property(property="true_false", type="integer", enum={0,1}, description="Boolean, 1 as true, 0 as false, set true for the correct answer", example=1)
     *                          )
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(property="file_dataset2", type="object",
     *                  @SWG\Property(property="model_id", type="integer", description="Map B dataset (file saved in attachments, put attachment id here)", example=12)
     *              ),
     *              @SWG\Property(property="text4", type="string", description="Information text (extra question) - step 3", example="<p>Extra task (Optional) :</p><p>Create an interactive map using the same datasets.</p>")
     *          ),
     *          @SWG\Property(property="step4", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 3 Humanitarian Needs Assesment - step 4", example="Part 3 - Humanitarian Needs Assesment"),
     *              @SWG\Property(property="text1", type="string", description="Extra assessment - step 4", example="<p>You are tasked to run a needs assessment in a region that was affected by a natural disaster.</p><p>What steps will you take to get a good idea of the humanitarian needs ?</p><p>Describe your approach in bullet points</p>"),
     *          ),
     *          @SWG\Property(property="step5", type="object",
     *              @SWG\Property(property="title", type="string", description="Part 4 Communications with Partners - step 5", example="Part 4 - Communications with Partners"),
     *              @SWG\Property(property="text1", type="string", description="Message Reporting - step 5", example="<p>You are workin as an Information Management Officer for a cluster in a country affected by a natural disaster.</p><p>Your cluster coordinator made you aware that of your 37 partners only 12 have been reporting their activities on time and using the correct format. The others were either late or used an outdated reporting format.</p><p>He / she asks you to write a message that can be circulated to improve the reporting.</p><p>Write a message to the partners to improve the reporting.</p>"),
     *          )
     *      )
     *   )
     * )
     *
     */
    public function update(Request $request, $id)
    {
        $validatedData = Validator::make($request->json()->all(), $this->rules);

        $record = $this->model::find($id);

        if ($validatedData->fails()) {
            return response()->error(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        $imtest1 = [
            "id" => $request['step1.id'],
            'steps' => '1',
            'title' => $request['step1.title'],
            'text1' => $request['step1.text1'],
            // 'limit_time' => $request['step1.limit_time'],
        ];

        $imtest2 = [
            "id" => $request['step2.id'],
            'steps' => '2',
            'title' => $request['step2.title'],
            'text1' => $request['step2.text1'],
            'text2' => $request['step2.text2'],
            'text3' => $request['step2.text3'],
            'file_dataset1' => $request['step2.file_dataset1.model_id'],
            'file_dataset2' => $request['step2.file_dataset2.model_id'],
        ];

        $imtest3 = [
            "id" => $request['step3.id'],
            'steps' => '3',
            'title' => $request['step3.title'],
            'text1' => $request['step3.text1'],
            'text2' => $request['step3.text2'],
            'text3' => $request['step3.text3'],
            'text4' => $request['step3.text4'],
            'file_dataset1' => $request['step3.file_dataset1.model_id'],
            'file_dataset2' => $request['step3.file_dataset2.model_id'],
        ];

        $imtest4 = [
            "id" => $request['step4.id'],
            'steps' => '4',
            'title' => $request['step4.title'],
            'text1' => $request['step4.text1'],
        ];

        $imtest5 = [
            "id" => $request['step5.id'],
            'steps' => '5',
            'title' => $request['step5.title'],
            'text1' => $request['step5.text1'],
        ];

        if (!$record) {
            return response()->not_found();
        }

        $record->fill($request->only($this->fillable));

        // if ($record->isClean()) {
        //     return response()->error(__('crud.error.update_not_clean'), 422);
        // }

        $record->save();

        if ($request['is_default'] == 1) {
            $this->model::where('id', '<>', $record->id)->update(['is_default' => 0]);
        }




        $tempIm1 = $this->updateImTest($imtest1);
        $tempIm2 =  $this->updateImTest($imtest2);
        $tempIm3 = $this->updateImTest($imtest3);
        $tempIm4 = $this->updateImTest($imtest4);
        $tempIm5 = $this->updateImTest($imtest5);



        $this->saveEditQuestion($request['step2.questions'][0]);
        $this->saveEditQuestion($request['step2.questions'][1]);
        $this->saveEditQuestion($request['step2.questions'][2]);

        $this->saveEditQuestion($request['step3.questions'][0]);

        $record->step1 = $tempIm1;
        $record->step2 = $tempIm2;
        $record->step3 = $tempIm3;
        $record->step4 = $tempIm4;
        $record->step5 = $tempIm5;

        return response()->json($tempIm1);


        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\Post(
     *   path="/api/im-test-templates/set-is-default",
     *   tags={"IM Test Template"},
     *   summary="set default / undefault IM test template",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@setIsDefault, permission:Index IM Test Template|Edit IM Test Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *      name="IMTestTemplate",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(
     *          required={"id"},
     *          @SWG\Property(property="id", type="integer", description="IM test template id", example=2),
     *       )
     *    )
     * )
     *
     **/
    public function setIsDefault(Request $request)
    {
        $validatedData = $this->validate($request, ['id' => 'required|integer']);

        $record = $this->model::findOrFail($validatedData['id']);

        if ($record->is_default == 0) {
            $record->fill(['is_default' => 1]);
        } else {
            $record->fill(['is_default' => 0]);
        }

        if ($record->isClean()) {
            return response()->error(__('crud.error.update_not_clean'), 422);
        }

        $record->save();

        if ($record->is_default == 1) {
            $this->model::where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);
    }

    /**
     * @SWG\GET(
     *   path="/api/im-test-templates/{id}",
     *   tags={"IM Test Template"},
     *   summary="Get specific IM test template data",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@show, Permission: Show IM Test Template",
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
     *       description="IM test template id"
     *    )
     * )
     *
     */
    public function show($id)
    {

        $getData = $this->model::select('id', 'name', 'slug', 'is_default', 'limit_time_hour', 'limit_time_minutes')
            ->with(['imtes', 'imtes.questions' => function ($query) {
                return $query->with('answer');
            }])->findOrFail($id);

        $imteswithimg = [];

        foreach ($getData->imtes as $key => &$imtes) {
            $oriimtes = $imtes->toArray();
            $imtes = array_merge($oriimtes, $this->getmedia($imtes->file_dataset1, $imtes->file_dataset2, $imtes->file_dataset3));
            $imteswithimg[$key] = $imtes;
        }

        $getData->unsetRelation('imtes');
        $getData->imtes = $imteswithimg;

        return response()->success(__('crud.success.default'), $getData);
    }

    /**
     * @SWG\GET(
     *   path="/api/im-test-templates/{id}/steps/{step}",
     *   tags={"IM Test Template"},
     *   summary="im test steps",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@steps, permission:Show IM Test Template",
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
     *      description="IM test template id"
     *   ),
     *   @SWG\Parameter(
     *      name="step",
     *      in="path",
     *      required=true,
     *      type="integer",
     *      description="Step number"
     *    )
     * )
     *
     */
    function steps($templateID, $step)
    {
        $profilauthID = \App\Models\Profile::select('id')->where('user_id', \Auth::id())->first()->id;
        //  $profilauthID = \App\Models\Profile::select('id')->where('user_id', auth()->user()->id);

        // $getData = $this->model::select('id', 'name', 'slug', 'is_default')
        //     ->with(['imtes' => function ($query) use ($step) {
        //         return $query->where('steps', $step)
        //             // ->with('questions', 'questions.answer')
        //             ->with(['questions'=>function($q){
        //                 return $q->with('answer');
        //             }])
        //             ->with(['belonging_profil'=>function($q){
        //                 return $q->select('profiles.id', 'profiles.first_name',
        //                     'profiles.middle_name', 'profiles.family_name')
        //                     ->with('answer_im_test_question');
        //             }])
        //             ;
        //     }])
        //     // ->with('belonging_profil')
        //     ->findOrFail($templateID);

        $getData = $this->model::select('id', 'name', 'slug', 'is_default', 'limit_time_hour', 'limit_time_minutes', 'created_at')
            ->with(['imtes' => function ($query) use ($step) {
                return $query->where('steps', $step);
            }])

            ->findOrFail($templateID);
        $imteswithimg = [];

        foreach ($getData->imtes as $key => &$imtes) {
            $oriimtes = $imtes->toArray();
            $imtes = array_merge($oriimtes, $this->getmedia(
                $imtes->file_dataset1,
                $imtes->file_dataset2,
                $imtes->file_dataset3
            ));

            $question = array_merge($imtes, $this->question($imtes['id']));
            $followimtes = array_merge($question, $this->followimtes($imtes['id'], $profilauthID));
            $imteswithimg[$key] = $followimtes;
        }

        $getData->unsetRelation('imtes');
        $getData->imtes = $imteswithimg;

        return response()->success(__('crud.success.default'), $getData);
    }

    function followimtes($imtesID, $profilID = NULL)
    {
        $adddata = array();
        $getData = \App\Models\Imtest\Follow_im_test::select('*')->where('im_test_id', $imtesID)
            ->where('profil_id', $profilID);

        foreach ($getData->get() as $key => $q) {
            $adddata[$key] = array(
                'id' => $q->id,
                'text1' => $q->text1,
                'text2' => $q->text2,
                'text3' => $q->text3,
                'im_test_id' => $q->im_test_id,
                'profil_id' => $q->profil_id,
                'file1' => $this->getmediafile($q->file1, 'file1'),
                'file2' => $this->getmediafile($q->file2, 'file2'),
                'file3' => $this->getmediafile($q->file3, 'file3')
            );
        }
        return array(
            'follow-imtes' => $adddata
        );
    }

    function question($imtesID)
    {

        $adddata = array();
        $getData = \App\Models\Imtest\Question_im_test::select('*')->where('im_test_id', $imtesID)
            ->with('im_test_q_answer');

        foreach ($getData->get() as $key => $q) {

            $adddata[$key] = array(
                'questionID' => $q->id,
                'question' => $q->question,
                'user-answer' => $q->im_test_q_answer,
                'answer' => $this->getmultiplechoice($q->id)
            );
        }

        return array(
            'questions' => $adddata
        );
    }

    function getmultiplechoice($questionID)
    {
        $getData = \App\Models\Imtest\Multiple_choice::select('*')->where('question_im_test_id', $questionID);

        return $getData->get()->toArray();
    }

    function getuseranswer($imtesID, $questionID)
    {
        $adddata = array();

        $getData = \App\Models\Imtest\Question_im_test::select('*')->where('im_test_id', $imtesID);

        // foreach($questions as $oo) {
        //     $adddata['user-answer-'.$oo['id']] = array(
        //         'ppp' => $oo['question']
        //     );
        // }

        return $adddata;
    }

    function getmediafile($file, $nm)
    {
        $adddata = array();
        if (!empty($file)) {
            $media = \App\Models\Attachment::findorfail($file);
            if (count($media->getMedia($nm)) > 0) {
                $adddata[$nm] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia($nm)[0]->id . '/' .
                        $media->getMedia($nm)[0]->file_name,
                    'filename' => $media->getMedia($nm)[0]->file_name,
                    'mime' => $media->getMedia($nm)[0]->mime_type,
                    'model_id' => $media->getMedia($nm)[0]->model_id
                );
            }
        }

        return $adddata;
    }

    function getmedia($file1, $file2, $file3)
    {

        $adddata = array();

        if (!empty($file1)) {
            $media = \App\Models\Attachment::findorfail($file1);
            if (count($media->getMedia('file_dataset1')) > 0) {
                $adddata['file_dataset1'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset1')[0]->id . '/' . $media->getMedia('file_dataset1')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset1')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset1')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset1')[0]->model_id
                );
            }
        }

        if (!empty($file2)) {
            $media = \App\Models\Attachment::findorfail($file2);
            if (count($media->getMedia('file_dataset2')) > 0) {
                $adddata['file_dataset2'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset2')[0]->id . '/' . $media->getMedia('file_dataset2')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset2')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset2')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset2')[0]->model_id
                );
            }
        }

        if (!empty($file3)) {
            $media = \App\Models\Attachment::findorfail($file3);
            if (count($media->getMedia('file_dataset3')) > 0) {
                $adddata['file_dataset2'] = array(
                    'file_url' => asset('/storage/') . '/' . $media->getMedia('file_dataset3')[0]->id . '/' . $media->getMedia('file_dataset3')[0]->file_name,
                    'filename' => $media->getMedia('file_dataset3')[0]->file_name,
                    'mime' => $media->getMedia('file_dataset3')[0]->mime_type,
                    'model_id' => $media->getMedia('file_dataset3')[0]->model_id
                );
            }
        }

        return $adddata;
    }

    /**
     * @SWG\GET(
     *   path="/api/im-test-templates",
     *   tags={"IM Test Template"},
     *   summary="Get list of IM test templates",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@index, permission:Index IM Test Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

    /**
     * @SWG\Delete(
     *   path="/api/im-test-templates/{id}",
     *   tags={"IM Test Template"},
     *   summary="Delete IM test templates",
     *   description="File: app\Http\Controllers\API\IMTestTemplateController@destroy, permission:Delete IM Test Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(name="id", in="path", required=true, type="integer", description="IM test template id")
     * )
     *
     */
}
