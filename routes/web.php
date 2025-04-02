<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('lessons', function () {
        return Inertia::render('Lessons');
    })->name('lessons');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
