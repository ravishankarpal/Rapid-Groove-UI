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


    checkTokenExpiration: () => {
        const currentSession = SessionManager.getCurrentSession();
        if (!currentSession || !currentSession.expireTime) {
            SessionManager.handleLogout();
            return null;
        }

        const currentTime = new Date().getTime();
        const expirationTime = new Date(currentSession.expireTime).getTime();
        
        if (currentTime >= expirationTime) {
            SessionManager.handleLogout();
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

