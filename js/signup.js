const form = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const toggleIcon = document.getElementById('toggleIcon');
const toggleConfirmIcon = document.getElementById('toggleConfirmIcon');
const spinner = document.getElementById('spinner');
const buttonText = document.getElementById('buttonText');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'password') {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleIcon.classList.remove('fa-solid');
        toggleIcon.classList.add('fa-regular');
    } else {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        toggleIcon.classList.remove('fa-regular');
        toggleIcon.classList.add('fa-solid');
    }
});


toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    
    if (type === 'password') {
        toggleConfirmIcon.classList.remove('fa-eye-slash');
        toggleConfirmIcon.classList.add('fa-eye');
        toggleConfirmIcon.classList.remove('fa-solid');
        toggleConfirmIcon.classList.add('fa-regular');
    } else {
        toggleConfirmIcon.classList.remove('fa-eye');
        toggleConfirmIcon.classList.add('fa-eye-slash');
        toggleConfirmIcon.classList.remove('fa-regular');
        toggleConfirmIcon.classList.add('fa-solid');
    }
});

// Show alert function
function showAlert(message, isSuccess = false) {
    alertMessage.textContent = message;
    const alertDiv = document.querySelector('#alert > div');
    if (isSuccess) {
       // alertDiv.classList.remove('bg-red-100', 'border-red-500');
        alertDiv.classList.add('bg-green-100', 'border-green-500');
        //alertMessage.classList.remove('text-red-800');
        alertMessage.classList.add('text-green-800');
    } else {
       // alertDiv.classList.remove('bg-green-100', 'border-green-500');
        alertDiv.classList.add('bg-red-100', 'border-red-500');
      //  alertMessage.classList.remove('text-green-800');
        alertMessage.classList.add('text-red-800');
    }
    alert.classList.add('show');
    setTimeout(() => {
        closeAlert();
    }, 5000);
}


function closeAlert() {
    alert.classList.remove('show');
}


function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
        return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character';
    }
    return null;
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    
    if (passwordInput.value !== confirmPasswordInput.value) {
        showAlert('Passwords do not match');
        return;
    }

    const passwordError = validatePassword(passwordInput.value);
    if (passwordError) {
        showAlert(passwordError);
        return;
    }

    
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Signing up...';
    
    try {
        const response = await fetch('http://localhost:8081/rapid/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: fullNameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            }),
        });

       const data = await response.json();
       console.log(data);

        if (data.code === 'BAD_REQUEST') {
            throw new Error(data.message);
        }

        
        showAlert('Sign up successful! Redirecting to Home Page...', true);
        
        
        form.reset();

     
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);

    } catch (error) {
       
        showAlert(error.message);
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 820);
    } finally {
        
        spinner.style.display = 'none';
        buttonText.textContent = 'Sign up';
    }
});

// Add input validation
emailInput.addEventListener('input', () => {
    const isValid = emailInput.checkValidity();
    emailInput.classList.toggle('border-red-500', !isValid);
});