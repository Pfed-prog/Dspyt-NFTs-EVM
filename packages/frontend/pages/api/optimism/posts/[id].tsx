import { ObjectJsonMetadata, fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";
import { Contract, InfuraProvider } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

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

    const linkMetadata: string = await contract.getPostCid(id);

    const objectJsonMetadata: ObjectJsonMetadata =
      await fetchDecodedPost(linkMetadata);

    const author: string = await contract.getPostAuthor(id);
    const owner: string = await contract.getPostOwner(id);

    res
      .status(200)
      .json({ ...objectJsonMetadata, author: author, owner: owner });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
