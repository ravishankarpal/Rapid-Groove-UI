
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const spinner = document.getElementById('spinner');
const buttonText = document.getElementById('buttonText');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');
const toggleIcon = document.getElementById('toggleIcon');

// Password toggle functionality
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    if (type === 'password') {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
});

// Alert functions
function showAlert(message) {
    alertMessage.textContent = message;
    alert.classList.add('show');
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

function closeAlert() {
    alert.classList.remove('show');
}

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Show loading state
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Signing in...';
    
    try {
        const response = await fetch('http://localhost:8081/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: emailInput.value,
                userPassword: passwordInput.value
            }),
        });

        if (!response.ok) {
            throw new Error('Invalid email or password');
        }

        const data = await response.json();
        
        // Clean up expired sessions first
        SessionManager.cleanupSessions();

        // Create new session
        const sessionData = SessionManager.createSession(data);
        console.log("console data", sessionData);

        // Handle remember me functionality
        const rememberMe = document.getElementById('remember-me');
        if (rememberMe.checked) {
            SessionManager.setRememberedEmail(emailInput.value);
        } else {
            SessionManager.removeRememberedEmail(emailInput.value);
        }

        // Redirect based on role
        window.location.href = sessionData.role.toLowerCase() === 'admin' 
            ? '/admin.html' 
            : '/index.html';

    } catch (error) {
        showAlert(error.message);
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 820);
    } finally {
        spinner.style.display = 'none';
        buttonText.textContent = 'Sign in';
    }
});

// Initialize remember me functionality
const rememberedEmails = SessionManager.getRememberedEmails();
if (rememberedEmails.length > 0) {
    emailInput.value = rememberedEmails[rememberedEmails.length - 1];
    document.getElementById('remember-me').checked = true;
}

