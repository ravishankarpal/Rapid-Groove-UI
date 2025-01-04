import { API_URLS } from "./api-constants.js";

const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

const formatPaymentMethod = (method) => {
    const methods = {
        'cc': 'Credit Card',
        'cod': 'Cash on Delivery'
    };
    return methods[method] || method;
};


// const renderOrderItems = (items) => {
//     const itemsContainer = document.getElementById('orderItems');
//     itemsContainer.innerHTML = items.map(item => `
//         <div class="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-100 rounded-xl">
//             <div class="w-full sm:w-48 h-48 sm:h-auto">
//                 <img src="data:image/png;base64,${item.image}" 
//                      alt="Product" 
//                      class="w-full h-full object-cover rounded-md shadow-sm">
//             </div>
//             <div class="flex-1 w-full">
//                 <h3 class="font-medium text-gray-900">${item.productName}</h3>
//                 <div class="mt-1 text-sm text-gray-600">Quantity: ${item.quantity}</div>
//                 <div class="mt-2 flex items-baseline gap-2">
//                     <span class="text-lg font-semibold">${formatCurrency(item.price - item.discount)}</span>
//                     ${item.discount > 0 ? `<span class="text-sm text-gray-500 line-through">${formatCurrency(item.price)}</span>` : ''}
//                 </div>
//             </div>
//         </div>
//     `).join('');
// };


const renderOrderItems = (items) => {
    const productList = document.getElementById('order-list');
    if (!productList) {
        console.error('Product list container not found.');
        return;
    }

    if (!items || items.length === 0) {
        productList.innerHTML = '<p>No items to display.</p>';
        return;
    }

    items.forEach(item => {
        const productItem = document.createElement('div');
        productItem.className = 'flex gap-4 items-center';
        productItem.innerHTML = `
            <div class="w-24 h-24 flex-shrink-0">
                <img src="data:image/png;base64,${item.image}" 
                    alt="${item.productName}" 
                    class="w-full h-full object-cover rounded-lg bg-white">

                                  
            </div>
            <div>
                <h3 class="font-medium text-gray-800">${item.productName}</h3>
                <p class="text-gray-600 mt-1">Size: ${item.size || 'N/A'}</p>
                <p class="text-gray-600 mt-1">Qty: ${item.quantity || 1}</p>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-lg font-semibold">${formatCurrency(item.price - (item.discount || 0))}</span>
                    ${item.discount > 0 ? `<span class="text-sm text-gray-500 line-through">${formatCurrency(item.price)}</span>` : ''}
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });
};


const renderOrderHeader = (order) => {
    document.getElementById('orderDate').textContent = `Ordered on ${formatDate(order.orderDate)}`;
    document.getElementById('orderId').textContent = `Order #${order.orderId}`;
    document.getElementById('orderStatus').textContent = order.orderStatus;
    document.getElementById('deliveryDate').textContent = `Delivery by ${formatDate(order.deliveryDate)}`;
};

const renderShippingAddress = (address) => {
    const addressHtml = `
        <p class="font-semibold text-gray-900">${address.name}</p>
        <p>${address.streetAddress}</p>
        <p>${address.city}, ${address.state} ${address.pinCode}</p>
        <p class="mt-2">${address.phoneNo}</p>
    `;
    document.getElementById('shippingAddress').innerHTML = addressHtml;
};

const renderPaymentSummary = (order) => {
    const totalDiscount = order.items.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(order.shippingCharge);
    document.getElementById('discount').textContent = `-${formatCurrency(totalDiscount)}`;
    document.getElementById('total').textContent = formatCurrency(order.totalAmount);
    document.getElementById('paymentMethod').textContent = formatPaymentMethod(order.paymentMethod);
};

const renderOrderDetails = (order) => {
    renderOrderHeader(order);
    renderShippingAddress(order.shippingAddress);
    renderOrderItems(order.items);
    renderPaymentSummary(order);
};

async function initializeOrderDetails() {
    const params = new URLSearchParams(window.location.search);
    const orderID = params.get('orderId');


    if (!orderID) {
        console.error('No orderID found in the URL');
        return;
    }
    try {
        const response = await fetch(API_URLS.ORDER_DETAILS_BY_ID(orderID));
        const orderData = await response.json();
        renderOrderDetails(orderData);
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeOrderDetails);