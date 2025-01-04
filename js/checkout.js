import { API_URLS } from "./api-constants.js";


let addresses = [];
let selectedAddressId = null;
let cartDetails = null;

document.addEventListener('DOMContentLoaded', function () {
    initializeCart();
    fetchAddresses();
    setupAddressForm();

});



async function fetchCheckoutDetails() {
    const response = await fetch(API_URLS.CHECKOUT_DETAILS, {
        method: 'POST',
        headers: API_URLS.HEADERS,
        body: JSON.stringify({
            productId: getSelectedProductData().productId,
            productSize: getSelectedProductData().size
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


function getSelectedProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productsString = urlParams.get('products');
    if (productsString) {
        const productsData = JSON.parse(decodeURIComponent(productsString));
        console.log(productsData);
        const productIds = productsData.map(product => product.productId);
        const productSizes = productsData.map(product => product.size);
        return {
            productId: productIds,
            size: productSizes
        };

    }
}


async function initializeCart() {
    cartDetails = await fetchCheckoutDetails();
    renderCartItems(cartDetails.itemResponses);
    updateOrderSummary(cartDetails.cartSummaryResponse);
}



function renderCartItems(items) {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            ${items.map(item => `
                <div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                    <div class="flex flex-col h-full">
                        <!-- Top Section with Image and Basic Info -->
                        <div class="flex gap-4">
                            <!-- Image Section -->
                            <div class="relative">
                                <img src="data:image/png;base64,${item.productImage}" 
                                    alt="${item.productName}" 
                                    class="w-24 h-24 object-cover rounded-lg">
                                ${item.discountPercentage > 0 ? `
                                    <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        ${item.discountPercentage}% OFF
                                    </span>
                                ` : ''}
                            </div>
                            
                            <!-- Basic Info -->
                            <div class="flex-grow">
                                <h3 class="font-medium text-lg text-gray-800 line-clamp-2">${item.productName}</h3>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="font-bold text-lg text-gray-900">₹${item.currentPrice}</span>
                                    ${item.discountPercentage > 0 ? `
                                        <span class="text-gray-400 line-through text-sm">₹${item.originalPrice}</span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bottom Section with Details -->
                        <div class="mt-4 space-y-2">
                            <!-- Product Attributes -->
                            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div class="flex items-center gap-1">
                                    <span class="font-medium">Size:</span>
                                    <span>${item.size}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <span class="font-medium">Quantity:</span>
                                    <span>${item.quantity}</span>
                                </div>
                            </div>
                            
                            <!-- Delivery Info -->
                            <div class="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-purple-600">Arriving in ${item.deliveryTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}


function updateOrderSummary(item) {
    const shippingCost = item.deliveryFee;
    const discount = item.discount;
    document.getElementById('subtotal').textContent = `₹${item.subtotal}`;
    document.getElementById('discount').textContent = `₹${discount}`;
    document.getElementById('shipping-cost').textContent = shippingCost === 0 ? 'Free' : `₹${shippingCost}`;
    document.getElementById('total-price').textContent = `₹${item.total}`;
    const message = document.getElementById('discount-message');
    if (discount === 0) {
        message.style.display = `none`;
    } else {
        message.textContent = `  You will save ₹${discount} on this order`;
    }

}



function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}


async function fetchAddresses() {
    try {
        const response = await fetch(API_URLS.ADDRESS_DETAILS, {
            method: 'GET',
            headers: API_URLS.HEADERS
        });

        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }

        addresses = await response.json();
        if (addresses.length > 0) {
            selectedAddressId = selectedAddressId || addresses[0].id;
            updateSelectedAddressDisplay();
            renderAddressList();
        }
    } catch (error) {
        console.error('Error fetching addresses:', error);
        showError('Failed to load addresses. Please try again later.');
    }
}

function updateSelectedAddressDisplay() {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
        document.getElementById('selectedAddressDisplay').innerHTML = `
            <p class="font-medium">${selectedAddress.name}</p>
            <p class="text-gray-600">${selectedAddress.streetAddress}</p>
            <p class="text-gray-600">${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pinCode}</p>
            <p class="text-gray-600">Phone: ${selectedAddress.phoneNo}</p>
        `;
    }
}

window.useSelectedAddress = function () {
    const selectedRadio = document.querySelector('input[name="selected-address"]:checked');
    if (selectedRadio) {
        const addressId = parseInt(selectedRadio.value);
        selectAddress(addressId);
    } else {
        showError('Please select an address');
    }
}

function selectAddress(addressId) {
    selectedAddressId = addressId;
    updateSelectedAddressDisplay();
    renderAddressList();
    closeAddressSelection();
}

window.showAddressSelection = function () {
    document.getElementById('addressSelectionModal').classList.remove('hidden');
    renderAddressList();
}



window.closeAddressSelection = function () {
    document.getElementById('addressSelectionModal').classList.add('hidden');
}

window.openAddressModal = function () {
    document.getElementById('addressModal').classList.remove('hidden');
}

window.closeAddressModal = function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
    document.getElementById('addressForm').reset();
}


function renderAddressList() {
    const container = document.getElementById('addressListContainer');
    container.innerHTML = addresses.map(address => `
        <div class="block border rounded-lg p-4 mb-4 relative hover:border-purple-600 ${address.id === selectedAddressId ? 'border-purple-600' : ''}">
            <label class="cursor-pointer">
                <div class="flex items-start">
                    <input type="radio" name="selected-address" value="${address.id}" 
                     class="h-4 w-4 mt-1 mr-3 text-purple-600 focus:ring-purple-500 border-gray-300"
                        ${address.id === selectedAddressId ? 'checked' : ''}>
                    
                    <div>
                        <p class="font-medium">${address.name}</p>
                        <p class="text-gray-600">${address.streetAddress}</p>
                        <p class="text-gray-600">${address.city}, ${address.state} - ${address.pinCode}</p>
                        <p class="text-gray-600">Phone: ${address.phoneNo}</p>
                    </div>
                </div>
                ${address.id === selectedAddressId ?
            '<div class="absolute top-4 right-4 text-purple-600">✓</div>' : ''}
            </label>
            
            <div class="flex justify-between mt-4 pt-4 border-t">
                <button 
                    onclick="editAddress(${address.id})" 
                    class="text-purple-600 hover:text-purple-700 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                    </svg>
                    Edit
                </button>
                <button 
                    onclick="deleteAddress(${address.id})" 
                    class="text-red-600 hover:text-red-700 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');

    // Add "Use this address" button at the bottom
    container.innerHTML += `
        <button 
            onclick="useSelectedAddress()" 
            class="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors mt-4"
        >
            Use Selected Address
        </button>
    `;
}

window.editAddress = function (addressId) {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
        // Populate the address form with existing details
        document.getElementById('name').value = addressToEdit.name;
        document.getElementById('phoneNo').value = addressToEdit.phoneNo;
        document.getElementById('streetAddress').value = addressToEdit.streetAddress;
        document.getElementById('city').value = addressToEdit.city;
        document.getElementById('state').value = addressToEdit.state;
        document.getElementById('pinCode').value = addressToEdit.pinCode;
        // Store the current address ID to know which address we're editing
        window.currentEditAddressId = addressId;

        // Open the address modal
        openAddressModal();
    }
}


// Modify the existing setupAddressForm to handle both adding and editing
function setupAddressForm() {
    const form = document.getElementById('addressForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phoneNo: document.getElementById('phoneNo').value,
            streetAddress: document.getElementById('streetAddress').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pinCode: document.getElementById('pinCode').value
        };

        try {
            let response;
            let successMessage;
            if (window.currentEditAddressId != null) {
                response = await fetch(API_URLS.UPDATE_ADDRESS(currentEditAddressId), {
                    method: 'PUT',
                    headers: API_URLS.HEADERS,
                    body: JSON.stringify(formData)
                });
                successMessage = 'Address updated successfully!';
            } else {
                response = await fetch(API_URLS.SAVE_ADRESS, {
                    method: 'POST',
                    headers: API_URLS.HEADERS,
                    body: JSON.stringify(formData)
                });
                successMessage = 'Address saved successfully!';
            }

            if (!response.ok) {
                throw new Error('Failed to save address');
            }

            closeAddressModal();
            form.reset();

            // Reset the edit address ID
            window.currentEditAddressId = null;

            await fetchAddresses();
            showSuccess(successMessage);
        } catch (error) {
            console.error('Error saving address:', error);
            showError('Failed to save address. Please try again.');
        }
    });
}

window.deleteAddress = async function (addressId) {
    try {
        console.log(API_URLS.DELETE_ADDRESS(addressId));
        const response = await fetch(API_URLS.DELETE_ADDRESS(addressId), {
            method: 'DELETE',
            headers: API_URLS.HEADERS
        });
        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }
        showSuccess('Address deleted successfully');
        addresses = addresses.filter(addr => addr.id !== addressId);
        // Update the selected address display
        if (selectedAddressId === addressId) {
            selectedAddressId = addresses.length > 0 ? addresses[0].id : null;
            updateSelectedAddressDisplay();
        }
        // Re-render the address list
        renderAddressList();

    } catch (error) {
        console.error('Error fetching addresses:', error);
        showError('Failed to load addresses. Please try again later.');
    }
}


window.createOrder = async function () {

    const button = document.getElementById('checkout-btn');
    const spinner = document.getElementById('spinner');
    const buttonText = document.getElementById('button-text');
    const setLoading = (loading) => {
        if (loading) {
            spinner.classList.remove('hidden');
            buttonText.classList.add('hidden');
            button.disabled = true;
        } else {
            spinner.classList.add('hidden');
            buttonText.classList.remove('hidden');
            button.disabled = false;
        }
    }

    const selectedAddress = document.querySelector('input[name="selected-address"]:checked');
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const cartItems = cartDetails.itemResponses || [];
    const cartSummary = cartDetails.cartSummaryResponse || {};


    console.log(addresses);
    if (!validateInputs(selectedAddress, selectedPayment)) {
        return;
    }

    setLoading(true);


    try {
        // Step 1: Create Order
        const orderResponse = await createOrderRequest(cartItems, cartSummary);
        if (!orderResponse.ok) {
            throw new Error('Failed to create order');
        }
        const orderResult = await orderResponse.json();
        console.log("order id is ", orderResult.order_id);
        // Step 2: Process Payment

        const paymentMethod = await buildPaymentPayload(selectedPayment);
        console.log("PAYMENT METHOD", paymentMethod);
        const processPaymentResponse = await fetch(`${API_URLS.PAYMENT_PROCESS}`, {
            method: 'POST',
            headers: API_URLS.HEADERS,
            body: JSON.stringify({
                payment_method: paymentMethod,
                payment_session_id: orderResult.payment_session_id
            })
        });

        if (!processPaymentResponse.ok) {
            throw new Error('Payment processing failed');
        }

        const paymentResult = await processPaymentResponse.json();
        // Step 3: Handle Authentication if needed
        if (paymentResult.cf_payment_id) {
            const authResult = await handlePaymentAuthentication(paymentResult.cf_payment_id);
            // Modified order processing code
            if (authResult.payment_message === 'payment successful') {
                const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

                const productDetailsPromises = cartItems.map(async item => {
                    try {
                        const compressedImage = await compressImage(item.productImage);
                        console.log('compressedImage ', compressedImage);
                        return {
                            p: item.productName, // Shortened key names to reduce URL length
                            s: item.size,
                            i: compressedImage || ''
                        };
                    } catch (error) {
                        return {
                            p: item.productName,
                            s: item.size,
                            i: '' // Use empty string for failed images
                        };
                    }
                });

                Promise.all(productDetailsPromises)
                    .then(optimizedProducts => {
                        const orderData = {
                            a: selectedAddress, // Shortened key names
                            p: optimizedProducts,
                            o:orderResult.order_id
                        };

                        // Compress the entire orderData using LZString
                        const compressed = LZString.compressToEncodedURIComponent(
                            JSON.stringify(orderData)
                        );

                        // Append to URL with a shorter parameter name
                        window.location.href = `/order-confirm.html?d=${compressed}`;
                    })
                    .catch(error => {
                        console.error('Error processing order:', error);
                        alert('There was an error processing your order. Please try again.');
                    });
            } else {
                throw new Error('Payment authentication failed');
            }
        }
        else {
            throw new Error('Error in payment processing');
        }

    } catch (error) {
        console.error('Payment process error:', error);
        showError(`Payment failed: ${error.message}`);
        setLoading(false);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const forms = {
        card: document.getElementById('cardForm'),
        netbanking: document.getElementById('netBankingForm'),
        upi: document.getElementById('upiForm')
    };


    function hideAllForms() {
        Object.values(forms).forEach(form => {
            form.classList.add('hidden');
        });
    }


    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            hideAllForms();
            if (forms[this.value]) {
                forms[this.value].classList.remove('hidden');
            }
        });
    });


    const cardNumber = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
    cardNumber.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });


    const expiryDate = document.querySelector('input[placeholder="MM/YY"]');
    expiryDate.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
});


function validateInputs(selectedAddress, selectedPayment) {
    if (!selectedAddress) {
        showError('Please select a delivery address');
        return false;
    }
    if (!selectedPayment) {
        showError('Please select a payment method');
        return false;
    }
    return true;
}

async function createOrderRequest(cartItems, cartSummary) {

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
        return;
    }
    const orderData = {
        cart_details: {
            cart_items: cartItems.map(item => ({
                item_id: item.productId,
                item_name: item.productName,
                item_description: item.description || "",
                item_tags: [item.size],
                item_original_unit_price: item.originalPrice,
                item_discounted_unit_price: item.originalPrice * (item.discountPercentage/100),
                item_currency: "INR",
                item_quantity: item.quantity,
                item_image_url: item.productImage
            })),
            cart_name: "product",
            ...(cartSummary.deliveryFee > 0 && { shipping_charge: cartSummary.deliveryFee })
        },

        customer_details: {
            customer_id: selectedAddress.id,
            customer_phone: selectedAddress.phoneNo
        },


        order_meta: {
            return_url: window.location.origin + "/order-confirmation.html",
            notify_url: window.location.origin + "/payment-webhook",
            payment_methods: getPaymentMethod()
        },
        order_note: "Order from web checkout",
        order_id: generateOrderId(),
        order_amount: cartSummary.total,
        order_currency: "INR"
    };

    return fetch(`${API_URLS.CREATE_ORDER}`, {
        method: 'POST',
        headers: API_URLS.HEADERS,
        body: JSON.stringify(orderData)
    });
}



function generateOrderId() {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}


function getPaymentMethod() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    console.log("getPaymentMethod", selectedPayment);
    const methodMap = {
        'card': 'cc',
        'upi': 'upi',
        'netbanking': 'nb'
    };
    return methodMap[selectedPayment.value] || 'cc';
}

async function handlePaymentAuthentication(paymentId) {
    //const otp = await showOTPDialog();
    const response = await fetch(`${API_URLS.AUTHENTICATE_PAYMENT(paymentId)}`, {
        method: 'POST',
        headers: API_URLS.HEADERS,
        body: JSON.stringify({
            action: "SUBMIT_OTP",
            otp: 111000
        })
    });

    if (!response.ok) {
        throw new Error('Authentication failed');
    }

    return response.json();
}


async function showOTPDialog() {
    return prompt('Please enter the OTP sent to your registered mobile number:');
}



async function buildPaymentPayload(selectedPayment) {
    console.log("selectedPayment method in payload", selectedPayment);
    const paymentType = selectedPayment.value;
    console.log("buildPaymentload", document.querySelector('input[placeholder="1234 5678 9012 3456"]'));

    if (paymentType === 'card') {
        return {
            card: {
                channel: "post",
                card_number: document.querySelector('input[placeholder="1234 5678 9012 3456"]').value.replace(/\s/g, ''),
                card_holder_name: document.getElementById('cardHolderName').value,
                card_expiry_mm: document.querySelector('input[placeholder="MM/YY"]').value.split('/')[0],
                card_expiry_yy: document.querySelector('input[placeholder="MM/YY"]').value.split('/')[1],
                card_cvv: document.querySelector('input[placeholder="123"]').value
            }
        };
    } else if (paymentType === 'upi') {
        return {
            upi: {
                channel: "link",
                upi_id: document.querySelector('input[placeholder="Enter UPI ID"]').value
            }
        };
    }

    throw new Error('Unsupported payment method');
}



function compressImage(imageData) {
    // If no image data provided, return empty string
    if (!imageData || imageData === 'null') {
        return Promise.resolve('');
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions (reducing size)
            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to base64 with reduced quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
            resolve(compressedBase64);
        };
        
        img.onerror = () => resolve('');

        // Check if imageData is already base64
        if (imageData.startsWith('data:image')) {
            img.src = imageData;
        } else if (/^[A-Za-z0-9+/=]+$/.test(imageData)) {
            // If it's raw base64 data, add the data URL prefix
            img.src = `data:image/jpeg;base64,${imageData}`;
        } else {
            // Treat as URL
            img.src = imageData;
        }
    });
}
