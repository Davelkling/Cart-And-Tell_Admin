<script setup lang="ts">
const getBgClass = (type: string) => {
  return useRoute().query.type === type ? "bg-active" : "";
};
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
          <h2 class="text-2xl text-[#494949]">ECOMMERCE SOLUTIONS</h2>
        </div>
        <h1 class="font-bold text-2xl text-[#2563EB]">Admin</h1>
      </div>
    </NuxtLink>
    <div class="h-full text-white">
      <div class="flex justify-center items-center px-5 relative">
        <NuxtLink to="/" class="absolute left-8">
          <div class="h-12 w-12 flex justify-center items-center">
            <span class="material-symbols-outlined font-black text-3xl"
              >west</span
            >
          </div>
        </NuxtLink>
        <div class="p-4 flex justify-center items-center flex-col">
          <span class="material-symbols-outlined font-black text-7xl"
            >globe</span
          >
          <h1 class="font-bold">Website Setting</h1>
        </div>
      </div>
      <NuxtLink to="/websiteSettings">
        <div class="link flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >home</span
          >
          <h2 class="font-bold text-2xl">Overview</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/websiteSettings/bankDetails">
        <div class="flex justify-start items-start gap-4 py-5 px-12">
          <span class="material-symbols-outlined font-black text-3xl"
            >account_balance</span
          >
          <h2 class="font-bold text-2xl">Bank Details</h2>
        </div>
      </NuxtLink>
      <div class="px-12">
        <p class="font-black text-center text-2xl py-4">Website CMS</p>
      </div>
      <NuxtLink to="/websiteSettings/editor?type=AboutUs">
        <div
          :class="getBgClass('AboutUs')"
          class="flex justify-start items-start gap-4 py-5 px-12"
        >
          <h2 class="px-12 font-bold text-2xl">About Us</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/websiteSettings/editor?type=ContactUs">
        <div
          :class="getBgClass('ContactUs')"
          class="flex justify-start items-start gap-4 py-5 px-12"
        >
          <h2 class="px-12 font-bold text-2xl">Contact Us</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/websiteSettings/editor?type=Policy">
        <div
          :class="getBgClass('Policy')"
          class="flex justify-start items-start gap-4 py-5 px-12"
        >
          <h2 class="px-12 font-bold text-2xl">Policy</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/websiteSettings/editor?type=Certifications">
        <div
          :class="getBgClass('Certifications')"
          class="flex justify-start items-start gap-4 py-5 px-12"
        >
          <h2 class="px-12 font-bold text-2xl">Certifications</h2>
        </div>
      </NuxtLink>
      <NuxtLink to="/websiteSettings/editor?type=Ratings">
        <div
          :class="getBgClass('Ratings')"
          class="ratings flex justify-start items-start gap-4 py-5 px-12"
        >
          <h2 class="px-12 font-bold text-2xl">Ratings</h2>
        </div>
      </NuxtLink>
      <button @click="logout" class="button">
        <div
          class="flex justify-start items-start gap-4 py-5 px-12 fixed bottom-0"
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
.router-link-active > div.link.flex.justify-start.items-start {
  @apply bg-[#79A3DF];
}
.bg-active {
  background-color: #79a3df;
}
</style>
