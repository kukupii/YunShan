<template>
  <div
    class="d-flex align-items-center p-3 bg-opacity-10 border-top border-bottom border-grey border-start-0"
  >
    <div class="col-2 text-center">
      <img :src="avatarImg" class="rounded-circle border w-50 img-thumbnail" />
    </div>
    <div class="col-7">
      <h6>{{ user.nickName }}</h6>
      <span class="text-truncate text-muted d-block" v-if="user.description">
        {{ user.description }}
      </span>
    </div>
    <div class="col-3">
      <em>Publish at {{ createdAt }}</em>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { UserProps } from "../store";
import defaultAvatar from "../assets/avatar.jpg";
import { generateFitUrl } from "../helper";
export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
    createdAt: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const avatarImg = ref("");
    if (
      props.user &&
      props.user.avatar &&
      typeof props.user.avatar !== "string"
    ) {
      generateFitUrl(props.user.avatar, 200, 200);
      avatarImg.value = props.user.avatar?.fitUrl || "";
    } else if (typeof props.user.avatar === "string") {
      avatarImg.value = props.user.avatar;
    } else {
      avatarImg.value = defaultAvatar;
    }
    return { avatarImg };
  },
});
</script>
