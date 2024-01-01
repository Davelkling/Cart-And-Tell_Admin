export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = useCookie('token');
    const { loggedIn } = useUserObj().value;
    if (!loggedIn && !token) {
        console.log("this is called");
        useUserObj().value.loggedIn = false;
        return navigateTo('/login');
    }
    if (to.path !== '/login') {
        const API = useRuntimeConfig().public.API;
        if (token.value === undefined) {
            useUserObj().value.loggedIn = false;
            return navigateTo('/login');
        }
        // Verify token
        let isInvalidToken = null;
        const result: any = await $fetch<{
            email: string,
            id: number,
            cartCount: number,
        }>(`${API}/auth/validateAsAdmin`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                ContentType: 'application/json',
            },
            method: 'GET',
        }).catch(async () => {
            isInvalidToken = true;
        });
        if (isInvalidToken) {
            const token = useCookie('token');
            token.value = null;
            useUserObj().value.loggedIn = false;
            return navigateTo('/login', { redirectCode: 301 });
        }
        if (result) {
            const userObj = useUserObj();
            userObj.value = { ...result, loggedIn: true };
        }
    }
})