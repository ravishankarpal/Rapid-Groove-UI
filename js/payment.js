import { API_URLS } from "./api-constants.js";

function calculatePriceDetails(apiResponse) {
    const totalProductPrice = apiResponse.checkoutItemResponses.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const totalDiscounts = apiResponse.discountAmount || 0;
    
    let deliveryFee = parseFloat(apiResponse.deliveryFee) ;
    
    let orderTotal = apiResponse.totalAmount || 0;
    return {
        totalProductPrice,
        totalDiscounts,
        deliveryFee,
        orderTotal
    };
}

async function loadSelectedCartItems() {
    try {
       
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch(API_URLS.CHECKOUT_DETAILS, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiCartData = await response.json();
        
        const priceDetails = calculatePriceDetails(apiCartData);
        document.getElementById('totalAmount').textContent = `₹${priceDetails.totalProductPrice.toFixed(2)}`;
        document.getElementById('totalDiscounts').textContent = `-₹${priceDetails.totalDiscounts.toFixed(2)}`;
        const deliveryFeeElement = document.getElementById('deliveryFee');

        if (priceDetails.deliveryFee === 0) {
            deliveryFeeElement.textContent = "Free";
            deliveryFeeElement.style.color = "green"; 
        } else {
            deliveryFeeElement.textContent = `₹${priceDetails.deliveryFee.toFixed(2)}`;
            deliveryFeeElement.style.color = ""; 
        }
    
        document.getElementById('finalAmount').textContent = `₹${priceDetails.orderTotal.toFixed(2)}`;
        document.getElementById('totalSavings').textContent = priceDetails.totalDiscounts.toFixed(2);

    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadSelectedCartItems);