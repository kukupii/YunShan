<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="areaType !== 'textarea'"
      class="form-control"
      @blur="validateForm"
      v-bind="$attrs"
      v-model="inputRef.val"
      :class="{ 'is-invalid': inputRef.error }"
    />
    <textarea
      v-else
      class="form-control"
      @blur="validateForm"
      v-bind="$attrs"
      v-model="inputRef.val"
      :class="{ 'is-invalid': inputRef.error }"
    ></textarea>
    <p v-if="inputRef.error" class="invalid-feedback">{{ inputRef.msg }}</p>
  </div>
</template>
<script lang="ts">
import { emitter } from "./ValidateForm.vue";
import {
  defineComponent,
  reactive,
  PropType,
  onMounted,
  computed,
  inject,
  watch,
} from "vue";
const emailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

interface IRange {
  message: string;
  length: number;
}

interface RuleProp {
  type: "required" | "email" | "password" | "range" | "custom";
  message?: string;
  max?: IRange;
  min?: IRange;
  validator?: () => boolean;
}

export type RulesProp = RuleProp[];
export type TagType = "input" | "textarea";

export default defineComponent({
  props: {
    rules: {
      type: Array as PropType<RulesProp>,
    },
    modelValue: {
      type: String,
    },
    areaType: {
      type: String as PropType<TagType>,
      default: "input",
    },
  },
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || "",
        set: (val) => {
          context.emit("update:modelValue", val);
        },
      }),
      error: false,
      msg: "",
    });

    const clearInput = () => {
      inputRef.val = "";
    };

    const clearStatus = () => {
      inputRef.error = false;
      inputRef.msg = "";
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        inputRef.val = newValue || "";
      }
    );

    function validateForm() {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true;
          const length = inputRef.val.trim().length;
          inputRef.msg =
            rule.message || rule.min?.message || rule.max?.message || "";
          switch (rule.type) {
            case "required":
              passed = inputRef.val.trim() !== "";
              break;
            case "email":
              passed = emailReg.test(inputRef.val);
              break;
            case "range":
              if (rule.min) {
                passed = length >= rule.min.length;
              } else if (rule.max) {
                passed = length <= rule.max.length;
              }
              break;
            case "custom":
              passed = rule.validator ? rule.validator() : true;
              break;
            default:
              break;
          }
          return passed;
        });
        inputRef.error = !allPassed;

        return allPassed;
      }

      return true;
    }
    onMounted(() => {
      emitter.emit("item-created", {
        validator: validateForm,
        clearInput,
        clearStatus,
        formName: "default",
      });
    });
    return { inputRef, validateForm };
  },
});
</script>
