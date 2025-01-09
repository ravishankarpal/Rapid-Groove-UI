

// sessionManager.js
window.SessionManager = {
    generateStorageKey: (userId, key) => `user_${userId}_${key}`,
    createSession: (userData) => {
        const { user, jwtToken, expireTime } = userData;
        const userId = user.email; 
        const sessionData = {
            name: user.name,
            email: user.email,
            role: user.role[0].roleName,
            jwtToken,
            expireTime,
            lastAccessed: new Date().getTime()
        };

        console.log(SessionManager.generateStorageKey(userId, 'session'));

        localStorage.setItem(
            SessionManager.generateStorageKey(userId, 'session'),
            JSON.stringify(sessionData)
        );

        return sessionData;
    },

    getAllSessions: () => {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('user_') && key.endsWith('_session')) {
                const sessionData = JSON.parse(localStorage.getItem(key));
                sessions.push(sessionData);
            }
        }
        return sessions;
    },

    getCurrentSession: () => {
        const sessions = SessionManager.getAllSessions();
        return sessions.find(session => {
            const now = new Date().getTime();
            return now < new Date(session.expireTime).getTime();
        });
    },

    handleLogout: async () => {
        try {
            const currentSession = SessionManager.getCurrentSession();
            
            // Clear all session data
            if (currentSession?.email) {
                localStorage.removeItem(
                    SessionManager.generateStorageKey(currentSession.email, 'session')
                );
            }
            
            // Clean up any expired sessions
            SessionManager.cleanupSessions();
            
            // Optional: Clear any sensitive data from memory
            SessionManager.clearSensitiveData();
            window.location.href = '/login.html';
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },

    clearSensitiveData: () => {
      
        const sensitiveKeys = ['tempAuthData', 'userPreferences'];
        sensitiveKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        });
    },


    checkTokenExpiration: () => {
        const currentSession = SessionManager.getCurrentSession();
        const currentTime = new Date().getTime();
        const expirationTime = new Date(currentSession.expireTime).getTime();
        console.log(expirationTime);
        if (!currentSession || !currentSession.expireTime) {
            SessionManager.handleLogout();
            return null;
        }

        // const currentTime = new Date().getTime();
        // const expirationTime = new Date(currentSession.expireTime).getTime();
        
        if (1736429373000 >= expirationTime) {
            showToast("Token Expire",'error',8000);
            setTimeout(() => {
                SessionManager.handleLogout();
            }, 10000);
            
            return null;
        }
    },

    cleanupSessions: () => {
        const sessions = SessionManager.getAllSessions();
        const now = new Date().getTime();
        
        sessions.forEach(session => {
            if (now >= new Date(session.expireTime).getTime()) {
                localStorage.removeItem(
                    SessionManager.generateStorageKey(session.email, 'session')
                );
            }
        });
    },

    setRememberedEmail: (email) => {
        localStorage.setItem('rememberedEmails', JSON.stringify([
            ...new Set([
                ...JSON.parse(localStorage.getItem('rememberedEmails') || '[]'),
                email
            ])
        ]));
    },

    removeRememberedEmail: (email) => {
        const emails = JSON.parse(localStorage.getItem('rememberedEmails') || '[]');
        localStorage.setItem('rememberedEmails', JSON.stringify(
            emails.filter(e => e !== email)
        ));
    },

    getRememberedEmails: () => {
        return JSON.parse(localStorage.getItem('rememberedEmails') || '[]');
    }
};




function showToast(message, type = 'success', duration = 3000) {
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