<template>
  <div class="column-detail-page w-75 mx-auto">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useMainStore, ColumnProps } from "./../store";
import PostList from "./../components/PostList.vue";
import { addColumnAvatar } from "../helper";
export default defineComponent({
  components: { PostList },
  setup() {
    const route = useRoute();
    const store = useMainStore();

    let selectedId = route.params.id.toString();

    onMounted(() => {
      store.fetchColumn(selectedId);
      store.fetchPosts(selectedId);
    });

    watch(
      () => route.params,
      (toParams) => {
        const jumpId = toParams && toParams.id;
        const column = store.currentUser.column;
        if (jumpId && column && jumpId === column) {
          store.fetchColumn(jumpId);
          store.fetchPosts(jumpId);
          selectedId = toParams.id.toString();
        }
      }
    );

    const column = computed(() => {
      const selectColumn = store.getColumnById(selectedId) as
        | ColumnProps
        | undefined;
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100);
      }
      return selectColumn;
    });

    const selectedPosts = computed(() => store.getPostsByCid(selectedId));
    return { column, selectedPosts };
  },
});
</script>
