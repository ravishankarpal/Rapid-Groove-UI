import { API_URLS } from "../api-constants.js";


 export  async function addToCart(productId, selectedSize) {
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
            console.log(response);
            alert(`Item added to cart successfully!`);
            window.location.href = 'cart.html';

        }else{
            throw new Error('Failed to add item to cart');
        }

       
    } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}
