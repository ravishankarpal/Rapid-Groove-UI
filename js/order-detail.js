import { API_URLS } from "./api-constants.js";

const periodSelect = document.getElementById('periodSelect');
const ordersContainer = document.getElementById('ordersContainer');
const orderCount = document.getElementById('orderCount');

function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString());
    const randomPadding = Math.random().toString(36).substring(2, 12);
    return btoa(base64Encoded + randomPadding);
}

const tabs = document.querySelectorAll('.flex.gap-4 button');

let allOrders = [];

const fetchOrders = async (period = '3months') => {
    try {
        const response = await fetch(API_URLS.ORDER_DETAILS(period), {
            method: 'GET',
            headers: API_URLS.HEADERS,
        });
        const data = await response.json();
        allOrders = data.content || [];
        renderOrders(allOrders);
        orderCount.textContent = `Total Orders: ${allOrders.length}`;
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

const filterOrders = (status) => {
    const filteredOrders = status ? allOrders.filter(order => order.orderStatus === status) : allOrders;
    renderOrders(filteredOrders);
    orderCount.textContent = `Total Orders: ${filteredOrders.length}`;
};

const renderOrders = (orders) => {
    ordersContainer.innerHTML = '';
    if (orders.length > 0) {
        orders.forEach((order) => {
            const encodedProductId = encodeProductId(order.items[0].productId);
            const orderHTML = `
                <div class="bg-white rounded-lg shadow-md border p-6 mb-6">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p class="text-sm text-gray-500">Order placed</p>
                                <p class="font-medium">${new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Total</p>
                                <p class="font-medium">₹ ${order.totalAmount}</p>
                            </div>
                            <div class="relative group">
                                <p class="text-sm text-gray-500 underline">Ship To</p>
                                <p class="font-medium">${order.shippingAddress.name}</p>
                                <div class="absolute z-10 invisible group-hover:visible bg-white border rounded-lg shadow-lg p-4 w-64 mt-2">
                                    <p>${order.shippingAddress.streetAddress}</p>
                                    <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pinCode}</p>
                                    <p>${order.shippingAddress.phoneNo}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0">
                           <p class="text-sm text-gray-500">Order #</p>
                           <p class="font-medium">${order.orderId}</p>
                            <div class="mt-4">
                                <a href="#" class="text-blue-500 hover:text-blue-700 mr-4">View order details</a>
                                <a href="#" class="text-blue-500 hover:text-blue-700">Invoice</a>
                            </div>
                       </div>
                    </div>
                    <div class="mt-6">
                        <div class="flex flex-col md:flex-row items-start md:items-center">
                            <div class="w-full md:w-48 mb-4 md:mb-0">
                                <img src="data:image/png;base64,${order.items[0].image}" alt="Product" class="w-full rounded-md shadow-sm">
                            </div>
                            <div class="flex-1 md:ml-6">
                                <div class="mb-4">
                                    <h3 class="text-lg font-medium">
                                        <a href="product-detail.html?id=${encodedProductId}" class="text-blue-500 hover:underline">
                                            ${order.items[0].productName}
                                        </a>
                                    </h3>
                                </div>
                                <div class="flex flex-wrap gap-4">
                                    <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow hover:scale-105 hover:shadow-lg transition-transform duration-200">Buy it again</button>
                                    <button class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md shadow hover:scale-105 hover:shadow-lg transition-transform duration-200">View your item</button>
                                    <button class="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-md shadow hover:scale-105 hover:shadow-lg transition-transform duration-200">Track package</button>
                                    <button class="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-md shadow hover:scale-105 hover:shadow-lg transition-transform duration-200">Write a product review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            ordersContainer.innerHTML += orderHTML;
        });
    } else {
        ordersContainer.innerHTML = '<p class="text-gray-500 text-center">No orders found for the selected status.</p>';
    }
};



// Add event listeners to tabs for filtering
tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        // Remove the active state from all tabs
        tabs.forEach((t) => t.classList.remove('font-medium', 'text-blue-500'));
        
        // Add the active state to the clicked tab
        event.target.classList.add('font-medium', 'text-blue-500');
        
        // Get the order status from the clicked button's data-status attribute
        const orderStatus = event.target.getAttribute('data-status');
        
        // Filter the orders based on the selected status
        filterOrders(orderStatus);
    });
});

fetchOrders();
