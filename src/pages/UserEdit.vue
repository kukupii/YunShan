<template>
  <div class="edit-page container w-75 mx-auto">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link
          class="nav-link"
          :class="{ active: selected === 'user' }"
          :to="userInfoLink"
          @click="changeSelect('user')"
          >Edit User Info</router-link
        >
      </li>
      <li class="nav-item">
        <router-link
          class="nav-link"
          :class="{ active: selected === 'col' }"
          :to="ColInfoLink"
          @click="changeSelect('col')"
          >Edit Column Info</router-link
        >
      </li>
    </ul>
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import useMainStore from "../store";
export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useMainStore();
    const userInfoLink = store.getUserLink;
    const selected = ref("user");

    const changeSelect = (comp: string) => {
      selected.value = comp;
    };

    onMounted(() => {
      const cid = store.currentUser.column;
      store.fetchColumn(cid || "");
    });

    const ColInfoLink = route.path + "/columnInfo";

    return { userInfoLink, ColInfoLink, changeSelect, selected };
  },
});
</script>

<style scoped></style>
