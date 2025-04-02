<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\VideoPopup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoPopupController extends Controller
{
    /**
     * Get popups for a specific lesson.
     */
    public function getLessonPopups(Lesson $lesson)
    {
        $user = Auth::user();

        // Get all active popups for the lesson
        $popups = $lesson->videoPopups()
            ->where('is_active', true)
            ->orderBy('appear_at')
            ->get();

        // Get IDs of popups the user has already answered
        $answeredPopupIds = $user->videoPopupSubmissions()
            ->where('lesson_id', $lesson->id)
            ->pluck('video_popup_id')
            ->toArray();

        // Filter out popups that have already been answered by the user
        $filteredPopups = $popups->filter(function ($popup) use ($answeredPopupIds) {
            // Only filter quiz popups - CTA popups can still be shown
            if ($popup->type === 'quiz') {
                return !in_array($popup->id, $answeredPopupIds);
            }
            return true;
        });

        return response()->json([
            'data' => $filteredPopups->values()
        ]);
    }

    /**
     * Display the specified video popup.
     */
    public function show($uuid)
    {
        $videoPopup = VideoPopup::where('uuid', $uuid)->firstOrFail();

        return response()->json([
            'data' => $videoPopup
        ]);
    }
}
