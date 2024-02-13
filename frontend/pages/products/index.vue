<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
const controller = new AbortController();
const signal = controller.signal;
const {
  data: products,
  refresh,
  pending,
} = await useFetch<
  [
    {
      [x: string]: any;
      id: number;
      name: string;
      image: string;
      merchantId: number;
      amount: number;
    }
  ]
>(`${API}/products`, {
  signal,
  lazy: true,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
import { useFileDialog } from "@vueuse/core";
const formData = reactive<{
  name: string;
  image: File | null;
  merchantId: number;
  description: string;
  amount: number;
}>({
  name: "",
  image: null,
  merchantId: NaN,
  description: "",
  amount: NaN,
});
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*", // Set to accept only image files
});

onChange((files) => {
  formData.image = files![0];
});
const isLoading = ref(false);
const selectedId = ref(NaN);
const selectedMerchantId = ref(NaN);
const createModal = ref(false);
const editModal = ref(false);
const deleteModal = ref(false);
function closeModal(e: Event) {
  e.stopPropagation();
  createModal.value = false;
  editModal.value = false;
  deleteModal.value = false;
  formData.image = null;
  formData.name = "";
  formData.description = "";
  formData.merchantId = NaN;
  formData.amount = NaN;
  selectedId.value = NaN;
}
function openModal(e: any) {
  if (e.target!.value === "create") {
    createModal.value = true;
  } else if (e.target!.value === "edit") {
    editModal.value = true;
    selectedId.value = parseInt(e.target.id);
    selectedMerchantId.value = parseInt(e.target.getAttribute("merchantid"));
  } else if (e.target!.value === "delete") {
    deleteModal.value = true;
    selectedId.value = parseInt(e.target.id);
    selectedMerchantId.value = parseInt(e.target.getAttribute("merchantid"));
  }
}
async function create() {
  isLoading.value = true;
  let isError = false;
  const formDataCreate = new FormData();
  formDataCreate.append("name", formData.name);
  formDataCreate.append("image", formData.image!);
  // formDataCreate.append('merchantId',formData.merchantId.toString());
  formDataCreate.append("description", formData.description);
  formDataCreate.append("amount", formData.amount.toString());

  const token = useCookie("token");
  const data = await $fetch<{ message: string }>(
    `${API}/merchant/${formData.merchantId}/products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formDataCreate,
    }
  ).catch((error) => {
    alert(error.data.message);
    isError = true;
    return;
  });
  if (!isError) {
    refresh();
    closeModal(new Event("click"));
  }
  isLoading.value = false;
}
async function update() {
  isLoading.value = true;
  let isError = false;
  const formDataCreate = new FormData();
  if (formData.name) {
    formDataCreate.append("name", formData.name);
  }
  if (formData.image) {
    formDataCreate.append("image", formData.image!);
  }
  if (formData.description) {
    formDataCreate.append("description", formData.description);
  }
  if (formData.amount) {
    formDataCreate.append("amount", formData.amount.toString());
  }

  const token = useCookie("token");
  const data = await $fetch<{ message: string }>(
    `${API}/merchant/${selectedMerchantId.value}/products/${selectedId.value}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formDataCreate,
    }
  ).catch((error) => {
    alert(error.data.message);
    isError = true;
    return;
  });
  if (!isError) {
    refresh();
    closeModal(new Event("click"));
  }
  isLoading.value = false;
}
async function Delete() {
  const data = await $fetch<{ message: string }>(
    `${API}/merchant/${selectedMerchantId.value}/products/${selectedId.value}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  ).catch((error) => {
    alert(error.data.message);
  });
  if (data) {
    refresh();
    closeModal(new Event("click"));
  }
}
onBeforeRouteLeave((to, from) => {
  if (pending) {
    controller.abort();
  }
});

const searchTerm = ref("");
const filteredProducts = computed(() => {
  return products!.value!.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>
<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <SideBar />
      <div class="p-4 w-full h-[100svh] overflow-x-scroll relative">
        <div class="bg-white rounded-3xl w-full p-4 text-center">
          <h1 class="text-5xl font-black">products</h1>
        </div>
        <div class="bg-white rounded-3xl w-full p-4 h-full mt-4">
          <!-- Add Modal -->
          <div
            v-if="createModal"
            class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center"
          >
            <div
              class="w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col"
              @click=""
            >
              <div class="flex justify-end">
                <button @click="closeModal">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <p class="font-bold text-2xl">Create product</p>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >MerchantId</label
                >
                <input
                  v-model="formData.merchantId"
                  id="name"
                  type="number"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Name</label
                >
                <input
                  v-model="formData.name"
                  id="name"
                  type="text"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Description</label
                >
                <textarea
                  v-model="formData.description"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                ></textarea>
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Amount</label
                >
                <input
                  v-model="formData.amount"
                  id="name"
                  type="number"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="w-full h-full items-center bg-grey-lighter mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Image</label
                >
                <input
                  @click="
                    {
                      open() as any;
                    }
                  "
                  type="file"
                  class=""
                />
              </div>
              <div class="flex-1 basis-0 flex justify-center items-end mt-4">
                <button
                  @click="create"
                  value="create"
                  type="button"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                >
                  Create product
                </button>
              </div>
              <p v-if="isLoading" class="text-center">Loading</p>
            </div>
          </div>
          <!-- Update Modal -->
          <div
            v-if="editModal"
            class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center"
          >
            <div
              class="w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col"
              @click=""
            >
              <div class="flex justify-end">
                <button @click="closeModal">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <p class="font-bold text-2xl">Update product</p>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >MerchantId</label
                >
                <input
                  v-model="formData.merchantId"
                  id="name"
                  type="number"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Name</label
                >
                <input
                  v-model="formData.name"
                  id="name"
                  type="text"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Description</label
                >
                <textarea
                  v-model="formData.description"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                ></textarea>
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Amount</label
                >
                <input
                  v-model="formData.amount"
                  id="name"
                  type="number"
                  name="name"
                  class="py-2 px-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
                />
              </div>
              <div class="w-full h-full items-center bg-grey-lighter mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Image</label
                >
                <input
                  @click="
                    {
                      open() as any;
                    }
                  "
                  type="file"
                  class=""
                />
              </div>
              <div class="flex-1 basis-0 flex justify-center items-end mt-4">
                <button
                  @click="update"
                  value="create"
                  type="button"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                >
                  Update product
                </button>
              </div>
              <p v-if="isLoading" class="text-center">Loading</p>
            </div>
          </div>
          <!-- Add Delete -->
          <div
            v-if="deleteModal"
            class="absolute h-full w-full bg-transparent flex left-0 p-6 justify-center items-center"
          >
            <div
              class="h-[500px] w-[500px] bg-white rounded-lg shadow-md p-4 z-4 flex flex-col"
              @click=""
            >
              <div class="flex justify-end">
                <button @click="closeModal">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <p class="font-bold text-2xl">Delete product</p>
              <p>Are you sure you want to Delete?</p>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Name</label
                >
                <p>
                  {{
                    products!.filter((product) => product.id == selectedId)[0]
                      .name
                  }}
                </p>
              </div>
              <div class="mt-4">
                <label class="block mb-1 font-bold text-lg" for="name"
                  >Image</label
                >
                <div class="flex justify-center items-center">
                  <img
                    class="h-[200px] object-cover"
                    :src="products!.filter(product => product.id == selectedId)[0].image"
                    alt=""
                  />
                </div>
              </div>
              <div class="flex-1 basis-0 flex justify-center items-end">
                <button
                  @click="Delete"
                  value="create"
                  type="button"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                >
                  Delete product
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center gap-4">
            <div class="flex justify-start items-center shrink-0">
              <p class="font-bold p-4">Total of products:</p>
              <div
                v-if="pending"
                class="h-5 rounded-md w-5 bg-gray-400 animate-pulse"
              ></div>
              <p v-else class="font-bold">
                {{ products ? products!.length : 0 }}
              </p>
            </div>
            <input
              v-model="searchTerm"
              type="text"
              class="w-full border-2 rounded-md h-[42px] px-4 border-gray-500"
              placeholder="Search by Name"
            />
            <div class="shrink-0">
              <button
                @click="openModal"
                value="create"
                type="button"
                class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
              >
                Add product
              </button>
            </div>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Id
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  merchantId
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  image
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  amount
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                class="animate-pulse"
                v-if="pending"
                v-for="i in Array.from({ length: 10 })"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap h-[81px]"
                  v-for="i in Array.from({ length: 7 })"
                >
                  <div class="h-[50%] rounded-md w-full bg-gray-400"></div>
                </td>
              </tr>
              <tr
                v-else
                v-for="product in searchTerm ? filteredProducts : products"
                :key="product.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ product.id }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ product.merchantId }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p
                    class="w-[250px] overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {{ product.name }}
                  </p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p v-if="!product.image">no image</p>
                  <img v-else class="h-10 w-10" :src="product.image" alt="" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p
                    class="w-[250px] overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {{ product.description }}
                  </p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ product.amount }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openModal"
                    value="edit"
                    :merchantId="product.merchantId.toString()"
                    :id="product.id.toString()"
                    type="button"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="openModal"
                    value="delete"
                    :merchantId="product.merchantId.toString()"
                    :id="product.id.toString()"
                    type="button"
                    class="ml-2 text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
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
