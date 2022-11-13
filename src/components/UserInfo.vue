<template>
  <info-edit edit-object="user" :id="id" :origin-data="data"></info-edit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InfoEdit, { originDataType } from "./InfoEdit.vue";
import { useRoute } from "vue-router";
import useMainStore from "../store";
import { generateFitUrl } from "../helper";
import defaultAvatarUrl from "../assets/avatar.jpg";

export default defineComponent({
  components: { InfoEdit },
  setup() {
    const route = useRoute();
    const store = useMainStore();
    const id = route.params.id.toString();
    const { nickName, description, avatar } = store.currentUser;
    let imgUrl;
    if (avatar && typeof avatar !== "string") {
      generateFitUrl(avatar, 200, 200);
      imgUrl = avatar.fitUrl;
    }
    const data: originDataType = {
      name: nickName || "",
      description: description || "",
      avatarUrl: imgUrl || defaultAvatarUrl,
    };

    return { id, data };
  },
});
</script>
