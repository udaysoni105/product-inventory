<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Get all categories
Route::get('api/categories', [ProductController::class, 'getAllCategories']);

// List products
Route::post('api/products', [ProductController::class, 'index']);

// Create product
Route::post('api/product', [ProductController::class, 'store']);

// Get product by ID
Route::get('api/products/{id}', [ProductController::class, 'showProduct']);

// Update product
Route::put('api/products/{id}', [ProductController::class, 'update']);

// Delete product
Route::delete('api/products/{id}', [ProductController::class, 'destroy']);

