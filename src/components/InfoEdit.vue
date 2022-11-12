<template>
  <div class="info row">
    <h2 class="mt-3">Edit {{ editObject }} Info:)</h2>
    <div class="avatar text-center">
      <img
        :src="
          values.avatarUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200'
        "
        class="rounded-circle"
        style="width: 150px"
        alt="Avatar"
      />
      <uploader
        action="/upload"
        :beforeUploaded="checkFile"
        class="m-3"
        @file-uploaded="fileUploaded"
        @file-uploaded-failed="fileUploadedFailed"
      >
        <template #uploaded>
          <div class="btn btn-primary d-block w-25 mx-auto mt-3">上传成功</div>
        </template>
        <div class="btn btn-primary">上传新头像</div>
      </uploader>
    </div>
    <div class="form">
      <validate-form @submit-form="handleSubmit">
        <div class="name">
          <label for="name">{{ editObject }} Name:</label>
          <validate-input
            placeholder="input name here:)"
            :rules="nameRules"
            v-model="values.nameVal"
          ></validate-input>
        </div>
        <div class="profile">
          <label for="profile">{{ editObject }} Profile:</label>
          <validate-input
            placeholder="input your profile here:)"
            :rules="profileRules"
            v-model="values.profileVal"
            areaType="textarea"
            rows="4"
          ></validate-input>
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">Save update😃</button>
        </template>
      </validate-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, PropType } from "vue";
import ValidateForm from "./ValidateForm.vue";
import ValidateInput, { RulesProp } from "./ValidateInput.vue";
import Uploader from "./Uploader.vue";
import useCreateMessage from "../hooks/useCreateMessage";
import { beforeUploadCheck } from "../helper";
import {
  useMainStore,
  ResponseProps,
  AvatarProps,
  UserProps,
  ColumnProps,
} from "../store";
import avatarUrl from "../assets/avatar.jpg";

type objectType = "user" | "column";

export default defineComponent({
  props: {
    editObject: {
      type: String as PropType<objectType>,
      required: true,
      default: "user",
    },
    id: {
      type: String,
      required: true,
    },
  },
  components: { ValidateForm, ValidateInput, Uploader },
  setup(props) {
    const store = useMainStore();

    const values = reactive({
      nameVal: "",
      profileVal: "",
      avatarVal: "",
      avatarUrl: "",
    });

    onMounted(() => {
      let name, desc, avatarV;
      if (props.editObject === "user") {
        const { nickName, description, avatar } = store.currentUser;
        name = nickName;
        desc = description;
        avatarV = avatar;
      } else if (props.editObject === "column" && props.id) {
        const { title, description, avatar } = store.getColumnById(props.id);
        name = title;
        desc = description;
        avatarV = avatar;
      }
      values.nameVal = name || "";
      values.profileVal = desc || "";
      if (typeof avatarV !== "string") {
        values.avatarUrl = avatarV?.url || avatarV?.fitUrl || avatarUrl;
      } else {
        values.avatarUrl = avatarV || avatarUrl;
      }
    });

    const nameRules: RulesProp = [
      { type: "required", message: "Please input your nickname:)" },
      {
        type: "range",
        max: { length: 13, message: "can't longer than 13 words." },
      },
    ];

    const profileRules: RulesProp = [
      { type: "required", message: "Please input your profile:)" },
      {
        type: "range",
        max: { length: 50, message: "can't longer than 50 words." },
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
      if (data.data._id && data.data.url) {
        values.avatarVal = data.data._id;
        values.avatarUrl = data.data.url;
      }
    };
    const fileUploadedFailed = (error: string) => {
      useCreateMessage(error, "error", 2000);
    };

    const handleSubmit = (result: boolean) => {
      if (result) {
        if (props.editObject === "user") {
          const userInfo: UserProps = {
            nickName: values.nameVal,
            description: values.profileVal,
            avatar: values.avatarVal,
          };

          store
            .updateUserInfo(props.id, userInfo)
            .then((resp) => {
              useCreateMessage("New info updated!", "success", 2000);
            })
            .catch((e) => {
              console.log(e);
              useCreateMessage(
                "Something went wrong! Try later...",
                "error",
                2000
              );
            });
        } else if (props.editObject === "column") {
          const columnInfo: ColumnProps = {
            title: values.nameVal,
            description: values.profileVal,
            avatar: values.avatarVal,
          };
          store
            .updateColumnInfo(props.id, columnInfo)
            .then((resp) => {
              useCreateMessage("New info updated!", "success", 2000);
            })
            .catch((e) => {
              console.log(e);
              useCreateMessage(
                "Something went wrong! Try later...",
                "error",
                2000
              );
            });
        }
      }
    };

    return {
      handleSubmit,
      values,
      nameRules,
      profileRules,
      checkFile,
      fileUploaded,
      fileUploadedFailed,
    };
  },
});
</script>
