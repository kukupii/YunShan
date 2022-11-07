import { h, render } from "vue";
import Message from "../components/Message.vue";
export type MessageType = "error" | "success" | "default";

const useCreateMessage = (
  message: string,
  type: MessageType,
  timeout?: number
) => {
  const messageVnode = h(Message, {
    message,
    type,
  });
  const mountNode = document.createElement("div");
  document.body.appendChild(mountNode);
  render(messageVnode, mountNode);
  function destory() {
    render(null, mountNode);
    document.body.removeChild(mountNode);
  }
  if (timeout) {
    setTimeout(() => {
      destory();
    }, timeout);
  }
  return {
    destory,
  };
};

export default useCreateMessage;
