import fetcher from "@/utils/fetcher";

export const fetchOrbisMessages = async (
  orbisTag: string,
  { pageParam = 0 }: { pageParam?: number } = {}
) => {
  try {
    return await fetcher(`/api/messages/${orbisTag}/${pageParam}`);
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};
