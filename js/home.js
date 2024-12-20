
function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString()); 
    const randomPadding = Math.random().toString(36).substring(2, 12); 
    return btoa(base64Encoded + randomPadding); 
}
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Global variables for infinite scroll
let currentPage = 0;
let isLoading = false;
let hasMore = true;

// Function to fetch products
async function fetchProducts(page) {
    //const url = API_URLS.HOME_PRODUCT_DETAILS(page,100);
    const url = `http://localhost:8081/product/all/details?page-number=${page}&size=100`;
    const token = localStorage.getItem('userJwtToken')
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}




function createProductCard(product) {
    const primaryImage = product.productImages.find(img => img.primaryImage) || product.productImages[0];
    const imageUrl = `data:${primaryImage.type};base64,${primaryImage.picByte}`;
    const smallestSize = product.sizes.reduce((min, size) => 
        size.available && (!min || size.price.current < min.price.current) ? size : min
    , null);

    const encodedId = encodeProductId(product.id);

    return `
        <div class="product-card-container relative w-full max-w-[250px] overflow-hidden">
            <div class="product-card-wrapper flex transition-transform duration-300 ease-in-out">
                <div class="product-card-main min-w-full bg-white rounded-md shadow-sm overflow-hidden">
                    <a href="product-detail.html?id=${encodedId}" class="block">
                        <div class="relative">
                            <img src="${imageUrl}" 
                                 alt="${product.name}" 
                                 class="w-full h-36 object-cover">
                            <span class="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                ${smallestSize.price.discountPercentage}% OFF
                            </span>
                        </div>
                        <div class="p-2">
                            <h2 class="text-sm font-bold mb-1 truncate">${product.name}</h2>
                            <p class="text-xs text-gray-600 mb-1 truncate">${product.subtitle}</p>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-semibold text-gray-900">
                                    ₹ ${smallestSize.price.current.toFixed(2)}
                                    <span class="text-xs text-gray-500 line-through ml-1">₹ ${smallestSize.price.original.toFixed(2)}</span>
                                </span>
                            </div>
                        </div>
                    </a>
                    <div class="px-2 pb-2">
                        <button 
                            onclick="window.location.href = 'cart.html?productId=${product.id}&size=${smallestSize.size}'" 
                            class="w-full bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 transition duration-300 text-xs"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-card-slide min-w-full bg-gray-100 rounded-md shadow-sm flex items-center justify-center">
                    <div class="text-center p-4">
                        <h3 class="font-bold text-sm mb-2">Quick Actions</h3>
                        <div class="flex flex-col space-y-2">
                            <button class="bg-blue-500 text-white text-xs px-3 py-2 rounded-md">
                                View Details
                            </button>
                            <button class="bg-green-500 text-white text-xs px-3 py-2 rounded-md">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add this JavaScript to handle the sliding interaction
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    
    productGrid.addEventListener('click', (event) => {
        const productCardContainer = event.target.closest('.product-card-container');
        if (!productCardContainer) return;

        const cardWrapper = productCardContainer.querySelector('.product-card-wrapper');
        
        // Toggle sliding effect
        cardWrapper.classList.toggle('translate-x-[-100%]');
    });
});
// Function to load products
async function loadProducts() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    const data = await fetchProducts(currentPage);
    if (data && data.content) {
        const productGrid = document.getElementById('product-grid');
        data.content.forEach(product => {
            const productCard = document.createElement('div');
            productCard.innerHTML = createProductCard(product);
            productGrid.appendChild(productCard.firstElementChild);
        });

        hasMore = !data.last;
        currentPage++;
    }

    isLoading = false;
    document.getElementById('loading').style.display = 'none';
}

// Infinite scroll handler
function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1000) {
        loadProducts();
    }
}

// Initial load
loadProducts();

// Add scroll event listener
window.addEventListener('scroll', handleScroll);