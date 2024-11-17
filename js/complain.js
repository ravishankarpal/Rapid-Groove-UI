
import { API_URLS } from './api-constants.js';


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('complaintForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = submitBtn.querySelector('span');
    const fileUpload = document.getElementById('file-upload');
    const userId = localStorage.getItem("userEmail");

    // Add new element for showing selected files
    const fileListDisplay = document.createElement('div');
    fileListDisplay.className = 'mt-2 text-sm text-gray-600';
    fileUpload.parentElement.parentElement.appendChild(fileListDisplay);

    const showMessage = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `mb-6 p-4 rounded-lg ${
            type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
        }`;
        statusMessage.classList.remove('hidden');
        setTimeout(() => {
            statusMessage.style.display = 'none';
            statusMessage.classList.remove(type);
        }, 5000);
    };

    const setLoading = (isLoading) => {
        spinner.classList.toggle('hidden', !isLoading);
        submitBtn.disabled = isLoading;
        btnText.textContent = isLoading ? 'Submitting...' : 'Submit Complaint';
    };

    const updateFileList = (files) => {
        const fileList = Array.from(files).map(file => {
            let size = file.size < 1024 * 1024 
                ? `${(file.size / 1024).toFixed(1)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

            

                
            return `
                <div class="flex items-center justify-between py-1">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        <span class="text-gray-700">${file.name}</span>
                    </div>
                    <span class="text-gray-500">${size}</span>
                </div>
            `;




       


        }).join('');

        fileListDisplay.innerHTML = fileList ? `
            <div class="border rounded-lg p-2 bg-gray-50">
                
                ${fileList}
            </div>
        ` : '';
    };

    fileUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        const invalidFiles = files.filter(file =>
            !allowedTypes.includes(file.type) || file.size > maxSize
        );

        if (invalidFiles.length > 0) {
            showMessage('Please upload only PNG, JPG, or PDF files under 10MB', 'error');
            fileUpload.value = '';
            updateFileList([]);
        } else {
            updateFileList(files);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0];

        if (!file) {
            showMessage('Please upload bill', 'error');
            return;
        }

       
        if (!formData.get('department') || !formData.get('subject') || !formData.get('message')) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        setLoading(true);

        try {
           
            const base64File = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result
                        .replace('data:', '')
                        .replace(/^.+,/, '');
                    resolve(base64String);
                };
                reader.readAsDataURL(file);
            });

            const requestData = {
                userId: userId,
                orderNumber: formData.get('orderNumber'),
                department: formData.get('department'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                attachment: {
                    fileName: file.name,
                    fileType: file.type,
                    fileData: base64File
                }
            };

           const url =  API_URLS.USER_COMPLAIN;
           console.log(url);

            const response = await fetch(API_URLS.USER_COMPLAIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                showMessage('Thank you for submitting your complaint. We will investigate and get back to you as soon as possible.', 'success');
                form.reset();
                updateFileList([]); 
            } else {
                const errorMessage = await response.text();
                showMessage(errorMessage,'error');
                form.reset();
            }
        } catch (error) {
            showMessage('Failed to submit the complaint. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    });
});