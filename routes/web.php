<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request; 
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/candidates', [CandidateController::class, 'index']);
Route::post('/candidates', [CandidateController::class, 'store']);
Route::get('/candidates/{id}', [CandidateController::class, 'show']);
Route::put('/candidates/{id}', [CandidateController::class, 'update']);
Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);
Route::get('/candidates/email/{email}', [CandidateController::class, 'getCandidateByEmail']);



Route::get('/responses', [ResponseController::class, 'index']);
Route::post('/responses', [ResponseController::class, 'store']);
Route::get('/responses/{id}', [ResponseController::class, 'show']);
Route::put('/responses/{id}', [ResponseController::class, 'update']);
Route::delete('/responses/{id}', [ResponseController::class, 'destroy']);
Route::post('/execute-storage-script', [ResponseController::class, 'executeStorageScript']);

Route::get('/recruiters', [RecruiterController::class, 'index']);
Route::post('/recruiters', [RecruiterController::class, 'store']);
Route::get('/recruiters/{id}', [RecruiterController::class, 'show']);
Route::put('/recruiters/{id}', [RecruiterController::class, 'update']);
Route::delete('/recruiters/{id}', [RecruiterController::class, 'destroy']);

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);
Route::get('/posts/random/{randomString}', [PostController::class, 'getByRandomString']);

// Routes pour attacher et détacher des questions aux postes
Route::post('/posts/{id}/questions', [PostController::class, 'attachQuestion']);
Route::delete('/posts/{id}/questions', [PostController::class, 'detachQuestion']);

Route::get('/questions', [QuestionController::class, 'index']);
Route::post('/questions', [QuestionController::class, 'store']);
Route::get('/questions/{id}', [QuestionController::class, 'show']);
Route::put('/questions/{id}', [QuestionController::class, 'update']);
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);


Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
