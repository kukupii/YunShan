<template>
  <Teleport to="#message">
    <div
      class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      v-if="isVisible"
      :class="classObject"
    >
      <span>{{ message }}</span>
      <button
        type="button"
        class="close"
        aria-label="Close"
        @click.prevent="close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import useDOMCreate from "../hooks/useDOMCreate";
export type MessageType = "error" | "success" | "default";

export default defineComponent({
  props: {
    message: {
      type: String,
    },
    type: {
      type: String as PropType<MessageType>,
      default: "default",
    },
  },
  emits: ["close-message"],
  setup(props, context) {
    useDOMCreate("message");
    const isVisible = ref(true);
    const classObject = {
      "alert-success": props.type === "success",
      "alert-danger": props.type === "error",
      "alert-primary": props.type === "default",
    };
    const close = () => {
      isVisible.value = false;
      context.emit("close-message");
    };
    return { isVisible, classObject, close };
  },
});
</script>
