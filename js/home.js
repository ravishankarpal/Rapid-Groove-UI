
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

// // Function to create product card
// function createProductCard(product) {
//     const primaryImage = product.productImages.find(img => img.primaryImage) || product.productImages[0];
//     const imageUrl = `data:${primaryImage.type};base64,${primaryImage.picByte}`;
//     const smallestSize = product.sizes.reduce((min, size) => 
//         size.available && (!min || size.price.current < min.price.current) ? size : min
//     , null);

//     return `
//         <div class="bg-white rounded-lg shadow-lg overflow-hidden">
//             <a href="product-detail.html?id=${encodedId}" class="block transform transition duration-300 ">
//                 <div class="relative">
//                     <img src="data:${imageToUse.type};base64,${imageToUse.picByte}" 
//                          alt="${product.name}" 
//                          class="w-full h-48 object-cover">
//                     <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                         ${availableSize.price.discountPercentage}% OFF
//                     </span>
//                 </div>
//                 <div class="p-4">
//                     <h2 class="text-lg font-bold mb-2">${product.name}</h2>
//                     <p class="text-gray-600 text-sm mb-3">${product.subtitle}</p>
                    
//                     <div class="flex justify-between items-center">
//                         <span class="text-lg font-semibold text-gray-900">
//                             ₹ ${availableSize.price.current.toFixed(2)}
//                             <span class="text-sm text-gray-500 line-through ml-1">₹ ${availableSize.price.original.toFixed(2)}</span>
//                         </span>
//                     </div>
//                 </div>
//             </a>
//             <div class="px-4 pb-4">
//                 <button 
//                     onclick="window.location.href = 'cart.html?productId=${product.id}&size=${availableSize.size}'" 
//                     class="w-auto bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600 transition duration-300 text-sm mx-auto block"
//                 >
//                     Add to Cart
//                 </button>
//             </div>
//         </div>
//     `;
// }



function createProductCard(product) {
    const primaryImage = product.productImages.find(img => img.primaryImage) || product.productImages[0];
    const imageUrl = `data:${primaryImage.type};base64,${primaryImage.picByte}`;
    const smallestSize = product.sizes.reduce((min, size) => 
        size.available && (!min || size.price.current < min.price.current) ? size : min
    , null);

    return `
        <div class="bg-white rounded-md shadow-sm overflow-hidden w-full max-w-[250px]">
            <a href="product-detail.html?id=${product.id}" class="block">
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
    `;
}
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