document.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const address = JSON.parse(decodeURIComponent(params.get('orderAddress')));
        //const cartDetails = JSON.parse(decodeURIComponent(params.get('orderCartDetails')));

        const productDetails = [];
        let index = 0;
        while (params.has(`productName${index}`) && params.has(`size${index}`) && params.has(`image${index}`)) {
            productDetails.push({
                productName: decodeURIComponent(params.get(`productName${index}`)),
                size: decodeURIComponent(params.get(`size${index}`)),
                image: decodeURIComponent(params.get(`image${index}`))
            });
            index++;
        }

        // Display shipping address
        document.getElementById('shipping-address').textContent =
            `${address.name}, ${address.streetAddress}, ${address.city}, ${address.state}, ${address.pinCode}`;


        // Display product details
        const productList = document.getElementById('product-list');
        productDetails.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'flex gap-4 items-start';
            productItem.innerHTML = `
           <div class="flex items-center gap-4">
                <img src="${item.image}" alt="${item.productName}" 
                class="w-20 h-20 object-cover rounded-md" />
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
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
        errorDiv.textContent = 'Error loading order details. Please try again later.';
        document.querySelector('.max-w-3xl').prepend(errorDiv);
    }
});


document.addEventListener("DOMContentLoaded", () =>{

    

});


