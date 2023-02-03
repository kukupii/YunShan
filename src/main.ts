import { createApp } from "vue";

import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import router from "./router";
import pinia from "./CreatePinia";
import axios from "axios";
import useMainStore from "./store";
import "easymde/dist/easymde.min.css";

const app = createApp(App);

app.use(router);
app.use(pinia);
const store = useMainStore();

axios.defaults.baseURL = "http://apis.imooc.com/api/";
axios.interceptors.request.use((config) => {
  store.setError(false, "");
  store.setLoading(true);
  config.params = { ...config.params, icode: "AD5DA945B788E021" };
  if (config.data instanceof FormData) {
    config.data.append("icode", "AD5DA945B788E021");
  } else {
    config.data = { ...config.data, icode: "AD5DA945B788E021" };
  }
  return config;
});

axios.interceptors.response.use(
  (config) => {
    store.setLoading(false);
    return config;
  },
  (e) => {
    const { error } = e.response.data;
    store.setError(true, error);
    store.setLoading(false);
    return Promise.reject(error);
  }
);

axios.get("/columns").then((res) => console.log(res));

app.mount("#app");
