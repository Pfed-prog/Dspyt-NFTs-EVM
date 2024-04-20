import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

import { contextOrbis } from "@/utils/contextConstant";

type dataOutCorrect = {
  data: IOrbisPost[];
  hasMoreMessages: boolean;
};

type dataOutError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<dataOutCorrect | dataOutError>
) {
  if (req.method === "POST") {
    const orbis: IOrbis = new Orbis();
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

    res.status(200).json({
      data: result.data,
      hasMoreMessages: hasMoreMessages,
    });
  }
  res.status(500).json({ error: "failed to fetch data" });
}
