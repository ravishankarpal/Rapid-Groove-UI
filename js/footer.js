document.addEventListener('DOMContentLoaded', () => {
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterSubmit = document.getElementById('newsletter-submit');
    const newsletterMessage = document.getElementById('newsletter-message');

    newsletterSubmit.addEventListener('click', () => {
        const email = newsletterEmail.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            newsletterMessage.textContent = 'Please enter an email address.';
            newsletterMessage.style.color = 'orange';
            return;
        }

        if (!emailRegex.test(email)) {
            newsletterMessage.textContent = 'Please enter a valid email address.';
            newsletterMessage.style.color = 'red';
            return;
        }

        // Simulate newsletter submission 
        try {
            // In a real-world scenario, you'd make an API call here
            newsletterMessage.textContent = 'Thank you for subscribing!';
            newsletterMessage.style.color = 'green';
            newsletterEmail.value = ''; // Clear input
        } catch (error) {
            newsletterMessage.textContent = 'Subscription failed. Please try again.';
            newsletterMessage.style.color = 'red';
        }
    });

    // Optional: Add Enter key support
    newsletterEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newsletterSubmit.click();
        }
    });
});