<script setup lang="ts">
    function logout() {
        const token = useCookie('token');
        token.value = "";
        const userObj = useUserObj();
        userObj.value.loggedIn = false;
        navigateTo('/login');
    }
</script>
<template>
    <div class="w-[400px] bg-[#5B8ED8] overflow-hidden shrink-0">
        <NuxtLink to="/" class="text-[#282F7A] mb-4">
        <div class="flex flex-col justify-start items-center p-4 bg-white rounded-b-2xl">
            <div class="flex flex-col justify-start ">
                <h1 class="text-4xl font-medium text-[#282E78] text-center"><span class="font-black">Cart</span> & Tell</h1>
                <h2 class="text-2xl text-[#282E78]">ECOMMERCE SOLUTIONS</h2>
            </div>
            <h1 class="font-bold text-2xl text-[#2563EB]">Admin</h1>
        </div>
        </NuxtLink>
        <div class="h-full text-white">
            <div class="flex justify-center items-center px-5 relative">
                <NuxtLink to="/" class="absolute left-8">
                    <div class="h-12 w-12 flex justify-center items-center ">
                        <span class="material-symbols-outlined font-black text-3xl">west</span> 
                    </div>
                </NuxtLink>
                <div class="p-4 flex justify-center items-center flex-col">
                    <span class="material-symbols-outlined font-black text-7xl">delete</span>
                    <h1 class="font-bold">Archives</h1>
                </div>
            </div>
            <NuxtLink to="/archives">
                <div class="flex justify-start items-start gap-4 py-5 px-12">
                    <span class="material-symbols-outlined font-black text-3xl">home</span>
                    <h2 class="font-bold text-2xl">Overview</h2>    
                </div>
            </NuxtLink>
            <NuxtLink to="/archives/users">
                <div class="flex justify-start items-start gap-4 py-5 px-12">
                    <span class="material-symbols-outlined font-black text-3xl">person</span>
                    <h2 class="font-bold text-2xl">Archived Users</h2>    
                </div>
            </NuxtLink>
            <NuxtLink to="/archives/bannedUsers">
                <div class="flex justify-start items-start gap-4 py-5 px-12">
                    <span class="material-symbols-outlined font-black text-3xl">person</span>
                    <h2 class="font-bold text-2xl">Banned Users</h2>    
                </div>
            </NuxtLink>
            <NuxtLink to="/archives/merchants">
                <div class="flex justify-start items-start gap-4 py-5 px-12">
                    <span class="material-symbols-outlined font-black text-3xl">person_apron</span>
                    <h2 class="font-bold text-2xl">Archived Merchants</h2>  
                </div>
            </NuxtLink>
            <button @click="logout" class="button">
                <div class="flex justify-start items-start gap-4 py-5 px-12 absolute bottom-0">
                    <span class="material-symbols-outlined font-black text-3xl">logout</span>
                    <h2 class="font-bold text-2xl">Logout</h2>  
                </div>
            </button>
        </div>
    </div>
</template>

<style scoped type="postcss">
    .router-link-active > div.flex.justify-start.items-start{
        @apply bg-[#79A3DF]
    }
</style>
