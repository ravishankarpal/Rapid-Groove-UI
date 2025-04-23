import { handleLogout } from "../navbar.js";
import { showToast } from "./toast.js";

export function sessionExpire(code){
    if (data.code === 401) {
        handleLogout(null);
        showToast(data.message, 'error', 10000); 
        setTimeout(() => {
        window.location.href = '/login.html';
    }, 1500);
        return;
    }
}