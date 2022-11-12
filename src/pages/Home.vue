<template>
  <div class="home-page d-flex flex-column">
    <div
      class="container-fluid text-center bg-image mb-3 w-100"
      style="
        background-image: url('https://mdbootstrap.com/img/Photos/Horizontal/Nature/full%20page/img(11).jpg');
        height: 460px;
        background-position: 10% 70%;
      "
    >
      <div class="d-flex justify-content-center align-items-center h-100 w-100">
        <div class="text-white">
          <h1 class="mb-3">Cloud Mountain</h1>
          <h4 class="mb-3">
            Write at your own pace & express yourself freely.
          </h4>
          <router-link
            class="btn btn-outline-light btn-lg"
            href="#!"
            role="button"
            to="/create"
            >Start writing now!</router-link
          >
        </div>
      </div>
    </div>

    <h4 class="font-weight-bold text-center mb-3">发现精彩</h4>
    <div class="container">
      <column-list></column-list>
    </div>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
      @click="loadMorePage"
      v-if="!isLastPage"
    >
      Load More😀
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import ColumnList from "./../components/ColumnList.vue";
import useMainStore from "./../store";
import useLoadMore from "../hooks/useLoadMore";

export default defineComponent({
  name: "Home",
  components: { ColumnList },
  setup() {
    const store = useMainStore();
    const total = computed(() => store.columns.total);
    const currentPage = computed(() => store.columns.currentPage);
    onMounted(() => {
      store.fetchColumns();
    });

    const { loadMorePage, isLastPage } = useLoadMore("columns", total, {
      currentPage: currentPage.value ? currentPage.value : 2,
      pageSize: 3,
    });

    return { loadMorePage, isLastPage };
  },
});
</script>
