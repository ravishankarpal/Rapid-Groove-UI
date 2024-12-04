const BASE_URL = 'http://localhost:8081';

const API_URLS = {

    HEADERS: {
        'Authorization': `Bearer ${localStorage.getItem('userJwtToken')}`,
        'Content-Type': 'application/json'
    },
    CHECK_DELIVERY: (pinCode) => `${BASE_URL}/rapid/user/check/delivery/${pinCode}`,
    GET_PRODUCT_DETAILS: (productId) => `${BASE_URL}/product/getProductDetails/yes/${productId}`,
    USER_COMPLAIN: `${BASE_URL}/rapid/user/register/complain`,
    CART_DETAILS:`${BASE_URL}/rapid/cart/get`,
    DELETE_CART_ITEM: (itemId) => `${BASE_URL}/rapid/cart/delete/${itemId}`,
    ADD_ITEM_TO_CART:`${BASE_URL}/rapid/cart/addItemToCart`,
    UPDATE_CART_ITEM_QUANTITY:`${BASE_URL}/rapid/cart/update-quantity`,
    CHECKOUT:`${BASE_URL}/rapid/cart/checkout`,
    CHECKOUT_DETAILS:`${BASE_URL}/rapid/cart/checkoutdetails`,
    PRODUCT_DETAILS : (isSingleProduct, productId, category = 'Serum') => 
        `${BASE_URL}/product/details/${isSingleProduct}/${productId}?category=${category}`,
    BACKGROUND_IMAGE :`${BASE_URL}/admin/product/images/bg2`,
    CATEGORY_PRODUCTS: `${BASE_URL}/product/category-details`,
    PRODUCT_DETAILS: (productId) =>`${BASE_URL}/product/details/${productId}`
 
};

export { BASE_URL, API_URLS };
