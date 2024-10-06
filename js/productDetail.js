// Initialize selected size and quantity variables
let selectedSize = null;
let selectedQuantity = 1; // Default quantity is 1
let productDiscountPrice = 0; // Placeholder for the discount price

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        try {
            const response = await fetch(`http://localhost:8081/product/getProductDetails/yes/${productId}`);
            const productArray = await response.json(); // Get the array from the API response

            if (productArray.length > 0) {
                const product = productArray[0]; // Access the first product in the array

                // Update the product details
                document.getElementById('product-name').textContent = product.productName;
                document.getElementById('product-subtitle').textContent = `${product.size}`;
                if (product.productRating === null) {
                    document.getElementById('product-rating').textContent = "";
                } else {
                    document.getElementById('product-rating').textContent = `${product.productRating} out of 5`;
                }
                if (product.ratingsCount === null) {
                    document.getElementById('product-ratings-count').textContent = "";
                } else {
                    document.getElementById('product-ratings-count').textContent = `${product.ratingsCount} ratings`;
                }
                if (product.reviewsCount === null) {
                    document.getElementById('product-reviews-count').textContent = "";
                } else {
                    document.getElementById('product-reviews-count').textContent = `${product.reviewsCount} reviews`;
                }
                document.getElementById('product-price').textContent = product.productDiscountPrice.toFixed(2);
                document.getElementById('product-original-price').textContent = product.productActualPrice.toFixed(2);

                if (product.discountPercentage === null) {
                    document.getElementById('product-discount').textContent = "";
                } else {
                    document.getElementById('product-discount').textContent = `${product.discountPercentage}% Off`;
                }

                if (product.promotionRequired) {
                    document.getElementById('promotion').textContent = product.promotions;
                } else {
                    document.getElementById('promotion').textContent = "";
                }

                // Set the product image
                if (product.productImages.length > 0) {
                    const productImage = product.productImages[0];
                    console.log('Image Data:', productImage); // Debugging the image data
                    document.getElementById('product-image').src = `data:${productImage.type};base64,${productImage.picByte}`;
                } else {
                    console.warn('No images available for this product.');
                }

                const sizes = product.availableSizes.split(",");
                console.log(sizes);
                const sizeOptionsContainer = document.getElementById('size-options');

                sizes.forEach(size => {
                    const button = document.createElement('button');
                    button.className = 'border rounded-md p-2 hover:bg-blue-500 hover:text-white';
                    button.textContent = size.trim();
                    button.value = size.trim();
                    button.onclick = () => {
                        console.log(`Selected size: ${size.trim()}`);
                    };
                    sizeOptionsContainer.querySelector('.flex').appendChild(button); // Append the button to the container
                });

                // Set the discount price
                productDiscountPrice = product.productDiscountPrice;
                
                // Set the default total price
                updateTotalPrice(selectedQuantity, productDiscountPrice);

            } else {
                console.error('No product found for the given ID.');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    // Event listeners for quantity buttons
    document.getElementById('increase-quantity').addEventListener('click', () => {
        selectedQuantity++;
        document.getElementById('quantity').textContent = selectedQuantity;
        updateTotalPrice(selectedQuantity, productDiscountPrice);
    });

    document.getElementById('decrease-quantity').addEventListener('click', () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            document.getElementById('quantity').textContent = selectedQuantity;
            updateTotalPrice(selectedQuantity, productDiscountPrice);
        }
    });

    // Function to update total price
    function updateTotalPrice(quantity, pricePerUnit) {
        const totalPrice = quantity * pricePerUnit;
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    }
});

// Loading navbar and footer components
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [navbarResponse, footerResponse] = await Promise.all([
            fetch('src/components/navbar.html'),
            fetch('src/components/footer.html')
        ]);

        const [navbarHtml, footerHtml] = await Promise.all([
            navbarResponse.text(),
            footerResponse.text()
        ]);

        document.getElementById('navbar-placeholder').innerHTML = navbarHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
    } catch (error) {
        console.error('Error loading page components:', error);
    }
});
