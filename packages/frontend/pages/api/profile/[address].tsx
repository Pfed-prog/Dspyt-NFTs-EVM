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
    const username = String(data[0].details.profile?.username);
    const pfp = String(data[0].details.profile?.pfp);
    const cover = String(data[0].details.profile?.cover);
    const description = String(data[0].details.profile?.description);
    const followers = data[0].details.count_followers;
    const following = data[0].details.count_following;

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
