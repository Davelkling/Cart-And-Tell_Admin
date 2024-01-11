<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
const controller = new AbortController();
const signal = controller.signal;
const {
  data: transactions,
  refresh,
  pending,
} = await useFetch<
  [
    {
      id:number;
      merchantId:number;
      bankReferenceNo:string;
      status:string;
      merchant:{
        id:number;
        name:string;
        image:string;
      }
    }
  ]
>(`${API}/ocbc-bankDetails/merchantRegistrationTransaction`, {
  signal,
  lazy: true,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const confirmLoading = ref(false);
const rejectLoading = ref(false);
onBeforeRouteLeave((to, from) => {
  if (pending) {
    controller.abort();
  }
});
async function confirm(e:Event) {
  confirmLoading.value = true;
  const id = (e.target as HTMLElement).id;
  const response = await fetch(`${API}/ocbc-bankDetails/confirmMerchantPayment/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  if (response.ok) {
    refresh();
  }
  confirmLoading.value = false;
}
async function reject(e:Event) {
  rejectLoading.value = true;
  const id = (e.target as HTMLElement).id;
  const response = await fetch(`${API}/ocbc-bankDetails/rejectMerchantPayment/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  if (response.ok) {
    refresh();
  }
  rejectLoading.value = false;
}
</script>
<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <SideBar />
      <div class="p-4 w-full h-[100svh] overflow-x-scroll relative">
        <div class="bg-white rounded-3xl w-full p-4 text-center">
          <h1 class="text-5xl font-black">Merchant Registration Fee Transactions</h1>
        </div>
        <div class="bg-white rounded-3xl w-full p-4 h-full mt-4">
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center">
              <p class="font-bold p-4">Total of transactions:</p>
              <div
                v-if="pending"
                class="h-5 rounded-md w-5 bg-gray-400 animate-pulse"
              ></div>
              <p v-else class="font-bold">
                {{ transactions ? transactions!.length : 0 }}
              </p>
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
                  name
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
                  bankReferenceNo
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200"
              v-for="transaction in transactions"
              :key="transaction.id"
            >
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
              <tr v-else>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ transaction.id }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ transaction.merchant.name }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <img class="h-12 w-12" :src="transaction.merchant.image" alt="" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ transaction.bankReferenceNo }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p>{{ transaction.status }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">

                  <button v-if="!confirmLoading" @click="confirm" value="confirm" :id="transaction.merchant.id.toString()" type="button" class="text-blue-600 hover:text-red-900 px-4 py-2 border-2 rounded-full">Confirm</button>
                  <button v-else value="confirm" :id="transaction.merchant.id.toString()" type="button" class="text-blue-600 hover:text-red-900 px-4 py-2 border-2 rounded-full">
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-3 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                    Confirm
                  </button>

                  <button v-if="!rejectLoading" @click="reject" value="reject" :id="transaction.merchant.id.toString()" type="button" class="text-red-600 hover:text-blue-900 px-4 py-2 border-2 rounded-full">Reject</button>
                  <button v-else value="reject" :id="transaction.merchant.id.toString()" type="button" class="text-red-600 hover:text-blue-900 px-4 py-2 border-2 rounded-full">
                    <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-3 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                    </svg>
                    Reject
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
