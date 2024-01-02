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
          <h1 class="text-5xl font-black">Website CMS</h1>
        </div>
        <div
          class="bg-white rounded-3xl w-full p-4 text-center h-full mt-4 flex flex-col"
        >
          <p class="font-bold text-3xl p-4">Website Home - WIP</p>
        </div>
      </div>
      <!-- <SettingBar/> -->
    </div>
  </div>
</template>

<style scoped></style>
