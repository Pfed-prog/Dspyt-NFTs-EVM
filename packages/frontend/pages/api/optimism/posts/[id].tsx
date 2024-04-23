import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, InfuraProvider } from "ethers";

import { ObjectJsonMetadata, fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { address, abi } = getContractInfo(10);

    const provider: InfuraProvider = new InfuraProvider(
      "optimism",
      process.env.NEXT_PUBLIC_INFURA_OPTIMISM
    );

    const contract: Contract = new Contract(address, abi, provider);

    const postData: {
      author: string;
      cid: string;
      id: string;
      tokenId: string;
    } = await contract.postByTokenId(id);

    const objectJsonMetadata: ObjectJsonMetadata = await fetchDecodedPost(
      postData.cid
    );
    const owner: string = await contract.getPostOwner(id);

    res.status(200).json({
      ...objectJsonMetadata,
      author: postData.author,
      owner: owner,
      tokenIdBytes: postData.tokenId,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
