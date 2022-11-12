<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <slot v-if="uploadStatus === 'uploading'" name="uploading">
        <div class="btn btn-primary" disabled>正在上传...</div>
      </slot>
      <slot
        v-else-if="uploadStatus === 'success'"
        name="uploaded"
        :uploadData="uploadData"
      >
        <div class="btn btn-primary">上传成功</div>
      </slot>
      <slot v-else-if="uploadStatus === 'failed'" name="uploaded-failed">
        <div class="btn btn-primary">上传失败</div>
      </slot>
      <slot v-else name="default">
        <div class="btn btn-primary">上传图片</div>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, ref, PropType, watch } from "vue";
export type UploadStatus = "ready" | "uploading" | "success" | "failed";
export type CheckFunction = (file: File) => boolean;
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUploaded: {
      type: Function as PropType<CheckFunction>,
    },
    uploaded: {
      type: Object,
    },
  },
  inheritAttrs: false,
  emits: ["file-uploaded", "file-uploaded-failed"],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const uploadStatus = ref<UploadStatus>(
      props.uploaded ? "success" : "ready"
    );
    const uploadData = ref(props.uploaded);
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    watch(
      () => props.uploaded,
      (newValue) => {
        if (newValue) {
          uploadStatus.value = "success";
          uploadData.value = newValue;
        }
      }
    );
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        const selectedFile = files[0];
        if (props.beforeUploaded) {
          const result = props.beforeUploaded(selectedFile);
          if (!result) {
            return;
          }
        }
        uploadStatus.value = "uploading";
        const formData = new FormData();
        formData.append("file", selectedFile);
        axios
          .post(props.action, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((resp) => {
            uploadStatus.value = "success";
            uploadData.value = resp.data;
            console.log(resp.data);
            context.emit("file-uploaded", resp.data);
          })
          .catch((e) => {
            uploadStatus.value = "failed";
            const { error } = e;
            context.emit("file-uploaded-failed", error);
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = "";
            }
          });
      }
    };
    return {
      fileInput,
      triggerUpload,
      uploadStatus,
      handleFileChange,
      uploadData,
    };
  },
});
</script>

<style scoped>
p {
  margin-bottom: 0;
}
</style>
