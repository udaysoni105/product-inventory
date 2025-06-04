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

Route::post('api/products', [ProductController::class, 'index']);
Route::post('api/product', [ProductController::class, 'store']);
Route::get('api/products/{id}', [ProductController::class, 'showProduct']);
Route::delete('api/deactive_product/{id}', [ProductController::class, 'destroy']);
Route::get('api/categories', [ProductController::class, 'getAllCategories']);
Route::put('api/edit_product/{id}', [ProductController::class, 'update']);

