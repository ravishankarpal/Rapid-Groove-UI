const BASE_URL = 'http://localhost:8081';

const API_URLS = {
    CHECK_DELIVERY: (pinCode) => `${BASE_URL}/rapid/user/check/delivery/${pinCode}`,
    GET_PRODUCT_DETAILS: (productId) => `${BASE_URL}/product/getProductDetails/yes/${productId}`,
    USER_COMPLAIN: `${BASE_URL}/rapid/user/register/complain`
};

export { BASE_URL, API_URLS };
