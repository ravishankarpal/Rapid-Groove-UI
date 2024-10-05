document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    console.log(userEmail);
    console.log(userName);

    const userGreeting = document.getElementById('userGreeting');
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userInfoDiv = document.getElementById('userInfo');
    const loginLinksDiv = document.getElementById('loginLinks');
    
    if (userName && userEmail) {
        userGreeting.textContent = `Hello ${userName}`;
        userNameElement.textContent = userName;
        userEmailElement.textContent = userEmail;
        
        // Show user info and hide login links
        userInfoDiv.classList.remove('hidden');
        loginLinksDiv.classList.add('hidden');
    } else {
        userGreeting.textContent = 'Account';
        
        // Hide user info and show login links
        userInfoDiv.classList.add('hidden');
        loginLinksDiv.classList.remove('hidden');
    }

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.reload(); // Refresh the page to update the navbar
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


// document.getElementById('shopButton').addEventListener('click', () =>{
//     const shopDropDownMenu = document.getElementById('dropdownMenu');
//     shopDropDownMenu.classList.toggle('hidden');
// });


// // Hide Shop dropdown when clicking outside
// document.addEventListener('click', (event) => {
//     const shopButton = document.getElementById('shopButton');
//     const shopDropDownMenu = document.getElementById('dropdownMenu');
    
//     if (!shopButton.contains(event.target) && !shopDropDownMenu.contains(event.target)) {
//         shopDropDownMenu.classList.add('hidden'); // Hide dropdown if clicked outside
//     }
// });



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