document.addEventListener('DOMContentLoaded', function() {
    const otpRequestStep = document.getElementById('otp-request-step');
    const otpValidateStep = document.getElementById('otp-validate-step');
    const passwordChangeStep = document.getElementById('password-change-step');
    const step2Element = document.querySelector('.step-2');
    const step2Line = document.querySelector('.step-2-line');
    const step3Element = document.querySelector('.step-3');
    let userEmail = '';

    function setLoading(button, isLoading) {
        const buttonContent = button.querySelector('.button-content');
        if (isLoading) {
            button.disabled = true;
            button.classList.add('opacity-75');
            buttonContent.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
        } else {
            button.disabled = false;
            button.classList.remove('opacity-75');
            buttonContent.innerHTML = button.getAttribute('data-original-content');
        }
    }

    function showMessage(elementId, message, type) {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = message;
        messageEl.className = `mt-4 p-3 rounded-lg ${
            type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
        }`;
        messageEl.classList.remove('hidden');
    }


    document.querySelectorAll('button').forEach(button => {
        button.setAttribute('data-original-content', button.querySelector('.button-content').innerHTML);
    });


    document.getElementById('otpRequestForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.email.value;
        userEmail = email;
        const button = document.getElementById('sendOtpButton');

        try {
            setLoading(button, true);

            const response = await fetch(`http://localhost:8081/rapid/otp/forgot/password?userName=${encodeURIComponent(email)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            showMessage('otpRequestMessage', 'Recovery code sent to your email!', 'success');
            
            setTimeout(() => {
                otpRequestStep.classList.add('hidden');
                otpValidateStep.classList.remove('hidden');
                otpValidateStep.classList.add('fade-in');
                step2Element.classList.remove('bg-gray-200', 'text-gray-600');
                step2Element.classList.add('bg-indigo-600', 'text-white');
                step2Line.classList.remove('bg-gray-200');
                step2Line.classList.add('bg-indigo-600');
            }, 1500);

        } catch (error) {
            showMessage('otpRequestMessage', 'Failed to send recovery code. Please try again.', 'error');
        } finally {
            setLoading(button, false);
        }
    });


    document.getElementById('otpValidationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const otp = this.otp.value;
        const button = document.getElementById('validateOtpButton');

        try {
            setLoading(button, true);

            const response = await fetch(`http://localhost:8081/rapid/otp/validate-otp?userName=${encodeURIComponent(userEmail)}&otp=${otp}`, {
                method: 'GET'
            });

            const responseText = await response.text();
            console.log(responseText);

            if (responseText === 'Valid OTP!') {
                showMessage('otpValidationMessage', 'Code verified successfully!', 'success');
                
                setTimeout(() => {
                    otpValidateStep.classList.add('hidden');
                    passwordChangeStep.classList.remove('hidden');
                    passwordChangeStep.classList.add('fade-in');
                    step3Element.classList.remove('bg-gray-200', 'text-gray-600');
                    step3Element.classList.add('bg-indigo-600', 'text-white');
                }, 1500);
            } else {
                showMessage('otpValidationMessage', responseText, 'error');

            }
           

        } catch (error) {
            showMessage('otpValidationMessage', 'Verification failed. Please try again.', 'error');
        } finally {
            setLoading(button, false);
        }
    });
    // Handle Password Change Form
    document.getElementById('passwordChangeForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newPassword = this.newPassword.value;
        const confirmPassword = this.confirmPassword.value;
        const button = document.getElementById('changePasswordButton');

        if (newPassword !== confirmPassword) {
            showMessage('passwordChangeMessage', 'Passwords do not match.', 'error');
            return;
        }

        try {
            setLoading(button, true);

            console.log(encodeURIComponent(newPassword));
            console.log(userEmail);
            console.log(newPassword);
            const response = await fetch(`http://localhost:8081/rapid/user/update-password?userName=${encodeURIComponent(userEmail)}&password=${encodeURIComponent(newPassword)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            showMessage('passwordChangeMessage', 'Password changed successfully! Redirecting to login...', 'success');
            
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);

        } catch (error) {
            showMessage('passwordChangeMessage', 'Failed to change password. Please try again.', 'error');
        } finally {
            setLoading(button, false);
        }
    });

    document.getElementById('otp').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});