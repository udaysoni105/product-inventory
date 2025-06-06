export const REACT_APP_API_URL = process.env.REACT_APP_DOMAIN == "development"
    ? window.location.protocol + "//" + window.location.hostname + ":8000/"
    : window.location.protocol + "//" + window.location.hostname + ":8000/";


export const API = "api/";

export const CONTANT_TYPE = "application/json";

export const ACCEPT_TYPE = "application/json";

export const CONTACT_API_ROUTE = "contact";

export const CAREER_API_ROUTE = "career";

export const QUOTE_API_ROUTE = "quote";

export const PRODUCTS_API_ROUTE = "products";

export const PRODUCT_API_ROUTE = "product";

export const CATEGORIES_API_ROUTE = "categories";

export const PRODUCT_DEACTIVE_API_ROUTE = "deactive_product";

export const PRODUCT_EDIT_API_ROUTE = "edit_product";

export const LOAD_PRODUCTS_FAILED = 'Failed to load products';

export const PRODUCT_DELETED_SUCCESS = 'Product deleted successfully!';

export const DELETE_PRODUCT_FAILED = 'Failed to delete product.';

export const FETCH_CATEGORIES_FAILED = "Failed to fetch categories";

export const PRODUCT_CREATED_SUCCESS = "Product created successfully!";

export const CREATE_PRODUCT_FAILED = "Failed to create product";

export const PRODUCT_EDIT_SUCCESS = "Product Edit successfully!";

export const EDIT_PRODUCT_FAILED = "Failed to Edit product";

export const NAME_REQUIRED = 'Name is required.';

export const PRODUCT_NAME_MAX_LENGTH = 'Name must be at most 255 characters.';

export const DESCRIPTION_MAX = 'Description must be at most 1000 characters.';

export const QUANTITY_TYPE = 'Quantity must be a number.';

export const QUANTITY_REQUIRED = 'Quantity is required.';

export const QUANTITY_MIN = 'Quantity cannot be negative.';

export const QUANTITY_INTEGER = 'Quantity must be an integer.';

export const CATEGORIES_MIN = 'At least one category is required.';

export const CATEGORY_REQUIRED = 'Category is required.';