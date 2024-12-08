import { API_URLS } from "./api-constants.js";

import { addToCart } from "./common/add-to-cart.js";
document.addEventListener('DOMContentLoaded', function() {
    const searchTitle = document.getElementById('searchTitle');
    const searchResults = document.getElementById('searchResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResults');
    const errorMessage = document.getElementById('errorMessage');

    let currentPage = 0;
    const pageSize = 50; 
    let isLoading = false;
    let hasMoreData = true; 
    let query = '';

    async function fetchSearchResults(query, page) {
        if (isLoading) return;
        isLoading = true;
        loadingIndicator.classList.remove('hidden');
        searchTitle.textContent = `Search Results for ${query}`;
        try {
          
           
          const url = API_URLS.SEARCH_PRODUCTS(query, currentPage, pageSize);
            const response = await fetch(url,{
                  headers: API_URLS.HEADERS,
                }
            );

            if (!response.ok) throw new Error('Search failed');

            const responseData = await response.json();
            const products = responseData.content;

         
            if (products.length < pageSize) {
                hasMoreData = false;
            }

            renderProducts(products);
        } catch (error) {
            console.error('Error loading search results:', error);
            errorMessage.classList.remove('hidden');
        } finally {
            isLoading = false;
            loadingIndicator.classList.add('hidden');
        }
    }

    function renderProducts(products) {
        if (products.length === 0 && currentPage === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        // Render each product in the DOM
        const htmlToAdd = products.map(product => {
            const primaryImage = product.productImages.find(img => img.primaryImage)?.picByte || '';

            const size = product.sizes[0];
            return `
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="relative">
                        <img src="data:${product.productImages[0]?.type};base64,${primaryImage}" 
                             alt="${product.name}" 
                             class="w-full h-48 object-cover">
                        ${size.price.discountPercentage > 0 ? `
                        <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ${size.price.discountPercentage}% OFF
                        </div>
                        ` : ''}
                    </div>
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800 mb-1">${product.name}</h3>
                        <p class="text-sm text-gray-600 mb-2">${product.subtitle}</p>
                        <div class="flex items-center mb-2">
                            <div class="text-yellow-500 mr-2">
                                ${renderStarRating(product.rating.average)}
                            </div>
                            <span class="text-gray-600 text-sm">
                                (${product.rating.totalReviews} reviews)
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="text-black-600 font-bold">₹${size.price.current}</span>
                                ${size.price.discountPercentage > 0 ? `
                                <span class="text-gray-500 line-through text-sm ml-2">₹${size.price.original}</span>
                                ` : ''}
                            </div>
                            <button 
                          class="w-auto bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600 transition duration-300 text-sm mx-auto block add-to-cart-btn" 
                          data-product-id="${product.id}" 
                          data-size="${size.value}">
                            Add to Cart
                        </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        searchResults.insertAdjacentHTML('beforeend', htmlToAdd);

        
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const productId = this.getAttribute('data-product-id');
        const size = this.getAttribute('data-size');
        await addToCart(productId, size);
    });
});

    }

    function renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = stars.length / 27; i < 5; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('query');

    if (query) {
        fetchSearchResults(query, currentPage);
    }

    window.addEventListener('scroll', () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && 
            !isLoading &&
            hasMoreData
        ) {
            currentPage++;
            fetchSearchResults(query, currentPage);
        }
    });
});


