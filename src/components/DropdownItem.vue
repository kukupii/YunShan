<template>
  <li class="dropdown-item" :class="{ 'is-disabled': disabled }">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style>
.dropdown-item.is-disabled * {
  color: grey;
  background-color: transparent;
  pointer-events: none;
}
</style>
