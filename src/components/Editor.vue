<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import EasyMDE, { Options } from "easymde";

//类型，属性和事件
interface EditorProps {
  modelValue?: string;
  options?: Options;
}

interface EditorEvents {
  (type: "update:modelValue", value: string): void;
  (type: "change", value: string): void;
  (type: "blur"): void;
}

const props = defineProps<EditorProps>();
const emit = defineEmits<EditorEvents>();

//定义完类型初始化数据
const textArea = ref<null | HTMLTextAreaElement>(null);
let easyMDEInstance: EasyMDE | null = null;
const innerValue = ref(props.modelValue || "");

watch(
  () => props.modelValue,
  (newValue) => {
    if (easyMDEInstance) {
      if (newValue !== innerValue.value) {
        easyMDEInstance.value(newValue || "");
      }
    }
  }
);

onMounted(() => {
  if (textArea.value) {
    //组装Options
    const config: Options = {
      ...(props.options || {}),
      element: textArea.value,
      initialValue: innerValue.value,
    };
    easyMDEInstance = new EasyMDE(config);
    //监控对应的事件
    easyMDEInstance.codemirror.on("change", () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        const updatedValue = easyMDEInstance.value();
        innerValue.value = updatedValue;
        emit("update:modelValue", updatedValue);
        emit("change", updatedValue);
      }
    });
    easyMDEInstance.codemirror.on("blur", () => {
      if (easyMDEInstance) {
        emit("blur");
      }
    });
  }
});

const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value("");
  }
};

const getMDEInstance = () => {
  return easyMDEInstance;
};

//销毁对应的实例
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup();
  }
  easyMDEInstance = null;
});

defineExpose({
  clear,
  getMDEInstance,
});
</script>

<style>
.vue-easymde-editor.is-invalid {
  border: 1px solid red;
}
</style>
