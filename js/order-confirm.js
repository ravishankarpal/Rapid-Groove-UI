document.addEventListener('DOMContentLoaded', () => {
    const displayError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        document.querySelector('.max-w-4xl').prepend(errorDiv);
    };

    const formatImageData = (imageData) => {
        if (!imageData) return 'https://via.placeholder.com/150?text=No+Image';
        if (imageData.startsWith('data:image')) return imageData;
        return `data:image/jpeg;base64,${imageData}`;
    };

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const compressedData = urlParams.get('d');
        if (!compressedData) throw new Error('No order data found in URL parameters.');

        const decompressedData = LZString.decompressFromEncodedURIComponent(compressedData);
        const orderData = JSON.parse(decompressedData);
        console.log(orderData);

        const orderAddress = orderData.a;
        const products = orderData.p.map(item => ({
            productName: item.p,
            size: item.s,
            image: item.i
        }));

        // Populate shipping address
        const addressElement = document.getElementById('shipping-address');
        if (addressElement) {
            addressElement.innerHTML = `
                <p class="font-medium">${orderAddress.name}</p>
                <p>${orderAddress.streetAddress}</p>
                <p>${orderAddress.city}, ${orderAddress.state} ${orderAddress.pinCode}</p>
            `;
        }

        // Populate product list
        const productList = document.getElementById('product-list');
        if (productList) {
            products.forEach(item => {
                const productItem = document.createElement('div');
                productItem.className = 'flex gap-4 items-center';

                const formattedImageSrc = formatImageData(item.image);
                productItem.innerHTML = `
                    <div class="w-24 h-24 flex-shrink-0">
                        <img src="${formattedImageSrc}" 
                            alt="${item.productName}" 
                            class="w-full h-full object-cover rounded-lg bg-white">
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-800">${item.productName}</h3>
                        <p class="text-gray-600 mt-1">Size: ${item.size}</p>
                    </div>
                `;
                productList.appendChild(productItem);
            });
        }
    } catch (error) {
        console.error('Error loading order details:', error);
        displayError('Error loading order details. Please try again later.');
    }
});
