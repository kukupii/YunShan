<template>
  <info-edit
    edit-object="column"
    :id="columnId"
    :origin-data="colData"
  ></info-edit>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import InfoEdit, { originDataType } from "./InfoEdit.vue";
import useMainStore, { ColumnProps } from "../store";
import { generateFitUrl } from "../helper";
import defaultAvatarUrl from "../assets/avatar.jpg";

export default defineComponent({
  components: { InfoEdit },
  setup() {
    const store = useMainStore();
    const columnId = store.currentUser.column || "";

    const { title, description, avatar } = store.getColumnById(columnId);

    let imgUrl;
    if (avatar && typeof avatar !== "string") {
      generateFitUrl(avatar, 200, 200);
      imgUrl = avatar.fitUrl;
    }
    const colData: originDataType = {
      name: title || "",
      description: description || "",
      avatarUrl: imgUrl || defaultAvatarUrl,
    };
    return { columnId, colData };
  },
});
</script>
