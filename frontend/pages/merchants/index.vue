<script setup lang="ts">
const API = useRuntimeConfig().public.API;
    import { useDateFormat, useFileDialog } from '@vueuse/core';
    enum MerchantRelation {
        MerchantOwner = "MerchantOwner",
        ExclusiveDistributor = "ExclusiveDistributor",
        NonExclusiveDistributor = "NonExclusiveDistributor"
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const token = useCookie('token');
    const {data:merchants,refresh,pending} = await useFetch<[{
        id:number
        name:string,
        website:string,
        description:string,
        category:{id:number,name:string},
        categoryId:number,
        proofOfAuthenticity:string,
        merchantStartValidity:Date,
        merchantEndValidity:Date,
        merchantRelationship:MerchantRelation,
        image:string,
        merchantsId:number,
        user:{
            id:number,
            email:string,
            isMerchant:boolean,
        },
        userId:number,
        products:[any]
    }]>(`${API}/merchant`,{
        signal,
        lazy:true,
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    });
    const {data:categories,refresh:refresh1} = await useFetch<[{id:number,name:string,icon:string}]>(`${API}/category`,{
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    });
    const formData = reactive<{
        name:string,
        website:string,
        description:string,
        categoryId:number,
        proofOfAuthenticity:File|null,
        image:File|null,
        merchantRelationship:MerchantRelation,
        userId:number,
        merchantStartValidity:Date|null,
        merchantEndValidity:Date|null
    }>({
        name: "",
        website:"",
        description: "",
        categoryId:NaN,
        proofOfAuthenticity: null,
        image:null,
        userId:NaN,
        merchantRelationship:MerchantRelation.MerchantOwner,
        merchantEndValidity: null,
        merchantStartValidity: null
    })
    
    
    // First instance
    const { files: files1, open: open1, reset: reset1, onChange: onChange1 } = useFileDialog({
    accept: 'image/*',
    });

    onChange1((files1) => {
    formData.image = files1![0];
    });

    // Second instance
    const { files: files2, open: open2, reset: reset2, onChange: onChange2 } = useFileDialog({
    accept: 'image/*',
    });

    onChange2((files2) => {
    formData.proofOfAuthenticity = files2![0];
    });


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
        
        formData.name = "";
        formData.website = "";
        formData.description = ""
        formData.categoryId = NaN;
        formData.proofOfAuthenticity = null;
        formData.image = null;
        formData.userId = NaN;
        formData.merchantRelationship = MerchantRelation.MerchantOwner;
        formData.merchantEndValidity = null;
        formData.merchantStartValidity = null;
        refresh();
    }
    function openModal(e:any) {
        if (e.target!.value === "create") {
            createModal.value = true;
        }
        else if (e.target!.value === "edit") {
            editModal.value = true;
            selectedId.value = parseInt(e.target.id);
            // formData.name = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].name;
            // formData.description = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].description;
            // formData.categoryId = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].categoryId;
            // formData.merchantEndValidity = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].merchantEndValidity;
            // formData.merchantStartValidity = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].merchantStartValidity;
            // formData.merchantRelationship = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].merchantRelationship;
            // formData.userId = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].userId;
            // formData.website = merchants.value!.filter(merchants => merchants.id == selectedId.value)[0].website;
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
        formDataCreate.append('website',formData.website);
        formDataCreate.append('description',formData.description);
        formDataCreate.append('categoryId',formData.categoryId.toString());
        formDataCreate.append('proofOfAuthenticity',formData.proofOfAuthenticity!);
        formDataCreate.append('image',formData.image!);
        formDataCreate.append('userId', formData.userId.toString());
        formDataCreate.append('merchantRelationship',formData.merchantRelationship.toString());
        formDataCreate.append('merchantStartValidity',formData.merchantStartValidity!.toString());
        formDataCreate.append('merchantEndValidity',formData.merchantEndValidity!.toString());
        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/merchant`,{
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
        isLoading.value = true;
        let isError = false;
        const formDataCreate = new FormData();
        if (formData.name) {
            formDataCreate.append('name',formData.name);
        }
        if (formData.website) {
            formDataCreate.append('website',formData.website);
        }
        if (formData.description) {
            formDataCreate.append('description',formData.description);
        }
        if (formData.categoryId) {
            formDataCreate.append('categoryId',formData.categoryId.toString());
        }
        if (formData.proofOfAuthenticity) {
            formDataCreate.append('proofOfAuthenticity',formData.proofOfAuthenticity!);
        }
        if (formData.image) {
            formDataCreate.append('image',formData.image!);
        }
        if (formData.userId) {
            formDataCreate.append('userId', formData.userId.toString());
        }
        if (formData.merchantRelationship) {
            formDataCreate.append('merchantRelationship',formData.merchantRelationship.toString());
        }
        if (formData.merchantStartValidity) {
            formDataCreate.append('merchantStartValidity',formData.merchantStartValidity!.toString());
        }
        if (formData.merchantEndValidity) {
            formDataCreate.append('merchantEndValidity',formData.merchantEndValidity!.toString());
        }

        const token = useCookie('token');
        const data = await $fetch<{message:string}>(`${API}/merchant/${selectedId.value}`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
            body: formDataCreate
        }).catch(error => {
            alert(error.data.message);
            isError = true
            refresh();
            return;
        })
        if (!isError) {
            closeModal(new Event('click'));
            refresh();
        }
        refresh();
        isLoading.value = false;
    }
    async function Delete() {
        console.log(selectedId);
        const data= await $fetch<{message:string}>(`${API}/merchant/${selectedId.value}`,{
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
    onBeforeRouteLeave((to,from) => {
  if (pending) {
    controller.abort();
  }})
</script>
<template>
    <div class="bg-[#F8F9FD] w-[100vw] ">
        <div class="flex justify-start">
            <SideBar/>
            <div class="flex-1 shrink-0 h-[100svh] overflow-scroll relative flex ">
                    <div class="h-[80px]">
                        <div class=" bg-[#F8F9FD] w-[calc(100svw-400px)] p-4 text-center fixed">
                            <div class="bg-white rounded-3xl w-full p-4 text-center">
                                <h1 class="text-5xl font-black">merchants</h1>
                            </div>
                        </div>
                    <div class="bg-white rounded-3xl w-full p-4 h-full m-4 mt-8">
                        <!-- Add Modal -->
                        <div v-if="createModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                            <div class=" w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                                <div class="flex justify-end">
                                    <button @click="closeModal">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <p class="font-bold text-2xl">Create merchants</p>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">userId</label>
                                    <input v-model="formData.userId" id="name" type="number" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">name</label>
                                    <input v-model="formData.name" id="name" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">image</label>
                                    <input @click="(open1 as any)" id="name" type="file" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">description</label>
                                    <input v-model="formData.description" id="description" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">website</label>
                                    <input v-model="formData.website" id="description" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">category</label>
                                    <select class="h-12" v-model="formData.categoryId">
                                        <option disabled selected value> -- select an option -- </option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                                    </select>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">merchant relationship</label>
                                    <select class="h-12">
                                        <option disabled selected value> -- select an option -- </option>
                                        <option :value="MerchantRelation.MerchantOwner">Merchant Owner</option>
                                        <option :value="MerchantRelation.ExclusiveDistributor">Exclusive Distributor</option>
                                        <option :value="MerchantRelation.NonExclusiveDistributor">Non-Exclusive Distributor</option>
                                    </select>
                                </div> 
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">proof of authenticity</label>
                                    <input @click="(open2 as any)" id="name" type="file" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">Merchant Start Validity</label>
                                    <input v-model="formData.merchantStartValidity" type="date" name="" id="">
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">Merchant End Validity</label>
                                    <input v-model="formData.merchantEndValidity" type="date" name="" id="">
                                </div>
                                <div class="flex-1 basis-0 flex justify-center items-end mt-4">  
                                    <button @click="create" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Create merchants</button>
                                </div>
                                <p v-if="isLoading" class="text-center">Loading</p>
                            </div> 
                        </div>
                        <!-- Update Modal -->
                        <div v-if="editModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                            <div class=" w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                                <div class="flex justify-end">
                                    <button @click="closeModal">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <p class="font-bold text-2xl">Update merchant</p>
                                <p>Note: Some Fields are Intentially left blank in order to not edited</p>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">userId</label>
                                    <input v-model="formData.userId" id="name" type="number" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">name</label>
                                    <input v-model="formData.name" id="name" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">image</label>
                                    <input @click="(open1 as any)" id="name" type="file" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">description</label>
                                    <input v-model="formData.description" id="description" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">website</label>
                                    <input v-model="formData.website" id="description" type="text" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">category</label>
                                    <select class="h-12" v-model="formData.categoryId">
                                        <option disabled selected value> -- select an option -- </option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                                    </select>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">merchant relationship</label>
                                    <select class="h-12">
                                        <option disabled selected value> -- select an option -- </option>
                                        <option :value="MerchantRelation.MerchantOwner">Merchant Owner</option>
                                        <option :value="MerchantRelation.ExclusiveDistributor">Exclusive Distributor</option>
                                        <option :value="MerchantRelation.NonExclusiveDistributor">Non-Exclusive Distributor</option>
                                    </select>
                                </div> 
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">proof of authenticity</label>
                                    <input @click="(open2 as any)" id="name" type="file" name="name" class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">Merchant Start Validity</label>
                                    <input v-model="formData.merchantStartValidity" type="date" name="" id="">
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">Merchant End Validity</label>
                                    <input v-model="formData.merchantEndValidity" type="date" name="" id="">
                                </div>
                                <div class="flex-1 basis-0 flex justify-center items-end mt-4">  
                                    <button @click="update" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Update merchant</button>
                                </div>
                                <p v-if="isLoading" class="text-center">Loading</p>
                            </div> 
                        </div>
                        <!-- Add Delete -->
                        <div v-if="deleteModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                            <div class=" w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                                <div class="flex justify-end">
                                    <button @click="closeModal">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <p class="font-bold text-2xl">Delete merchants</p>
                                <p>Are you sure you want to Delete?</p>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">userId</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{merchants!.filter(merchants => merchants.id == selectedId)[0].userId }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">name</label>
                                    <p>{{merchants!.filter(merchants => merchants.id == selectedId)[0].name }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">Image</label>
                                    <div class="flex justify-center items-center">
                                        <img  class="h-[200px] object-cover" :src="merchants!.filter(merchants => merchants.id == selectedId)[0].image " alt="">
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">description</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{merchants!.filter(merchants => merchants.id == selectedId)[0].description }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">website</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{merchants!.filter(merchants => merchants.id == selectedId)[0].website }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">category</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{merchants!.filter(merchants => merchants.id == selectedId)[0].category.name }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">merchant relation</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{merchants!.filter(merchants => merchants.id == selectedId)[0].merchantRelationship }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">proof of authenticity</label>
                                    <NuxtLink :to="merchants!.filter(merchants => merchants.id == selectedId)[0].proofOfAuthenticity" class="font-bold text-blue-600">PDF LINK</NuxtLink> 
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">merchant start validity</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{useDateFormat(merchants!.filter(merchants => merchants.id == selectedId)[0].merchantStartValidity,"YYYY-MM-DD").value }}</p>
                                </div>
                                <div class="mt-4">
                                    <label class="block mb-1 font-bold text-lg" for="name">merchant end validity</label>
                                    <p class="w-full text-ellipsis whitespace-nowrap overflow-hidden">{{useDateFormat(merchants!.filter(merchants => merchants.id == selectedId)[0].merchantEndValidity,"YYYY-MM-DD").value }}</p>
                                </div> 
                                <div class="flex-1 basis-0 flex justify-center items-end">  
                                    <button @click="Delete" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Delete merchant</button>
                                </div>
                            </div> 
                        </div>
                        <div class="flex justify-between items-center mt-[81px]">
                            <div class="flex justify-start items-center">
                                <p class="font-bold p-4">Total of merchants: </p>
                                <div v-if="pending" class="h-5 rounded-md w-5 bg-gray-400 animate-pulse"></div>
                                <p v-else class="font-bold">{{ (merchants) ? merchants!.length : 0 }}</p>
                            </div>
                            <div>
                                <button @click="openModal" value="create" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Add merchants</button>
                            </div>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">userId</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">userEmail</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">image</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">description</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">category</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. products</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">merchantRelationship</th> 
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">proofOfAuthenticity</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">merchantStartValidity</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">merchantEndValidity</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" >
                                <tr class="animate-pulse" v-if="pending" v-for="i in Array.from({length:10})">
                                    <td class="px-6 py-4 whitespace-nowrap h-[81px]" v-for="i in Array.from({length:13})">
                                        <div class="h-[50%] rounded-md w-full bg-gray-400"></div>
                                    </td>
                                </tr>
                                <tr v-if="!pending"  v-for="merchant in merchants" :key="merchant.id">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.id}}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.userId }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.user.email }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img class="h-12 w-12" :src="merchant.image" alt="">
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.name }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p class="w-[300px] text-ellipsis whitespace-nowrap overflow-hidden">{{ merchant.description }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.category.name }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.products.length }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ merchant.merchantRelationship }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <NuxtLink :to="merchant.proofOfAuthenticity" class="text-blue-600 font-bold">Open PDF</NuxtLink>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ useDateFormat(merchant.merchantStartValidity,"YYYY-MM-DD").value }}</p>
                                    </td>                                    
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <p>{{ useDateFormat(merchant.merchantEndValidity,"YYYY-MM-DD").value }}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                        <button @click="openModal" value="edit" :id="merchant.id.toString()" type="button" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button @click="openModal" value="delete" :id="merchant.id.toString()" type="button" class="ml-2 text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- <SettingBar/> -->
        </div> 
    </div>
</template>