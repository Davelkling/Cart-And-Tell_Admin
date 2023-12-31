<script setup>
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
const { data: users, pending: pending1 } = await useFetch(`${API}/user`, {
  lazy: true,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const { data: categories, pending: pending2 } = await useFetch(
  `${API}/category`,
  {
    lazy: true,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);
const { data: merchants, pending: pending3 } = await useFetch(
  `${API}/merchant`,
  {
    lazy: true,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);
const { data: products, pending: pending4 } = await useFetch(
  `${API}/products`,
  {
    lazy: true,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);
</script>

<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <SideBar />
      <div
        class="p-4 w-full min-h-[100svh] overflow-x-scroll overflow-y-hidden"
      >
        <div class="bg-white rounded-3xl w-full p-4 text-center">
          <h1 class="text-5xl font-black">Overview</h1>
        </div>
        <div class="bg-white rounded-3xl w-full p-4 text-center h-full mt-4">
          <div
            v-if="pending1 && pending2 && pending3 && pending4"
            class="flex justify-between items-center w-full bg-gray-400 h-[100px] rounded-md animate-pulse"
          ></div>
          <div class="flex justify-between items-center w-full" v-else>
            <div
              class="flex flex-col justify-center items-center shadow-sm p-4 rounded-md w-full"
            >
              <h1 class="text-2xl font-bold">Total Users</h1>
              <h2 class="text-2xl font-bold">{{ [...users].length }}</h2>
            </div>
            <div
              class="flex flex-col justify-center items-center shadow-sm p-4 rounded-md w-full"
            >
              <h1 class="text-2xl font-bold">Total Categories</h1>
              <h2 class="text-2xl font-bold">{{ [...categories].length }}</h2>
            </div>
            <div
              class="flex flex-col justify-center items-center shadow-sm p-4 rounded-md w-full"
            >
              <h1 class="text-2xl font-bold">Total Merchants</h1>
              <h2 class="text-2xl font-bold">{{ [...merchants].length }}</h2>
            </div>
            <div
              class="flex flex-col justify-center items-center shadow-sm p-4 rounded-md w-full"
            >
              <h1 class="text-2xl font-bold">Total Products</h1>
              <h2 class="text-2xl font-bold">{{ [...products].length }}</h2>
            </div>
          </div>
        </div>
      </div>
      <!-- <SettingBar/> -->
    </div>
  </div>
</template>

<style scoped></style>
