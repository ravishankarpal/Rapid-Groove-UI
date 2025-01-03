
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Retrieve order data from sessionStorage
        const storedData = localStorage.getItem('orderData');

        if (!storedData) {
            throw new Error('No order data found in session storage.');
        }

        // Parse the stored data
        const { orderAddress, products } = JSON.parse(storedData);

        // Display the shipping address
        document.getElementById('shipping-address').textContent =
            `${orderAddress.name}, ${orderAddress.streetAddress}, ${orderAddress.city}, ${orderAddress.state}, ${orderAddress.pinCode}`;

        // Display product details
        const productList = document.getElementById('product-list');
        products.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'flex gap-4 items-start';
            productItem.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="data:image/png;base64,${item.image}" 
                                    alt="${item.productName}" 
                                    class="w-24 h-24 object-cover rounded-lg">
                    <div class="flex-grow">
                        <h3 class="font-medium text-gray-800">${item.productName}</h3>
                        <p class="text-gray-600">Size: ${item.size}</p>
                    </div>
                </div>
            `;
            productList.appendChild(productItem);
        });
       

    } catch (error) {
        console.error('Error loading order details:', error);

        // Display an error message on the page
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
        errorDiv.textContent = 'Error loading order details. Please try again later.';
        document.querySelector('.max-w-3xl').prepend(errorDiv);
    }
});



document.addEventListener("DOMContentLoaded", () =>{

    

});


