import { API_URLS } from './api-constants.js';
let selectedItems = new Set();


function toggleItemSelection(itemId) {
    if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
    } else {
        selectedItems.add(itemId);
    }
    updatePriceDetails();
}

window.toggleItemSelection = toggleItemSelection;


async function fetchCartData() {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch(API_URLS.CART_DETAILS, {
            headers: {
                'Authorization': token
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return [];
    }
}

function calculatePriceDetails(cartData) {
    let totalProductPrice = 0;
    let totalDiscounts = 0;
    let deliveryFee = 50; 
    let orderTotal = 0;

    cartData.forEach(item => {
        if (selectedItems.has(item.id)) {
            item.productSizePrice.forEach((sizePrice) => {
                totalProductPrice += (sizePrice.price || 0) * (sizePrice.qty || 1);
                totalDiscounts += ((sizePrice.price || 0) - (sizePrice.finalPrice || 0)) * (sizePrice.qty || 1);
                orderTotal += (sizePrice.finalPrice || 0) * (sizePrice.qty || 1);
                 
            });
        }
    });

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

async function updateItemQuantity(itemId, newQuantity) {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        
        const response = await fetch(API_URLS.UPDATE_CART_ITEM_QUANTITY, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItemId: itemId,
                quantity: newQuantity
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const updatedCartData = await fetchCartData();
        const updatedPriceDetails = calculatePriceDetails(updatedCartData);
        renderCart(updatedCartData, updatedPriceDetails);
        updateCartIconQuantity(updatedCartData);
        
    } catch (error) {
        console.error('Error updating item quantity:', error);
    }
}

window.increaseQuantity = function(itemId) {
    const cartItem = document.querySelector(`[data-cart-item-id="${itemId}"]`);
    if (!cartItem) return;

    const quantityElement = cartItem.querySelector('.quantity-value');
    const currentQuantity = parseInt(quantityElement.textContent);
    updateItemQuantity(itemId, currentQuantity + 1);
};

window.decreaseQuantity = function(itemId) {
    const cartItem = document.querySelector(`[data-cart-item-id="${itemId}"]`);
    if (!cartItem) return;

    const quantityElement = cartItem.querySelector('.quantity-value');
    const currentQuantity = parseInt(quantityElement.textContent);
    
   
    if (currentQuantity > 1) {
        updateItemQuantity(itemId, currentQuantity - 1);
    }
};

async function initializeCart() {
    const cartData = await fetchCartData();
    cartData.forEach(item => selectedItems.add(item.id));
    const priceDetails = calculatePriceDetails(cartData);

    renderCart(cartData, priceDetails);
    updateCartIconQuantity(cartData);

}

function renderCart(cartData, priceDetails) {
    const productDetailsContainer = document.getElementById('productDetails');
    const priceDetailsContainer = document.getElementById('priceDetails');
    const itemCountSpan = document.getElementById('itemCount');
    const discountMessageDiv = document.getElementById('discountMessage');

    // Empty cart handling (same as before)
    if (!cartData || cartData.length === 0) {
        const diableText = document.getElementById("disbleText");
        diableText.style.display = 'none';

        const priceRemove = document.getElementById("priceremove");
        priceRemove.style.display = 'none';

        const removecontent = document.getElementById("removecontent");
        removecontent.style.display = 'none';
        
        productDetailsContainer.innerHTML = ``;

        if (priceDetailsContainer) priceDetailsContainer.style.display = 'none';
        if (itemCountSpan) itemCountSpan.style.display = 'none';
        if (discountMessageDiv) discountMessageDiv.style.display = 'none';
        return;
    }

    itemCountSpan.textContent = selectedItems.size;
    productDetailsContainer.innerHTML = cartData.map(item => {
        const isChecked = selectedItems.has(item.id) ? 'checked' : '';
        return item.product.map((product, index) => {
            const productImage = product.productImages.length > 0 ? product.productImages[0].picByte : '';
            const base64Image = `data:${product.productImages[0].type};base64,${productImage}`;
            const sizePrice = item.productSizePrice[index];
          

            return `
                <div class="flex gap-4 mb-4" data-cart-item-id="${item.id}">
                    <input type="checkbox" class="item-checkbox" id="item-${item.id}" ${isChecked} onclick="toggleItemSelection(${item.id})" />
                    <a href="#" onclick="viewProduct(${product.productId}); return false;">
                        <img src="${base64Image}" alt="${product.productName}" class="w-20 h-20 bg-gray-200 rounded"/>
                    </a>
                    <div class="flex-1">
                        <a href="#" class="font-medium" onclick="viewProduct(${product.productId}); return false;">${product.productName}</a>
                        
                        <div class="flex items-center mt-2">
                            <span class="font-bold">₹${sizePrice.finalPrice}</span>
                            <span class="ml-2 text-gray-500 line-through">₹${sizePrice.price}</span>
                            <span class="ml-2 text-green-600">${sizePrice.discountPercentage}% Off</span>
                        </div>
                        
                        <div class="mt-2 flex items-center">
                            <span class="mr-2">Size: ${sizePrice.size}</span>
                            <div class="flex items-center border rounded">
                                <button onclick="decreaseQuantity(${item.id})" class="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                <span class="quantity-value px-3" id="quantity-${item.id}">${sizePrice.qty}</span>
                                <button onclick="increaseQuantity(${item.id})" class="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                            </div>
                        </div>
                    </div>
                </div>   
            `;
        }).join('');
    }).join('');

    priceDetailsContainer.innerHTML = `
        <div class="flex justify-between">
            <span>Total Product Price</span>
            <span>₹${priceDetails.totalProductPrice.toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-green-600">
            <span>Total Discounts</span>
            <span>₹${priceDetails.totalDiscounts.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span>Delivery Fee</span>
            <span>${priceDetails.deliveryFee === 0 ? 'Free' : `₹${priceDetails.deliveryFee.toFixed(2)}`}</span>
        </div>
        <div class="flex justify-between font-bold pt-3 border-t">
            <span>Order Total</span>
            <span>₹${priceDetails.orderTotal.toFixed(2)}</span>
        </div>
    `;

   
    discountMessageDiv.textContent = `Yay! Your total discount is ₹${priceDetails.totalDiscounts.toFixed(2)}`;
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

window.removeItem = async function (itemId) {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch(API_URLS.DELETE_CART_ITEM(itemId), { 
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        selectedItems.delete(itemId);
        const updatedCartData = await fetchCartData();
        const updatedPriceDetails = calculatePriceDetails(updatedCartData);
        renderCart(updatedCartData, updatedPriceDetails);
        updateCartIconQuantity(updatedCartData);
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};

function updatePriceDetails() {
    console.log("price details called");
    fetchCartData().then(cartData => {
        const priceDetails = calculatePriceDetails(cartData);
        renderCart(cartData, priceDetails);
    });
}



function updateCartIconQuantity(cartData) {
    const cartQuantityElement = document.getElementById('cartQuantity');
   
    let totalCartQuantity = 0;
    cartData.forEach(item => {
        item.productSizePrice.forEach((sizePrice) => {
            totalCartQuantity += sizePrice.qty  ;
        });
       
    });
    console.log(totalCartQuantity);
    cartQuantityElement.textContent = totalCartQuantity;
}



window.saveCheckoutDetails = async function() {
    try {
        const cartData = await fetchCartData();
        const selectedCartItems = cartData.filter(item => selectedItems.has(item.id)).map(item => {
            return item.product.map((product, index) => {
                const sizePrice = item.productSizePrice[index];
                return {
                    productId: product.productId,
                    productName: product.productName,
                    picByte: product.productImages.length > 0 ? product.productImages[0].picByte : '',
                    quantity: sizePrice.qty,
                    size: sizePrice.size,
                    price: sizePrice.finalPrice
                };
            });
        }).flat();

        const priceDetails = calculatePriceDetails(cartData);

        const checkoutPayload = {
            checkoutItems: selectedCartItems,
            totalAmount: priceDetails.orderTotal,
            discountAmount: priceDetails.totalDiscounts,
            deliveryFee: priceDetails.deliveryFee 
        };

        console.log("delivery fee"+priceDetails.deliveryFee );

        // Trigger the checkout API
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;

        const response = await fetch(API_URLS.CHECKOUT, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkoutPayload)
        });

        if(response.ok){
            return true;
        }

        if (!response.ok) {
            return false;
        }
    
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again.');
        return false;
    }
};
// Initialize cart on page load
initializeCart();