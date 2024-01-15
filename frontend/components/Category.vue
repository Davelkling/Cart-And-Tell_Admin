<script setup lang="ts">
import { defineProps, ref } from "vue";

const { category } = defineProps(["category"]);

const API = useRuntimeConfig().public.API;
const { data: merchants } = await useFetch<any>(`${API}/merchant`);
</script>

<template>
  <NuxtLink :to="`/merchants`">
    <div
      class="hover:text-[#2563EB] hover:bg-gray-100 p-1 pl-8 pr-4 transition duration-200 ease-in-out cursor-pointer"
    >
      {{ category.name }}
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Add your styles here if needed */
</style>
