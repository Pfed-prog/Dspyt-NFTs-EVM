import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

const orbis: IOrbis = new Orbis();

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
  try {
    const { slug } = req.query;
    console.log(slug);
    if (slug?.length === 2) {
      const postId: string = slug[0];
      const page: number = Number(slug[1]);

      console.log("api page", page);

      const context =
        "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w";

      const result = await orbis.getPosts(
        {
          context: context,
          tag: postId,
        },
        page,
        5,
        false
      );
      const lenResult: number = result.data.length;
      const hasMoreMessages: boolean = lenResult === 5;
      console.log(lenResult);

      res.status(200).json({
        data: result.data,
        hasMoreMessages: hasMoreMessages,
      });
    }
    res.status(500).json({ error: "failed to fetch data" });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" + error });
  }
}
