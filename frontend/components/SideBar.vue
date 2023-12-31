<script setup lang="ts">
function logout() {
  const token = useCookie("token");
  token.value = "";
  const userObj = useUserObj();
  userObj.value.loggedIn = false;
  navigateTo("/login");
}
</script>
<template>
  <div class="w-[400px] bg-[#5B8ED8] overflow-hidden shrink-0">
    <NuxtLink to="/" class="text-[#282F7A] mb-4">
      <div
        class="flex flex-col justify-start items-center p-4 bg-white rounded-b-2xl"
      >
        <div class="flex flex-col justify-start">
          <h1 class="text-4xl font-medium text-[#282E78] text-center">
            <span class="font-black">Cart</span> & Tell
          </h1>
          <h2 class="text-2xl text-[#282E78]">ECOMMERCE SOLUTIONS</h2>
        </div>
        <h1 class="font-bold text-2xl text-[#2563EB]">Admin</h1>
      </div>
    </NuxtLink>
    <div class="h-full text-white">
      <NuxtLink to="/">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >home</span
          >
          <h2 class="font-bold text-2xl">Overview</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/categories">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >category</span
          >
          <h2 class="font-bold text-2xl">Categories</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/users">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >person</span
          >
          <h2 class="font-bold text-2xl">Users</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/merchants">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >point_of_sale</span
          >
          <h2 class="font-bold text-2xl">Merchants</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="products">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >inventory_2</span
          >
          <h2 class="font-bold text-2xl">Products</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="unverifiedMerchants">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >person_apron</span
          >
          <h2 class="font-bold text-2xl">Pending Merchant</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="verifiedMerchants">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >person_check</span
          >
          <h2 class="font-bold text-2xl">Verified Merchants</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="archives">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >delete</span
          >
          <h2 class="font-bold text-2xl">Archives</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="websiteSettings">
        <div
          class="flex justify-start items-start gap-4 py-5 px-12 absolute bottom-16"
        >
          <span class="material-symbols-outlined font-black text-3xl"
            >globe</span
          >
          <h2 class="font-bold text-2xl">Website Settings</h2>
        </div>
      </NuxtLink>
      <button @click="logout" class="button">
        <div
          class="flex justify-start items-start gap-4 py-5 px-12 absolute bottom-0"
        >
          <span class="material-symbols-outlined font-black text-3xl"
            >logout</span
          >
          <h2 class="font-bold text-2xl">Logout</h2>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped type="postcss">
.router-link-active > div.flex.justify-start.items-start {
  @apply bg-[#79A3DF];
}
</style>
