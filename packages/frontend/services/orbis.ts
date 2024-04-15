import { NextRouter } from "next/router";

import { getContractInfo } from "@/utils/contracts";
import { contextOrbis } from "@/utils/contextConstant";

export const sendMessage = async function (
  orbis: IOrbis,
  newMessage: string,
  tag: string
) {
  await orbis.isConnected();
  const response: IOrbisResponse = await orbis.createPost({
    body: newMessage,
    context: contextOrbis,
    tags: [{ slug: tag, title: tag }],
  });
  return response;
};

export const sendReaction = async function (
  id: string,
  reaction: string,
  orbis: IOrbis
) {
  await orbis.isConnected();
  const response: IOrbisResponse = await orbis.react(id, reaction);
  return response;
};

export const getMessage = async function (content: any, orbis: IOrbis) {
  if (content?.content?.body === "") {
    let res = await orbis.decryptPost(content.content);
    return res.result;
  }
  return content?.content?.body;
};

export async function loadData(
  orbis: IOrbis,
  router: NextRouter,
  context: string,
  tag: string
) {
  if (!router.isReady) return;

  const result = await orbis.getPosts(
    {
      context: context,
      tag: tag,
    },
    0,
    5
  );

  const messagesData = await Promise.all(
    result.data.map(async (obj: object) => {
      return {
        ...obj,
        newData: await getMessage(obj, orbis),
      };
    })
  );
  return messagesData;
}

export async function decryptPost(content: any, orbis: IOrbis) {
  const res = await orbis.decryptPost(content);
  console.log(res);
  return res;
}

export const sendEncryptedMessage = async function (
  context: string,
  orbis: IOrbis,
  newMessage: string,
  tag: string
) {
  const { address } = getContractInfo();
  const response: IOrbisResponse = await orbis.createPost(
    {
      body: newMessage,
      context: context,
      tags: [{ slug: tag, title: tag }],
    },
    {
      type: "custom",
      accessControlConditions: [
        {
          contractAddress: address,
          chain: "optimism",
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: { comparator: ">=", value: "1" },
        },
      ],
    }
  );
  return response;
};
