// let selectedItems = new Set(); // A set to track selected item IDs

// async function fetchCartData() {
//     try {
//         let token = localStorage.getItem("userJwtToken");
//         token = "Bearer " + token;
//         const response = await fetch('http://localhost:8081/rapid/cart/details', {
//             headers: {
//                 'Authorization': token
//             }
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching cart data:', error);
//         return [];
//     }
// }

// function toggleItemSelection(itemId) {
//     if (selectedItems.has(itemId)) {
//         selectedItems.delete(itemId);
//     } else {
//         selectedItems.add(itemId);
//     }
//     updatePriceDetails();
// }

// function calculatePriceDetails(cartData) {
//     let totalProductPrice = 0;
//     let totalDiscounts = 0;
//     let deliveryFee = 50; // Default delivery fee
//     let orderTotal = 0;

//     cartData.forEach(item => {
//         if (selectedItems.has(item.id)) {
//             item.productSizePrice.forEach((sizePrice) => {
//                 totalProductPrice += sizePrice.price || 0;
//                 totalDiscounts += (sizePrice.price || 0) - (sizePrice.finalPrice || 0);
//                 orderTotal += sizePrice.finalPrice || 0;
//             });
//         }
//     });

//     // Apply free delivery if the order total is above ₹400
//     if (orderTotal >= 400) {
//         deliveryFee = 0;
//     }

//     orderTotal += deliveryFee;

//     return {
//         totalProductPrice,
//         totalDiscounts,
//         deliveryFee,
//         orderTotal
//     };
// }

// async function initializeCart() {
//     const cartData = await fetchCartData();
//     // Initially select all items
//     cartData.forEach(item => selectedItems.add(item.id));
//     const priceDetails = calculatePriceDetails(cartData);
    
//     renderCart(cartData, priceDetails);
// }



// function renderCart(cartData, priceDetails) {
//     const productDetailsContainer = document.getElementById('productDetails');
//     const priceDetailsContainer = document.getElementById('priceDetails');
//     const itemCountSpan = document.getElementById('itemCount');
//     const discountMessageDiv = document.getElementById('discountMessage');

//     // Update item count based on selected items
//     itemCountSpan.textContent = selectedItems.size;

//     // Render product details with checkboxes
    
//     productDetailsContainer.innerHTML = cartData.map(item => {
//         const isChecked = selectedItems.has(item.id) ? 'checked' : '';
//         return item.product.map((product, index) => {
//             const productImage = product.productImages.length > 0 ? product.productImages[0].picByte : '';
//             const base64Image = `data:${product.productImages[0].type};base64,${productImage}`;
//             const sizePrice = item.productSizePrice[index];

//             return `
//                 <div class="flex gap-4 mb-4">
//                     <input type="checkbox" class="item-checkbox" id="item-${item.id}" ${isChecked} onclick="toggleItemSelection(${item.id})" />
//                     <!-- Product Image with Click Event -->
//                 <a href="#" onclick="viewProduct(${product.productId}); return false;">
//                 <img src="${base64Image}" alt="${product.productName}" class="w-20 h-20 bg-gray-200 rounded"/>
//                     <div class="flex-1">
//                         <div class="flex justify-between">
                           
//                              <!-- Product Name with Click Event -->
//                     <a href="#" class="font-medium" onclick="viewProduct(${product.productId}); return false;">${product.productName}</a>
                           
//                             <button class="flex items-center text-gray-500 mt-2" onclick="removeItem(${item.id})">
//                                 <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                     <path d="M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                                 </svg>
//                                 REMOVE
//                             </button>
//                         </div>
//                         <div class="flex items-center mt-2">
//                             <span class="font-bold">₹${sizePrice.finalPrice}</span>
//                             <span class="ml-2 text-gray-500 line-through">₹${sizePrice.price}</span>
//                             <span class="ml-2 text-green-600">${sizePrice.discountPercentage}% Off</span>
//                         </div>
//                         <div class="mt-2">
//                             Size: ${sizePrice.size} • Qty: 1
//                         </div>
//                     </div>
//                 </div>
//             `;
//         }).join('');
//     }).join('');

//     // Render price details
//     priceDetailsContainer.innerHTML = `
//         <div class="flex justify-between">
//             <span>Total Product Price</span>
//             <span>₹${priceDetails.totalProductPrice.toFixed(2)}</span>
//         </div>
//         <div class="flex justify-between text-green-600">
//             <span>Total Discounts</span>
//             <span>₹${priceDetails.totalDiscounts.toFixed(2)}</span>
//         </div>
//         <div class="flex justify-between">
//             <span>Delivery Fee</span>
//             <span>${priceDetails.deliveryFee === 0 ? 'Free' : `₹${priceDetails.deliveryFee.toFixed(2)}`}</span>
//         </div>
//         <div class="flex justify-between font-bold pt-3 border-t">
//             <span>Order Total</span>
//             <span>₹${priceDetails.orderTotal.toFixed(2)}</span>
//         </div>
//     `;

//     // Render discount message
//     discountMessageDiv.textContent = `Yay! Your total discount is ₹${priceDetails.totalDiscounts.toFixed(2)}`;
// }


// function viewProduct(productId) {
//     // Navigate to the product detail page or show a modal with product details
//     window.location.href = `product-detail.html?id=${productId}`; // Example URL, adjust as needed
// }










// async function removeItem(itemId) {
//     try {
//         let token = localStorage.getItem("userJwtToken");
//         token = "Bearer " + token;
//         const response = await fetch(`http://localhost:8081/rapid/cart/deleteCartItem/${itemId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': token
//             }
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         // Remove the item from the selectedItems set
//         selectedItems.delete(itemId);
//         // Fetch updated cart data and re-render
//         const updatedCartData = await fetchCartData();
//         const updatedPriceDetails = calculatePriceDetails(updatedCartData);
//         renderCart(updatedCartData, updatedPriceDetails);
//     } catch (error) {
//         console.error('Error removing item from cart:', error);
//     }
// }

// function updatePriceDetails() {
//     fetchCartData().then(cartData => {
//         const priceDetails = calculatePriceDetails(cartData);
//         renderCart(cartData, priceDetails);
//     });
// }


// function saveOrderSummaryToLocalStorage(priceDetails) {
//     localStorage.setItem("orderSummary", JSON.stringify(priceDetails));
// }



// function updateSelectedCartDataAndPrice() {
//     const selectedCartData = cartData.filter(item => selectedItems.has(item.id));
//     cartData = selectedCartData;
//     localStorage.setItem('cartData', JSON.stringify(cartData));
// }

// // Update the button click event to save summary before navigating
// document.querySelector("button").addEventListener("click", () => {
//     const cartData =  fetchCartData();
//     const priceDetails = calculatePriceDetails(cartData);
//     saveOrderSummaryToLocalStorage(priceDetails);
//     window.location.href = "payment.html"; // Navigate to payment page
// });


// initializeCart();



















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

    if (!cartData || cartData.length === 0) {
        // Clear existing content
      const diableText= document.getElementById("disbleText");
      diableText.style.display = 'none';

      const priceRemove = document.getElementById("priceremove");
      priceRemove.style.display = 'none';

      const removecontent = document.getElementById("removecontent");
      removecontent.style.display = 'none';
      
     
    
    
    //     productDetailsContainer.innerHTML = `
    // <div class="flex flex-col min-h-screen">
    //     <!-- Top Header -->
    //     <div class="w-full text-center py-4">
    //         <h1 class="text-3xl font-bold">Rapid Groove</h1>
    //     </div>
        
    //     <!-- Main Content (Empty Cart) centered vertically -->
    //     <div class="flex-grow flex flex-col items-center justify-center p-8">
    //         <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    //         </svg>
    //         <h2 class="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
    //         <p class="text-gray-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
    //         <a href="/" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
    //             Continue Shopping
    //         </a>
    //     </div>
    // </div>`;



    // productDetailsContainer.innerHTML = `
    // <div class="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
    //     <!-- Modern Header -->
    //     <div class="w-full text-center pt-6 pb-2">
    //         <h1 class="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight">
    //             Rapid Groove™
    //         </h1>
    //         <p class="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">Premium Shopping Experience</p>
    //     </div>
        
    //     <!-- Modernized Empty Cart Section -->
    //     <div class="flex-grow flex flex-col items-center justify-center p-8 mt-4">
    //         <div class="relative group">
    //             <svg xmlns="http://www.w3.org/2000/svg" class="w-28 h-28 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    //             </svg>
    //             <div class="absolute -bottom-2 w-full h-4 bg-gradient-to-t from-gray-100 to-transparent opacity-50"></div>
    //         </div>
            
    //         <h2 class="text-2xl font-bold text-gray-800 mt-8 mb-2">Your Cart Awaits</h2>
    //         <p class="text-gray-600 mb-8 text-center max-w-md">
    //             Ready to fill your cart with amazing finds? Start your shopping journey now.
    //         </p>
            
    //         <a href="/" class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
    //             Explore Collection
    //             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-2 -mr-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    //             </svg>
    //         </a>
    //     </div>
        
    //     <!-- Subtle Background Decoration -->
    //     <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
    // </div>`;









    productDetailsContainer.innerHTML = `
    <div class="relative min-h-screen bg-gradient-to-b from-gray-50 to-white mr-[200px] emptyCart">
        <!-- Modern Header -->
        <div class="w-full text-center pt-6 pb-2">
            <h1 class="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight">
                Rapid Groove
            </h1>
            <p class="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">Premium Shopping Experience</p>
        </div>
        
        <!-- Modernized Empty Cart Section -->
        <div class="flex-grow flex flex-col items-center justify-center p-8 mt-4">
            <div class="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-28 h-28 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div class="absolute -bottom-2 w-full h-4 bg-gradient-to-t from-gray-100 to-transparent opacity-50"></div>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-800 mt-8 mb-2">Your Cart Awaits</h2>
            <p class="text-gray-600 mb-8 text-center max-w-md">
                Ready to fill your cart with amazing finds? Start your shopping journey now.
            </p>
            
            <a href="index.html" class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Explore Collection
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-2 -mr-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>
        </div>
        
        <!-- Subtle Background Decoration -->
        <div class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
    </div>
     <style>
     .emptyCart{
     right:-200px;
     }
     
     </style>
    
    
    `;


      

        
        // Hide any price details or other cart-related elements
        if (priceDetailsContainer) priceDetailsContainer.style.display = 'none';
        if (itemCountSpan) itemCountSpan.style.display = 'none';
        if (discountMessageDiv) discountMessageDiv.style.display = 'none';
        return;
    }

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
    window.location.href = `product-detail.html?id=${productId}`;
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
        selectedItems.delete(itemId);
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

function saveOrderSummaryToLocalStorage() {
    fetchCartData().then(cartData => {
        const priceDetails = calculatePriceDetails(cartData);
        localStorage.setItem("orderSummary", JSON.stringify(priceDetails));
        window.location.href = "address.html";
    });
}

initializeCart();

