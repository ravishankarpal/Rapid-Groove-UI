        // Initialize selected size variable
        let selectedSize = null;

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
                        document.getElementById('product-rating').textContent = `${product.productRating} out of 5`; 
                        document.getElementById('product-ratings-count').textContent = `${product.ratingsCount} ratings`;
                        document.getElementById('product-reviews-count').textContent = `${product.reviewsCount} reviews`; 
                        document.getElementById('product-price').textContent = product.productDiscountPrice.toFixed(2);
                        document.getElementById('product-original-price').textContent = product.productActualPrice.toFixed(2);
                        document.getElementById('product-discount').textContent = `${product.discountPercentage}% Off`; 
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

                        // Size Options buttons
                        const sizeButtons = document.querySelectorAll('#size-options button');
                        sizeButtons.forEach(button => {
                            button.addEventListener('click', () => {
                                // Clear previously selected button style
                                sizeButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));

                                // Set the selected size
                                selectedSize = button.value;

                                // Add styles to the clicked button
                                button.classList.add('bg-blue-500', 'text-white');
                            });
                        });
                    } else {
                        console.error('No product found for the given ID.');
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }
        });


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