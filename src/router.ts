import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import ColumnDetail from "./pages/ColumnDetail.vue";
import Createpost from "./pages/Createpost.vue";
import useMainStore from "./store";
import Register from "./pages/Register.vue";
import PostDetail from "./pages/PostDetail.vue";
import UserEdit from "./pages/UserEdit.vue";
import UserInfo from "./components/UserInfo.vue";
import ColumnInfo from "./components/ColumnInfo.vue";

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    { path: "/", component: Home, name: "Home" },
    {
      path: "/login",
      component: Login,
      name: "Login",
      meta: { redirectAlreadyLogin: true },
    },
    {
      path: "/register",
      component: Register,
      name: "Register",
    },
    { path: "/column/:id", component: ColumnDetail, name: "ColumnDetail" },
    {
      path: "/create",
      component: Createpost,
      name: "CreatePost",
      meta: { needAuthendicated: true },
    },
    { path: "/post/:id", component: PostDetail, name: "PostDetail" },
    {
      path: "/user/:id",
      component: UserEdit,
      name: "UserEdit",
      meta: { needAuthendicated: true },
      children: [
        {
          path: "",
          name: "user",
          component: UserInfo,
        },
        {
          path: "columnInfo",
          name: "columnInfo",
          component: ColumnInfo,
        },
      ],
    },
  ],
});

router.beforeEach((to, _, next) => {
  const store = useMainStore();
  const { currentUser, token } = store.$state;
  const { redirectAlreadyLogin, needAuthendicated } = to.meta;
  if (!currentUser.isLogin) {
    if (token) {
      store
        .fetchCurrentUser()
        .then((res) => {
          if (redirectAlreadyLogin) {
            next("/");
          } else {
            next();
          }
        })
        .catch(() => {
          store.logout();
          next("login");
        });
    } else {
      if (needAuthendicated) {
        next("login");
      } else {
        next();
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
