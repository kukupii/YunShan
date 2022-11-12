<template>
  <div class="create-post-page container w-75 mx-auto">
    <div class="ability">
      <h1>
        {{ isEditMode ? "Edit your post!" : "Create a new post!" }}
      </h1>
    </div>
    <uploader
      :uploaded="uploadedData"
      action="/upload"
      :beforeUploaded="checkFile"
      @file-uploaded="fileUploaded"
      @file-uploaded-failed="fileUploadedFailed"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #uploading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadData.data.url" />
      </template>
    </uploader>
    <validate-form @submit-form="handleSubmit">
      <div class="title-area">
        <label for="title">Article Title:</label>
        <validate-input
          :rules="titleRules"
          placeholder="title"
          v-model="values.titleVal"
        ></validate-input>
      </div>
      <div class="content-area">
        <label for="content">Article Content:</label>
        <editor
          v-model="values.contentVal"
          @blur="editorCheck"
          :options="editorOptions"
          ref="editorRef"
          :class="{ 'is-invalid': !editorStatus.isValid }"
        ></editor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{
          editorStatus.message
        }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "Edit" : "Publish" }} article
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import ValidateInput, { RulesProp } from "../components/ValidateInput.vue";
import ValidateForm from "../components/ValidateForm.vue";
import { reactive, defineComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Uploader from "../components/Uploader.vue";
import { useMainStore, ResponseProps, AvatarProps, PostProps } from "../store";
import useCreateMessage from "../hooks/useCreateMessage";
import { beforeUploadCheck } from "../helper";
import EasyMDE, { Options } from "easymde";
import Editor from "../components/Editor.vue";

interface EditorInstance {
  clear: () => void;
  getMDEInstance: () => EasyMDE | null;
}

export default defineComponent({
  components: { ValidateInput, ValidateForm, Uploader, Editor },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useMainStore();
    const isEditMode = !!route.query.id;
    const values = reactive({
      titleVal: "",
      contentVal: "",
    });
    let ImageId = "";
    const uploadedData = ref();
    const editorOptions: Options = {
      spellChecker: false,
    };
    const editorStatus = reactive({
      isValid: true,
      message: "",
    });

    const editorRef = ref<EditorInstance | null>(null);

    const editorCheck = () => {
      if (values.contentVal.trim() === "") {
        editorStatus.isValid = false;
        editorStatus.message = "Content can't be empty!";
      } else {
        editorStatus.isValid = true;
        editorStatus.message = "";
      }
    };

    onMounted(() => {
      if (isEditMode && route.query.id) {
        store
          .fetchPost(route.query.id.toString())
          .then((resp: ResponseProps<PostProps>) => {
            const currentPost = resp.data;
            if (currentPost.image) {
              uploadedData.value = { data: currentPost.image };
            }
            values.titleVal = currentPost.title;
            values.contentVal = currentPost.content || "";
          });
      }
    });

    const titleRules: RulesProp = [
      { type: "required", message: "Please input article title:)" },
      {
        type: "range",
        max: { length: 25, message: "Title can't longer than 25 words." },
      },
    ];
    const checkFile = (file: File) => {
      const { passed, error } = beforeUploadCheck(file, {
        format: ["image/jpeg", "image/png"],
        size: 1,
      });
      if (error === "format") {
        useCreateMessage("上传图片格式只能为JPG/PNG", "error", 2000);
      } else if (error === "size") {
        useCreateMessage("图片过大", "error", 2000);
      }
      return passed;
    };
    const fileUploaded = (data: ResponseProps<AvatarProps>) => {
      if (data.data._id) {
        ImageId = data.data._id;
        useCreateMessage(
          `uploaded success! image id: ${data.data._id}`,
          "success",
          2000
        );
      }
    };
    const fileUploadedFailed = (error: string) => {
      useCreateMessage(error, "error", 2000);
    };

    function handleSubmit(result: boolean) {
      editorCheck();
      if (result && editorStatus.isValid) {
        const { column, _id } = store.currentUser;
        if (column && _id) {
          const post: PostProps = {
            column,
            author: _id,
            title: values.titleVal,
            content: values.contentVal,
          };
          if (ImageId) {
            post.image = ImageId;
          }
          const actionName = isEditMode ? "editPost" : "createPost";
          if (actionName === "createPost") {
            store.addNewPost(post).then((resp) => {
              useCreateMessage(
                "创建文章成功 2秒后跳转文章列表",
                "success",
                2000
              );
              setTimeout(() => {
                router.push(`/column/${column}`);
              }, 2000);
            });
          } else if (actionName === "editPost" && route.query.id) {
            store.updatePost(route.query.id.toString(), post).then((resp) => {
              useCreateMessage(
                "修改文章成功 2秒后跳转文章列表",
                "success",
                2000
              );
              setTimeout(() => {
                router.push(`/column/${column}`);
              }, 2000);
            });
          }
        }
      }
    }
    return {
      values,
      titleRules,
      editorStatus,
      handleSubmit,
      checkFile,
      fileUploaded,
      fileUploadedFailed,
      uploadedData,
      isEditMode,
      editorOptions,
      editorRef,
      editorCheck,
    };
  },
});
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
