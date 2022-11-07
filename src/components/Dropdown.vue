<template>
  <div class="dropdown">
    <a
      class="btn btn-outline-light my-2 dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Hello, {{ title }}
    </a>
    <ul class="dropdown-menu">
      <DropdownItem
        ><router-link class="dropdown-item" :to="currentUserColumnLink"
          >我的专栏</router-link
        ></DropdownItem
      >
      <DropdownItem
        ><router-link class="dropdown-item" to="/create"
          >新建文章</router-link
        ></DropdownItem
      >
      <DropdownItem disabled
        ><a class="dropdown-item" href="#">编辑资料</a></DropdownItem
      >
      <DropdownItem
        ><a class="dropdown-item" @click="logout">退出登陆</a></DropdownItem
      >
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import DropdownItem from "./DropdownItem.vue";
import { useMainStore } from "../store";
import { userInfo } from "os";

export default defineComponent({
  components: { DropdownItem },
  props: ["title"],
  setup() {
    const store = useMainStore();
    const logout = () => {
      store.logout();
      window.history.go(0);
    };

    const currentUserColumnLink = computed(() => {
      const { column } = store.currentUser;
      return `/column/${column}`;
    });
    return { logout, currentUserColumnLink };
  },
});
</script>
