export const fetchProfile = async (address: string) => {
  try {
    const response: Response = await fetch(`/api/profile/${address}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
