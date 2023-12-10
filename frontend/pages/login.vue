<script setup lang="ts">
import { reactive, watch } from 'vue';
const API = useRuntimeConfig().public.API;
const formData = reactive<{email:string, password:string}>({
  email: '',
  password: ''
});
const errorMessage = ref<string>("");
interface loginFetchData {
  message:string,
  access_token?:string
}
async function login(email:string, password:string):Promise<loginFetchData> {
  const data = await $fetch<string>(`${API}/auth/login`,{
    method:'POST',
    headers:{
        "Content-Type": "application/json",
    },
    body: JSON.stringify({email,password})
  })
  .then(res => res)
  .catch(error => error.data);
  return data;
}
async function handler() {
  errorMessage.value = "";
  const result:loginFetchData = await login(formData.email, formData.password);
  console.log(result);
  if (result.access_token) {
    const token = useCookie('token');
    token.value = result.access_token;
    const userObj = useUserObj();
    const response:any = await $fetch<{
        email:string,
        id:number,
        cartCount: number,
    }>(`${API}/auth/validateAsAdmin`,{
        headers:{
            Authorization: `Bearer ${token.value}`,
            ContentType: 'application/json',
        },
        method: 'GET',
    })
    .catch(error => {
        errorMessage.value = "User not Authorized";
    })
    .then(res => res)
    if (response) {
        const userObj = useUserObj();
        userObj.value = {...response,loggedIn:true};
        await navigateTo('/');
    }
  }
  else {
    if (result.message === "Unauthorized") {
        errorMessage.value = "Provide Email and Password";
    }
  }
}
</script>
<template>
    <div class="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
        <div class="w-full sm:max-w-md p-5 mx-auto">
            <div class="flex justify-center items-center flex-col p-4">
                <h1 class="text-7xl font-medium text-[#282E78]"><span class="font-black">Cart</span> & Tell</h1>
                <h2 class="text-3xl text-[#282E78]">ECOMMERCE SOLUTIONS</h2>
            </div>
            <h2 class="mb-12 text-center text-5xl font-extrabold ">Administrator</h2>
            <form>
            <div class="mb-4">
                <label class="block mb-1" for="email">Email-Address</label>
                <input v-model="formData.email" id="email" type="text" name="email" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
            </div>
            <div class="mb-4">
                <label class="block mb-1" for="password">Password</label>
                <input v-model="formData.password" id="password" type="password" name="password" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
            </div>
            <div class="mt-6">
                <button @click="handler" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Sign In</button>
            </div>
            <div class="flex justify-center">
                <ul>
                <li class="mt-4 font-bold">{{ errorMessage }}</li>
                </ul>
            </div>
            </form>
        </div>
    </div>
</template>