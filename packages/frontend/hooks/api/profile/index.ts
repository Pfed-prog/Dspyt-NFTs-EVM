import { useQuery } from "@tanstack/react-query";

import { fetchProfile } from "./queries";

export const useProfile = (address: string) => {
  return useQuery({
    queryKey: [address],
    queryFn: () => fetchProfile(address),
  });
};
