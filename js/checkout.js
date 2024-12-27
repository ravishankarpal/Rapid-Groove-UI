import { API_URLS } from "./api-constants.js";

let addresses = [];
let selectedAddressId = null;

document.addEventListener('DOMContentLoaded', function () {
    initializeCart();
    fetchAddresses();
    setupAddressForm();

});

function initializeCart() {
    const cartItems = JSON.parse(localStorage.getItem('selectedCartItems')) || [];
    const cartSummary = JSON.parse(localStorage.getItem('cartSummary')) || [];
    renderCartItems(cartItems);
    updateOrderSummary(cartSummary);
}


function renderCartItems(items) {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = items.map(item => `
        <p class="text-purple-600 mt-1">Arriving in ${item.deliveryTime}</p>
        <div class="flex space-x-4 border-b pb-4">
            <img src="${item.productImage}" alt="${item.productName}" class="w-24 h-24 object-cover rounded">
            <div class="flex-grow">
                <h3 class="font-medium">${item.productName}</h3>
                <p class="text-gray-600">Size: ${item.size}</p>
                <div class="flex items-center mt-2">
                    <span class="font-bold">₹${item.currentPrice}</span>
                    <span class="text-gray-500 line-through ml-2">₹${item.originalPrice}</span>
                    <span class="text-green-600 ml-2">${item.discountPercentage}% off</span>
                </div>
                <p class="text-gray-600 mt-2">Qty: ${item.quantity}</p>
            </div>
        </div>
       
        
    `).join('');
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
    const cartItems = JSON.parse(localStorage.getItem('selectedCartItems')) || [];
    const cartSummary = JSON.parse(localStorage.getItem('cartSummary')) || {};


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
            if (authResult.payment_message === 'payment successful') {
                const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

                const productDetailsPromises = cartItems.map(async item => {
                    const optimizedImage = await optimizeImage(item.productImage);
                    return {
                        productName: item.productName,
                        size: item.size,
                        image: optimizedImage
                    };
                });


                Promise.all(productDetailsPromises)
                    .then(optimizedProducts => {
                        const params = new URLSearchParams({
                            orderAddress: encodeURIComponent(JSON.stringify(selectedAddress))
                        });

                        optimizedProducts.forEach((item, index) => {
                            params.append(`productName${index}`, item.productName);
                            params.append(`size${index}`, item.size);
                            params.append(`image${index}`, item.image);
                        });

                        // Navigate after params are ready
                        window.location.href = `/order-confirm.html?${params.toString()}`;
                    })
                    .catch(error => {
                        console.error('Error optimizing images:', error);
                        // Handle error appropriately
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
                item_discounted_unit_price: item.currentPrice,
                item_currency: "INR",
                item_quantity: item.quantity,
                item_image_url: item.productImage
            })),
            cart_name: "product",
            shipping_charge: cartSummary.deliveryFee || 0
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


// function showError(message) {
//     alert(message);
// }

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



function optimizeImage(base64String, maxWidth = 200) {
    return new Promise((resolve, reject) => {
        // Create an image element
        const img = new Image();

        // Handle load error
        img.onerror = () => reject(new Error('Failed to load image'));

        // Process image once loaded
        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            const ratio = img.width / img.height;
            const newWidth = Math.min(maxWidth, img.width);
            const newHeight = newWidth / ratio;

            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw resized image
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert to optimized base64
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Using JPEG format with 70% quality
            resolve(optimizedBase64);
        };

        // Set source of image
        img.src = base64String;
    });
}


