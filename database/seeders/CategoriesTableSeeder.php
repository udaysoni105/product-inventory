<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * @return void
     */
    public function run()
    {
        //Collect all the predefined categories into an array
        $collection = [
            'Electronics','Books','Clothing','Furniture','Toys','Groceries','Health & Beauty','Sports & Outdoors',
            'Automotive','Jewelry','Music','Office Supplies','Pet Supplies','Home Decor','Garden',
            'Baby Products','Footwear','Kitchenware','Art & Craft','Software',
        ];

        //Foreach loop of array starts
        foreach ($collection as $value) {
        $exist = Category::where('name', $value)->first();
        //Checking the above categories exist in the system or not. If one or more categories exists in the system then it will not be created again and hence an info will be logged 
        if ($exist !== null && $exist !== "") {
            Log::info("CategoriesTableSeeder::run::" . $value . " Category already exists.");
        } else {
            $data = ['name' => $value];
            Category::create($data);
        }
        }
    }
}
