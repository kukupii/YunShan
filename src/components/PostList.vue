<template>
  <div class="post-list">
    <article
      class="card mb-3 shadow-sm"
      v-for="post in postList"
      :key="post._id"
    >
      <div class="card-body">
        <router-link :to="`/post/${post._id}`">{{ post.title }}</router-link>
        <div class="row my-3 alin-items-center">
          <div
            class="col-3"
            v-if="post.image && typeof post.image !== 'string'"
          >
            <img
              :src="post.image.fitUrl"
              :alt="post.title"
              class="rounded-lg"
            />
          </div>
          <p :class="{ 'col-9': post.image }">{{ post.excerpt }}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { PostProps } from "./../store";
import { generateFitUrl } from "../helper";
export default defineComponent({
  props: {
    lists: {
      type: Array as PropType<PostProps[]>,
      required: true,
    },
  },
  setup(props) {
    const postList = computed(() => {
      return props.lists.map((li) => {
        if (li.image) {
          if (li.image && typeof li.image !== "string") {
            generateFitUrl(li.image, 200, 100);
          }
        }
        return li;
      });
    });
    return { postList };
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}
</style>
