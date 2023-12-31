<script setup>
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
</script>

<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <WebsiteSettingsSideBar />
      <div
        class="p-4 w-full min-h-[100svh] overflow-x-scroll overflow-y-hidden"
      >
        <div class="bg-white rounded-3xl w-full p-4 text-center">
          <h1 class="text-5xl font-black">Bank Details</h1>
        </div>
        <div class="bg-white rounded-3xl w-full p-4 text-center h-full mt-4">
          <div class="flex justify-between items-center w-full p-4">
            <img src="/ocbc.png" alt="" class="h-12" placeholder="ocbc logo" />
          </div>
          <p>Referred to: <NuxtLink></NuxtLink></p>
        </div>
      </div>
      <!-- <SettingBar/> -->
    </div>
  </div>
</template>

<style scoped></style>
