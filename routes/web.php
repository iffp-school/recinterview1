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

Route::get('/responses', [ResponseController::class, 'index']);
Route::post('/responses', [ResponseController::class, 'store']);
Route::get('/responses/{id}', [ResponseController::class, 'show']);
Route::put('/responses/{id}', [ResponseController::class, 'update']);
Route::delete('/responses/{id}', [ResponseController::class, 'destroy']);

Route::apiResource('recruiters', RecruiterController::class);

Route::apiResource('posts', PostController::class);
Route::post('posts/{id}/questions', [PostController::class, 'attachQuestion']);
Route::delete('posts/{id}/questions', [PostController::class, 'detachQuestion']);

Route::apiResource('questions', QuestionController::class);


Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
