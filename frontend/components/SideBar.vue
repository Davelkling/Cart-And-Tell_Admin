<script setup lang="ts">

    const categoriesList = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Books & Literature',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Health & Wellness',
    'Jewelry',
    'Food & Grocery',
    'Music & Instruments',
    'Pets',
    'Art & Collectibles',
    'Office & School Supplies',
    'Travel & Luggage',
    ];

    const categories = ref(
        categoriesList.map((name, index) => ({
            id: index + 1,
            name,
            value: '',
        }))
    );
    const isShowDropDown = ref(true);

    const handleToggleDropDown = () => {
        isShowDropDown.value = !isShowDropDown.value;
    };

    
</script>

<template>
    <div class="bg-white h-screen shadow-2xl shadow-blue-500/20">
        <NuxtLink to="/" class="text-[#282F7A] mb-4">
        <div class="flex flex-col justify-center items-center p-4">
            <h1 class="font-bold text-4xl text-[#282F7A]">Cart & Tell</h1>
            <h1 class="font-bold text-2xl text-[#2563EB]">Admin</h1>
        </div>
        </NuxtLink>

        <div class="relative">
            <div
            class="p-3 pl-4 h-8 w-full flex items-center hover:text-[#2563EB] cursor-pointer"
            @click="handleToggleDropDown"
            :class="{'bg-[#2563EB] text-white hover:text-white': !isShowDropDown}"
            >
            <span class="material-symbols-outlined mr-2 transition duration-400 ease-in-out text-3xl">local_shipping</span>
            <span class="font-semibold">Categories</span>
                <div class="absolute top-[2px] right-2 transition-transform duration-350 rotate-0" :class="{ 'rotate-180': isShowDropDown }">
                    <span class="material-symbols-outlined h-6 w-6">stat_1</span>
                </div>
            </div>

            <div class="overflow-hidden gap-4" :class="{ 'max-h-0': isShowDropDown, 'max-h-full': !isShowDropDown }">
                <div class="text-gray-500" v-for="(categoryItem, index) in categories" :key="index">
                    <Category :category="categoryItem" />
                </div>
            </div>
        </div>

        
    </div>

</template>

<style scoped>

</style>
