<script setup lang="ts">
const API = useRuntimeConfig().public.API;
    import { useDateFormat} from '@vueuse/core';
    enum MerchantRelation {
        MerchantOwner = "MerchantOwner",
        ExclusiveDistributor = "ExclusiveDistributor",
        NonExclusiveDistributor = "NonExclusiveDistributor"
    }
    const token = useCookie('token');
    const {data:merchants,refresh} = await useFetch<[{
[x: string]: any;
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
        merchant:{
            id:number,
            name:string,
            isMerchant:boolean,
        },
        merchantId:number,
        products:[any]
    }]>(`${API}/merchant?status=Removed`,{
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    });
    const isLoading = ref(false);
    const selectedId = ref(NaN);
    const deleteModal = ref(false);
    function closeModal(e:Event) {
        e.stopPropagation();
        deleteModal.value = false;
        refresh();
    }
    function openModal(e:any) {
        if (e.target!.value === "delete") {
            deleteModal.value = true;
            selectedId.value = e.target!.id;
        }
    }
    async function Delete() {
        isLoading.value = true;
        let isError = false;
        const token = useCookie('token');
        const formData = new FormData();
        formData.append('isVerified', 'false');
        const data = await $fetch<{message:string}>(`${API}/merchant/${selectedId.value}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
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
</script>
<template>
    <div class="bg-[#F8F9FD]">
        <div class="flex justify-between">
            <ArchivesSideBar/>
            <div class="p-4 w-full h-[100svh] overflow-x-scroll relative">
                <div class="bg-white rounded-3xl w-full p-4 text-center">
                    <h1 class="text-5xl font-black">Archived Merchants</h1>
                </div>
                <div class="bg-white rounded-3xl w-full p-4 h-full mt-4">
                    <!-- Add Modal -->
                    <div v-if="deleteModal" class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center">
                        <div class="w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col" @click="">
                            <div class="flex justify-end">
                                <button @click="closeModal">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p class="font-bold text-2xl text-center">Delete Merchant</p>
                            <p>This will Delete Merchant Permanently</p>
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
                            <div class="flex-1 basis-0 flex justify-center items-end mt-4">  
                                <button @click="Delete" value="delete" type="button" class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition">Confirm</button>
                            </div>
                            <p v-if="isLoading" class="text-center">Loading</p>
                        </div> 
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start items-center">
                            <p class="font-bold p-4">Total of merchants: </p>
                            <p class="font-bold">{{ (merchants!.length) ? merchants!.length : 0 }}</p>
                        </div>
                    </div>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">image</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">merchantRelationship</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">proofOfAuthenticity</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">startValidity</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">endValidity</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">isVerified</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" v-for="merchant in merchants" :key="merchant.id">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ merchant.id}}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ merchant.name }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <img class="h-12 w-12" :src="merchant.image" alt="">
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
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <p>{{ merchant.isVerified }}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                    <button @click="openModal" value="delete" :id="merchant.id.toString()" type="button" class="text-red-600 hover:text-indigo-900 px-4 py-2 border-2 rounded-full">Delete</button>
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