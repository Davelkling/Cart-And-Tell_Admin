export default defineNuxtPlugin( async () => {
    const token = useCookie('token');
    const {loggedIn} = useUserObj().value;
    const route = useRoute().fullPath;
    if (!loggedIn && !token) {
        useUserObj().value.loggedIn = false;
    }
    if (route !== '/login') {
        const API = useRuntimeConfig().public.API;
        if (token.value === undefined) {
            useUserObj().value.loggedIn = false;
            await navigateTo('/login'); 
            return;
        }
        // Verify token
        let isInvalidToken = null;
        const result:any = await $fetch<{
            email:string,
            id:number,
            cartCount: number,
        }>(`${API}/auth/validateAsAdmin`,{
            headers:{
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
            await navigateTo('/login',{ redirectCode: 301 });
            return;
        }
        if (result) {
            const userObj = useUserObj();
            userObj.value = {...result,loggedIn:true};
        }
    }
});

