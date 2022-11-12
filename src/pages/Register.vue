<template>
  <div class="container">
    <validate-form @submit-form="handleSubmit">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <ValidateInput
          :rules="emailRules"
          v-model="input.emailVal"
          placeholder="Input email here"
          type="email"
        ></ValidateInput>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Nickname</label>
        <ValidateInput
          :rules="nickNameRules"
          v-model="input.nickNameVal"
          placeholder="Input nickname here"
        ></ValidateInput>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <ValidateInput
          :rules="passwordRules"
          v-model="input.passwordVal"
          placeholder="Input password here"
          type="password"
        ></ValidateInput>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Repeat password</label>
        <ValidateInput
          :rules="repeatedPasswordRules"
          v-model="input.repeatedPassword"
          placeholder="Input repeated password here"
          type="password"
        ></ValidateInput>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">Signup</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import ValidateInput, { RulesProp } from "../components/ValidateInput.vue";
import ValidateForm from "../components/ValidateForm.vue";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import useCreateMessage from "../hooks/useCreateMessage";
import axios from "axios";

export default defineComponent({
  components: { ValidateInput, ValidateForm },
  setup() {
    const router = useRouter();
    const input = reactive({
      emailVal: "",
      nickNameVal: "",
      passwordVal: "",
      repeatedPassword: "",
    });
    const emailRules: RulesProp = [
      { type: "required", message: "Please input your email:)" },
      { type: "email", message: "Please input valid email:)" },
    ];
    const passwordRules: RulesProp = [
      { type: "required", message: "Password can't be empty" },
      {
        type: "range",
        min: { message: "Too short password! Must longer than 6.", length: 6 },
      },
    ];
    const nickNameRules: RulesProp = [
      { type: "required", message: "Nickname can't be empty" },
    ];
    const repeatedPasswordRules: RulesProp = [
      { type: "required", message: "repeated password can't be empty" },
      {
        type: "custom",
        validator: () => {
          return input.passwordVal === input.repeatedPassword;
        },
        message: "Repeated password isn't as same as password.",
      },
    ];
    function handleSubmit(result: boolean) {
      console.log("result" + result);
      if (result) {
        const payload = {
          email: input.emailVal,
          nickName: input.nickNameVal,
          password: input.passwordVal,
        };
        axios
          .post("/users", payload)
          .then((data) => {
            useCreateMessage("注册成功 2秒后跳转登陆页面", "success", 2000);
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }

    return {
      input,
      emailRules,
      nickNameRules,
      passwordRules,
      repeatedPasswordRules,
      handleSubmit,
    };
  },
});
</script>
