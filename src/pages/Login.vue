<template>
  <div>
    <validate-form @submit-form="handleSubmit" ref="loginForm">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <ValidateInput
          :rules="emailRules"
          v-model="emailVal"
          placeholder="Input email here"
          type="email"
          ref="inputRef"
        ></ValidateInput>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <ValidateInput
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="Input password here"
          type="password"
        ></ValidateInput>
      </div>
      <div class="form-text mb-3">
        <router-link to="/register">No account? Sign up now!</router-link>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">Login</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import ValidateInput, { RulesProp } from "../components/ValidateInput.vue";
import ValidateForm from "../components/ValidateForm.vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import useMainStore from "../store";
import useCreateMessage from "../hooks/useCreateMessage";

export default defineComponent({
  components: { ValidateInput, ValidateForm },
  setup() {
    const router = useRouter();
    const store = useMainStore();
    const emailVal = ref("");
    const passwordVal = ref("");
    const loginForm = ref();
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
    function handleSubmit(result: boolean) {
      console.log("result" + result);
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value,
        };
        store
          .userLogin(payload)
          .then((data) => {
            useCreateMessage("登陆成功 2秒后跳转首页", "success", 2000);
            setTimeout(() => {
              router.push("/");
            }, 2000);

            console.log(data);
          })
          .catch((e) => {
            console.log(e);
            loginForm.value.clearInputs();
          });
      }
    }

    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      handleSubmit,
      loginForm,
    };
  },
});
</script>
