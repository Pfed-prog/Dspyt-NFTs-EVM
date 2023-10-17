import { fetchMetadata } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";
import { JsonRpcProvider, Contract } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { number } = req.query;
    const pageNumber = Number(number) + 1;

    const { address, abi } = getContractInfo(314);
    const provider = new JsonRpcProvider("https://rpc.ankr.com/filecoin");

    const contract = new Contract(address, abi, provider);

    const totalSupply = Number(await contract.totalSupply());

    let items = [];
    let result;

    var upperLimit = 6 * pageNumber;

    const lowerLimit = upperLimit - 6 + 1;

    if (totalSupply < upperLimit) {
      upperLimit = totalSupply;
    }

    try {
      for (let i = lowerLimit; upperLimit >= i; i++) {
        result = await contract.getPost(i);

        const item = await fetchMetadata(result);

        items.push({ token_id: i, ...item });
      }
    } catch {
      res.status(200).json({ items: items, totalSupply: totalSupply });
    }

    res.status(200).json({ items: items, totalSupply: totalSupply });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch data" + err });
  }
}
