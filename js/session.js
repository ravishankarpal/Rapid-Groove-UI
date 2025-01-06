function showAlert(message) {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alert-message');

    if (alert && alertMessage) {
        alertMessage.textContent = message;
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
        }, 5000);
    }
}

// Check session expiration
 function checkSession() {
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    const jwtToken = sessionStorage.getItem('userJwtToken');

    if (!jwtToken || !tokenExpiry || Date.now() > tokenExpiry) {
        // Clear session storage
        sessionStorage.clear();

        // Redirect to login page with a message
        showAlert('Session expired, please login again');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
}