<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InterviewController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/execute-storage-script', [ResponseController::class, 'executeStorageScript']);
Route::get('/posts/random/{randomString}', [PostController::class, 'getByRandomString']);
Route::post('/candidates', [CandidateController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/candidates/email/{email}', [CandidateController::class, 'getCandidateByEmail']);
Route::post('/responses', [ResponseController::class, 'store']);
Route::get('/candidates/{id}/data', [CandidateController::class, 'show']);
// Routes sécurisées
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);  // Route pour ajouter un utilisateur recruteur
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/send-recruiter-email', [EmailController::class, 'sendRecruiterEmail']);


    // Route::get('/admin/interviews/statistics', [InterviewController::class, 'getInterviewStatistics']); // Statistiques globales
    Route::get('/admin/interviews', [InterviewController::class, 'getCompletedInterviews']); // Entretiens terminés
    // Route::get('/admin/interviews/pending', [InterviewController::class, 'getPendingInterviews']); // Entretiens en attente
    // Route::get('/admin/recruiters/activities', [InterviewController::class, 'getRecruiterActivities']); // Activités récentes des recruteurs
    // Route::get('/admin/interviews/{id}/responses', [InterviewController::class, 'viewCompletedInterviewResponses']); // Visualiser les réponses d'un entretien terminé

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
    Route::put('/responses/{id}/rating', [ResponseController::class, 'updateRating']);


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
