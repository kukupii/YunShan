<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar && column.avatar.fitUrl"
            :alt="column.title"
            class="rounded-circle border border-light my-3"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">{{ column.description }}</p>
          <router-link
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { AvatarProps, useMainStore } from "./../store";
import imgUrl from "../assets/avatar.jpg";
import { generateFitUrl } from "../helper";

export default defineComponent({
  setup() {
    const store = useMainStore();

    const columnList = computed(() => {
      return store.getColumns.map((col) => {
        if (!col.avatar) {
          col.avatar = { url: imgUrl };
        } else if (col.avatar && typeof col.avatar !== "string") {
          generateFitUrl(col.avatar, 50, 50);
        }
        return col;
      });
    });

    return { columnList };
  },
});
</script>

<style scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
