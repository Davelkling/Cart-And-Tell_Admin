<script setup lang="ts">
const API = useRuntimeConfig().public.API;
    const token = useCookie('token');
    const {data:categories,refresh, pending} = await useFetch<[{id:number,name:string,icon:string}]>(`${API}/category`,{
        lazy:true,
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    });
    import { useFileDialog } from '@vueuse/core'
    const formData = reactive<{name:string,icon:File|null}>({
        name: "",
        icon: null
    })
    const { files, open, reset, onChange } = useFileDialog({
    accept: 'image/*', // Set to accept only image files
    })

    onChange((files) => {
        formData.icon = files![0]
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
        formData.icon = null;
        formData.name = "";
        selectedId.value = NaN;
    }
    function openModal(e:any) {
        if (e.target!.value === "create") {
            createModal.value = true;
        }
        else if (e.target!.value === "edit") {
            editModal.value = true;
            selectedId.value = parseInt(e.target.id);
            formData.name = categories.value!.filter(category => category.id == selectedId.value)[0].name;
        }
        else if (e.target!.value === "delete") {
            deleteModal.value = true;
            selectedId.value = parseInt(e.target.id);
        }
    }
    async function create() {
        isLoading.value = true;
        let isError = false;
        const formDataCreate = new FormData();
        formDataCreate.append('name',formData.name);
        if (formData.icon) {
            formDataCreate.append('image',formData.icon!);
        }
        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/category`,{
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
            refresh();
            closeModal(new Event('click'));
        }
        isLoading.value = false;
    }
    async function update() {
        isLoading.value = true;
        let isError = false;
        const formDataCreate = new FormData();
        if (formData.name) {
            formDataCreate.append('name',formData.name);
        }
        if (formData.icon) {
            formDataCreate.append('image',formData.icon!);
        }
        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/category/${selectedId.value}`,{
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
            refresh();
            closeModal(new Event('click'));
        }
        isLoading.value = false;
    }
    async function Delete() {
        console.log(selectedId);
        const data= await $fetch<{message:string}>(`${API}/category/${selectedId.value}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        }).catch(error => {
            alert(error.data.message)
        });
        if (data) {
            refresh();
            closeModal(new Event('click'));
        }
    }
</script>
<template>
    <div class="bg-[#F8F9FD]">
        <div class="flex justify-between">
            <SideBar/>
            <div class="p-4 w-full h-[100svh] overflow-x-scroll relative">
                <div class="bg-white rounded-3xl w-full p-4 text-center">
                    <h1 class="text-5xl font-black">categories</h1>
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
                            <p class="font-bold text-2xl">Create Category</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="name">Name</label>
                                <input v-model="formData.name" id="name" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="w-full h-full items-center bg-grey-lighter">
                                <label class="block mb-1 font-bold text-lg" for="name">Image</label> 
                                <input @click="(open as any)" type='file' class="" />
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="create" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Create Category</button>
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
                            <p class="font-bold text-2xl">Update Category</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="name">Name</label>
                                <input v-model="formData.name" id="name" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                            </div>
                            <div class="w-full h-full items-center bg-grey-lighter">
                                <label class="block mb-1 font-bold text-lg" for="name">Image</label> 
                                <input @click="(open as any)" type='file' class="" />
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="update" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Update Category</button>
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
                            <p class="font-bold text-2xl">Delete Category</p>
                            <p>Are you sure you want to Delete?</p>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="name">Name</label>
                                <p>{{categories!.filter(category => category.id == selectedId)[0].name }}</p>
                            </div>
                            <div class="mt-4">
                                <label class="block mb-1 font-bold text-lg" for="name">Image</label>
                                <div class="flex justify-center items-center">
                                    <img  class="h-[200px] object-cover" :src="categories!.filter(category => category.id == selectedId)[0].icon" alt="">
                                </div>
                            </div>
                            <div class="flex-1 basis-0 flex justify-center items-end">  
                                <button @click="Delete" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Delete Category</button>
                            </div>
                        </div> 
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start items-center">
                            <p class="font-bold p-4">Total of Categories: </p>
                            <p v-if="!pending" class="font-bold">{{ (categories!.length) ? categories!.length : 0 }}</p>
                            <div v-else class="h-5 rounded-md w-5 bg-gray-400"></div>
                        </div>
                        <div>
                            <button @click="openModal" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Add Category</button>
                        </div>
                    </div>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="animate-pulse" v-if="pending" v-for="i in Array.from({length:10})">
                                <td class="px-6 py-4 whitespace-nowrap h-[81px]" v-for="i in Array.from({length:4})">
                                    <div class="h-[50%] rounded-md w-full bg-gray-400"></div>
                                </td>
                            </tr>
                            <tr v-if="!pending" v-for="category in categories" :key="category.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ category.id}}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ category.name }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p v-if="!category.icon">no image</p>
                                    <img v-else class="h-10 w-10" :src="category.icon" alt="">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                    <button @click="openModal" value="edit" :id="category.id.toString()" type="button" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button @click="openModal" value="delete" :id="category.id.toString()" type="button" class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- <SettingBar/> -->
        </div> 
    </div>
</template>