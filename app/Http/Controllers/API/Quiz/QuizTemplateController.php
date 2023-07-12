<?php

namespace App\Http\Controllers\API\Quiz;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Traits\CRUDTrait;

/**
 * This is still in development, but not priority,
 * The idea is to make other type of quiz beside IM Test
 *
 */
class QuizTemplateController extends Controller
{
    use CRUDTrait;

    const MODEL = 'App\Models\Quiz\QuizTemplate';
    const SINGULAR = 'quiz template';

    const FILLABLE = ['title', 'slug', 'is_default', 'is_im_test', 'im_test_template_id', 'duration', 'pass_score'];

    const RULES = [
        'title' => 'required|string|max:255',
        'is_default' => 'required|boolean',
        'is_im_test' => 'required|boolean',
        'im_test_template' => 'sometimes|nullable|required_if:is_im_test,1',
        'im_test_template.value' => 'sometimes|nullable|required_if:is_im_test,1|integer',
        'duration' => 'sometimes|nullable|required_if:is_im_test,0|integer|min:30',
        'pass_score' => 'sometimes|nullable|required_if:is_im_test,0|integer|max:100',
        'multiple_choice_questions' => 'sometimes|nullable|required_if:is_im_test,0|required_without:essay_questions|array',
        'essay_questions' => 'sometimes|nullable|required_if:is_im_test,0|required_without:multiple_choice_questions|array'
    ];

    /**
     * @SWG\GET(
     *   path="/api/quiz-templates",
     *   tags={"Quiz Templates"},
     *   summary="Get all quiz template data",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@index, permission:Index Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */

     /**
     * @SWG\GET(
     *   path="/api/quiz-templates/all-options",
     *   tags={"Quiz Templates"},
     *   summary="Get all quiz template data in {value: 1, label: template 1} format",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@index, permission:Add Quiz|Edit Quiz",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=500, description="Internal server error"),
     * )
     *
     */
    public function allOptions() {
        return response()->success(__('crud.success.default'), $this->model::select('id as value', 'title as label')->orderBy('title', 'asc')->get());
    }

    /**
     * @SWG\GET(
     *   path="/api/quiz-templates/{id}",
     *   tags={"Quiz Templates"},
     *   summary="Get specific quiz template data",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@show, permission:Show Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Quiz template id"
     *    ),
     * )
     *
     */
    public function show($id)
    {
        $record = $this->model::with(['im_test_template'])->findOrFail($id);

        return response()->success(__('crud.success.default'), $record);
    }

    /**
     * The part below is not fully developed yet, the idea is to have other type of quiz besides the IM Test
     * There is should be duration, pass score, multiple choice questions and essay questions
     * This features only working for setup the quiz template as IM Test
     * Duration property and below is not fixed yet
     */
    /**
     * @SWG\POST(
     *   path="/api/quiz-templates",
     *   tags={"Quiz Templates"},
     *   summary="Store quiz template data",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@store, permission:Add Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="QuizTemplate",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"title", "is_default", "is_im_test", "im_test_template", "duration", "pass_score",
     *                  "multiple_choice_questions", "essay_questions"},
     *              @SWG\Property(property="title", type="string", description="Quiz template title", example="quiz template 1"),
     *              @SWG\Property(property="is_default", type="integer", enum={0,1}, description="Set quiz template as default (1 == default, 0 == no)", example=0),
     *              @SWG\Property(property="is_im_test", type="integer", enum={0,1}, description="Set quiz template as IM Test (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="im_test_template", type="object", description="Choose IM Test template [Required if is_im_test == 1]",
     *                  @SWG\Property(property="value", type="integer", description="IM Test template id", example=1)
     *              ),
     *              @SWG\Property(property="duration", type="integer", description="Quiz duration [required if min: 30]", example=""),
     *              @SWG\Property(property="pass_score", type="integer", description="", example=""),
     *              @SWG\Property(
     *                  property="multiple_choice_questions",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="question",
     *                          type="string"
     *                      ),
     *                      @SWG\Property(
     *                          property="score",
     *                          type="string",
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="essay_questions",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="question",
     *                          type="string"
     *                      ),
     *                      @SWG\Property(
     *                          property="score",
     *                          type="string",
     *                      )
     *                  )
     *              )
     *       )
     *   )
     * )
     *
     */
    public function store(Request $request) {
        $validatedData = $this->validate($request, $this->rules);

        $recordData = $request->only($this->fillable);
        $recordData['im_test_template_id'] = $validatedData['im_test_template']['value'];

        $record = $this->model::create($recordData);

        if (!$record) {
            return response()->success(__('crud.error.store', ['singular' => $this->singular]), 500);
        }

        if ($record->is_default == 1) {
            $this->model::where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        if(!empty($validatedData['multiple_choice_questions'])) {
            foreach($validatedData['multiple_choice_questions'] as $mc_question) {
                $question = $record->multiple_choice_questions()->create([
                    'question' => $mc_question['question'],
                    'score' => $mc_question['score']
                ]);

                foreach($mc_question['multiple_choice_answers'] as $answer) {
                    $question->multiple_choice_answers()->create([
                        'answer' => $answer['answer'],
                        'is_correct' => $answer['is_correct']
                    ]);
                }
            }
            // $record->multiple_choice_questions()->
        }

        if(!empty($validatedData['essay_questions'])) {
            foreach($validatedData['essay_questions'] as $e_question) {
                $question = $record->essay_questions()->create([
                    'question' => $e_question['question'],
                    'score' => $e_question['score']
                ]);
            }
        }

        return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
    }

    /**
     * @SWG\POST(
     *   path="/api/quiz-templates/{id}",
     *   tags={"Quiz Templates"},
     *   summary="Update quiz templates",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@update, permission:Edit Quiz Template",
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
     *       description="Quiz template id"
     *   ),
     *   @SWG\Parameter(
     *       name="QuizTemplate",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"_method", "title", "is_default", "is_im_test", "im_test_template", "duration", "pass_score",
     *                  "multiple_choice_questions", "essay_questions"},
     *              @SWG\Property(property="_method", type="string", enum={"PUT"}, example="PUT"),
     *              @SWG\Property(property="title", type="string", description="Quiz template title", example="quiz template 1"),
     *              @SWG\Property(property="is_default", type="integer", enum={0,1}, description="Set quiz template as default (1 == default, 0 == no)", example=0),
     *              @SWG\Property(property="is_im_test", type="integer", enum={0,1}, description="Set quiz template as IM Test (1 == yes, 0 == no)", example=1),
     *              @SWG\Property(property="im_test_template", type="object", description="Choose IM Test template [Required if is_im_test == 1]",
     *                  @SWG\Property(property="value", type="integer", description="IM Test template id", example=1)
     *              ),
     *              @SWG\Property(property="duration", type="integer", description="Quiz duration [required if min: 30]", example=""),
     *              @SWG\Property(property="pass_score", type="integer", description="", example=""),
     *              @SWG\Property(
     *                  property="multiple_choice_questions",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="question",
     *                          type="string"
     *                      ),
     *                      @SWG\Property(
     *                          property="score",
     *                          type="string",
     *                      )
     *                  )
     *              ),
     *              @SWG\Property(
     *                  property="essay_questions",
     *                  type="array",
     *                  @SWG\Items(
     *                      type="object",
     *                      @SWG\Property(
     *                          property="question",
     *                          type="string"
     *                      ),
     *                      @SWG\Property(
     *                          property="score",
     *                          type="string",
     *                      )
     *                  )
     *              )
     *       )
     *   ),
     * )
     *
     */
    public function update(Request $request, int $id) {
        $validatedData = $this->validate($request, $this->rules);

        $recordData = $request->only($this->fillable);
        $recordData['im_test_template_id'] = $validatedData['im_test_template']['value'];

        $record = $this->model::findOrFail($id);

        $record->fill($recordData)->save();

        if ($record->is_default == 1) {
            $this->model::where('id', '<>', $record->id)->update(['is_default' => 0]);
        }

        if ($record) {
            return response()->success(__('crud.success.update', ['singular' => ucfirst($this->singular)]), $record);
        }

        return response()->error(__('crud.error.update', ['singular' => $this->singular]), 500);

        // if(!empty($validatedData['multiple_choice_questions'])) {
        //     foreach($validatedData['multiple_choice_questions'] as $mc_question) {
        //         $question = $record->multiple_choice_questions()->create([
        //             'question' => $mc_question['question'],
        //             'score' => $mc_question['score']
        //         ]);

        //         foreach($mc_question['multiple_choice_answers'] as $answer) {
        //             $question->multiple_choice_answers()->create([
        //                 'answer' => $answer['answer'],
        //                 'is_correct' => $answer['is_correct']
        //             ]);
        //         }
        //     }
        //     // $record->multiple_choice_questions()->
        // }

        // if(!empty($validatedData['essay_questions'])) {
        //     foreach($validatedData['essay_questions'] as $e_question) {
        //         $question = $record->essay_questions()->create([
        //             'question' => $e_question['question'],
        //             'score' => $e_question['score']
        //         ]);
        //     }
        // }

        // return response()->success(__('crud.success.store', ['singular' => ucfirst($this->singular)]), $record);
    }


    /**
     * @SWG\POST(
     *   path="/api/quiz-templates/set-is-default",
     *   tags={"Quiz Templates"},
     *   summary="Set quiz template data as default",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@store, permission:Index Quiz Template|Edit Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=422, description="Validation Error"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="QuizTemplate",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *              required={"id"},
     *              @SWG\Property(property="id", type="integer", description="Quiz template id", example=1),
     *       )
     *   )
     * )
     *
     */
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
     * @SWG\Delete(
     *   path="/api/quiz-templates/{id}",
     *   tags={"Quiz Templates"},
     *   summary="Delete quiz template data",
     *   description="File: app\Http\Controllers\API\QuizTemplateController@destroy, permission:Delete Quiz Template",
     *   security={"type":"apiKey", "name":"Authorization", "in":"header", "description":"Info: JWT Bearer Token"},
     *   @SWG\Response(response=200, description="Success"),
     *   @SWG\Response(response=404, description="Sorry, data not found"),
     *   @SWG\Response(response=500, description="Internal server error"),
     *   @SWG\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       type="integer",
     *       description="Quiz template id"
     *    ),
     * )
     *
     */
}
