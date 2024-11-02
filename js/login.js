const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const spinner = document.getElementById('spinner');
const buttonText = document.getElementById('buttonText');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

// Toggle password visibility
// togglePassword.addEventListener('click', () => {
//     console.log('Toggle password visibility clicked');
//     const type = passwordInput.type === 'password' ? 'text' : 'password';
//     passwordInput.type = type;
//     togglePassword.querySelector('i').classList.toggle('fa-eye');
//     togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
// });

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

// Show alert function
function showAlert(message) {
    alertMessage.textContent = message;
    alert.classList.add('show');
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

// Close alert function
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

        // Store user data
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userJwtToken', data.jwtToken);

        // Redirect based on role
        const userRole = data.user.role[0].roleName.toLowerCase();
        window.location.href = userRole === 'admin' ? '/admin.html' : '/index.html';

    } catch (error) {
        // Show error
        showAlert(error.message);
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 820);
    } finally {
        // Reset loading state
        spinner.style.display = 'none';
        buttonText.textContent = 'Sign in';
    }
});

// Add input validation
emailInput.addEventListener('input', () => {
    const isValid = emailInput.checkValidity();
    emailInput.classList.toggle('border-red-500', !isValid);
});

// Remember me functionality
const rememberMe = document.getElementById('remember-me');
if (localStorage.getItem('rememberedEmail')) {
    emailInput.value = localStorage.getItem('rememberedEmail');
    rememberMe.checked = true;
}

rememberMe.addEventListener('change', () => {
    if (rememberMe.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

