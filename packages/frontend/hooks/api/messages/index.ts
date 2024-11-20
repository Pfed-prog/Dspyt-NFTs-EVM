import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { fetchOrbisMessages } from "./queries";

export const useMessagesInfiteQuery = (orbisTag: string) => {
  return useInfiniteQuery({
    queryKey: [orbisTag],
    queryFn: async ({ pageParam }: { pageParam?: number | undefined }) => {
      const data = await fetchOrbisMessages(orbisTag, { pageParam });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any, pages: any) => {
      if (Boolean(lastPage.hasMoreMessages)) {
        return pages.length;
      }
    },
  });
};

export const useMessages = (orbisTag: string, page?: number) => {
  return useQuery({
    queryKey: [orbisTag, page],
    queryFn: () => fetchOrbisMessages(orbisTag, { pageParam: page }),
  });
};
