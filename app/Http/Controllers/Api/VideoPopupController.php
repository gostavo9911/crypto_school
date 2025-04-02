<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VideoPopupResource;
use App\Models\Lesson;
use App\Models\VideoPopup;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoPopupController extends Controller
{
    /**
     * Get popups for a specific lesson.
     */
    public function getLessonPopups(Lesson $lesson): JsonResource
    {
        $popups = $lesson->videoPopups()
            ->where('is_active', true)
            ->orderBy('appear_at')
            ->get();

        return VideoPopupResource::collection($popups);
    }

    /**
     * Display the specified video popup.
     */
    public function show(VideoPopup $videoPopup): JsonResource
    {
        return new VideoPopupResource($videoPopup);
    }
}
