import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import axios from "axios";
const isAuthenticatedGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem('token')

    if (!token) {
        return next({
            name: 'login'
        })
    }

    try{

        const response = await axios.get(`${API_URL}/api/auth/validate-token`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return next();
    } catch(err) {
        localStorage.removeItem('token');
        return next({name: 'login'})
    }

    

    

}

export default isAuthenticatedGuard;