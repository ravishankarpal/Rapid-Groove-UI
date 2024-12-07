import { API_URLS } from "./api-constants.js";
import { SKIN_CARE } from "./constant/category.js";

const CATEGORIES = SKIN_CARE;

function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString()); 
    const randomPadding = Math.random().toString(36).substring(2, 12); 
    return btoa(base64Encoded + randomPadding); 
}

function createLoadingCard() {
    return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4">
                <div class="h-6 w-3/4 bg-gray-200 mb-3"></div>
                <div class="h-4 bg-gray-200 mb-2"></div>
                <div class="h-4 w-1/2 bg-gray-200 mb-4"></div>
                <div class="flex justify-between">
                    <div class="h-10 w-24 bg-gray-200"></div>
                    <div class="h-10 w-24 bg-gray-200"></div>
                </div>
            </div>
        </div>
    `;
}

// Create Product Card with Separate Routing
function createProductCard(product) {
    const imageToUse = product.productImages.find(img => img.primaryImage) || product.productImages[0];
    const availableSize = product.sizes.find(size => size.available);

    if (!availableSize) return null;
    const encodedId = encodeProductId(product.id);


    return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <a href="product-detail.html?id=${encodedId}" class="block transform transition duration-300 ">
                <div class="relative">
                    <img src="data:${imageToUse.type};base64,${imageToUse.picByte}" 
                         alt="${product.name}" 
                         class="w-full h-48 object-cover">
                    <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ${availableSize.price.discountPercentage}% OFF
                    </span>
                </div>
                <div class="p-4">
                    <h2 class="text-lg font-bold mb-2">${product.name}</h2>
                    <p class="text-gray-600 text-sm mb-3">${product.subtitle}</p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-900">
                            ₹ ${availableSize.price.current.toFixed(2)}
                            <span class="text-sm text-gray-500 line-through ml-1">₹ ${availableSize.price.original.toFixed(2)}</span>
                        </span>
                    </div>
                </div>
            </a>
            <div class="px-4 pb-4">
                <button 
                    onclick="window.location.href = 'cart.html?productId=${product.id}&size=${availableSize.size}'" 
                    class="w-auto bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600 transition duration-300 text-sm mx-auto block"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

async function fetchAndDisplayCategory(category) {
    const section = document.createElement('section');
    section.innerHTML = `
        <h2 class="text-3xl font-extrabold mb-6 text-center flex items-center justify-center">
            <i class="fas fa-${category.icon} mr-3"></i> ${category.name}
        </h2>
        <div id="${category.id}-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}
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

        const productCards = categoryProducts.map(createProductCard).filter(card => card !== null);

        container.innerHTML = productCards.length
            ? productCards.join('')
            : `<div class="text-center py-8 text-gray-500">No products found in this category</div>`;
    } catch (error) {
        console.error(`Error fetching ${category.name} products:`, error);
    }
}

CATEGORIES.forEach(fetchAndDisplayCategory);




