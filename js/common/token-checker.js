
document.addEventListener('DOMContentLoaded', () => {
    const currentSession = SessionManager.checkTokenExpiration();
    console.log("nmbmbbmn ", currentSession);
    if(!currentSession){
        
        console.log("Token expire redirecting to login");
        return;
        
    }
});


