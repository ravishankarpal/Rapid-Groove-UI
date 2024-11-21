const BASE_URL = 'http://localhost:8081';

const API_URLS = {
    CHECK_DELIVERY: (pinCode) => `${BASE_URL}/rapid/user/check/delivery/${pinCode}`,
    GET_PRODUCT_DETAILS: (productId) => `${BASE_URL}/product/getProductDetails/yes/${productId}`,
    USER_COMPLAIN: `${BASE_URL}/rapid/user/register/complain`,
    CART_DETAILS:`${BASE_URL}/rapid/cart/details`,
    DELETE_CART_ITEM: (itemId) => `${BASE_URL}/rapid/cart/deleteCartItem/${itemId}`,
    ADD_ITEM_TO_CART:`${BASE_URL}/rapid/cart/addItemToCart`,
    UPDATE_CART_ITEM_QUANTITY:`${BASE_URL}/rapid/cart/update-quantity`
};

export { BASE_URL, API_URLS };
