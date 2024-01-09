<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
const { data, error, status, refresh } = await useFetch<{
  uen: string;
  mobileNumber: string;
  accountId: string;
}>(`${API}/ocbc-bankDetails`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const loading = ref(false);
const configured = ref(false);
const edit = ref(false);
const errors = ref([]);
if (!error.value) {
  configured.value = true;
}
const form = reactive({
  uen: "",
  mobileNumber: "",
  accountId: "",
});
async function buttonHandler() {
  errors.value = [];
  if (loading.value) {
    return;
  }
  loading.value = true;
  if (configured.value) {
    await updateBankDetails();
  } else {
    await createBankDetails();
  }
  loading.value = false;
}
async function createBankDetails() {
  const data = await $fetch(`${API}/ocbc-bankDetails`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    method: "POST",
    body: JSON.stringify(form),
  }).catch((err) => {
    if (err.data) {
      errors.value = err.data.message;
    } else {
      alert(err);
    }
  });
  if (data) {
    alert("Changes Applied");
    refresh();
    configured.value = true;
  }
}
async function updateBankDetails() {
  const updateForm: { [key: string]: any } = {};
  if (form.uen) {
    updateForm.uen = form.uen;
  }
  if (form.mobileNumber) {
    updateForm.mobileNumber;
  }
  if (form.accountId) {
    updateForm.accountId = form.accountId;
  }
  const data = await $fetch(`${API}/ocbc-bankDetails`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    method: "PATCH",
    body: JSON.stringify(updateForm),
  }).catch((err) => {
    if (err.data) {
      errors.value = err.data.message;
    } else {
      alert(err);
    }
  });
  if (data) {
    edit.value = false;
    alert("Changes Applied");
  }
}
function editMode() {
  edit.value = true;
  form.accountId = data.value!.accountId;
  form.mobileNumber = data.value!.mobileNumber;
  form.uen = data.value!.uen;
}
</script>

<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <WebsiteSettingsSideBar />
      <div
        class="p-4 w-full min-h-[100svh] overflow-x-scroll overflow-y-hidden"
      >
        <div class="h-full">
          <div class="bg-white rounded-3xl w-full p-4 text-center">
            <h1 class="text-5xl font-black">Bank Details</h1>
          </div>
          <div class="bg-white rounded-3xl w-full p-4 text-center h-full mt-4">
            <div class="flex justify-between items-center w-full p-4">
              <img
                src="/ocbc.png"
                alt=""
                class="h-12"
                placeholder="ocbc logo"
              />
              <p class="font-bold text-3xl">Bank Details</p>
            </div>
            <div v-if="!configured || edit">
              <div
                class="relative z-10 flex flex-col flex-1 px-4 py-10 bg-white lg:py-24 md:flex-none md:px-28 sm:justify-center"
              >
                <div
                  class="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4"
                >
                  <div class="flex flex-col">
                    <div>
                      <h2 class="text-4xl text-black">Let's get started!</h2>
                      <p class="mt-2 text-sm text-gray-500">
                        Complete the details below so your company can receive
                        payments from your merchants registration.
                      </p>
                    </div>
                  </div>
                  <form>
                    <div class="mt-4 space-y-4">
                      <p class="font-bold text-2xl">PayNow Requirements</p>
                      <p class="p-0 m-0">
                        API Referred to:
                        <NuxtLink
                          class="text-blue-500"
                          to="https://api.ocbc.com/store/OCBC/apis/overview?title=Corporate%20PayNow%20Payment&name=Corporate_PayNowPayment&type=Transactional"
                          >Corporate PayNow API</NuxtLink
                        >
                      </p>
                      <div>
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="uen"
                        >
                          Unique Entity Number (UEN)
                        </label>
                        <input
                          v-model="form.uen"
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="UEN"
                        />
                      </div>
                      <div class="col-span-full">
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="email"
                        >
                          Mobile Number
                        </label>
                        <input
                          v-model="form.mobileNumber"
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="mobile number associated with PayNow ex. +659xxxxxxx"
                          autocomplete="off"
                          type="text"
                        />
                        <p class="my-2 text-sm text-gray-500">
                          Note: Please make sure that the UEN is already
                          registered in PayNow services in OCBC, since the API
                          store doesn't have a way for checking if your bank is
                          already registered, the current implementation will
                          use your mobile number for verification
                        </p>
                      </div>
                      <p class="font-bold text-2xl">
                        For Bank Transaction History
                      </p>
                      <p class="p-0 m-0">
                        API Referred to:
                        <NuxtLink
                          class="text-blue-500"
                          to="https://api.ocbc.com/store/OCBC/apis/overview?title=Corporate%20Transaction%20History&name=Transactional_TransactionHistory&type=Transactional"
                          >Corporate Transaction History</NuxtLink
                        >
                      </p>
                      <div class="col-span-full">
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="company"
                        >
                          Account Id
                        </label>
                        <input
                          v-model="form.accountId"
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="Company Bank Account Id"
                        />
                      </div>
                      <div class="col-span-full">
                        <button
                          v-if="!loading"
                          @click="buttonHandler"
                          type="button"
                          class="w-full max-w-[1216px] mx-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white hover:bg-white hover:text-black active:bg-[#5B8ED8] active:text-[#5B8ED8]"
                        >
                          Apply Changes
                        </button>
                        <button
                          v-else
                          type="button"
                          class="w-full max-w-[1216px] mx-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white"
                        >
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
                          Loading...
                        </button>
                        <button
                          v-if="edit"
                          @click="edit = false"
                          type="button"
                          class="w-full max-w-[1216px] mx-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white hover:bg-white hover:text-black active:bg-[#5B8ED8] active:text-[#5B8ED8]"
                        >
                          Cancel Changes
                        </button>
                        <div v-for="error in errors">
                          <p class="text-red-500 my-2">{{ error }}</p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div v-else class="text-center bg-white rounded-md h-full my-4">
              <!-- component -->
              <div class="flex items-center justify-center">
                <div
                  class="w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg"
                >
                  <div class="max-w-md mx-auto space-y-6">
                    <form action="">
                      <h2 class="text-2xl font-bold">
                        Cart And Tell Bank Details Info
                      </h2>
                      <p class="my-4 opacity-70">
                        You can change the bank details info if there is issues
                        in the Authorization API
                      </p>
                      <hr class="my-6" />
                      <div class="mb-4">
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="company"
                        >
                          Unique Entity Number (UEN)
                        </label>
                        <p
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        >
                          {{ data!.uen }}
                        </p>
                      </div>
                      <div class="mb-4">
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="company"
                        >
                          Mobile Number
                        </label>
                        <p
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        >
                          {{ data!.mobileNumber }}
                        </p>
                      </div>
                      <div class="mb-4">
                        <label
                          class="block mb-3 text-sm font-medium text-gray-600"
                          name="company"
                        >
                          Account Id
                        </label>
                        <p
                          class="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        >
                          {{ data!.accountId }}
                        </p>
                      </div>
                      <div class="col-span-full">
                        <button
                          @click="editMode"
                          type="button"
                          class="w-full max-w-[1216px] mx-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white hover:bg-white hover:text-black active:bg-[#5B8ED8] active:text-[#5B8ED8]"
                        >
                          Edit
                        </button>
                        <div v-for="error in errors">
                          <p class="text-red-500 my-2">{{ error }}</p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <SettingBar/> -->
    </div>
  </div>
</template>

<style scoped></style>
