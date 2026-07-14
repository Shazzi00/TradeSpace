<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MockApiController;

// Real Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Real Chat Routes
Route::get('/chat/messages', [ChatController::class, 'getMessages']);
Route::post('/chat/messages', [ChatController::class, 'sendMessage']);

// Dashboards (Still reading mock structures for charts)
Route::get('/dashboard/workspace', [MockApiController::class, 'getWorkspaceData']);
Route::get('/dashboard/ecommerce', [MockApiController::class, 'getEcommerceData']);