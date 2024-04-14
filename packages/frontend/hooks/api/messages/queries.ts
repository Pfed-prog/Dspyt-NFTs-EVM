import fetcher from "@/utils/fetcher";

export const fetchOrbisMessages = async (
  orbisTag: string,
  { pageParam = 0 }: { pageParam?: number } = {}
) => {
  try {
    const apiRoute: string = `/api/messages/${orbisTag}/${pageParam}`;
    console.log(apiRoute);
    return await fetcher(apiRoute);
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};
