<?php

namespace App\Http\Controllers;

use App\Models\VideoPopup;
use App\Models\VideoPopupSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VideoPopupSubmissionController extends Controller
{
    /**
     * Display a listing of the user's submissions.
     */
    public function index()
    {
        $user = Auth::user();
        $submissions = VideoPopupSubmission::where('user_id', $user->id)
            ->with(['videoPopup', 'lesson'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => $submissions,
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total()
            ]
        ]);
    }

    /**
     * Store a new submission.
     */
    public function store(Request $request, $videoPopupUuid)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:quiz,cta',
            'action' => 'required_if:type,cta|string|in:open,close',
            'answer' => 'required_if:type,quiz',
            'answer_data' => 'nullable|array',
            'response_time_seconds' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get the video popup by UUID explicitly
        $videoPopup = VideoPopup::where('uuid', $videoPopupUuid)->firstOrFail();
        $user = Auth::user();

        // For CTA popups, we'll always create a submission tracking the action
        if ($request->input('type') === 'cta') {
            $submission = VideoPopupSubmission::create([
                'uuid' => Str::uuid(),
                'user_id' => $user->id,
                'video_popup_id' => $videoPopup->id,
                'lesson_id' => $videoPopup->lesson_id,
                'answer' => $request->input('action'), // 'open' or 'close'
                'answer_data' => null,
                'is_correct' => null, // Not applicable for CTA
                'responded_at' => now(),
                'response_time_seconds' => $request->input('response_time_seconds'),
                'metadata' => [
                    'popup_type' => 'cta'
                ]
            ]);

            return response()->json([
                'data' => $submission,
                'message' => 'CTA interaction recorded successfully'
            ]);
        }

        // For quiz popups, check if user already submitted an answer
        $existingSubmission = VideoPopupSubmission::where('user_id', $user->id)
            ->where('video_popup_id', $videoPopup->id)
            ->where(function ($query) {
                $query->whereNull('metadata->popup_type')
                    ->orWhere('metadata->popup_type', 'quiz');
            })
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
            'metadata' => [
                'popup_type' => 'quiz'
            ]
        ]);

        return response()->json([
            'data' => $submission,
            'message' => 'Submission recorded successfully'
        ]);
    }
}
