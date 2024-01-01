// Checks of user is authenticated and authorized
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { loggedIn } = useUserObj().value;
    console.log("middleware");
    if (!loggedIn && to.path !== '/login') {
        useUserObj().value.loggedIn = false;
        return navigateTo('/login');
    }
})