let selectedItems = new Set();
function calculatePriceDetails(cartData) {
    let totalProductPrice = 0;
    let totalDiscounts = 0;
    let deliveryFee = 50; // Default delivery fee
    let orderTotal = 0;

    cartData.forEach(item => {
            item.productSizePrice.forEach((sizePrice) => {
                totalProductPrice += sizePrice.price || 0;
                totalDiscounts += (sizePrice.price || 0) - (sizePrice.finalPrice || 0);
                orderTotal += sizePrice.finalPrice || 0;
            });
        
    });

    // Apply free delivery if the order total is above ₹400
    if (orderTotal >= 400) {
        deliveryFee = 0;
    }

    orderTotal += deliveryFee;

    return {
        totalProductPrice,
        totalDiscounts,
        deliveryFee,
        orderTotal
    };
}

function loadSelectedCartItems() {

    const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');

    const priceDetails = calculatePriceDetails(cartData);
  
   console.log(cartData);
   console.log(priceDetails);


}

document.addEventListener('DOMContentLoaded', loadSelectedCartItems);