import { API_URLS } from "./api-constants.js";
import { getOriginalImage } from "./common/image-utils.js";
// import { getOriginalImage } from "./common/image-utils.js";
import { showToast } from "./common/toast.js";
//import { getImageMap } from "./order-history.js";

const urlParams = new URLSearchParams(window.location.search);
const encodedId = urlParams.get('id');

let currentRating = 0;
const starContainer = document.getElementById('starContainer');
const ratingText = document.getElementById('ratingText');
const submitButton = document.getElementById('submitButton');
const reviewForm = document.getElementById('reviewForm');





function createStar(index) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-hover focus:outline-none';
    star.dataset.value = index;
    star.innerHTML = `
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
    `;
    return star;
}

// Create 5 stars
for (let i = 1; i <= 5; i++) {
    const star = createStar(i);
    star.addEventListener('click', function () {
        currentRating = i;
        updateStars();
        updateRatingText();
        validateForm();
    });
    starContainer.appendChild(star);
}

function updateStars() {
    const stars = starContainer.children;
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i].querySelector('svg');
        if (i < currentRating) {
            star.classList.remove('text-gray-300');
            star.classList.add('text-yellow-400');
        } else {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-300');
        }
    }
}

function updateRatingText() {
    ratingText.textContent = `${currentRating} out of 5 stars`;
    ratingText.classList.remove('hidden');
}

function decodeProductId(encodedId) {
    const decodedOnce = atob(encodedId);
    const originalId = decodedOnce.substring(0, decodedOnce.indexOf('='));
    return atob(originalId);
}


function validateForm() {
    const reviewContent = document.getElementById('reviewContent');
    const isValid = currentRating > 0 && reviewContent.value.trim().length >= 10;
    submitButton.disabled = !isValid;
    submitButton.className = `flex-1 px-4 py-2 text-white rounded-lg transition-all ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`;
}

document.getElementById('reviewContent').addEventListener('input', validateForm);

// Handle form submission with API integration
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reviewData = {
        productId: decodeProductId(encodedId),
        rating: currentRating.toString(),
        reviewComment: document.getElementById('reviewContent').value
    };

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const response = await fetch('http://localhost:8081/product/customer/products/rate-review', {
            method: 'POST',
            headers: API_URLS.HEADERS,
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            showToast('Review submitted successfully!', 'success');
            window.history.back();
        } else {
            showToast('Failed to submit review!', 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showToast('Failed to submit review. Please try again', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Review';
    }
});

updateStars();

document.addEventListener('DOMContentLoaded', function () {
    const productName = document.getElementById('productName');
    const product = urlParams.get('product');
    
    productName.textContent = product ;
    const imgnnb= getOriginalImage('1234');
    console.log(imgnnb);

});