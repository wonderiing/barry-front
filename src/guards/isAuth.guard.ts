import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import axios from "axios";
const isAuthenticatedGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {

    const token = localStorage.getItem('token')

    if (!token) {
        return next({
            name: 'login'
        })
    }

    try{

        const response = await axios.get('http://localhost:8000/api/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return next();
    } catch(err) {
        localStorage.removeItem('token');
        return next({name: 'login'})
    }

    

    

}

export default isAuthenticatedGuard;