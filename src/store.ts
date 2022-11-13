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
  avatar?: AvatarProps | string;
  title?: string;
  description?: string;
}

export interface UserProps {
  isLogin?: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  description?: string;
  avatar?: AvatarProps | string;
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
        currentPage: 0,
        total: 0,
      },
      posts: {
        data: {} as ListProps<PostProps>,
        loadedColumns: {} as ListProps<{
          total?: 0;
          currentPage?: 1;
        }>,
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
    getUserLink: (state) => {
      return "/user/" + state.currentUser._id;
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
      if (this.columns.currentPage < currentPage) {
        const { data } = await axios.get(
          `/columns?currentPage=${currentPage}&pageSize=${pageSize}`
        );
        const { list, count } = data.data;
        const currentPageP = data.data.currentPage;
        this.columns = {
          data: { ...this.columns.data, ...arrToObj(list) },
          currentPage: currentPageP * 1,
          total: count,
        };
      }
    },
    async fetchColumn(cid: string) {
      if (!this.columns.data[cid]) {
        const { data } = await axios.get(`/columns/${cid}`);
        this.columns.data[data.data._id] = data.data;
        return data;
      }
    },
    async fetchPosts(
      cid: string,
      params: loadParams = { currentPage: 1, pageSize: 3 }
    ) {
      const { currentPage, pageSize } = params;
      if (
        !this.posts.loadedColumns[cid] ||
        (this.posts.loadedColumns[cid].currentPage || 1) < currentPage
      ) {
        const { data } = await axios.get(
          `columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`
        );
        const { list, count } = data.data;
        const currentPageP = data.data.currentPage;
        this.posts = {
          data: { ...this.posts.data, ...arrToObj(list) },
          loadedColumns: {
            ...this.posts.loadedColumns,
            ...arrToObj([
              { _id: cid, total: count, currentPage: currentPageP },
            ]),
          },
        };
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
    async updateUserInfo(id: string, payload: UserProps) {
      const { data } = await axios.patch(`/user/${id}`, payload);
      this.currentUser = { ...this.currentUser, ...data.data };
      console.log(this.currentUser);
      return data;
    },
    async updateColumnInfo(cid: string, payload: ColumnProps) {
      const { data } = await axios.patch(`/columns/${cid}`, payload);
      this.columns.data[cid] = data.data;
      console.log(this.columns.data[cid]);
      return data;
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
