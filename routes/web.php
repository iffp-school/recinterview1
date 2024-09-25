<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/execute-storage-script', [ResponseController::class, 'executeStorageScript']);
Route::get('/posts/random/{randomString}', [PostController::class, 'getByRandomString']);
Route::post('/candidates', [CandidateController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/candidates/email/{email}', [CandidateController::class, 'getCandidateByEmail']);
Route::post('/responses', [ResponseController::class, 'store']);
// Routes sécurisées
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/dashboard-data-admin', [DashboardController::class, 'getAdminDashboardData']);
    Route::get('/dashboard-data-recruiter', [DashboardController::class, 'getRecruiterDashboardData']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/candidates/{id}', [CandidateController::class, 'show']);
    Route::put('/candidates/{id}', [CandidateController::class, 'update']);
    Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);
    Route::put('/candidates/{id}/rating', [CandidateController::class, 'updateRating']);

    Route::get('/responses', [ResponseController::class, 'index']);
    Route::get('/responses/{id}', [ResponseController::class, 'show']);
    Route::put('/responses/{id}', [ResponseController::class, 'update']);
    Route::delete('/responses/{id}', [ResponseController::class, 'destroy']);


    Route::get('/recruiters', [RecruiterController::class, 'index']);
    Route::post('/recruiters', [RecruiterController::class, 'store']);
    Route::get('/recruiters/{id}', [RecruiterController::class, 'show']);
    Route::put('/recruiters/{id}', [RecruiterController::class, 'update']);
    Route::delete('/recruiters/{id}', [RecruiterController::class, 'destroy']);

    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}/responses', [PostController::class, 'getResponsesByPost']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{id}/questions', [PostController::class, 'attachQuestion']);
    Route::delete('/posts/{id}/questions', [PostController::class, 'detachQuestion']);

    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::get('/questions/{id}', [QuestionController::class, 'show']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
