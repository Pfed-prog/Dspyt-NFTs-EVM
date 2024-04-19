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
  var pfp = "/IconLarge.png";
  var cover = "/background.png";
  var description = "";
  var followers = "";
  var following = "";

  const { data } = await orbis.getDids(userAddress);

  if (data[0].address !== undefined) {
    username = data[0].details.profile?.username;
    pfp = data[0].details.profile?.pfp;

    if (
      typeof data[0].details.profile?.cover === "string" &&
      data[0].details.profile?.cover !== ""
    ) {
      cover = data[0].details.profile?.cover;
    }

    description = data[0].details.profile?.description;
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
