import { PinataSDK } from "pinata-web3";

export type PostDataUpload = {
  name: string;
  description: string;
  image: File;
};

export type PostData = {
  description: string;
  image: string;
  name: string;
};

export type Post = PostData & {
  tokenId: number;
};

export type IndividualPost = Post & {
  owner: string;
  author: string;
};

export type UploadingPost = {
  data: PostDataUpload;
  provider?: string;
};

export async function UploadData(incomingData: UploadingPost) {
  if (incomingData.provider === "Pinata") {
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
    });

    const uploadImage = await pinata.upload.file(incomingData.data.image);

    const image_ipfs =
      "https://gateway.pinata.cloud/ipfs/" + uploadImage.IpfsHash;

    const blob = new Blob([
      JSON.stringify({
        name: incomingData.data.name,
        description: incomingData.data.description,
        image: image_ipfs,
      }),
    ]);

    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });

    const upload = await pinata.upload.file(file);
    return upload.IpfsHash;
  }
}
