<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VideoPopup extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'lesson_id',
        'title',
        'content',
        'type',
        'appear_at',
        'duration',
        'is_skippable',
        'is_active',
        'options',
        'metadata',
    ];

    protected $casts = [
        'appear_at' => 'integer',
        'duration' => 'integer',
        'is_skippable' => 'boolean',
        'is_active' => 'boolean',
        'options' => 'array',
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
     * Get the lesson that the popup belongs to.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the submissions for the popup.
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(VideoPopupSubmission::class);
    }
}
