import { API_URLS } from "./api-constants.js";

let addresses = [];
let selectedAddressId = null;

document.addEventListener('DOMContentLoaded', function () {
    fetchAddresses();
    setupAddressForm();
});





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
 
function useSelectedAddress() {
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

window.openAddressModal = function() {
    document.getElementById('addressModal').classList.remove('hidden');
}

window.closeAddressModal = function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
    document.getElementById('addressForm').reset();
}



function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
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

window.editAddress  = function(addressId) {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
        // Populate the address form with existing details
        document.getElementById('name').value = addressToEdit.name;
        document.getElementById('phoneNo').value = addressToEdit.phoneNo;
        document.getElementById('streetAddress').value = addressToEdit.streetAddress;
        document.getElementById('city').value = addressToEdit.city;
        document.getElementById('state').value = addressToEdit.state;
        document.getElementById('pinCode').value = addressToEdit.pinCode;
        const editMessage = document.querySelector('.text-lg.font-semibold');
        console.log(editMessage);
        if (editMessage) {
            editMessage.textContent = 'Edit Address';
        }

        // Store the current address ID to know which address we're editing
        window.currentEditAddressId = addressId;

        // Open the address modal
        openAddressModal();
    }
}

function deleteAddress(addressId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this address?')) {
        // Remove the address from local array
        addresses = addresses.filter(addr => addr.id !== addressId);

        // Update the address list display
        renderAddressList();

        // If the deleted address was the selected one, select the first address or reset
        if (selectedAddressId === addressId) {
            if (addresses.length > 0) {
                selectedAddressId = addresses[0].id;
                updateSelectedAddressDisplay();
            } else {
                selectedAddressId = null;
                document.getElementById('selectedAddressDisplay').innerHTML = '';
            }
        }

        // Send delete request to backend
        fetch(`${API_URLS.ADDRESS_DETAILS}/${addressId}`, {
            method: 'DELETE',
            headers: API_URLS.HEADERS
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            showSuccess('Address deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting address:', error);
            showError('Failed to delete address');
        });
    }
}

// Modify the existing setupAddressForm to handle both adding and editing
function setupAddressForm() {
    const form = document.getElementById('addressForm');
    form.addEventListener('submit', async function(e) {
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

            // Check if we're editing an existing address
            if (window.currentEditAddressId) {
                // Update existing address
                response = await fetch(`${API_URLS.ADDRESS_DETAILS}/${window.currentEditAddressId}`, {
                    method: 'PUT',
                    headers: API_URLS.HEADERS,
                    body: JSON.stringify(formData)
                });
                successMessage = 'Address updated successfully!';
            } else {
                // Save new address
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