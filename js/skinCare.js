import { API_URLS } from "./api-constants.js";
import { SKIN_CARE } from "./constant/category.js";
import { addToCart } from "./common/add-to-cart.js";

const CATEGORIES = SKIN_CARE;

function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString());
    const randomPadding = Math.random().toString(36).substring(2, 12);
    return btoa(base64Encoded + randomPadding);
}




// async function fetchAndDisplayCategory(category) {
//     const section = document.createElement('section');
//     section.className = 'mb-12'; // Add margin between categories
//     section.innerHTML = `
//         <h2 class="text-3xl font-extrabold mb-6 text-center flex items-center justify-center">
//             <i class="fas fa-${category.icon} mr-3"></i> ${category.name}
//         </h2>
//         <div id="${category.id}-container" class="grid grid-cols-5 gap-4">
//             ${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}
//         </div>
//     `;
//     document.getElementById('categories-container').appendChild(section);

//     try {
//         const url = new URL(API_URLS.CATEGORY_PRODUCTS);
//         url.searchParams.append('category', 'Skin Care');
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: API_URLS.HEADERS
//         });

//         if (!response.ok) throw new Error('Network response was not ok');

//         const products = await response.json();
//         const container = document.getElementById(`${category.id}-container`);

//         const categoryProducts = products.filter(
//             product => product.subCategory === category.subCategory
//         );

//         // Clear loading cards
//         container.innerHTML = '';
        
//         // Add products to container
//         categoryProducts.forEach(product => {
//             const productCard = createProductCard(product);
//             if (productCard) {
//                 container.appendChild(productCard);
//             }
//         });

//         if (categoryProducts.length === 0) {
//             container.innerHTML = `<div class="col-span-5 text-center py-8 text-gray-500">No products found in this category</div>`;
//         }
//     } catch (error) {
//         console.error(`Error fetching ${category.name} products:`, error);
//     }
// }

// const loadingSpinner = `<div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>`;

// function createProductCard(product) {
//     // Validate product data
//     if (!product || !product.productImages || !product.sizes) {
//         console.error('Invalid product data provided');
//         return null;
//     }

//     const imageToUse = product.productImages.find(img => img.primaryImage) || product.productImages[0];
//     const availableSize = product.sizes.find(size => size.available);

//     if (!availableSize || !imageToUse) {
//         console.log('No available size or image found for product:', product.id);
//         return null;
//     }

//     const encodedId = encodeProductId(product.id);

//     // Create product card element
//     const productCard = document.createElement('div');
//     productCard.className = 'bg-white rounded-lg shadow-sm overflow-hidden flex flex-col';

//     productCard.innerHTML = `
//         <a href="product-detail.html?id=${encodedId}" class="block flex-grow">
//             <div class="relative">
//                 <img src="data:${imageToUse.type};base64,${imageToUse.picByte}" 
//                      alt="${product.name}" 
//                      class="w-full h-48 object-cover">
//                 <span class="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                     ${availableSize.price.discountPercentage}% OFF
//                 </span>
//             </div>
//             <div class="p-2 flex-grow">
//                 <h2 class="text-lg font-bold mb-2 line-clamp-2">${product.name}</h2>
//                 <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.subtitle || ''}</p>
                
//                 <div class="flex justify-between items-center">
//                     <span class="text-lg font-semibold text-gray-900">
//                         ₹ ${availableSize.price.current.toFixed(2)}
//                         <span class="text-sm text-gray-500 line-through ml-1">₹ ${availableSize.price.original.toFixed(2)}</span>
//                     </span>
//                 </div>
//             </div>
//         </a>
//         <div class="px-2 pb-2">
//             <button 
//                 class="w-full bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 transition duration-300 text-xs add-to-cart-btn"
//                 data-product-id="${product.id}" 
//                 data-size="${availableSize.value}">
//                 Add to Cart
//             </button>
//         </div>
//     `;

//     // Add click event listener to the Add to Cart button
//     const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
//     addToCartBtn.addEventListener('click', async function(event) {
//         const button = event.currentTarget;
//         const originalContent = button.innerHTML;
        
//         try {
//             button.innerHTML = loadingSpinner;
//             button.disabled = true;
            
//             const productId = button.dataset.productId;
//             const size = button.dataset.size;
            
//             if (!productId || !size) {
//                 throw new Error('Missing product information');
//             }
            
//             await addToCart(productId, size);
            
//         } catch (error) {
//             this.innerHTML = originalContent;
//             this.disabled = false;
//         }
//     });

//     return productCard;
// }

// function createLoadingCard() {
//     return `
//         <div class="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
//             <div class="bg-gray-300 h-48 w-full"></div>
//             <div class="p-4">
//                 <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//                 <div class="h-4 bg-gray-300 rounded w-1/2"></div>
//             </div>
//         </div>
//     `;
// }


async function fetchAndDisplayCategory(category) {
    const section = document.createElement('section');
    section.className = 'mb-12'; // Add margin between categories
    section.innerHTML = `
        <h2 class="text-3xl font-extrabold mb-6 text-center flex items-center justify-center">
            <i class="fas fa-${category.icon} mr-3"></i> ${category.name}
        </h2>
        <div id="${category.id}-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            ${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}
        </div>
    `;
    document.getElementById('categories-container').appendChild(section);

    try {
        const url = new URL(API_URLS.CATEGORY_PRODUCTS);
        url.searchParams.append('category', 'Skin Care');
        const response = await fetch(url, {
            method: 'GET',
            headers: API_URLS.HEADERS
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const products = await response.json();
        const container = document.getElementById(`${category.id}-container`);

        const categoryProducts = products.filter(
            product => product.subCategory === category.subCategory
        );

        // Clear loading cards
        container.innerHTML = '';
        
        // Add products to container
        categoryProducts.forEach(product => {
            const productCard = createProductCard(product);
            if (productCard) {
                container.appendChild(productCard);
            }
        });

        if (categoryProducts.length === 0) {
            container.innerHTML = `<div class="col-span-full text-center py-8 text-gray-500">No products found in this category</div>`;
        }
    } catch (error) {
        console.error(`Error fetching ${category.name} products:`, error);
    }
}

const loadingSpinner = `<div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>`;

function createProductCard(product) {
    // Validate product data
    if (!product || !product.productImages || !product.sizes) {
        console.error('Invalid product data provided');
        return null;
    }

    const imageToUse = product.productImages.find(img => img.primaryImage) || product.productImages[0];
    const availableSize = product.sizes.find(size => size.available);

    if (!availableSize || !imageToUse) {
        console.log('No available size or image found for product:', product.id);
        return null;
    }

    const encodedId = encodeProductId(product.id);

    // Create product card element
    const productCard = document.createElement('div');
    productCard.className = 'bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full'; // Added h-full for consistent height

    productCard.innerHTML = `
        <a href="product-detail.html?id=${encodedId}" class="block flex-grow">
            <div class="relative">
                <img src="data:${imageToUse.type};base64,${imageToUse.picByte}" 
                     alt="${product.name}" 
                     class="w-full h-40 sm:h-48 object-cover"> <!-- Adjusted height for mobile -->
                <span class="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    ${availableSize.price.discountPercentage}% OFF
                </span>
            </div>
            <div class="p-2 flex-grow">
                <h2 class="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-2">${product.name}</h2>
                <p class="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">${product.subtitle || ''}</p>
                
                <div class="flex justify-between items-center">
                    <span class="text-base sm:text-lg font-semibold text-gray-900">
                        ₹ ${availableSize.price.current.toFixed(2)}
                        <span class="text-xs sm:text-sm text-gray-500 line-through ml-1">₹ ${availableSize.price.original.toFixed(2)}</span>
                    </span>
                </div>
            </div>
        </a>
        <div class="px-2 pb-2 mt-auto">
            <button 
                class="w-full bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 transition duration-300 text-xs add-to-cart-btn"
                data-product-id="${product.id}" 
                data-size="${availableSize.value}">
                Add to Cart
            </button>
        </div>
    `;

    // Add click event listener to the Add to Cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', async function(event) {
        const button = event.currentTarget;
        const originalContent = button.innerHTML;
        
        try {
            button.innerHTML = loadingSpinner;
            button.disabled = true;
            
            const productId = button.dataset.productId;
            const size = button.dataset.size;
            
            if (!productId || !size) {
                throw new Error('Missing product information');
            }
            
            await addToCart(productId, size);
            
        } catch (error) {
            this.innerHTML = originalContent;
            this.disabled = false;
        }
    });

    return productCard;
}

function createLoadingCard() {
    return `
        <div class="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-300 h-40 sm:h-48 w-full"></div>
            <div class="p-4">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    `;
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const productId = this.getAttribute('data-product-id');
        const size = this.getAttribute('data-size');
        await addToCart(productId, size);
    });
});

 CATEGORIES.forEach(fetchAndDisplayCategory);




