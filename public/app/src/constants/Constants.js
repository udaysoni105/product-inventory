export const REACT_APP_API_URL = process.env.REACT_APP_DOMAIN == "development"
    ? window.location.protocol + "//" + window.location.hostname + ":8000/"
    : window.location.protocol + "//" + window.location.hostname + ":8000/";


export const API = "api/";

export const CONTANT_TYPE = "application/json";

export const CONTACT_API_ROUTE = "contact";

export const CAREER_API_ROUTE = "career";

export const QUOTE_API_ROUTE = "quote";

export const PRODUCTS_API_ROUTE = "products";

export const PRODUCT_API_ROUTE = "product";

export const CATEGORIES_API_ROUTE = "categories";

export const PRODUCT_DEACTIVE_API_ROUTE = "deactive_product";

export const PRODUCT_EDIT_API_ROUTE = "edit_product";
