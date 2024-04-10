import type { NextApiRequest, NextApiResponse } from "next";
import { Orbis } from "@orbisclub/orbis-sdk";

const orbis: IOrbis = new Orbis();

type dataOut = {
  data: IOrbisPost[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<dataOut>
) {
  const { id } = req.query;
  const postId: string = String(id);

  const context =
    "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w";

  const result = await orbis.getPosts(
    {
      context: context,
      tag: postId,
    },
    0,
    5
  );

  res.status(200).json({
    data: result.data,
  });
}
