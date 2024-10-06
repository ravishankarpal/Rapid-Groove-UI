const CATEGORIES = [
    { id: 'serums', name: 'Serums', icon: 'tint' },
    { id: 'eye-care', name: 'Eye Care', icon: 'eye' },
    { id: 'oily-skin', name: 'Oily Skin', icon: 'oil-can' },
    { id: 'cleansers', name: 'Cleansers', icon: 'pump-soap' },
    { id: 'gel-cream', name: 'Gel Cream', icon: 'jar' },
    { id: 'sunscreen', name: 'Sunscreen', icon: 'sun' },
    { id: 'lotion', name: 'Lotion', icon: 'bottle-droplet' }
];

function createLoadingCard() {
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="h-48 shimmer"></div>
            <div class="p-4">
                <div class="h-6 w-3/4 shimmer mb-2"></div>
                <div class="h-4 shimmer mb-2"></div>
                <div class="h-4 w-1/2 shimmer mb-4"></div>
                <div class="flex justify-between">
                    <div class="h-10 w-24 shimmer"></div>
                    <div class="h-10 w-24 shimmer"></div>
                </div>
            </div>
        </div>
    `;
}

function createProductCard(product) {
    return `
        <a href="product-detail.html?id=${product.productId}" class="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
            <img src="data:${product.productImages[0].type};base64,${product.productImages[0].picByte}" 
                 alt="${product.productName}" 
                 class="w-full h-48 object-cover">
            <div class="p-4">
                <h2 class="text-lg font-bold mb-2">${product.productName}</h2>
                <p class="text-gray-600 text-sm mb-3">${product.productDescription}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-900">
                        ₹ ${product.productDiscountPrice.toFixed(2)} 
                        <span class="text-sm text-gray-500 line-through">₹ ${product.productActualPrice.toFixed(2)}</span>
                    </span>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>
        </a>
    `;
}

async function fetchAndDisplayCategory(category) {
    const section = document.createElement('section');
    section.innerHTML = `
        <h2 class="category-heading">
            <i class="fas fa-${category.icon} mr-2"></i>${category.name}
        </h2>
        <div id="${category.id}-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${createLoadingCard()}${createLoadingCard()}${createLoadingCard()}
        </div>
    `;
    document.getElementById('categories-container').appendChild(section);

    try {
        const response = await fetch(`http://localhost:8081/product/details/categories?searchKey=${category.name}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const container = document.getElementById(`${category.id}-container`);

        if (data.content && data.content.length > 0) {
            container.innerHTML = data.content.map(createProductCard).join('');
        } else {
            container.innerHTML = `
                <div class="col-span-3 text-center py-8">
                    <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-500">No products found in this category</p>
                </div>
            `;
        }
    } catch (error) {
        console.error(`Error fetching ${category.name} products:`, error);
        document.getElementById(`${category.id}-container`).innerHTML = `
            <div class="col-span-3 text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <p class="text-gray-700">Sorry, we couldn't load the products. Please try again later.</p>
            </div>
        `;
    }
}

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

    CATEGORIES.forEach(fetchAndDisplayCategory);
});