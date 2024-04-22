import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const orbis: IOrbis = new Orbis();
  const { address } = req.query;

  const userAddress: string = String(address);

  const { data } = await orbis.getDids(userAddress);

  if (data.length === 0) {
    res.status(200).json({
      address: address,
    });
  }

  if (data[0]) {
    let username: string | undefined = data[0].details.profile?.username;
    if (username === "undefined" || undefined) {
      username = undefined;
    }
    let pfp: string | undefined = data[0].details.profile?.pfp;
    if (pfp === "undefined" || undefined) {
      pfp = undefined;
    }
    let cover: string | undefined = data[0].details.profile?.cover;
    if (cover === "undefined" || undefined) {
      cover = undefined;
    }
    let description: string | undefined = data[0].details.profile?.description;
    if (description === "undefined" || undefined) {
      description = undefined;
    }
    const followers: number = data[0].details.count_followers;
    const following: number = data[0].details.count_following;

    res.status(200).json({
      address: address,
      username: username,
      pfp: pfp,
      cover: cover,
      description: description,
      followers: followers,
      following: following,
    });
  }
}
