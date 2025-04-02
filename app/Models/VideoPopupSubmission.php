<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoPopupSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'video_popup_id',
        'lesson_id',
        'answer',
        'answer_data',
        'is_correct',
        'responded_at',
        'response_time_seconds',
        'metadata',
    ];

    protected $casts = [
        'answer_data' => 'array',
        'is_correct' => 'boolean',
        'responded_at' => 'datetime',
        'response_time_seconds' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the user that created the submission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the video popup that this submission is for.
     */
    public function videoPopup(): BelongsTo
    {
        return $this->belongsTo(VideoPopup::class);
    }

    /**
     * Get the lesson associated with this submission.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
