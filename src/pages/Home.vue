<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img
            src="../assets/img/hlyjd38ej8061.jpg"
            alt="callout"
            class="w-50"
          />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2"
              >开始写文章</router-link
            >
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <div>
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
    onMounted(() => {
      store.fetchColumns();
    });

    const { loadMorePage, isLastPage } = useLoadMore("columns", total, {
      currentPage: 2,
      pageSize: 3,
    });

    return { loadMorePage, isLastPage };
  },
});
</script>
