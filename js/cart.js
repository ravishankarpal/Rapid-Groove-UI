// cart.js

// document.addEventListener('DOMContentLoaded', function() {
//     // Simulating API call - replace with actual fetch in production
//     const cartData = [
//         {
//             "id": 3,
//             "quantity": 1,
//             "products": {
//                 "productId": 16,
//                 "productName": "Lycra Casual Womens Top And Tunics, Rib top for...",
//                 "productDiscountPrice": 16,
//                 "productActualPrice": 209,
//                 "productCategory": "Women Top"
//             }
//         }
//     ];

//     const deliveryFee = 62;
//     const totalDiscount = 193;
//     const orderTotal = 78;

//     function renderCart() {
//         const productDetailsContainer = document.getElementById('productDetails');
//         const priceDetailsContainer = document.getElementById('priceDetails');
//         const itemCountSpan = document.getElementById('itemCount');
//         const discountMessageDiv = document.getElementById('discountMessage');

//         // Update item count
//         itemCountSpan.textContent = cartData.length;

//         // Render product details
//         productDetailsContainer.innerHTML = cartData.map(item => `
//             <div class="flex gap-4">
//                 <div class="w-20 h-20 bg-gray-200 rounded"></div>
//                 <div class="flex-1">
//                     <div class="flex justify-between">
//                         <h3 class="font-medium">${item.products.productName}</h3>
//                         <button class="text-purple-600">EDIT</button>
//                     </div>
//                     <div class="flex items-center mt-2">
//                         <span class="font-bold">₹${item.products.productDiscountPrice}</span>
//                         <span class="ml-2 text-gray-500 line-through">₹${item.products.productActualPrice}</span>
//                         <span class="ml-2 text-green-600">92% Off</span>
//                     </div>
//                     <div class="mt-2">
//                         Size: S • Qty: ${item.quantity}
//                     </div>
//                     <button class="flex items-center text-gray-500 mt-2">
//                         <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                         </svg>
//                         REMOVE
//                     </button>
//                 </div>
//             </div>
//             <div class="flex justify-between mt-4 pt-4 border-t">
//                 <span>Sold by: ${item.products.productCategory}</span>
//                 <span>Delivery Fee: ₹${deliveryFee}</span>
//             </div>
//         `).join('');

//         // Render price details
//         priceDetailsContainer.innerHTML = `
//             <div class="flex justify-between">
//                 <span>Total Product Price</span>
//                 <span>+ ₹${cartData[0].products.productActualPrice}</span>
//             </div>
//             <div class="flex justify-between text-green-600">
//                 <span>Total Discounts</span>
//                 <span>- ₹${totalDiscount}</span>
//             </div>
//             <div class="flex justify-between">
//                 <span>Additional Fees</span>
//                 <span>+ ₹${deliveryFee}</span>
//             </div>
//             <div class="flex justify-between font-bold pt-3 border-t">
//                 <span>Order Total</span>
//                 <span>₹${orderTotal}</span>
//             </div>
//         `;

//         // Render discount message
//         discountMessageDiv.textContent = `Yay! Your total discount is ₹${totalDiscount}`;
//     }

//     // Initial render
//     renderCart();
// });































async function fetchCartData() {
    try {
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer " + token;
        const response = await fetch('http://localhost:8081/rapid/cart/cart_details', {
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

function calculatePriceDetails(cartItems) {
    const totalProductPrice = cartItems.reduce((sum, item) => {
        return sum + (item.products.productActualPrice || 0);
    }, 0);

    const totalDiscounts = cartItems.reduce((sum, item) => {
        const discount = (item.products.productActualPrice || 0) - (item.products.productDiscountPrice || 0);
        return sum + discount;
    }, 0);

    const deliveryFee = 62; // You might want to make this dynamic based on your business logic
    const orderTotal = totalProductPrice - totalDiscounts + deliveryFee;

    return {
        totalProductPrice,
        totalDiscounts,
        deliveryFee,
        orderTotal
    };
}

async function initializeCart() {
    const cartData = await fetchCartData();
    const priceDetails = calculatePriceDetails(cartData);
    
    renderCart(cartData, priceDetails);
}

// function renderCart(cartData, priceDetails) {
//     const productDetailsContainer = document.getElementById('productDetails');
//     const priceDetailsContainer = document.getElementById('priceDetails');
//     const itemCountSpan = document.getElementById('itemCount');
//     const discountMessageDiv = document.getElementById('discountMessage');

//     // Update item count
//     itemCountSpan.textContent = cartData.length;

//     // Render product details
//     productDetailsContainer.innerHTML = cartData.map(item => `
//         <div class="flex gap-4">
//             <div class="w-20 h-20 bg-gray-200 rounded"></div>
//             <div class="flex-1">
//                 <div class="flex justify-between">
//                     <h3 class="font-medium">${item.products.productName}</h3>
//                     <button class="text-purple-600">EDIT</button>
//                 </div>
//                 <div class="flex items-center mt-2">
//                     <span class="font-bold">₹${item.products.productDiscountPrice}</span>
//                     <span class="ml-2 text-gray-500 line-through">₹${item.products.productActualPrice}</span>
//                     <span class="ml-2 text-green-600">${calculateDiscountPercentage(item.products.productActualPrice, item.products.productDiscountPrice)}% Off</span>
//                 </div>
//                 <div class="mt-2">
//                     Size: ${item.products.size || 'N/A'} • Qty: ${item.quantity}
//                 </div>
//                 <button class="flex items-center text-gray-500 mt-2" onclick="removeItem(${item.id})">
//                     <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                         <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                     </svg>
//                     REMOVE
//                 </button>
//             </div>
//         </div>
//         <div class="flex justify-between mt-4 pt-4 border-t">
//             <span>Sold by: ${item.products.productCategory}</span>
//             <span>Delivery Fee: ₹${priceDetails.deliveryFee}</span>
//         </div>
//     `).join('');

//     // Render price details
//     priceDetailsContainer.innerHTML = `
//         <div class="flex justify-between">
//             <span>Total Product Price</span>
//             <span>+ ₹${priceDetails.totalProductPrice}</span>
//         </div>
//         <div class="flex justify-between text-green-600">
//             <span>Total Discounts</span>
//             <span>- ₹${priceDetails.totalDiscounts}</span>
//         </div>
//         <div class="flex justify-between">
//             <span>Additional Fees</span>
//             <span>+ ₹${priceDetails.deliveryFee}</span>
//         </div>
//         <div class="flex justify-between font-bold pt-3 border-t">
//             <span>Order Total</span>
//             <span>₹${priceDetails.orderTotal}</span>
//         </div>
//     `;

//     // Render discount message
//     discountMessageDiv.textContent = `Yay! Your total discount is ₹${priceDetails.totalDiscounts}`;
// }





function renderCart(cartData, priceDetails) {
    const productDetailsContainer = document.getElementById('productDetails');
    const priceDetailsContainer = document.getElementById('priceDetails');
    const itemCountSpan = document.getElementById('itemCount');
    const discountMessageDiv = document.getElementById('discountMessage');

    // Update item count
    itemCountSpan.textContent = cartData.length;

    // Render product details
    productDetailsContainer.innerHTML = cartData.map(item => {
        const productImage = item.products.productImages.length > 0 ? item.products.productImages[0].picByte : ''; // Get the image byte data
        const base64Image = `data:${item.products.productImages[0].type};base64,${productImage}`; // Construct base64 image source

        return `
            <div class="flex gap-4">
                <img src="${base64Image}" alt="${item.products.productName}" class="w-20 h-20 bg-gray-200 rounded"/>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h3 class="font-medium">${item.products.productName}</h3>
                        <button class="text-purple-600">EDIT</button>
                    </div>
                    <div class="flex items-center mt-2">
                        <span class="font-bold">₹${item.products.productDiscountPrice}</span>
                        <span class="ml-2 text-gray-500 line-through">₹${item.products.productActualPrice}</span>
                        <span class="ml-2 text-green-600">${calculateDiscountPercentage(item.products.productActualPrice, item.products.productDiscountPrice)}% Off</span>
                    </div>
                    <div class="mt-2">
                        Size: ${item.products.size || 'N/A'} • Qty: ${item.quantity}
                    </div>
                    <button class="flex items-center text-gray-500 mt-2" onclick="removeItem(${item.id})">
                        <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        REMOVE
                    </button>
                </div>
            </div>
            <div class="flex justify-between mt-4 pt-4 border-t">
                <span>Sold by: ${item.products.productCategory}</span>
                <span>Delivery Fee: ₹${priceDetails.deliveryFee}</span>
            </div>
        `;
    }).join('');

    // Render price details
    priceDetailsContainer.innerHTML = `
        <div class="flex justify-between">
            <span>Total Product Price</span>
            <span> ₹${priceDetails.totalProductPrice}</span>
        </div>
        <div class="flex justify-between text-green-600">
            <span>Total Discounts</span>
            <span> ₹${priceDetails.totalDiscounts}</span>
        </div>
        <div class="flex justify-between">
            <span>Additional Fees</span>
            <span> ₹${priceDetails.deliveryFee}</span>
        </div>
        <div class="flex justify-between font-bold pt-3 border-t">
            <span>Order Total</span>
            <span>₹${priceDetails.orderTotal}</span>
        </div>
    `;

    // Render discount message
    discountMessageDiv.textContent = `Yay! Your total discount is ₹${priceDetails.totalDiscounts}`;
}



function calculateDiscountPercentage(actualPrice, discountPrice) {
    if (!actualPrice || !discountPrice) return 0;
    const discount = ((actualPrice - discountPrice) / actualPrice) * 100;
    return Math.round(discount);
}

async function removeItem(itemId) {
    // Implement your remove item logic here
    console.log(`Removing item with ID: ${itemId}`);
    // After removing, re-fetch and re-render the cart
    await initializeCart();
}

// Initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', initializeCart);



document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [navbarResponse, footerResponse] = await Promise.all([
            fetch('src/components/navbar.html'),
            fetch('src/components/footer.html')
        ]);

        const [navbarHtml, footerHtml] = await Promise.all([
            navbarResponse.text(),
            footerResponse.text()
        ]);

        document.getElementById('navbar-placeholder').innerHTML = navbarHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
    } catch (error) {
        console.error('Error loading page components:', error);
    }
});
