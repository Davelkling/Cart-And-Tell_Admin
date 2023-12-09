<script setup lang="ts">
const API = useRuntimeConfig().public.API;
    const token = useCookie('token');
    const {data:users,refresh} = await useFetch<[{id:number,email:string,password:string,isMerchant:boolean,merchant:null|{}}]>(`${API}/user`,{
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    });
    const formData = reactive<{email:string,password:string,isMerchant:boolean}>({
        email: "",
        password:"",
        isMerchant: false,
    })
    const isLoading = ref(false);
    const selectedId = ref(NaN);
    const createModal = ref(false);
    const editModal = ref(false);
    const deleteModal = ref(false);
    function closeModal(e:Event) {
        e.stopPropagation();
        createModal.value = false;
        editModal.value = false;
        deleteModal.value = false;
        
        formData.password = "";
        formData.email = "";
        formData.isMerchant = false;
        selectedId.value = NaN;
        refresh();
    }
    function openModal(e:any) {
        if (e.target!.value === "create") {
            createModal.value = true;
        }
        else if (e.target!.value === "edit") {
            editModal.value = true;
            selectedId.value = parseInt(e.target.id);
            formData.email = users.value!.filter(user => user.id == selectedId.value)[0].email;
            formData.password = users.value!.filter(user => user.id == selectedId.value)[0].password;
            formData.isMerchant = users.value!.filter(user => user.id == selectedId.value)[0].isMerchant;
        }
        else if (e.target!.value === "delete") {
            deleteModal.value = true;
            selectedId.value = parseInt(e.target.id);
        }
    }
    async function create() {
        const trueRegExp = new RegExp("true");
        formData.isMerchant = trueRegExp.test(formData.isMerchant.toString());
        isLoading.value = true;
        let isError = false;
        const formDataCreate = JSON.stringify(formData);
        console.log(formData.isMerchant)
        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/user`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
            body: formDataCreate
        }).catch(error => {
            alert(error.data.message);
            isError = true
            return;
        })
        if (!isError) {
            closeModal(new Event('click'));
        }
        refresh();
        isLoading.value = false;
    }
    async function update() {
        const trueRegExp = new RegExp("true");
        formData.isMerchant = trueRegExp.test(formData.isMerchant.toString());
        isLoading.value = true;
        let isError = false;
        const formDataCreate = JSON.stringify(formData);
        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/user/${selectedId.value}`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
            body: formDataCreate
        }).catch(error => {
            alert(error.data.message);
            isError = true
            return;
        })
        if (!isError) {
            closeModal(new Event('click'));
        }
        refresh();
        isLoading.value = false;
    }
    async function Delete() {
        console.log(selectedId);
        const data= await $fetch<{message:string}>(`${API}/user/${selectedId.value}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        }).catch(error => {
            alert(error.data.message)
        });
        if (data) {
            closeModal(new Event('click'));
        }
        refresh();
    }
</script>
<template>
    <div class="bg-[#F8F9FD]">
        <div class="flex justify-between">
            <SideBar/>
            <div class="p-4 w-full h-[100svh] overflow-x-scroll relative">
                <div class="bg-white rounded-3xl w-full p-4 text-center">
                    <h1 class="text-5xl font-black">users</h1>
                </div>
                <div class="bg-white rounded-3xl w-full p-4 h-full mt-4">
                    <!-- Add Modal -->
                    <div v-if="createModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                        <div class="h-[500px] w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                            <div class="flex justify-end">
                                <button @click="closeModal">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p class="font-bold text-2xl">Create user</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">email</label>
                                <input v-model="formData.email" id="email" type="text" email="email" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">password</label>
                                <input v-model="formData.password" id="email" type="text" email="email" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">isMerchant</label>
                                <select v-model="formData.isMerchant"  class="p-4" >
                                    <option value="true">true</option>
                                    <option value="false" selected>false</option>
                                </select>
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="create" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Create user</button>
                            </div>
                            <p v-if="isLoading" class="text-center">Loading</p>
                        </div> 
                    </div>
                    <!-- Update Modal -->
                    <div v-if="editModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                        <div class="h-[500px] w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                            <div class="flex justify-end">
                                <button @click="closeModal">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p class="font-bold text-2xl">Update user</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">email</label>
                                <input v-model="formData.email" id="email" type="text" email="email" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">password</label>
                                <input v-model="formData.password" id="email" type="text" email="email" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">isMerchant</label>
                                <select v-model="formData.isMerchant"  class="p-4" >
                                    <option value="true">true</option>
                                    <option value="false" selected>false</option>
                                </select>
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="update" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Update user</button>
                            </div>
                            <p v-if="isLoading" class="text-center">Loading</p>
                        </div> 
                    </div>
                    <!-- Add Delete -->
                    <div v-if="deleteModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                        <div class="h-[500px] w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                            <div class="flex justify-end">
                                <button @click="closeModal">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p class="font-bold text-2xl">Delete user</p>
                            <p>Are you sure you want to Delete?</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">email</label>
                                <p>{{users!.filter(user => user.id == selectedId)[0].email }}</p>
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">password</label>
                                <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{users!.filter(user => user.id == selectedId)[0].password }}</p>
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="email">isMerchant</label>
                                <p class="">{{users!.filter(user => user.id == selectedId)[0].isMerchant }}</p>
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="Delete" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Delete user</button>
                            </div>
                        </div> 
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start items-center">
                            <p class="font-bold p-4">Total of users: </p>
                            <p class="font-bold">{{ (users!.length) ? users!.length : 0 }}</p>
                        </div>
                        <div>
                            <button @click="openModal" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Add user</button>
                        </div>
                    </div>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">password</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">isMerchant</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">hasAccount</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" v-for="user in users" :key="user.id">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ user.id}}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ user.email }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ user.password }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ user.isMerchant }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ user.merchant !== null }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                    <button @click="openModal" value="edit" :id="user.id.toString()" type="button" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button @click="openModal" value="delete" :id="user.id.toString()" type="button" class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <SettingBar/>
        </div> 
    </div>
</template>