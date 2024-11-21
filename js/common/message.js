const showMessage = (message, type) => {
    const toastContainer = document.getElementById('statusMessage');

    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = `
        flex items-center justify-between w-72 p-4 mb-2 rounded-lg shadow-lg text-sm
        ${type === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'}
        transition-transform transform ease-in-out duration-300 translate-x-full
    `;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-4 text-lg font-bold focus:outline-none hover:text-gray-600" onclick="this.parentElement.remove()">&times;</button>
    `;

   
    toastContainer.appendChild(toast);

    
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 50); 

    
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300); 
    }, 5000);
};
