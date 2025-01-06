

// export function showToast(message, type = 'success', duration = 3000) {
//     let toastContainer = document.getElementById('toast-container');
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.id = 'toast-container';
//         toastContainer.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 space-y-4 z-50';
//         document.body.appendChild(toastContainer);
//     }

//     const toast = document.createElement('div');
//     toast.className =
//         `toast bg-white shadow-lg rounded-lg px-4 py-3 flex items-center space-x-3 
//         transition-transform transform opacity-0 scale-95`;

//     const iconType = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
//     const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

//     toast.innerHTML = `
//         <div class="icon ${iconColor}">
//             <i class="fas fa-${iconType}"></i>
//         </div>
//         <div class="message text-gray-700">
//             ${message}
//         </div>
//         <button class="close-button text-gray-400 hover:text-gray-600">
//             <i class="fas fa-times"></i>
//         </button>
//     `;

//     toastContainer.appendChild(toast);
//     setTimeout(() => {
//         toast.classList.remove('opacity-0', 'scale-95');
//         toast.classList.add('opacity-100', 'scale-100');
//     }, 100);

//     const removeToast = () => {
//         toast.classList.remove('opacity-100', 'scale-100');
//         toast.classList.add('opacity-0', 'scale-95');
//         setTimeout(() => toast.remove(), 300);
//     };

//     setTimeout(removeToast, duration);
//     toast.querySelector('.close-button').addEventListener('click', removeToast);
// }

// toast.js
export function showToast(message, type = 'success', duration = 3000) {
    // Create or get toast container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 space-y-4 z-50';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    
    // Set base classes
    const baseClasses = 'flex items-center p-4 mb-4 rounded-lg shadow-lg border transform transition-all duration-300';
    
    // Get type-specific classes
    let typeClasses = '';
    let icon = '';
    
    switch(type) {
        case 'error':
            typeClasses = 'bg-red-50 border-red-200 text-red-800';
            icon = `<svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>`;
            break;
        case 'success':
            typeClasses = 'bg-green-50 border-green-200 text-green-800';
            icon = `<svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>`;
            break;
        case 'warning':
            typeClasses = 'bg-yellow-50 border-yellow-200 text-yellow-800';
            icon = `<svg class="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>`;
            break;
        default: // info
            typeClasses = 'bg-blue-50 border-blue-200 text-blue-800';
            icon = `<svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>`;
    }

    toast.className = `${baseClasses} ${typeClasses} opacity-0 translate-y-2`;
    
    // Set toast content
    toast.innerHTML = `
        <div class="flex items-center">
            ${icon}
            <div class="text-sm font-medium flex-1">${message}</div>
            <button class="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
    });

    // Remove toast function
    const removeToast = () => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            toast?.remove();
            if (toastContainer?.childNodes.length === 0) {
                toastContainer.remove();
            }
        }, 300);
    };

    // Add click handler to close button
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', removeToast);

    // Auto remove after duration
    setTimeout(removeToast, duration);
}
