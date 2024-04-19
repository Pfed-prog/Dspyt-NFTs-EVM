import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const orbis: IOrbis = new Orbis();
  const { address } = req.query;

  const userAddress: string = String(address);

  var username = "";
  var pfp = "/Rectangle.png";
  var cover = "/background.png";
  var description = "";
  var followers = 0;
  var following = 0;

  const { data } = await orbis.getDids(userAddress);

  if (data.length === 0) {
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

  if (data[0]) {
    username = String(data[0].details.profile?.username);
    pfp = String(data[0].details.profile?.pfp);
    cover = String(data[0].details.profile?.cover);
    description = String(data[0].details.profile?.description);
    followers = data[0].details.count_followers;
    following = data[0].details.count_following;
  }

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
