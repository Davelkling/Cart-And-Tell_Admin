<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
interface CMS {
  type: string;
  html: string;
}
// Public States
const API = useRuntimeConfig().public.API;
const token = useCookie("token").value;
const TINYMCE_API_KEY = useRuntimeConfig().public.TINYMCE_API_KEY;
const route = useRoute();
// Component Specific States
const content = ref("");
const configured = ref(false);
const dataLoaded = ref(false);
const data = ref<CMS>({ type: "", html: "" });
const editMode = ref(false);
const editing = ref(false);
let type = route.query.type;

async function fetchData() {
  const result = (await $fetch<CMS>(`${API}/cms/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((error) => {
    configured.value = false;
    alert(error.data.message);
  })) as CMS;
  if (result) {
    content.value = (result as { html: string }).html;
    configured.value = true;
  }
  dataLoaded.value = true;
  data.value = result;
}
// watch(
//   () => dataLoaded.value,
//   () => {
//     if (dataLoaded.value) {
//       console.log(data.value);
//     }
//   }
// );
await fetchData();
// Resets state on each redirect
onBeforeRouteUpdate((to, from) => {
  if (editing.value) {
    if (
      confirm(
        "You unsaved changes on the editor.\n Do you want to discard changes?"
      )
    ) {
    } else {
      return false;
    }
  }
  type = to.query.type;
  editMode.value = false;
  configured.value = false;
  dataLoaded.value = false;
  content.value = "";
  data.value = { type: "", html: "" };
  editing.value = false;
  fetchData();
  return true;
});

//TinyMCE Helper function
async function uploadImage(file: File) {
  // Uploads Imaged to Supabase
  const formData = new FormData();
  formData.append("image", file);
  return $fetch<{ link: string }>(`${API}/supabase/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).catch((err) => {
    alert(err.data.message);
  });
}
// TinyMCE upload Image Handler
function handleFilePicker(callback: any) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = () => {
    const file = input!.files?.[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file as Blob);
    reader.onload = async () => {
      const response = await uploadImage(file as File);
      callback((response as { link: string }).link);
    };
  };
}
function cancelButtonHandler() {
  if (
    confirm(
      "You unsaved changes on the editor.\n Do you want to discard changes?"
    )
  ) {
    editMode.value = false;
    editing.value = false;
    content.value = data.value.html;
  }
}
// Apply Changes Button Handler
async function buttonHandler() {
  if (configured.value) {
    await updateCMS();
  } else {
    await createCMS();
  }
}
// CMS CRUD Operations
async function createCMS() {
  const result = await $fetch(`${API}/cms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      html: content.value,
    }),
  }).catch((error) => {
    alert(error.data.message);
  });
  if (result) {
    configured.value = true;
    dataLoaded.value = false;
    editMode.value = false;
    editing.value = false;
    fetchData();
    alert("Changes Applied");
  }
}
async function updateCMS() {
  const result = await $fetch(`${API}/cms/${type}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      html: content.value,
    }),
  }).catch((error) => {
    alert(error.data.message);
  });
  if (result) {
    alert("Update Changes Applied");
    editMode.value = false;
    dataLoaded.value = false;
    editing.value = false;
    fetchData();
  }
}
</script>

<template>
  <div class="bg-[#F8F9FD]">
    <div class="flex justify-between">
      <WebsiteSettingsSideBar />
      <div
        class="p-4 w-full min-h-[100svh] overflow-x-scroll overflow-y-hidden flex flex-col"
      >
        <div class="bg-white rounded-3xl w-full p-4 text-center">
          <h1 class="text-5xl font-black">Overview</h1>
        </div>
        <div class="bg-white rounded-3xl w-full p-4 h-full mt-4 flex flex-col">
          <p class="font-bold text-3xl p-4 text-center">Website Editor</p>

          <div
            v-if="configured && !editMode"
            class="flex-1 pb-4 flex flex-col items-center"
          >
            <p class="font-bold text-3xl">Preview</p>
            <div
              v-html="data.html"
              class="max-w-[1216px] w-full border-2 h-full p-4 rounded-md"
            ></div>
            <button
              @click="editMode = true"
              class="max-w-[1216px] w-full px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white hover:bg-white hover:text-black active:bg-[#5B8ED8] active:text-[#5B8ED8]"
            >
              Edit
            </button>
          </div>

          <div
            v-if="(dataLoaded && !configured) || editMode"
            class="flex flex-col"
          >
            <div class="w-full max-w-[1216px] mx-auto flex flex-col">
              <button
                v-if="configured"
                @click="cancelButtonHandler"
                class="w-96 my-2 ml-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-yellow-500 bg-yellow-500 text-white hover:bg-white hover:text-black active:bg-yellow-500 active:text-yellow"
              >
                Cancel
              </button>
              <Editor
                v-model="content"
                :api-key="TINYMCE_API_KEY"
                :init="{
                  min_height: 1000,
                  plugins:
                    'lists link image table code help wordcount autoresize',
                  toolbar:
                    'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image',
                  a11y_advanced_options: true,
                  file_picker_callback: handleFilePicker,
                  setup: function (editor:any) {
                    editor.on('keydown', function (e:Event) {
                      editing = true;
                    });
                  },
                }"
              />
            </div>

            <button
              @click="buttonHandler"
              class="w-full max-w-[1216px] mx-auto px-4 py-2 font-bold text-2xl border-2 rounded-md mt-5 border-[#5B8ED8] bg-[#5B8ED8] text-white hover:bg-white hover:text-black active:bg-[#5B8ED8] active:text-[#5B8ED8]"
            >
              Apply Changes
            </button>
          </div>
          <div
            v-if="!dataLoaded"
            class="animate-pulse bg-gray-300 h-full rounded-lg max-w-[1216px] w-full mx-auto"
          ></div>
        </div>
      </div>
      <!-- <SettingBar/> -->
    </div>
  </div>
</template>

<style scoped>
.tox.tinymce {
  @apply w-[1216px] bg-red-500;
}
</style>
