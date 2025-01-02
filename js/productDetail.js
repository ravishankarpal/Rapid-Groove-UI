import { API_URLS } from "./api-constants.js";
import { addToCart } from "./common/add-to-cart.js";
import { encodeProductId } from "./common/product-util.js";


function decodeProductId(encodedId) {
    const decodedOnce = atob(encodedId); 
    const originalId = decodedOnce.substring(0, decodedOnce.indexOf('=')); 
    return atob(originalId); 
}

//const encodedProductId = encodeProductId()

const urlParams = new URLSearchParams(window.location.search);
const productId = decodeProductId(urlParams.get('id'));
let size;

async function fetchProductDetails() {
    // const urlParams = new URLSearchParams(window.location.search);
    // const productId = decodeProductId(urlParams.get('id'));
    
    if(productId){
        try {
            const response = await fetch(API_URLS.PRODUCT_DETAILS(productId), {
                method: 'GET',
                headers:API_URLS.HEADERS
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
    
            const [productData] = await response.json();
            renderProductDetails(productData);
        } catch (error) {
            console.error('Error fetching product details:', error);
            displayErrorMessage('Unable to load product details. Please try again later.');
        }
    }
   
}

// Function to render product details
const loadingSpinner = `<div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>`;

function renderProductDetails(product) {
    // Product Name and Subtitle
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-subtitle').textContent = product.subtitle;

    // Product Images
    const primaryImage = product.productImages.find(img => img.primaryImage);
    mainImageSrc = primaryImage 
        ? `data:${primaryImage.type};base64,${primaryImage.picByte}` 
        : '/api/placeholder/200/200';
    document.getElementById('product-image').src = mainImageSrc;

    // Side Images
    const sideImagesContainer = document.querySelector('.col-span-2');
    const sideImageTemplate = sideImagesContainer.querySelector('div').cloneNode(true);
    sideImagesContainer.innerHTML = ''; // Clear existing images

    product.productImages.slice(0, 4).forEach((image, index) => {
        const imageElement = sideImageTemplate.cloneNode(true);
        const img = imageElement.querySelector('img');
        img.src = `data:${image.type};base64,${image.picByte}`;
        img.alt = `View ${index + 1}`;
        
        imageElement.setAttribute('onmouseover', `showImage('data:${image.type};base64,${image.picByte}')`);
        imageElement.setAttribute('onmouseout', 'showMainImage()');
        imageElement.setAttribute('onclick', `setMainImage('data:${image.type};base64,${image.picByte}')`);
        
        sideImagesContainer.appendChild(imageElement);
    });

    // Pricing (using first size's price)
    const selectedSize = product.sizes[0];
    size = selectedSize;
    document.getElementById('product-price').textContent = selectedSize.price.current.toFixed(2);
    document.getElementById('product-original-price').textContent = selectedSize.price.original.toFixed(2);
    document.getElementById('product-discount').textContent = `${selectedSize.price.discountPercentage}% OFF`;
    document.getElementById('total-price').textContent = selectedSize.price.current.toFixed(2);

    // Ratings
    document.getElementById('product-rating').textContent = product.rating.average.toFixed(1);
    document.getElementById('product-ratings-count').textContent = `(${product.rating.totalRatings} Ratings)`;
    document.getElementById('product-reviews-count').textContent = `${product.rating.totalReviews} Reviews`;

    // Sizes
    const sizeOptionsContainer = document.getElementById('size-options');
    sizeOptionsContainer.innerHTML = ''; // Clear existing sizes
    product.sizes.forEach(size => {
        const sizeButton = document.createElement('button');
        sizeButton.textContent = size.value;
        sizeButton.className = `px-3 py-2 rounded-md ${size.available 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`;
        sizeButton.disabled = !size.available;
        sizeButton.addEventListener('click', () => updateSizeSelection(size));
        sizeOptionsContainer.appendChild(sizeButton);
    });

    // Description
    document.getElementById('product-description').textContent = product.description;

    // Specifications
    const specificationsContainer = document.getElementById('product-specifications');
    specificationsContainer.innerHTML = ''; // Clear existing specifications
    product.specifications.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specificationsContainer.appendChild(li);
    });

    // Reviews
    const reviewsContainer = document.getElementById('product-reviews');
    reviewsContainer.innerHTML = ''; // Clear existing reviews
    product.reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'border-b pb-3';
        reviewElement.innerHTML = `
            <div class="flex justify-between">
                <span class="font-medium">${review.name}</span>
                <div class="text-yellow-500">
                    ${generateStarRating(review.rating)}
                </div>
            </div>
            <p class="text-gray-600 mt-2">${review.comment}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });

    // Related Products
    renderRelatedProducts(product.relatedProducts);

    // Delivery Options
    checkPincode(product.deliveryInfo);
}

// Function to update price and total price when size is selected
function updateSizeSelection(selectedSize) {
    document.getElementById('product-price').textContent = selectedSize.price.current.toFixed(2);
    document.getElementById('product-original-price').textContent = selectedSize.price.original.toFixed(2);
    document.getElementById('product-discount').textContent = `${selectedSize.price.discountPercentage}% OFF`;
    
    const quantity = parseInt(document.getElementById('quantity').textContent);
    const totalPrice = (selectedSize.price.current * quantity).toFixed(2);
    document.getElementById('total-price').textContent = totalPrice;
}

// Generate star rating HTML
function generateStarRating(rating) {
    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
        starHTML += i <= rating 
            ? '<i class="fas fa-star"></i>' 
            : '<i class="far fa-star"></i>';
    }
    return starHTML;
}

// Render Related Products
function renderRelatedProducts(relatedProducts) {
    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = '';

    relatedProducts.forEach(product => {
        const primaryImage = product.productImages.find(img => img.primaryImage) || product.productImages[0];
        const productCard = document.createElement('div');
        productCard.className = 'product-card-main min-w-full bg-white rounded-md shadow-sm overflow-hidden';
        
        productCard.innerHTML = `
            <a href="product-detail.html?id=${encodeProductId(product.id)}" class="block">
                <div class="relative">
                    <img src="data:${primaryImage.type};base64,${primaryImage.picByte}" 
                         alt="${product.name}" 
                         class="w-full h-36 object-cover">
                    <span class="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        ${product.productSize.price.discountPercentage}% OFF
                    </span>
                </div>
                <div class="p-2">
                    <h2 class="text-sm font-bold mb-1 truncate">${product.name}</h2>
                    <p class="text-xs text-gray-600 mb-1 truncate">${product.subtitle || ''}</p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-semibold text-gray-900">
                            ₹ ${product.productSize.price.current.toFixed(2)}
                            <span class="text-xs text-gray-500 line-through ml-1">₹ ${product.productSize.price.original.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </a>
            <div class="px-2 pb-2">
                <button 
                    class="w-full bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 transition duration-300 text-xs add-to-cart-btn"
                    data-product-id="${product.id}" 
                    data-size="${product.productSize.value}">
                    Add to Cart
                </button>
            </div>
        `;
        relatedProductsContainer.appendChild(productCard);


        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', async function() {
              // Save original button content
              const originalContent = this.innerHTML;
              this.innerHTML = loadingSpinner;
              this.disabled = true;
            const productId = this.dataset.productId;
            const size = this.dataset.size;
            try {
                await addToCart(productId, size);
                
            } catch (error) {
                
                this.innerHTML = originalContent;
                this.disabled = false;
               
            }
            
        });
    });
}

document.getElementById('decrease-quantity').addEventListener('click', () => {
    const quantitySpan = document.getElementById('quantity');
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
        updateTotalPrice();
    }
});

document.getElementById('increase-quantity').addEventListener('click', () => {
    const quantitySpan = document.getElementById('quantity');
    let quantity = parseInt(quantitySpan.textContent);
    quantity++;
    quantitySpan.textContent = quantity;
    updateTotalPrice();
});

function updateTotalPrice() {
    const price = parseFloat(document.getElementById('product-price').textContent);
    const quantity = parseInt(document.getElementById('quantity').textContent);
    const totalPrice = (price * quantity).toFixed(2);
    document.getElementById('total-price').textContent = totalPrice;
}

// Pincode Delivery Check
function checkPincode(deliveryInfo) {
    document.getElementById('check-button').addEventListener('click', function () {
        const originalContent = this.innerHTML;
        this.innerHTML = loadingSpinner;
        this.disabled = true;

        const pincodeInput = document.getElementById('pincode-input').value.trim();
        const deliveryMessage = document.getElementById('delivery-message');

        if (!pincodeInput) {
            deliveryMessage.innerHTML = `
                <span class="text-red-600">
                    <i class="fas fa-times-circle mr-2"></i>
                    Please enter a pincode.
                </span>
            `;
            return; 
        }


        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(pincodeInput)) {
            deliveryMessage.innerHTML = `
                <span class="text-red-600">
                    <i class="fas fa-times-circle mr-2"></i>
                    Please enter a valid 6-digit pincode.
                </span>
            `;
            return; 
        }

        if (pincodeInput === deliveryInfo.pinCode && deliveryInfo.expressDeliveryAvailable) {
            deliveryMessage.innerHTML = `
                <span class="text-green-600">
                    <i class="fas fa-check-circle mr-2"></i>
                    Delivery available to ${deliveryInfo.city}
                </span>
            `;
        } else {
            deliveryMessage.innerHTML = `
                <span class="text-red-600">
                    <i class="fas fa-times-circle mr-2"></i>
                    Delivery not available to ${pincodeInput}
                </span>
            `;
        }

        this.innerHTML = originalContent;
        this.disabled = false;
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', fetchProductDetails);

// Error message display function
function displayErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';
    errorContainer.textContent = message;
    
    const mainContainer = document.querySelector('.container');
    mainContainer.insertBefore(errorContainer, mainContainer.firstChild);
}



document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const originalContent = this.innerHTML;
        this.innerHTML = loadingSpinner;
        this.disabled = true;
        await addToCart(productId, size.value);
        
        this.innerHTML = originalContent;
        this.disabled = false;
    });
});