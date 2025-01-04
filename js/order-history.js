import { API_URLS } from "./api-constants.js";
import { storeImage } from "./common/image-utils.js";

const periodSelect = document.getElementById('periodSelect');
const ordersContainer = document.getElementById('ordersContainer');
const orderCount = document.getElementById('orderCount');
const imgkey= '1234';

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
    storeImage(filteredOrders[0].items[0].image);
    orderCount.textContent = `Total Orders: ${filteredOrders.length}`;
};

const renderOrders = (orders) => {
    ordersContainer.innerHTML = '';
    if (orders.length > 0) {
        orders.forEach((order) => {
            const encodedProductId = encodeProductId(order.items[0].productId);
            
            //   storeImage(orders[0].items[0].image);
            
            const timelineHTML = order.trackingInfo?.deliveryTimeline.map(timeline => {
                const isDelivered = timeline.status.toLowerCase() === 'delivered';
                return `
                    <div class="flex items-start mb-4">
                        <div class="flex items-center h-full mr-4">
                            ${isDelivered ? `
                                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            ` : `
                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            `}
                            ${!isDelivered ? '<div class="h-full w-0.5 bg-blue-200"></div>' : ''}
                        </div>
                        <div class="${isDelivered ? 'bg-green-50 p-3 rounded-lg w-full' : ''}">
                            <p class="${isDelivered ? 'font-bold text-green-700' : 'font-medium'}">${timeline.status}</p>
                            <p class="text-sm text-gray-500">${timeline.location}</p>
                            <p class="text-sm text-gray-400">${new Date(timeline.timestamp).toLocaleString()}</p>
                            ${isDelivered ? `
                                <p class="text-sm text-green-600 mt-1">
                                    Package delivered successfully! 
                                </p>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('')
            
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
                                
<a href="/order-details.html?orderID=${order.orderId}" class="text-blue-500 hover:text-blue-700 mr-4">View order details</a>
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
                               <button class="group px-6 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"

                                    onclick="window.location.href='product-detail.html?id=${encodedProductId}'">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-700 group-hover:rotate-180" 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Buy it again</span>
                                </button>

    
                                   <button 
                                    onclick="document.getElementById('tracking-modal-${order.orderId}').classList.remove('hidden')"
                                    class="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-full shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5">
                                    Track package
                                </button>
<button 
    onclick="window.location.href='review-your-purchase.html?id=${encodedProductId}&product=${order.items[0].productName}&img=${imgkey}'"
    class="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    <span>Write a product review</span>
</button>                                </div>
                            </div>
                        </div>
                    </div>

                   <!-- Tracking Modal with Fixed Height and Scrollable Timeline -->
                <div id="tracking-modal-${order.orderId}" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
                        <!-- Modal Header -->
                        <div class="flex justify-between items-center p-6 border-b">
                            <h3 class="text-xl font-bold">Tracking Details</h3>
                            <button 
                                onclick="document.getElementById('tracking-modal-${order.orderId}').classList.add('hidden')"
                                class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Modal Content -->
                        <div class="overflow-y-auto flex-1 p-6">
                            <!-- Tracking Info -->
                            <div class="mb-4">
                                <p class="text-sm text-gray-500">Carrier: ${order.trackingInfo?.carrier}</p>
                                <p class="text-sm text-gray-500">Tracking Number: ${order.trackingInfo?.trackingNumber}</p>
                                <p class="text-sm text-gray-500">Current Status: ${order.trackingInfo?.status}</p>
                                <p class="text-sm text-gray-500">Return Window Closes: ${new Date(order.returnWindowCloseDate).toLocaleDateString()}</p>
                            </div>
                            
                            <!-- Scrollable Timeline -->
                            <div class="border-t pt-4">
                                <h4 class="font-medium mb-4">Delivery Timeline</h4>
                                <div class="space-y-4">
                                    ${timelineHTML}
                                </div>
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


tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        tabs.forEach((t) => t.classList.remove('font-medium', 'text-blue-500'));
        event.target.classList.add('font-medium', 'text-blue-500');
        const orderStatus = event.target.getAttribute('data-status');
        filterOrders(orderStatus);
    });
});

const imageMap = new Map();
function encodeImageBytes(byteString) {
    const base64 = btoa(byteString);
    const base64url = base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    
    return base64url.slice(0, 15);
}



fetchOrders();
