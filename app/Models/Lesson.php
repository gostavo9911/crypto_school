<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'video_url',
        'duration',
        'difficulty',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'duration' => 'integer',
    ];

    // Generate a UUID for the lesson
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = (string) \Illuminate\Support\Str::uuid();
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the video popups for the lesson.
     */
    public function videoPopups(): HasMany
    {
        return $this->hasMany(VideoPopup::class);
    }

    /**
     * Get the formatted duration.
     */
    public function getFormattedDurationAttribute(): string
    {
        $minutes = floor($this->duration / 60);
        $seconds = $this->duration % 60;

        return $minutes . ':' . str_pad($seconds, 2, '0', STR_PAD_LEFT);
    }
}
