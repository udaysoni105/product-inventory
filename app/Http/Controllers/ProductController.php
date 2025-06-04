<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    /**
    * @author : Uday Soni
    *
    * Method name: index
    * This method is used for retrieve Product List.
    *
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when retrieve Product detail.
    */
    public function index(Request $request){
        Log::info('Admin::ProductController::index::Start');
        $result = DB::transaction(function () use ($request) {
        try {
            $input = $request->all();
            info($input);
            $query = Product::with('categories');
            // Search by name
            if ($request->has('filter') && !empty($request->filter)) {
                $query->where('name', 'like', '%' . $request->filter . '%');
            }
            // Filter by categories
            if ($request->has('category_ids') && is_array($request->category_ids) && count($request->category_ids) > 0) {
                foreach ($request->category_ids as $categoryId) {
                    $query->whereHas('categories', function ($q) use ($categoryId) {
                        $q->where('categories.id', $categoryId);
                    });
                }
            }
            // Sorting
            $order = $request->get('order', 'created_at'); 
            $orderType = $request->get('order_type', 'desc');
            $query->orderBy($order, $orderType);
            // Pagination
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            $products = $query->paginate($limit, ['*'], 'page', $page);
            return response()->json([
                'products' => $products->items(),
                'totalPages' => $products->lastPage(),
                'total' => $products->total(),
            ]);
            } catch (Exception $ex) {
                Log::error('ProductController::index::Exception', ['error' => $ex->getMessage()]);
                return response()->json(['error' => 'Something went wrong.'], 500);
            }
        });
        return $result;
    }

    /**
    * @author : Uday Soni
    *
    * Method name: store
    * This method is used for Create Product detail from storage and display in form .
    *
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when Create Product.
    */
    public function store(Request $request){
        Log::info('Admin::ProductController::store::Start');
        return DB::transaction(function () use ($request) {
            try {
                $input = $request->all();
                info($input);
                if (!empty($input)) {
                    $validation = Product::validate($input);
                    if ($validation->fails()) {
                        $commaSeparated = $validation->messages()->all();
                        $message = implode("\n", $commaSeparated);
                        Log::warning('Admin::ProductController::store::' . $message);
                        // return response()->json(['message' => 'Validation failed', 'errors' => $messages], 422);
                        return response()->json(['flag' => false, 'code' => 400,'message' => $message,])->setStatusCode(400);
                    }
                    $validatedData = $validation->validated();
                    $product = Product::create($validatedData);
                    if ($product) {
                        $product->categories()->sync($validatedData['categories'] ?? []);
                        Log::info('Admin::ProductController::store::End');
                        // return response()->json($product->load('categories'), 201);
                    } else {
                        Log::error('Admin::ProductController::store::Creation failed');
                        return response()->json(['message' => 'Product creation failed!'], 500);
                    }
                } else {
                    Log::info('ProductController::store::Empty input data');
                    return response()->json(['error' => 'Input data is empty.'], 400);
                }
            } catch (Exception $ex) {
                Log::error('ProductController::store::Exception', ['error' => $ex->getMessage()]);
                return response()->json(['error' => 'Something went wrong.'], 500);
            }
        });
    }

    /**
    * @author : Uday Soni
    *
    * Method name: showProduct
    * This method is used for retrieve particular Product detail from storage and display in form.
    *
    * @param  {integer} id - The id of the Product.
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when retrieve particular Product detail.
    */
    public function showProduct($id){
        Log::info('Admin::ProductController::showProduct::Start');
        return DB::transaction(function () use ($id) {
            try {
                if (is_null($id) || empty($id) || !is_numeric($id)) {
                    Log::error('Admin::ProductController::showProduct::Invalid ID');
                    return response()->json(['error' => 'Invalid product ID'], 400);
                }
                $product = Product::with('categories')->find($id);
                if (!$product) {
                    Log::error("Admin::ProductController::showProduct::Product not found with ID: $id");
                    return response()->json(['error' => 'Product not found'], 404);
                }
                Log::info("Admin::ProductController::showProduct::Success");
                return response()->json([
                    'product' => $product,
                    'categories' => $product->categories
                ], 200);
            } catch (\Exception $e) {
                Log::error('Admin::ProductController::showProduct::Exception - ' . $e->getMessage());
                return response()->json(['error' => 'Something went wrong'], 500);
            }
        });
    }

    /**
    * @author : Uday Soni
    *
    * Method name: update
    * This method is used for retrieve particular Product detail from storage and display in form .
    *
    * @param  {integer} id - The id of the Product.
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when retrieve particular Product detail.
    */
    public function update($id, Request $request){
        Log::info('Admin::ProductController::update::Start');
        $result = DB::transaction(function () use ($id, $request) {
            try {
                $input = $request->all();
                info($input);
                if(null != $input && '' != $input) {
                    // Find the product
                    $validation = Product::validateUpdate($input,$id);
                    if ($validation->fails()) {
                        $commaSeparated = $validation->messages()->all();
                        $errors = $validation->errors(); 
                        $message = implode("\n", $commaSeparated);
                        Log::warning('Admin::ProductController::store::' . $message);
                        // return response()->json(['message' => $errors->messages()], 422);
                        return response()->json(['flag' => false, 'code' => 400,'message' => $message,])->setStatusCode(400);
                    }
                    $validated = $validation->validated();
                    $product = Product::findOrFail($id);
                    // Update product fields
                    $product->update(['name' => $validated['name'],'description' => $validated['description'] ?? null,'quantity' => $validated['quantity']]);
                    // Sync categories
                    if (isset($validated['categories'])) {
                        $product->categories()->sync($validated['categories']);
                    }
                    return response()->json(['message' => 'Product updated successfully.','product' => $product], 200);
                } else {
                    Log::info('ProductController::update::Empty input data');
                    return response()->json(['error' => 'Input data is empty.'], 400);
                }
            } catch (Exception $ex) {
                Log::error('Admin::ProductController::update::');
                throw new Exception($ex);
            }
        });
        return $result;
    }

    /**
    * @author : Uday Soni
    *
    * Method name: destroy
    * This method is used for delete particular Product detail from storage and display in form .
    *
    * @param  {integer} id - The id of the Product.
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when delete particular Product detail.
    */
    public function destroy($id){
    Log::info('Admin::ProductController::destroy::Start');
        $result = DB::transaction(function () use ($id) {
            try {
                $product = Product::findOrFail($id);
                $product->delete();
                Log::info('Admin::ProductController::destroy::Success', ['product_id' => $id]);
                return response()->json(['status' => true,'message' => 'Product deleted successfully.'], 200);
            }  catch (\Exception $e) {
                Log::error('Admin::ProductController::destroy::Error', [ 'product_id' => $id,'error' => $e->getMessage()        ]);
                return response()->json(['status' => false, 'message' => 'Product not found.'], 404);
            }
        });
        return $result;
    }

    /**
    * @author : Uday Soni
    *
    * Method name: getAllCategories
    * This method is used for retrieve particular Categories detail.
    *
    * @return Product detail,Response code,message.
    * @exception throw if any error occur when retrieve particular Category detail.
    */
    public function getAllCategories(Request $request){
    Log::info('Admin::ProductController::getAllCategories::Start');
        $result = DB::transaction(function () use ($request) {
            try {
                $categories = Category::all();
                return response()->json(['status' => true,'message' => 'Categories retrieved successfully.','data' => $categories], 200);
            } catch (\Exception $e) {
                Log::error('Admin::ProductController::getAllCategories::Error', ['error' => $e->getMessage()]);
                return response()->json(['status' => false,'message' => 'Failed to retrieve categories.'], 500);
            }
        });
        return $result;
    }
}
