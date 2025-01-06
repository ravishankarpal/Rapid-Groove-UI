import { storage } from './session.js';

export function initializeProtectedPage() {
    // Check token validity periodically (every minute)
    const checkSession = () => {
        storage.checkTokenExpiration();
    };
    
    // Initial check
    checkSession();
    
    // Set up periodic checks
    const sessionCheckInterval = setInterval(checkSession, 60000);
    
    // Clean up interval on page unload
    window.addEventListener('unload', () => {
        clearInterval(sessionCheckInterval);
    });
}