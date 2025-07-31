import { API_URLS } from "../api-constants.js";
import { showToast } from "./toast.js"
export async function addToCart(productId, selectedSize) {
    const payload = {
        productId,
        selectedSize,
        quantity: 1,
    };

    try {
        const response = await fetch(API_URLS.ADD_ITEM_TO_CART_V2, {
            method: 'POST',
            headers: API_URLS.HEADERS,
            body: JSON.stringify(payload),
        });

        if (response.ok) {
           const responseData = await response.json();
            updateCartQuantity(responseData);
             showToast('Item added to cart successfully!', 'success');
        
        } else {
            showToast('Failed to add item to cart. Please try again.', 'error');
            throw new Error('Failed to add item to cart');
        }


    } catch (error) {

        showToast('Failed to add item to cart. Please try again.', 'error');
    }

    function updateCartQuantity( totalQuantity) {
    const cartQuantityElement = document.getElementById('cartQuantity');
    if (cartQuantityElement) {        
        console.log("Total Quantity: ", totalQuantity);
        cartQuantityElement.textContent = totalQuantity;
        cartQuantityElement.style.display = totalQuantity === 0 ? 'none' : 'inline-block';
    }
}
}
