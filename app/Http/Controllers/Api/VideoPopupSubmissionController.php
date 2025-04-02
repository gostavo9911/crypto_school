<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VideoPopupSubmissionResource;
use App\Models\VideoPopup;
use App\Models\VideoPopupSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VideoPopupSubmissionController extends Controller
{
    /**
     * Display a listing of the user's submissions.
     */
    public function index(Request $request): JsonResource
    {
        $user = $request->user();
        $submissions = VideoPopupSubmission::where('user_id', $user->id)
            ->with(['videoPopup', 'lesson'])
            ->latest()
            ->paginate(15);

        return VideoPopupSubmissionResource::collection($submissions);
    }

    /**
     * Store a new submission.
     */
    public function store(Request $request, VideoPopup $videoPopup)
    {
        $validator = Validator::make($request->all(), [
            'answer' => 'required_if:type,quiz',
            'answer_data' => 'nullable|array',
            'response_time_seconds' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Check if user already submitted an answer for this popup
        $existingSubmission = VideoPopupSubmission::where('user_id', $user->id)
            ->where('video_popup_id', $videoPopup->id)
            ->first();

        if ($existingSubmission) {
            return response()->json([
                'message' => 'You have already submitted an answer for this quiz'
            ], 409);
        }

        // For quizzes, determine if the answer is correct
        $isCorrect = null;
        if ($videoPopup->type === 'quiz') {
            $options = $videoPopup->options['answers'] ?? [];
            $userAnswerId = $request->input('answer_data.selected_id');

            foreach ($options as $option) {
                if ($option['id'] == $userAnswerId && ($option['is_correct'] ?? false)) {
                    $isCorrect = true;
                    break;
                } else if ($option['id'] == $userAnswerId) {
                    $isCorrect = false;
                    break;
                }
            }
        }

        $submission = VideoPopupSubmission::create([
            'uuid' => Str::uuid(),
            'user_id' => $user->id,
            'video_popup_id' => $videoPopup->id,
            'lesson_id' => $videoPopup->lesson_id,
            'answer' => $request->input('answer'),
            'answer_data' => $request->input('answer_data'),
            'is_correct' => $isCorrect,
            'responded_at' => now(),
            'response_time_seconds' => $request->input('response_time_seconds'),
        ]);

        return new VideoPopupSubmissionResource($submission);
    }
}
