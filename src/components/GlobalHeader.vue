<template>
  <nav class="navbar-dark bg-primary justify-content-between mb-4 px-4">
    <div class="w-75 mx-auto navbar">
      <router-link class="navbar-brand" to="/">者也专栏</router-link>
      <ul v-if="!user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item">
          <router-link to="/login" class="btn btn-outline-light my-2"
            >登陆</router-link
          >
        </li>
        <li class="list-inline-item">
          <router-link to="/register" class="btn btn-outline-light my-2"
            >注册</router-link
          >
        </li>
      </ul>
      <ul v-else class="list-inline mb-0">
        <Dropdown :title="user.nickName"></Dropdown>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Dropdown from "./Dropdown.vue";
import { UserProps } from "../store";

export default defineComponent({
  components: { Dropdown },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },
});
</script>
