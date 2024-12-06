
import { API_URLS } from "./api-constants.js";

window.toggleSelection = toggleSelection;
window.changeQuantity = changeQuantity;
window.deleteItem = deleteItem;

let cartData = [];
let selectedItems = new Set();

async function fetchCartData() {
    try {
        const response = await fetch(API_URLS.CART_DETAILS, {
            method: 'GET',
            headers: API_URLS.HEADERS
        });
        if (!response.ok) throw new Error('Failed to fetch cart data');
        const data = await response.json();
        cartData = data.cartItemDetails;

        selectedItems = new Set(cartData.map(item => item.id));

        renderCart();
        updatePriceDetails();
        document.getElementById('checkout-btn').disabled = selectedItems.size === 0;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to render the cart
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (!cartData || cartData.length === 0) {
        const orderSummary = document.querySelector('.bg-white.rounded-xl.shadow-lg.p-6');
        orderSummary.style.display = 'none';

        cartItemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-[80vh] bg-gray-100">
            <div class="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l1.38-6.56a1 1 0 00-.97-1.19H6.21M7 13L5.5 19h13M7 13l-1.5 6M12 5v1m0 4v1m-2-6h4"></path>
                </svg>
            </div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p class="text-gray-600 mb-6 text-center">Looks like you haven't added anything to your cart yet.</p>
            <button 
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-lg font-medium hover:opacity-90 transition"
                onclick="window.location.href='index.html'">
                Explore Now
            </button>
        </div>`;

        return;
    }

    cartData.forEach(item => {
        const isSelected = selectedItems.has(item.id);
        const product = item.product;
        const selectedSize = item.selectedSize;
        const imgSrc = `data:image/png;base64,${product.productImages[0].picByte}`;

        cartItemsContainer.innerHTML += `
        <div class="flex gap-4 mb-4 items-start border-b pb-4">
            <input type="checkbox" class="mt-2" ${isSelected ? 'checked' : ''} onchange="toggleSelection(${item.id})">
            <img src="${imgSrc}" alt="${product.name}" class="w-24 h-24 rounded bg-gray-200">
            <div class="flex-1">
                <h3 class="font-medium">${product.name}</h3>
                <p class="text-gray-500">${selectedSize.value}</p>
                <div class="flex items-center gap-2 mt-2">
                    <span class="font-bold text-blue-600">₹${selectedSize.price.current}</span>
                    <span class="line-through text-gray-400">₹${selectedSize.price.original}</span>
                    <span class="text-green-500 font-semibold">${selectedSize.price.discountPercentage}% Off</span>
                </div>
                <div class="mt-2 flex items-center gap-4">
                    <button onclick="changeQuantity(${item.id}, -1)" class="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+</button>
                </div>
            </div>

            

             <button onclick="deleteItem(${item.id})" class="delete-item p-2 rounded-full hover:bg-red-100 transition">
             <i class="fas fa-trash text-red-500 text-lg"></i>
             </button>


        </div>`;
    });
}

// Function to toggle item selection
function toggleSelection(itemId) {
    
    if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
    } else {
        selectedItems.add(itemId);
    }

    
    updatePriceDetails();
   
    document.getElementById('checkout-btn').disabled = selectedItems.size === 0;
}

// Function to update price details
function updatePriceDetails() {
    let subtotal = 0;
    let discount = 0;
    let shippingCost = 0;
    let totalPrice = 0;
    let isdeliveryChargeAdded = false;
    let freeShippingThreshold = 0;

    cartData.forEach(item => {
        if (selectedItems.has(item.id)) {
            const selectedSize = item.selectedSize;
            subtotal += selectedSize.price.original * item.quantity;
            discount += (selectedSize.price.original - selectedSize.price.current) * item.quantity;
            if (!isdeliveryChargeAdded) {
                shippingCost += item.product.deliveryInfo.shippingCost;
                freeShippingThreshold += item.product.deliveryInfo.freeShippingThreshold;
                isdeliveryChargeAdded = true;
            }
        }
    });

    if (subtotal - discount > freeShippingThreshold) shippingCost = 0;

    totalPrice = subtotal - discount + shippingCost;

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('discount').textContent = `₹${discount}`;
    document.getElementById('shipping-cost').textContent = shippingCost === 0 ? 'Free' : `₹${shippingCost}`;
    document.getElementById('total-price').textContent = `₹${totalPrice}`;
    document.getElementById('cart-summary').textContent = `${selectedItems.size} Items Selected`;
}

// Function to change quantity
function changeQuantity(itemId, delta) {
    const item = cartData.find(cartItem => cartItem.id === itemId);
    if (!item) return;

    item.quantity = Math.max(1, item.quantity + delta);
    renderCart();
    updatePriceDetails();
}

async function deleteItem(itemId) {
    try {
        const response =  await fetch(API_URLS.DELETE_CART_ITEM(itemId), {
            method: 'DELETE',
            headers: API_URLS.HEADERS
        });
        if (!response.ok) throw new Error('Failed to delete cart data');
        const data = await response.json();
        cartData = data.cartItemDetails;
        renderCart();
        updatePriceDetails();
    } catch (error) {
        console.error('Error:', error);
    }


   
}


function storeSelectedItemsInLocalStorage() {
    const selectedItemsToStore = cartData
        .filter(item => selectedItems.has(item.id))
        .map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: `data:image/png;base64,${item.product.productImages[0].picByte}`,
            size: item.selectedSize.value,
            originalPrice: item.selectedSize.price.original,
            currentPrice: item.selectedSize.price.current,
            quantity: item.quantity,
            discountPercentage: item.selectedSize.price.discountPercentage,
            deliveryTime: item.product.deliveryInfo.standardDeliveryTime,
        }));

    const cartSummary = {
        subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('₹', '')),
        discount: parseFloat(document.getElementById('discount').textContent.replace('₹', '')),
        deliveryFee: document.getElementById('shipping-cost').textContent === 'Free' ? 0 : 
            parseFloat(document.getElementById('shipping-cost').textContent.replace('₹', '')),
        total: parseFloat(document.getElementById('total-price').textContent.replace('₹', ''))
    };

    
}



document.getElementById('checkout-btn').addEventListener('click', function() {
    if (this.disabled) return;
    storeSelectedItemsInLocalStorage();
    window.location.href = 'payment.html';
});




// Initialize cart on page load
fetchCartData();