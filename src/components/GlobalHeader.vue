<template>
  <header>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarExample01"
          aria-controls="navbarExample01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarExample01">
          <ul class="mb-2 mb-lg-0 w-75 mx-auto navbar">
            <router-link class="navbar-brand" to="/">云山专栏</router-link>
            <ul v-if="!user.isLogin" class="list-inline mb-0">
              <li class="list-inline-item">
                <router-link to="/login" class="btn btn-dark my-2"
                  >登陆</router-link
                >
              </li>
              <li class="list-inline-item">
                <router-link to="/register" class="btn btn-dark my-2"
                  >注册</router-link
                >
              </li>
            </ul>
            <ul v-else class="list-inline mb-0">
              <Dropdown :title="user.nickName"></Dropdown>
            </ul>
          </ul>
        </div>
      </div>
    </nav>
    <!-- <div
      class="p-5 text-center bg-image b-5 mb-3 mw-100 d-flex"
      style="
        background-image: url('https://mdbootstrap.com/img/Photos/Horizontal/Nature/full%20page/img(11).jpg');
        height: 460px;
        background-position: 10% 70%;
      "
    >
      <div class="d-flex justify-content-center align-items-center h-100 w-100">
        <div class="text-white">
          <h1 class="mb-3">Zheye</h1>
          <h4 class="mb-3">
            Write at your own pace & express yourself freely.
          </h4>
          <router-link
            class="btn btn-outline-light btn-lg"
            href="#!"
            role="button"
            to="/create"
            >Start writing!</router-link
          >
        </div>
      </div>
    </div> -->
  </header>
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
