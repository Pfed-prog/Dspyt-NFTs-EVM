import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

import { contextOrbis } from "@/utils/contextConstant";

type dataOutCorrect = {
  data: IOrbisPost[];
  hasMoreMessages: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<dataOutCorrect>
) {
  if (req.method === "POST") {
    const orbis: IOrbis = new Orbis();
    console.log(orbis);
    const data: { postId: string; page: number } = req.body;
    console.log(data);
    const postId: string = String(data.postId);
    const page: number = Number(data.page);

    const result = await orbis.getPosts(
      {
        context: contextOrbis,
        tag: postId,
      },
      page,
      5,
      false
    );
    const lenResult: number = result.data.length;
    const hasMoreMessages: boolean = lenResult === 5;
    console.log(result.data);
    console.log(hasMoreMessages);
    res.status(200).json({
      data: result.data,
      hasMoreMessages: hasMoreMessages,
    });
  }
}