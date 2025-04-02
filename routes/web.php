<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LessonsController;
use App\Http\Controllers\VideoPopupController;
use App\Http\Controllers\VideoPopupSubmissionController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Lessons routes
    Route::get('lessons', [LessonsController::class, 'index'])->name('lessons');
    Route::get('lessons/{lesson}', [LessonsController::class, 'show'])->name('lessons.show');

    // Video popup submissions
    Route::post('popups/{uuid}/submit', [VideoPopupSubmissionController::class, 'store'])
        ->name('popups.submit');
    Route::get('popups/submissions', [VideoPopupSubmissionController::class, 'index'])
        ->name('popups.submissions');
    Route::get('lessons/{lesson}/popups', [VideoPopupController::class, 'getLessonPopups'])
        ->name('lessons.popups');
    Route::get('popups/{uuid}', [VideoPopupController::class, 'show'])
        ->name('popups.show');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
