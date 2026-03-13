<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ContactController;

// ── PUBLIC ───────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

Route::get('/about',              [AboutController::class,      'show']);
Route::get('/skills',             [SkillController::class,      'index']);
Route::get('/experiences',        [ExperienceController::class, 'index']);
Route::get('/educations',         [EducationController::class,  'index']);
Route::get('/projects',           [ProjectController::class,    'index']);
Route::get('/projects/{project}', [ProjectController::class,    'show']);
Route::post('/contact',           [ContactController::class,    'store']);

// ── PROTECTED ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // About — accept both POST and PUT (POST for multipart/file uploads)
    Route::post('/about',  [AboutController::class, 'update']);
    Route::put('/about',   [AboutController::class, 'update']);
    Route::patch('/about', [AboutController::class, 'update']);

    // Skills
    Route::post('/skills',           [SkillController::class, 'store']);
    Route::put('/skills/{skill}',    [SkillController::class, 'update']);
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

    // Experience
    Route::post('/experiences',                [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}',    [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);

    // Education
    Route::post('/educations',               [EducationController::class, 'store']);
    Route::put('/educations/{education}',    [EducationController::class, 'update']);
    Route::delete('/educations/{education}', [EducationController::class, 'destroy']);

    // Projects — POST for both create and update (needed for file uploads)
    Route::post('/projects',             [ProjectController::class, 'store']);
    Route::post('/projects/{project}',   [ProjectController::class, 'update']);
    Route::put('/projects/{project}',    [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Contacts
    Route::get('/contacts',                [ContactController::class, 'index']);
    Route::put('/contacts/{contact}/read', [ContactController::class, 'markRead']);
    Route::delete('/contacts/{contact}',   [ContactController::class, 'destroy']);
});
