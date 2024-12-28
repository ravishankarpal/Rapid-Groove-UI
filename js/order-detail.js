import { API_URLS } from "./api-constants.js";


const periodSelect = document.getElementById('periodSelect');
const ordersContainer = document.getElementById('ordersContainer');
const orderCount = document.getElementById('orderCount');

function encodeProductId(productId) {
    const base64Encoded = btoa(productId.toString());
    const randomPadding = Math.random().toString(36).substring(2, 12);
    return btoa(base64Encoded + randomPadding);
}

const tabs = document.querySelectorAll('.flex.flex-wrap button');
let allOrders = [];

const fetchOrders = (period = '3months') => {
    fetch(API_URLS.ORDER_DETAILS(period), {
        method: 'GET',
        headers: API_URLS.HEADERS,
    })
        .then((response) => response.json())
        .then((data) => {
            allOrders = data.content || [];
            renderOrders(allOrders);
            orderCount.textContent = `Total Orders: ${data.totalElements}`;
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
        });
};

const filterOrders = (status) => {
    if (status === '') {
        renderOrders(allOrders);

    } else {
        const filteredOrders = allOrders.filter((order) => order.orderStatus === status);
        renderOrders(filteredOrders);
    }
};


const renderOrders = (orders) => {
    ordersContainer.innerHTML = '';
    if (orders.length > 0) {
        orders.forEach((order) => {
            const encodedProductId = encodeProductId(order.items[0].productId);
            const orderHTML = `
                <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div class="flex flex-col md:flex-row justify-between border-b pb-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p class="text-sm text-gray-600">Order placed</p>
                                <p class="font-medium">${new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Total</p>
                                <p class="font-medium"> ₹ ${order.totalAmount}</p>
                            </div>
                            <div class="relative group">
                                <p class="text-sm text-gray-600 underline">Ship To</p>
                                <p class="font-medium">${order.shippingAddress.name}</p>
                                <div class="absolute z-10 invisible group-hover:visible bg-white border rounded-lg shadow-lg p-4 w-64 mt-2">
                                    <p>${order.shippingAddress.streetAddress}</p>
                                    <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pinCode}</p>
                                    <p>${order.shippingAddress.phoneNo}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 md:mt-0">
                           <p class="text-sm text-gray-600">Order #</p>
                           <p class="font-medium">${order.orderId}</p>
                            <div class="mt-4">
                                <a href="#" class="text-blue-600 hover:text-blue-800 mr-4">View order details</a>
                                <a href="#" class="text-blue-600 hover:text-blue-800">Invoice</a>
                            </div>
                       </div>
                    </div>
                    <div class="mt-6">
                        <div class="flex flex-col md:flex-row">
                            <div class="w-full md:w-48 mb-4 md:mb-0">
                                <img src="data:image/png;base64,${order.items[0].image}" alt="Product" class="w-full rounded">
                            </div>
                            <div class="flex-1 md:ml-6">
                                <div class="mb-4">
                                    <h3 class="text-lg font-medium">
                                        <a href="product-detail.html?id=${encodedProductId}" class="text-blue-600 hover:underline text-sm">
                                            ${order.items[0].productName}
                                        </a>
                                    </h3>
                                </div>
                                <div class="flex flex-wrap gap-3">
                                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Buy it again</button>
                                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">View your item</button>
                                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Track package</button>
                                    <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">Write a product review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            ordersContainer.innerHTML += orderHTML;
        });
    } else {
        ordersContainer.innerHTML = '<p class="text-gray-600">No orders found for the selected status.</p>';
    }
};

tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        tabs.forEach((t) => t.classList.remove('font-medium', 'text-blue-600'));
        event.target.classList.add('font-medium', 'text-blue-600');

        const orderStatus = event.target.getAttribute('data-status');
        filterOrders(orderStatus);
    });
});

fetchOrders();
