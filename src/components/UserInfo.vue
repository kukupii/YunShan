<template>
  <info-edit edit-object="user" :id="id"></info-edit>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InfoEdit from "./InfoEdit.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { InfoEdit },
  setup() {
    const route = useRoute();
    const id = route.params.id.toString();

    return { id };
  },
});
</script>
