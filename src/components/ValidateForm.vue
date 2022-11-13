<template>
  <div class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitAction">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">Submit</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, provide } from "vue";
import mitt from "mitt";

type ValidateFunc = () => boolean;
type ClearFunc = () => void;
type ClearStatusFunc = () => void;

interface CallbackProps {
  validator: ValidateFunc;
  clearInput: ClearFunc;
  clearStatus: ClearStatusFunc;
  formName: string;
}

type Events = {
  "item-created": CallbackProps;
};

export const emitter = mitt<Events>();

export default defineComponent({
  emits: ["submit-form"],
  props: {
    name: {
      type: String,
      default: "default",
    },
  },
  setup(props, context) {
    provide("formName", props.name);
    let validateFunction: ValidateFunc[] = [];
    let clearFuncArr: ClearFunc[] = [];
    const clearStatusArr: ClearStatusFunc[] = [];

    function submitAction() {
      const result = validateFunction.map((func) => func()).every((res) => res);
      context.emit("submit-form", result);
    }

    function callback(obj?: CallbackProps) {
      if (obj && obj.formName === props.name) {
        validateFunction.push(obj.validator);
        clearFuncArr.push(obj.clearInput);
        clearStatusArr.push(obj.clearStatus);
      }
    }

    const clearInputs = () => {
      clearFuncArr.forEach((c) => c());
    };

    const clearAllStatus = () => {
      clearStatusArr.forEach((c) => c());
    };

    emitter.on("item-created", callback);
    onUnmounted(() => {
      emitter.off("item-created", callback);
      validateFunction = [];
      clearFuncArr = [];
    });
    return { submitAction, clearInputs, clearAllStatus };
  },
});
</script>
