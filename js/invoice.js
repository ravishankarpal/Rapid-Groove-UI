import { API_URLS } from "./api-constants.js";

const params = new URLSearchParams(window.location.search);
const orderID = params.get('orderID');
 

export function downloadInvoice(orderID) {
    fetch(API_URLS.INVOICE(orderID), {
        method: 'POST',
       
    })
    .then(response => {
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            console.error('Error downloading invoice:');
        }
        return ;
    })
    .then(data => {
        // Handle the response, e.g., download the invoice as a file
        console.log('Invoice downloaded:');
        
    })
    .catch(error => {
        console.error('Error downloading invoice:');
    });
}


document.getElementById('downloadInvoiceBtn').addEventListener('click', () => {
 // Replace with dynamic orderId if necessary
    downloadInvoice(orderID);
});
