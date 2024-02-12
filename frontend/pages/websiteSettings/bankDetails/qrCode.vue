<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const token = useCookie("token");
const { data, error, status, refresh } = await useFetch<
  [
    {
      id: number;
      qrName: string;
      qrCodeImage: string;
    }
  ]
>(`${API}/cartntell-qrs?status=Active`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const previewImage = ref<string>("");
const form = reactive<{ qrCodeImage: null | File; qrName: string }>({
  qrCodeImage: null,
  qrName: "",
});
const loading = ref(false);
const relativeLoading = ref(-1);
const createQr = ref(false);

let dropZoneRef = ref<HTMLDivElement>();
const { open, reset, onChange } = useFileDialog({ accept: "image/*" });
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files: File[] | null) {
    reset();
    alert("hello world");
    form.qrCodeImage = files![0];
    previewImage.value = URL.createObjectURL(form.qrCodeImage);
  },
  // specify the types of data to be received.
  dataTypes: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
});
onChange((files) => {
  form.qrCodeImage = files![0];
  previewImage.value = URL.createObjectURL(form.qrCodeImage);
});

async function uploadQR() {
  loading.value = true;
  if (form.qrCodeImage && form.qrName) {
    const formData = new FormData();
    formData.append("file", form.qrCodeImage as File);
    formData.append("qrName", form.qrName);
    const response = await $fetch(`${API}/cartntell-qrs/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    }).catch((error) => {
      alert(error.message);
    });
    if (response) {
      refresh();
      (form.qrCodeImage = null), (form.qrName = ""), (createQr.value = false);
    }
  } else {
    alert("qrName or qrCodeImage must be provided");
  }
  loading.value = false;
}
async function deleteQR(e: Event) {
  loading.value = true;
  const target = e.target as HTMLElement;
  const { id } = target;
  relativeLoading.value = parseInt(id);
  const formData = new FormData();
  formData.append("status", "Inactive");
  if (confirm("Are you sure you want to delete this QR?")) {
    await $fetch(`${API}/cartntell-qrs/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    }).catch((error) => {
      alert(error.message);
    });
    refresh();
  } else {
  }
  loading.value = false;
  relativeLoading.value = -1;
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
            <div>
              <nav>
                <div class="flex flex-col sm:flex-row font-bold">
                  <NuxtLink
                    to="/websiteSettings/bankDetails"
                    class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
                  >
                    Bank Details
                  </NuxtLink>
                  <NuxtLink
                    to="/websiteSettings/bankDetails/qrCode"
                    class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
                  >
                    Bank QR Codes
                  </NuxtLink>
                </div>
              </nav>
            </div>
            <div class="flex justify-between items-center w-full p-4">
              <img
                src="/qrImage.jpg"
                alt=""
                class="h-12"
                placeholder="ocbc logo"
              />
              <p class="font-bold text-3xl">Bank Qr Codes</p>
            </div>
            <div>
              <div class="flex justify-center items-center gap-4 py-4 flex-col">
                <div v-for="qr in data" :key="qr.id">
                  <img :src="qr.qrCodeImage" class="h-[400px]" alt="" />
                  <p class="font-bold text-3xl">{{ qr.qrName }}</p>
                  <button
                    v-if="!loading && relativeLoading != qr.id"
                    :id="qr.id.toString()"
                    class="border-2 px-4 py-2 my-3 bg-red-500 rounded-md text-white font-bold border-red-500"
                    @click="deleteQR"
                  >
                    Remove
                  </button>
                  <button
                    v-else
                    :id="qr.id.toString()"
                    class="border-2 px-4 py-2 my-3 bg-red-500 rounded-md text-white font-bold border-red-500"
                    @click="deleteQR"
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
                    Remove
                  </button>
                </div>
              </div>
              <button
                v-if="!createQr"
                @click="createQr = true"
                class="w-full border-2 rounded-md py-4 px-2 flex gap-4 justify-center items-center border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <img
                  src="/qrLogo.png"
                  class="h-12 w-12 rounded-xl"
                  alt="Qr Logo"
                />
                <p class="font-bold">Create new QR Code</p>
              </button>
              <div v-else>
                <div class="flex items-center justify-center p-12">
                  <div
                    class="mx-auto w-full max-w-[550px] bg-white border-2 rounded-md"
                  >
                    <form class="py-6 px-9">
                      <div class="mb-6 pt-4">
                        <label
                          class="mb-5 block text-xl font-semibold text-[#07074D]"
                        >
                          Upload Image
                        </label>

                        <div class="mb-8" v-if="!form.qrCodeImage">
                          <label
                            ref="dropZoneRef"
                            @click="
                              {
                                open();
                              }
                            "
                            for="file"
                            class="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                          >
                            <div>
                              <span
                                class="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]"
                              >
                                Browse
                              </span>
                            </div>
                          </label>
                        </div>
                        <div
                          v-else
                          ref="dropZoneRef"
                          class="flex justify-center items-center"
                          @click="
                            {
                              open();
                            }
                          "
                        >
                          <img :src="previewImage" alt="" />
                        </div>
                      </div>
                      <div class="my-5">
                        <label
                          for="email"
                          class="mb-3 block text-base font-medium text-[#07074D]"
                        >
                          QR Code Title
                        </label>
                        <input
                          v-model="form.qrName"
                          placeholder="PayMaya | GCash "
                          class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                      </div>
                      <div>
                        <button
                          v-if="!loading"
                          @click="uploadQR"
                          type="button"
                          class="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                        >
                          Upload QR Code
                        </button>
                        <button
                          v-else
                          @click="uploadQR"
                          type="button"
                          class="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
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
                          Send File
                        </button>
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

<style scoped>
.router-link-exact-active {
  border-bottom: 2px solid black;
}
</style>
