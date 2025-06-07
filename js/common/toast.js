export function showToast(message, type = 'success', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 space-y-4 z-50 max-w-md w-full sm:w-auto';
        document.body.appendChild(toastContainer);
    }

    // Define toast configurations
    const toastConfigs = {
        success: {
            icon: 'check-circle',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            iconColor: 'text-green-500',
            title: 'Success'
        },
        error: {
            icon: 'exclamation-circle',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            iconColor: 'text-red-500',
            title: 'Error'
        },
        warning: {
            icon: 'exclamation-triangle',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
            iconColor: 'text-yellow-500',
            title: 'Warning'
        },
        info: {
            icon: 'info-circle',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            iconColor: 'text-blue-500',
            title: 'Information'
        }
    };

    const config = toastConfigs[type] || toastConfigs.info;

    const toast = document.createElement('div');
    toast.className = `
        group relative overflow-hidden
        ${config.bgColor} border-l-4 ${config.borderColor}
        rounded-lg shadow-lg px-5 py-4
        transform transition-all duration-300 ease-in-out
        translate-x-full opacity-0
        hover:shadow-xl
        cursor-default
    `;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = `
        absolute bottom-0 left-0 h-1 bg-gradient-to-r
        from-${type}-400 to-${type}-600
        transition-all duration-300 ease-linear
    `;
    progressBar.style.width = '100%';

    toast.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="${config.iconColor} flex-shrink-0 mt-0.5">
                <i class="fas fa-${config.icon} text-lg"></i>
            </div>
            <div class="flex-grow">
                <h3 class="font-semibold text-gray-900 leading-tight mb-1">
                    ${config.title}
                </h3>
                <p class="text-sm text-gray-600">
                    ${message}
                </p>
            </div>
            <button class="flex-shrink-0 ml-4 -mr-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    toast.appendChild(progressBar);
    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Animate progress bar
    progressBar.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => {
        progressBar.style.width = '0%';
    });

    // Remove toast function
    const removeToast = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 300);
    };

    // Setup event listeners
    toast.querySelector('button').addEventListener('click', () => {
        removeToast();
    });

    // Auto dismiss
    const dismissTimeout = setTimeout(() => {
        removeToast();
    }, duration);

    // Pause timer on hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(dismissTimeout);
        progressBar.style.transition = 'none';
    });

    toast.addEventListener('mouseleave', () => {
        const remainingWidth = parseFloat(progressBar.style.width) || 0;
        const remainingTime = (remainingWidth / 100) * duration;
        
        progressBar.style.transition = `width ${remainingTime}ms linear`;
        progressBar.style.width = '0%';
        
        setTimeout(removeToast, remainingTime);
    });

    // Return control object
    return {
        dismiss: removeToast
    };
}

