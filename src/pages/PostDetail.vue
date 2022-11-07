<template>
  <div class="post-detail-page w-75 mx-auto">
    <div class="post-detail-container">
      <modal
        :visible="modalIsVisible"
        title="删除文章"
        @modal-on-confirm="deletePostAction"
        @modal-on-close="modalIsVisible = false"
      >
        <p>确定删除文章吗？</p>
      </modal>
      <div class="header-image-container text-center rounded" v-if="imgUrl">
        <img :src="imgUrl" alt="" class="rounded" />
      </div>
      <div class="title-container mb-2 pb-2">
        <h2 class="mb-2">{{ post?.title }}</h2>
      </div>
      <div v-if="author" class="user-profile mb-2 pb-4">
        <user-propfile
          :user="author"
          :createdAt="post?.createdAt"
        ></user-propfile>
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-outline-success"
          :to="{ name: 'CreatePost', query: { id: post?._id } }"
          >Edit</router-link
        >
        <button
          type="button"
          class="btn btn-outline-danger"
          @click="modalIsVisible = true"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useMainStore, PostProps, UserProps, ResponseProps } from "./../store";
import UserPropfile from "../components/UserPropfile.vue";
import Modal from "../components/Modal.vue";
import router from "../router";
import useCreateMessage from "../hooks/useCreateMessage";
import { marked } from "marked";

export default defineComponent({
  components: { UserPropfile, Modal },
  setup() {
    const route = useRoute();
    const store = useMainStore();
    const post = ref<PostProps>();
    const imgUrl = ref("");
    const modalIsVisible = ref(false);

    const selectedId = route.params.id;

    onMounted(() => {
      if (typeof selectedId === "string") {
        store.fetchPost(selectedId).then((resp) => {
          const { data } = resp;
          post.value = data;
          console.log(data);
          if (post.value?.image && typeof post.value.image !== "string") {
            imgUrl.value = post.value.image.url || "";
          }
        });
      }
    });

    const currentHTML = computed(() => {
      if (post.value && post.value.content) {
        return marked.parse(post.value.content);
      }
    });

    const author = computed(() => {
      if (post.value?.author && typeof post.value.author !== "string") {
        return post.value.author;
      }
    });

    const showEditArea = computed(() => {
      const { isLogin, _id } = store.currentUser;
      if (post.value && post.value.author && isLogin) {
        const postAuthor = post.value.author as UserProps;
        return postAuthor._id === _id;
      } else {
        return false;
      }
    });

    const deletePostAction = () => {
      store
        .deletePost(selectedId as string)
        .then((resp: ResponseProps<PostProps>) => {
          console.log(resp);
          modalIsVisible.value = false;
          useCreateMessage("删除成功，2秒后跳转专栏列表", "success", 2000);
          setTimeout(() => {
            router.push(`/column/${resp.data.column}`);
          }, 2000);
        });
    };

    return {
      post,
      imgUrl,
      author,
      currentHTML,
      showEditArea,
      modalIsVisible,
      deletePostAction,
    };
  },
});
</script>

<style scoped>
.post-detail-page .header-image-container {
  height: 210px;
  margin-bottom: 20px;
}
.post-detail-page .header-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
