// Function to show the address popup
function showAddressPopup() {
    const popup = document.getElementById('addressPopup');
    if (popup) {
        popup.classList.remove('hidden');
    } else {
        console.error("Address popup element not found.");
    }
}

// Function to close the address popup
function closeAddressPopup() {
    const popup = document.getElementById('addressPopup');
    if (popup) {
        popup.classList.add('hidden');
    } else {
        console.error("Address popup element not found.");
    }
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', async () => {
    // Add click event listener to Continue button
    const continueButton = document.querySelector('.bg-purple-600.text-white.py-3');
   
    if (continueButton) {
        continueButton.addEventListener('click', async () => {
            try {
                const success = await saveCheckoutDetails(); // Call saveCheckoutDetails()
                if (success) {
                    showAddressPopup(); // Open the popup only if saveCheckoutDetails is successful
                } else {
                    alert('Unable to proceed. Please try again.');
                }
            } catch (error) {
                console.error("Error during checkout process:", error);
            }
        });
    } else {
        console.error("Continue button not found.");
    }

    // Load the address popup component dynamically
    try {
        const addressResponse = await fetch('src/components/address.html');
        const addressHtml = await addressResponse.text();
        document.getElementById('address-popup-placeholder').innerHTML = addressHtml;

        // Bind submitAddress to the form submit event
        const addressForm = document.getElementById('addressForm');
        if (addressForm) {
            addressForm.addEventListener('submit', submitAddress);
        } else {
            console.error("Address form not found in the DOM.");
        }
        
    } catch (error) {
        console.error('Error loading page components:', error);
    }
});

// Function to handle address submission
function submitAddress(event) {
    event.preventDefault(); // Prevent the form from submitting the default way


    // Get form field values
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const streetAddress = document.getElementById('streetAddress').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;


    const addressData = {
        name: fullName,
        phoneNo: phoneNumber,
        streetAddress: streetAddress,
        city: city,
        pinCode: pincode,
        state: state
    };

  
    let token = localStorage.getItem("userJwtToken");
    token = "Bearer " + token; 

    if (!token || token === "Bearer null") {
        console.error("Token is missing or invalid.");
        return;
    }

    fetch('http://localhost:8081/rapid/user/save/address', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(addressData) 
    })
    .then(response => {
        
        if (response.ok) {
            return response.text().then(text => {
                return text ? JSON.parse(text) : {}; 
            });
        }
        throw new Error('Unexpected response status: ' + response.status);
    })
    .then(data => {
        
        window.location.href = 'payment.html'; 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
