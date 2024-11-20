import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import type { ChainName } from "@/constants/chains";
import { fetchPosts, fetchPost } from "./queries";

export const usePosts = (chain: ChainName) => {
  return useInfiniteQuery({
    queryKey: [chain],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const data = await fetchPosts(chain, { pageParam });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any, pages: any) => {
      if (lastPage.items[5]?.token_id < lastPage.totalSupply) {
        return pages.length + 1;
      }
    },
  });
};

export const usePost = (chain: ChainName, id: string) => {
  return useQuery({
    queryKey: [chain, id],
    queryFn: () => fetchPost(chain, id),
  });
};
