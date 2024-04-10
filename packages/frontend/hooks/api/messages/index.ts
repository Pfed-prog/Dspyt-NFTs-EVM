import { useQuery } from "@tanstack/react-query";

import { fetchMessages } from "./queries";

export const useMessages = (orbisTag: string) => {
  return useQuery({
    queryKey: [orbisTag],
    queryFn: () => fetchMessages(orbisTag),
  });
};
