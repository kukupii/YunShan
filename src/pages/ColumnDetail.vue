<template>
  <div class="column-detail-page w-75 mx-auto container">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.fitUrl"
          :alt="column.title"
          class="rounded-circle border w-50"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :lists="selectedPosts"></post-list>
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
import { defineComponent, onMounted, computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useMainStore, ColumnProps } from "./../store";
import PostList from "./../components/PostList.vue";
import { addColumnAvatar } from "../helper";
import useLoadMore from "../hooks/useLoadMore";
export default defineComponent({
  components: { PostList },
  setup() {
    const route = useRoute();
    const store = useMainStore();

    const selectedId = ref(route.params.id.toString());
    const total = computed(
      () => store.posts.loadedColumns[selectedId.value]?.total || 0
    );
    const currentPage = computed(
      () => store.posts.loadedColumns[selectedId.value]?.currentPage
    );

    const { loadMorePage, isLastPage } = useLoadMore(
      "posts",
      total,
      { currentPage: currentPage.value ? currentPage.value : 2, pageSize: 3 },
      selectedId.value
    );

    onMounted(() => {
      store.fetchColumn(selectedId.value);
      store.fetchPosts(selectedId.value);
    });

    watch(
      () => route.params,
      (toParams) => {
        const jumpId = toParams && toParams.id;
        const column = store.currentUser.column;
        if (jumpId && column && jumpId === column) {
          store.fetchColumn(jumpId);
          store.fetchPosts(jumpId);
          selectedId.value = toParams.id.toString();
        }
      }
    );

    const column = computed(() => {
      const selectColumn = store.getColumnById(selectedId.value) as
        | ColumnProps
        | undefined;
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100);
      }
      return selectColumn;
    });

    const selectedPosts = computed(() => store.getPostsByCid(selectedId.value));
    return { column, selectedPosts, loadMorePage, isLastPage };
  },
});
</script>
