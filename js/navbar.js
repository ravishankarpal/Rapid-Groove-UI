const user = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');
const token = localStorage.getItem('userJwtToken');
const userGreeting = document.getElementById('userGreeting');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userInfo = document.getElementById('userInfo');
const guestMenu = document.getElementById('guestMenu');
const loggedInMenu = document.getElementById('loggedInMenu');
const accountMenu = document.getElementById('accountMenu');
const accountButton = document.getElementById('accountButton');

function updateUIForLoggedInUser() {
    userName.textContent = `Hello, ${user}`;
    userEmail.textContent = email;
    userInfo.style.display = 'block';
    loggedInMenu.style.display = 'block';
    guestMenu.style.display = 'none';
}

function updateUIForGuestUser() {
    userGreeting.textContent = 'Account';
    userInfo.style.display = 'none';
    loggedInMenu.style.display = 'none';
    guestMenu.style.display = 'block';
}

if (token && user) {
    updateUIForLoggedInUser();
} else {
    updateUIForGuestUser();
}


accountButton.addEventListener('mouseover', () => {
    accountMenu.classList.remove('hidden');
});

accountMenu.addEventListener('mouseleave', () => {
    accountMenu.classList.add('hidden');
});

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userJwtToken');
        updateUIForGuestUser();
        window.location.href = '/login.html';
    });
}


