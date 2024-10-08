
// Base URL for the API
const BASE_URL = 'http://localhost:8081';
// API Endpoints
const API_URLS = {
    CHECK_DELIVERY: (pinCode) => `${BASE_URL}/rapid/user/check/delivery/${pinCode}`,
    GET_PRODUCT_DETAILS: (productId) => `http://localhost:8081/product/getProductDetails/yes/${productId}`
};

console.log(CHECK_DELIVERY);

export { BASE_URL, API_URLS };
