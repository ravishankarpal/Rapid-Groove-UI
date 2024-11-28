import { API_URLS } from "./api-constants.js";

// Initialize variables
let selectedSize = null;
let selectedQuantity = 1;
let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        try {
            const response = await fetch(`http://localhost:8081/product/productDetails/yes/${productId}`);
            const productArray = await response.json();

            if (productArray.length > 0) {
                currentProduct = productArray[0];
                updateProductDetails(currentProduct);
            } else {
                console.error('No product found for the given ID.');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    // Event listeners for quantity buttons
    document.getElementById('increase-quantity').addEventListener('click', () => {
        selectedQuantity++;
        updateQuantityAndPrice();
    });

    document.getElementById('decrease-quantity').addEventListener('click', () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            updateQuantityAndPrice();
        }
    });

    // Add to Bag functionality
    document.querySelector('.bg-blue-500').addEventListener('click', addToCart);
});

function updateProductDetails(product) {
    document.getElementById('product-name').textContent = product.productName;
    document.getElementById('product-subtitle').textContent = product.productDescription;

    updateRatingAndReviews(product);
    updateSizeOptions(product);
    updateProductImage(product);
    updatePromotion(product);

    // Select the first size by default
    if (product.sizePrices.length > 0) {
        selectSize(product.sizePrices[0]);
    }
}

function updateRatingAndReviews(product) {
    document.getElementById('product-rating').textContent = product.productRating ? `${product.productRating} out of 5` : "";
    document.getElementById('product-ratings-count').textContent = product.ratingsCount ? `${product.ratingsCount} ratings` : "";
    document.getElementById('product-reviews-count').textContent = product.reviewsCount ? `${product.reviewsCount} reviews` : "";
}

function updateSizeOptions(product) {
    const sizeOptionsContainer = document.getElementById('size-options').querySelector('.flex');
    sizeOptionsContainer.innerHTML = ''; // Clear existing options

    product.sizePrices.forEach(sizePrice => {
        const button = document.createElement('button');
        button.className = 'border rounded-md p-2 hover:bg-blue-500 hover:text-white';
        button.textContent = sizePrice.size;
        button.onclick = () => selectSize(sizePrice);
        sizeOptionsContainer.appendChild(button);
    });
}

function updateProductImage(product) {
    if (product.productImages.length > 0) {
        const productImage = product.productImages[0];
        document.getElementById('product-image').src = `data:${productImage.type};base64,${productImage.picByte}`;
    } else {
        console.warn('No images available for this product.');
    }
}

function updatePromotion(product) {
    document.getElementById('promotion').textContent = product.promotionRequired ? product.promotions : "";
}

function selectSize(sizePrice) {
    selectedSize = sizePrice;
    updatePricing();
    console.log(`Selected size: ${sizePrice.size}`);
}

function updatePricing() {
    if (!selectedSize || !currentProduct) return;

    document.getElementById('product-price').textContent = selectedSize.price.toFixed(2);
    document.getElementById('product-original-price').textContent = selectedSize.actualPrice.toFixed(2);
    document.getElementById('product-discount').textContent = selectedSize.discountPercentage ? `${selectedSize.discountPercentage}% Off` : "";

    updateTotalPrice();
}

function updateQuantityAndPrice() {
    document.getElementById('quantity').textContent = selectedQuantity;
    updateTotalPrice();
}

function updateTotalPrice() {
    if (!selectedSize) return;

    let totalPrice = selectedQuantity * selectedSize.price;

    if (!currentProduct.taxIncluded && currentProduct.taxPercent > 0) {
        const taxAmount = totalPrice * (currentProduct.taxPercent / 100);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        document.getElementById('tax-amount').textContent = `${taxAmount.toFixed(2)} (${currentProduct.taxPercent}% tax added to total)`;
    } else {
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        document.getElementById('tax-amount').textContent = ""; // Clear any previous tax amount
    }
}

async function checkPincode() {
    const pincode = document.getElementById('pincode-input').value;
    const deliveryMessage = document.getElementById('delivery-message');

    try {
        const response = await fetch(`http://localhost:8081/rapid/user/check/delivery/${pincode}`);
        const result = await response.json();

        if (response.ok) {
            deliveryMessage.innerHTML = `<span class="text-green-600">Delivery is available in ${result.city}, ${result.state}. Estimated delivery in ${result.estimatedDays} days.</span>`;
        } else {
            deliveryMessage.innerHTML = `<span class="text-red-600">${result.message}</span>`;
        }
    } catch (error) {
        deliveryMessage.innerHTML = `<span class="text-red-600">Error checking delivery: ${error.message}</span>`;
    }
}

async function addToCart() {
    if (!currentProduct || !selectedSize) {
        console.error("Product or size not selected.");
        return;
    }

    const selectedSizePrice = currentProduct.sizePrices.find(size => size.sizePriceId === selectedSize.sizePriceId);

    if (!selectedSizePrice) {
        console.error("Selected size not found in product details.");
        return;
    }

    const requestBody = {
        productId: currentProduct.productId,  // Product ID from the API response
        sizePriceId: selectedSizePrice.sizePriceId, // Size Price ID from selected sizePrices list
        quantity: selectedQuantity // The quantity selected by the user
    };

    try {
        
        let token = localStorage.getItem("userJwtToken");
        token = "Bearer"+ token;
        const response = await fetch(API_URLS.ADD_ITEM_TO_CART, {
            method: 'POST',
            headers: {
                'Authorization': token, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        console.log(response);
        if(response.ok){

        
                showMessage('Item Added in cart.', 'success');
            
        }else{
            alert('An error occurred while adding the product to the cart.','error');
        }

    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('An error occurred while adding the product to the cart.');
    }
}

// Loading navbar and footer components
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const [navbarResponse, footerResponse] = await Promise.all([
//             fetch('src/components/navbar.html'),
//             fetch('src/components/footer.html')
//         ]);

//         const [navbarHtml, footerHtml] = await Promise.all([
//             navbarResponse.text(),
//             footerResponse.text()
//         ]);

//         document.getElementById('navbar-placeholder').innerHTML = navbarHtml;
//         document.getElementById('footer-placeholder').innerHTML = footerHtml;
//     } catch (error) {
//         console.error('Error loading page components:', error);
//     }
// });
