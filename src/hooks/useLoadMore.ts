import useMainStore from "../store";
import { ref, ComputedRef, computed } from "vue";

export interface loadParams {
  currentPage: number;
  pageSize: number;
}

const useLoadMore = (
  useFor: string,
  total: ComputedRef<number>,
  params: loadParams = { currentPage: 2, pageSize: 5 },
  cid?: string
) => {
  const store = useMainStore();
  const currentPage = ref(params.currentPage);
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize,
  }));

  let loadMorePage;
  if (useFor === "columns") {
    loadMorePage = () => {
      store.fetchColumns(requestParams.value).then(() => {
        currentPage.value++;
        console.log(requestParams);
      });
    };
  }
  if (useFor === "posts" && cid) {
    loadMorePage = () => {
      store.fetchPosts(cid, requestParams.value).then(() => {
        currentPage.value++;
        console.log(requestParams);
      });
    };
  }

  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value;
  });

  return { loadMorePage, isLastPage };
};

export default useLoadMore;
