let selectedItems = new Set(); // A set to track selected item IDs

async function fetchCartData() {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch('http://localhost:8081/rapid/cart/details', {
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

function toggleItemSelection(itemId) {
    if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
    } else {
        selectedItems.add(itemId);
    }
    updatePriceDetails();
}

function calculatePriceDetails(cartData) {
    let totalProductPrice = 0;
    let totalDiscounts = 0;
    let deliveryFee = 50; // Default delivery fee
    let orderTotal = 0;

    cartData.forEach(item => {
        if (selectedItems.has(item.id)) {
            item.productSizePrice.forEach((sizePrice) => {
                totalProductPrice += sizePrice.price || 0;
                totalDiscounts += (sizePrice.price || 0) - (sizePrice.finalPrice || 0);
                orderTotal += sizePrice.finalPrice || 0;
            });
        }
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

async function initializeCart() {
    const cartData = await fetchCartData();
    // Initially select all items
    cartData.forEach(item => selectedItems.add(item.id));
    const priceDetails = calculatePriceDetails(cartData);
    
    renderCart(cartData, priceDetails);
}



function renderCart(cartData, priceDetails) {
    const productDetailsContainer = document.getElementById('productDetails');
    const priceDetailsContainer = document.getElementById('priceDetails');
    const itemCountSpan = document.getElementById('itemCount');
    const discountMessageDiv = document.getElementById('discountMessage');

    // Update item count based on selected items
    itemCountSpan.textContent = selectedItems.size;

    // Render product details with checkboxes
    productDetailsContainer.innerHTML = cartData.map(item => {
        const isChecked = selectedItems.has(item.id) ? 'checked' : '';
        return item.product.map((product, index) => {
            const productImage = product.productImages.length > 0 ? product.productImages[0].picByte : '';
            const base64Image = `data:${product.productImages[0].type};base64,${productImage}`;
            const sizePrice = item.productSizePrice[index];

            return `
                <div class="flex gap-4 mb-4">
                    <input type="checkbox" class="item-checkbox" id="item-${item.id}" ${isChecked} onclick="toggleItemSelection(${item.id})" />
                    <!-- Product Image with Click Event -->
                <a href="#" onclick="viewProduct(${product.productId}); return false;">
                <img src="${base64Image}" alt="${product.productName}" class="w-20 h-20 bg-gray-200 rounded"/>
                    <div class="flex-1">
                        <div class="flex justify-between">
                           
                             <!-- Product Name with Click Event -->
                    <a href="#" class="font-medium" onclick="viewProduct(${product.productId}); return false;">${product.productName}</a>
                           
                            <button class="flex items-center text-gray-500 mt-2" onclick="removeItem(${item.id})">
                                <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                REMOVE
                            </button>
                        </div>
                        <div class="flex items-center mt-2">
                            <span class="font-bold">₹${sizePrice.finalPrice}</span>
                            <span class="ml-2 text-gray-500 line-through">₹${sizePrice.price}</span>
                            <span class="ml-2 text-green-600">${sizePrice.discountPercentage}% Off</span>
                        </div>
                        <div class="mt-2">
                            Size: ${sizePrice.size} • Qty: 1
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }).join('');

    // Render price details
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

    // Render discount message
    discountMessageDiv.textContent = `Yay! Your total discount is ₹${priceDetails.totalDiscounts.toFixed(2)}`;
}


function viewProduct(productId) {
    // Navigate to the product detail page or show a modal with product details
    window.location.href = `product-detail.html?id=${productId}`; // Example URL, adjust as needed
}










async function removeItem(itemId) {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch(`http://localhost:8081/rapid/cart/deleteCartItem/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Remove the item from the selectedItems set
        selectedItems.delete(itemId);
        // Fetch updated cart data and re-render
        const updatedCartData = await fetchCartData();
        const updatedPriceDetails = calculatePriceDetails(updatedCartData);
        renderCart(updatedCartData, updatedPriceDetails);
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

function updatePriceDetails() {
    fetchCartData().then(cartData => {
        const priceDetails = calculatePriceDetails(cartData);
        renderCart(cartData, priceDetails);
    });
}

initializeCart();