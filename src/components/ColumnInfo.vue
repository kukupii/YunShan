<template>
  <info-edit edit-object="column" :id="columnId"></info-edit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InfoEdit from "./InfoEdit.vue";
import useMainStore from "../store";

export default defineComponent({
  components: { InfoEdit },
  setup() {
    const store = useMainStore();
    const columnId = store.currentUser.column || "";
    return { columnId };
  },
});
</script>
