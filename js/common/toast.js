

export function showToast(message, type = 'success', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 space-y-4 z-50';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className =
        `toast bg-white shadow-lg rounded-lg px-4 py-3 flex items-center space-x-3 
        transition-transform transform opacity-0 scale-95`;

    const iconType = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

    toast.innerHTML = `
        <div class="icon ${iconColor}">
            <i class="fas fa-${iconType}"></i>
        </div>
        <div class="message text-gray-700">
            ${message}
        </div>
        <button class="close-button text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'scale-95');
        toast.classList.add('opacity-100', 'scale-100');
    }, 100);

    const removeToast = () => {
        toast.classList.remove('opacity-100', 'scale-100');
        toast.classList.add('opacity-0', 'scale-95');
        setTimeout(() => toast.remove(), 300);
    };

    setTimeout(removeToast, duration);
    toast.querySelector('.close-button').addEventListener('click', removeToast);
}
