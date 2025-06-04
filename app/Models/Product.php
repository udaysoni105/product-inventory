<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class Product extends Model
{
    protected $table = 'products';
    protected $fillable = ['name', 'description', 'quantity'];
    protected $hidden = ['updated_at'];
    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];
    use HasFactory;

    /**
    * @author : Uday Soni
    *
    * Method name: validate
    * Define for validate Product data.
    *
    * @param  {array} data - The data is array of product
    * @return  array object of validate product
    */
    public static function validate($data) {
        $rule = array(
            'name' => 'required|string|unique:products,name|max:255',
            'description' => 'nullable|string|max:1000',
            'quantity' => 'required|integer|min:0|regex:/^[\d\s\-()+]+$/',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id'
        );
        $messages = array(
            'required' => ':attribute field is required.',
            'max' => ':attribute may not be greater than :max characters.',
        );
        $data = Validator::make($data, $rule, $messages);
        $data->setAttributeNames(array(
            'name' => ucfirst('name'),
            'description' => ucfirst('description'),
            'quantity' => ucfirst('quantity'),
            'Categories' => ucfirst('Categories')
        ));
        return $data;
    }

    /**
    * @author : Uday Soni
    *
    * Method name: validate
    * Define for validate Product data.
    *
    * @param  {array} data - The data is array of product
    * @return  array object of validate product
    */
    public static function validateUpdate($data,$id) {
        $rule = array(
            // 'name' => 'required|string|max:255',
            'name' => ['required','string','max:255',Rule::unique('products', 'name')->ignore($id)],
            'description' => 'nullable|string|max:1000',
            'quantity' => 'required|integer|min:0|regex:/^[\d\s\-()+]+$/',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id'
        );
        $messages = array(
            'required' => ':attribute field is required.',
            'max' => ':attribute may not be greater than :max characters.',
        );
        $data = Validator::make($data, $rule, $messages);
        $data->setAttributeNames(array(
            'name' => ucfirst('name'),
            'description' => ucfirst('description'),
            'quantity' => ucfirst('quantity'),
            'Categories' => ucfirst('Categories')
        ));
        return $data;
    }


    public function categories(){
        return $this->belongsToMany(Category::class);
    }


}
