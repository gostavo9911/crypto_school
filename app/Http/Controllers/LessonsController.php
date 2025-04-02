<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonsController extends Controller
{
    /**
     * Display a listing of the lessons.
     */
    public function index()
    {
        $lessons = Lesson::where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Lessons', [
            'lessons' => $lessons
        ]);
    }

    /**
     * Display the specified lesson.
     */
    public function show(Lesson $lesson)
    {
        return Inertia::render('Lesson', [
            'lesson' => $lesson
        ]);
    }
}
