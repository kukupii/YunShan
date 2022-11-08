import { defineStore } from "pinia";
import axios from "axios";
import { arrToObj, objToArr } from "./helper";
import { loadParams } from "./hooks/useLoadMore";

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
  image?: AvatarProps | string;
  column?: string;
  author?: UserProps | string;
}

export interface ResponseProps<P> {
  code: number;
  msg: string;
  data: P;
}

export interface AvatarProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface ColumnProps {
  _id?: string;
  avatar?: AvatarProps;
  title?: string;
  description?: string;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  description?: string;
  avatar?: AvatarProps;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface ErrorProps {
  status: boolean;
  message?: string;
}

interface ListProps<T> {
  [id: string]: T;
}

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      token: localStorage.getItem("token") || "",
      currentUser: {
        isLogin: false,
      } as UserProps,
      columns: {
        data: {} as ListProps<ColumnProps>,
        isLoaded: false,
        total: 0,
      },
      posts: {
        data: {} as ListProps<PostProps>,
        loadedColumns: [] as String[],
      },
      loading: false,
      error: { status: false } as ErrorProps,
    };
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id];
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter((p) => p.column === cid);
    },
    getColumns: (state) => {
      return objToArr(state.columns.data);
    },
  },
  actions: {
    async addNewPost(post: PostProps) {
      const { data } = await axios.post("/posts", post);
      this.posts.data[data._id] = data;
      return data;
    },
    async fetchColumns(params: loadParams = { currentPage: 1, pageSize: 3 }) {
      const { currentPage, pageSize } = params;
      // if (!this.columns.isLoaded) {
      //   const { data } = await axios.get("/columns");
      //   this.columns.data = arrToObj(data.data.list);
      //   this.columns.isLoaded = true;
      // }
      const { data } = await axios.get(
        `/columns?currentPage=${currentPage}&pageSize=${pageSize}`
      );
      const { list, count } = data.data;
      this.columns = {
        data: { ...this.columns.data, ...arrToObj(list) },
        isLoaded: true,
        total: count,
      };
      console.log(params);
      console.log(this.columns);
    },
    async fetchColumn(cid: string) {
      if (!this.columns.data[cid]) {
        const { data } = await axios.get(`/columns/${cid}`);
        this.columns.data[data.data._id] = data.data;
      }
    },
    async fetchPosts(cid: string) {
      if (!this.posts.loadedColumns.includes(cid)) {
        const { data } = await axios.get(`/columns/${cid}/posts`);
        this.posts.data = { ...this.posts.data, ...arrToObj(data.data.list) };
        this.posts.loadedColumns.push(cid);
      }
    },
    async fetchPost(pid: string) {
      const currentPost = this.posts.data[pid];
      if (!currentPost || !currentPost.content) {
        const { data } = await axios.get(`/posts/${pid}`);
        this.posts.data[data.data._id] = data.data;
        return data;
      } else {
        return Promise.resolve({ data: currentPost });
      }
    },
    async updatePost(pid: string, body: PostProps) {
      const { data } = await axios.patch(`/posts/${pid}`, body);
      this.posts.data[data._id] = data;
    },
    async deletePost(pid: string) {
      const { data } = await axios.delete(`/posts/${pid}`);
      delete this.posts.data[data._id];
      return data;
    },
    setLoading(status: boolean) {
      this.loading = status;
    },
    async userLogin(payload: LoginProps) {
      const { data } = await axios.post("/user/login", payload);
      console.log(data);
      if (data.code === 0) {
        const { token } = data.data;
        this.token = token;
        localStorage.setItem("token", token);
        this.fetchCurrentUser();
        return data;
      }
    },
    async fetchCurrentUser() {
      const token = this.token;
      if (token !== "") {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const { data } = await axios.get("/user/current");
        this.currentUser = { isLogin: true, ...data.data };
      }
    },
    setError(status: boolean, msg: string) {
      this.error = { status: status, message: msg };
    },
    logout() {
      this.token = "";
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    },
  },
});

export default useMainStore;
