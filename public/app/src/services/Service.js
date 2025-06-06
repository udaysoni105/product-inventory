

import axios from "axios";
import * as Constants from "../constants/Constants";

export function ProductList(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        Constants.REACT_APP_API_URL +
        Constants.API +
        Constants.PRODUCTS_API_ROUTE,
        payload,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function categoryService(payload) {
  return new Promise(async (resolve, reject) => {
    axios
      .get(
        Constants.REACT_APP_API_URL +
        Constants.API +
        Constants.CATEGORIES_API_ROUTE,
        payload,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProduct(id) {
  return new Promise(async (resolve, reject) => {
    axios
      .get(
        Constants.REACT_APP_API_URL +
        Constants.API +
        `${Constants.PRODUCTS_API_ROUTE + "/" + id}`,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const createProduct = (payload) => {
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        Constants.REACT_APP_API_URL +
        Constants.API +
        Constants.PRODUCT_API_ROUTE,
        payload,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function DeleteProduct(id) {
  return new Promise(async (resolve, reject) => {
    axios
      .delete(
        Constants.REACT_APP_API_URL +
        Constants.API +
        `${Constants.PRODUCTS_API_ROUTE + "/" + id}`,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const EditProduct = (payload, id) => {
  return new Promise(async (resolve, reject) => {
    axios
      .put(
        Constants.REACT_APP_API_URL +
        Constants.API +
        `${Constants.PRODUCTS_API_ROUTE + "/" + id}`,
        payload,
        {
          headers: {
            "content-type": Constants.CONTANT_TYPE,
            "Accept": Constants.ACCEPT_TYPE
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}