const BASE_URL = 'http://localhost:8081';

const API_URLS = {

    HEADERS: {
        'Authorization': `Bearer ${localStorage.getItem('userJwtToken')}`,
        'Content-Type': 'application/json'
    },
    HOME_PRODUCT_DETAILS: (page, number) => `${BASE_URL}/product/all/details?page-number=${page}&size=${number}`,
    CHECK_DELIVERY: (pinCode) => `${BASE_URL}/rapid/user/check/delivery/${pinCode}`,
    GET_PRODUCT_DETAILS: (productId) => `${BASE_URL}/product/getProductDetails/yes/${productId}`,
    USER_COMPLAIN: `${BASE_URL}/rapid/user/register/complain`,
    CART_DETAILS:`${BASE_URL}/rapid/cart/get`,
    DELETE_CART_ITEM: (itemId) => `${BASE_URL}/rapid/cart/delete/${itemId}`,
    ADD_ITEM_TO_CART:`${BASE_URL}/rapid/cart/addItemToCart`,
    ADD_ITEM_TO_CART_V2:`${BASE_URL}/rapid/cart/v2/addItemToCart`,
    UPDATE_CART_ITEM_QUANTITY:`${BASE_URL}/rapid/cart/update-quantity`,
    CHECKOUT:`${BASE_URL}/rapid/cart/checkout`,
    CHECKOUT_DETAILS:`${BASE_URL}/rapid/cart/checkoutdetails`,
    PRODUCT_DETAILS : (isSingleProduct, productId, category = 'Serum') => 
        `${BASE_URL}/product/details/${isSingleProduct}/${productId}?category=${category}`,
    BACKGROUND_IMAGE :`${BASE_URL}/admin/product/images/bg2`,
    CATEGORY_PRODUCTS: `${BASE_URL}/product/category-details`,
    PRODUCT_DETAILS: (productId) =>`${BASE_URL}/product/details/${productId}`,
    ADDRESS_DETAILS: `${BASE_URL}/rapid/user/address-details`,
    SAVE_ADRESS: `${BASE_URL}/rapid/user/save/address`,
    DELETE_ADDRESS: (id) =>`${BASE_URL}/rapid/user/delete-address/${id}`,
    UPDATE_ADDRESS: (id) =>`${BASE_URL}/rapid/user/update-address/${id}`,
    SEARCH_PRODUCTS: (key, page, size) => 
        `${BASE_URL}/product/search-products?key=${encodeURIComponent(key)}&page=${page}&size=${size}`,
    CREATE_ORDER:`${BASE_URL}/order/create-order`,
    AUTHENTICATE_PAYMENT: (paymentId) =>`${BASE_URL}/rapid/payment/authenticate-payment/${paymentId}`,
    PAYMENT_PROCESS:`${BASE_URL}/rapid/payment/process`,
    ORDER_DETAILS: (period)=>`${BASE_URL}/order/v2/details?period=${period}&page=0&size=10`,
    ORDER_DETAILS_BY_ID:(id)=>`${BASE_URL}/order/details/${id}`,
    INVOICE:(order_id)=>`${BASE_URL}/order/invoice/${order_id}`,
    RATE_AND_REVIEW:`${BASE_URL}/product/customer/products/rate-review`,
    SAVE_CHECKOUT:`${BASE_URL}/rapid/cart/save/checkout`,
    CHECKOUT_DETAILS:`${BASE_URL}/rapid/cart/checkout/details`



   
    
};

export { BASE_URL, API_URLS };
