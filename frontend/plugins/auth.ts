export default defineNuxtPlugin(async () => {
    // Improved Efficiency by only validating token once
    const token = useCookie('token');
    const { loggedIn } = useUserObj().value;
    const path = useRoute().path;
    if (!loggedIn && !token.value) {
        useUserObj().value.loggedIn = false;
        return;
    }
    if (path !== '/login') {
        const API = useRuntimeConfig().public.API;
        if (token.value === undefined) {
            useUserObj().value.loggedIn = false;
            return;
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
            return;
        }
        if (result) {
            const userObj = useUserObj();
            userObj.value = { ...result, loggedIn: true };
        }
    }
})