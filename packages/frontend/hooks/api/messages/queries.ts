export const fetchOrbisMessages = async (
  orbisTag: string,
  { pageParam = 0 }: { pageParam?: number } = {}
) => {
  try {
    const apiRoute: string = `/api/messages/orbisPosts`;
    const response: Response = await fetch(apiRoute, {
      mode: "cors",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ postId: orbisTag, page: pageParam }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};
