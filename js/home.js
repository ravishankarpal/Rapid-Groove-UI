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
   // const token = localStorage.getItem('userJwtToken')
    try {
        const response = await fetch(url, {
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
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
    productCard.className = 'group relative w-full overflow-hidden rounded-lg shadow-sm ';

    productCard.innerHTML = `
        <div class="product-card-wrapper flex transition-transform duration-300 ease-in-out">
            <!-- Main Card -->
            <div class="min-w-full bg-white rounded-lg flex flex-col h-full">
                <a href="product-detail.html?id=${encodedId}" class="block flex-grow">
                    <div class="relative">
                        <img src="data:${imageToUse.type};base64,${imageToUse.picByte}" 
                             alt="${product.name}" 
                             class="w-full h-40 sm:h-48 object-cover rounded-t-lg">
                        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            ${availableSize.price.discountPercentage}% OFF
                        </span>
                    </div>
                    <div class="p-3 flex-grow">
                        <h2 class="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-2">${product.name}</h2>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">${product.subtitle || ''}</p>
                        
                        <div class="flex justify-between items-center">
                            <span class="text-base sm:text-lg font-semibold text-gray-900">
                                ₹${availableSize.price.current.toFixed(2)}
                                <span class="text-xs sm:text-sm text-gray-500 line-through ml-1">₹${availableSize.price.original.toFixed(2)}</span>
                            </span>
                        </div>
                    </div>
                </a>
                <div class="px-3 pb-3 mt-auto">
                    <button 
                        class="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm font-medium add-to-cart-btn flex items-center justify-center"
                        data-product-id="${product.id}" 
                        data-size="${availableSize.value}">
                        Add to Cart
                    </button>
                </div>
            </div>

        </div>
    `;

    // Add click event listeners
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', async function(event) {
        event.preventDefault();
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
            console.error('Error adding to cart:', error);
        } finally {
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    });

    return productCard;
}

function createLoadingCard() {
    return `
        <div class="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-300 h-40 sm:h-48 w-full rounded-t-lg"></div>
            <div class="p-4">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div class="h-8 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    `;
}


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
           const productCard = createProductCard(product);
            if (productCard) {
                productGrid.appendChild(productCard);
            }
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


 async function addToCart(productId, selectedSize) {
    const payload = {
        productId,
        selectedSize,
        quantity: 1,
    };

    try {
        const currentSession = SessionManager.getCurrentSession();
        const head =  currentSession ? `Bearer ${currentSession.jwtToken}` : '';
        const header = {
            'Authorization': head,
            'Content-Type': 'application/json'
        };
        const response = await fetch("http://localhost:8081/rapid/cart/v2/addItemToCart", {
            method: 'POST',
            headers: header,
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(response);
             showToast('Item added to cart successfully!', 'success');
            


        } else {
            showToast('Failed to add item to cart. Please try again.', 'error');
            throw new Error('Failed to add item to cart');
        }


    } catch (error) {

        showToast('Failed to add item to cart. Please try again.', 'error');
    }
}

// Initial load
loadProducts();

// Add scroll event listener
window.addEventListener('scroll', handleScroll);