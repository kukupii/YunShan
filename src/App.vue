<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <GlobalHeader :user="store.currentUser"></GlobalHeader>
    <loder
      text="loading..."
      background="rgba(0,0,0,.8)"
      v-if="isLoading"
    ></loder>

    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>

  <div class="container mt-3">
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 云山专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home.vue";
import GlobalHeader from "./components/GlobalHeader.vue";
import Login from "./pages/Login.vue";
import { defineComponent, computed, onMounted, watch } from "vue";
import { useMainStore } from "./store";
import Loder from "./components/Loder.vue";
import useCreateMessage from "./hooks/useCreateMessage";

export default defineComponent({
  name: "App",
  components: { Home, GlobalHeader, Login, Loder },
  setup() {
    const store = useMainStore();
    const isLoading = computed(() => store.loading);
    const token = computed(() => store.token);
    const error = computed(() => store.error);
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value;
        if (status && message) {
          useCreateMessage(message, "error", 2000);
        }
      }
    );
    onMounted(() => {
      if (token && !store.currentUser.isLogin) {
        store.fetchCurrentUser();
      }
    });

    return {
      store,
      isLoading,
      error,
    };
  },
});
</script>

<style>
.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
