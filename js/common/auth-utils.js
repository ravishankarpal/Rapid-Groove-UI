import { showLogin } from "../navbar.js";
import { showToast } from "./toast.js";


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

    } catch (error) {
        console.error('Error loading page components:', error);
    }
});

export function handleLogout(e) {
    // If called from event listener, prevent default
    if (e) e.preventDefault();
    
    // Clear all auth-related data
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userJwtToken');
    
    // Update UI to show guest state
    if (typeof updateUIForGuestUser === 'function') {
        updateUIForGuestUser();
    }
    
    // Redirect to login
    window.location.href = '/login.html';
}

export function handleSessionExpired(data) {
    if (data?.code === 401) {
        showToast(data.message , 'error', 10000);
        setTimeout(() => {
            handleLogout();;
        }, 1500);
        updateUIForGuestUser();
        showLogin();
        
        return true;
    }
    return false;
}

export function isLoggedIn() {
    return Boolean(localStorage.getItem('userJwtToken'));
}