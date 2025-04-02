<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoPopupSubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'user_id' => $this->user_id,
            'popup_id' => $this->whenLoaded('videoPopup', function () {
                return $this->videoPopup->uuid;
            }),
            'lesson_id' => $this->whenLoaded('lesson', function () {
                return $this->lesson->uuid;
            }),
            'answer' => $this->answer,
            'answer_data' => $this->answer_data,
            'is_correct' => $this->is_correct,
            'responded_at' => $this->responded_at,
            'response_time_seconds' => $this->response_time_seconds,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
