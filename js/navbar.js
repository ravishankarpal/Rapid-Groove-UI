document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user data from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('userEmail');

    // DOM elements
    const userGreeting = document.getElementById('userGreeting');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userInfo = document.getElementById('userInfo');
    const loginLinks = document.getElementById('loginLinks');
    const accountMenu = document.getElementById('accountMenu');
    
    // Check if user is logged in
    if (username && email) {
        // Update user info
        userGreeting.textContent = `Hello, ${username}`;
        userName.textContent = username;
        userEmail.textContent = email;

        // Show user info, hide login links
        userInfo.classList.remove('hidden');
        loginLinks.classList.add('hidden');
    } else {
        // If no user data in localStorage, hide user info and show login links
        userInfo.classList.add('hidden');
        loginLinks.classList.remove('hidden');
    }

    // Toggle account menu visibility on click
    document.getElementById('accountButton').addEventListener('click', function() {
        accountMenu.classList.toggle('hidden');
    });

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', function() {
        // Clear the local storage and reload
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        location.reload();
    });
});









document.getElementById('accountButton').addEventListener('mouseover', () => {
    const accountMenu = document.getElementById('accountMenu');
    accountMenu.classList.toggle('hidden'); // Toggle visibility
});

// Hide dropdown when clicking outside
document.addEventListener('mouseover', (event) => {
    const accountButton = document.getElementById('accountButton');
    const accountMenu = document.getElementById('accountMenu');
    
    if (!accountButton.contains(event.target) && !accountMenu.contains(event.target)) {
        accountMenu.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});

document.getElementById('shopButton').addEventListener('mouseover', () =>{
    const shopDropDownMenu = document.getElementById('dropdownMenu');
    shopDropDownMenu.classList.toggle('hidden');
});


// Hide Shop dropdown when clicking outside
document.addEventListener('mouseover', (event) => {
    const shopButton = document.getElementById('shopButton');
    const shopDropDownMenu = document.getElementById('dropdownMenu');
    
    if (!shopButton.contains(event.target) && !shopDropDownMenu.contains(event.target)) {
        shopDropDownMenu.classList.add('hidden'); // Hide dropdown if clicked outside
    }
});