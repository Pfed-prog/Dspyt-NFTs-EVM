import { NFTStorage } from "nft.storage";

export type PostDataUpload = {
  name: string;
  description: string;
  image: File;
};

export type PostData = {
  name: string;
  description: string;
  image: string;
};

export type Post = PostData & {
  token_id: number;
};

export type IndividualPost = Post & {
  owner: string;
  author: string;
  tokenIdBytes: string;
};

export type UploadingPost = {
  data: PostDataUpload;
  provider?: string;
};

export async function UploadData(incomingData: UploadingPost) {
  let metadata_url: string;

  if (incomingData.provider === "NFT.Storage") {
    const client = new NFTStorage({
      token: process.env.NEXT_PUBLIC_TOKEN,
    });

    const metadata = await client.store({
      ...incomingData.data,
    });

    metadata_url = metadata.url;
    return metadata_url;
  }

  if (incomingData.provider === "NFTPort") {
    let image_ipfs: string;

    const formData = new FormData();
    formData.append("file", incomingData.data.image);

    const options = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFTPORT,
      },
    };

    const rawResponse: Response = await fetch(
      "https://api.nftport.xyz/v0/files",
      options
    );
    const content: {
      response: string;
      ipfs_url: string;
      file_name: string;
      content_type: string;
      file_size: number;
    } = await rawResponse.json();
    image_ipfs =
      "ipfs://" +
      content.ipfs_url.substring(content.ipfs_url.indexOf("ipfs/") + 5);

    const optionsPost = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_NFTPORT,
      },
      body: JSON.stringify({
        name: incomingData.data.name,
        description: incomingData.data.description,
        image: image_ipfs,
        file_url: image_ipfs,
      }),
    };

    const rawMetadataResponse: Response = await fetch(
      "https://api.nftport.xyz/v0/metadata",
      optionsPost
    );

    const metadata: {
      description: string;
      file_url: string;
      metadata_uri: string;
      name: string;
      response: string;
    } = await rawMetadataResponse.json();

    metadata_url = metadata.metadata_uri;
    return metadata_url;
  }

  if (incomingData.provider === "Estuary") {
    let image_ipfs;
    const formData = new FormData();
    formData.append("data", incomingData.data.image);

    const rawResponse = await fetch("https://upload.estuary.tech/content/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESTUARY}`,
      },
      body: formData,
    });

    const content = await rawResponse.json();
    image_ipfs = "ipfs://" + content.cid;

    const formDataJson = new FormData();

    const blob = new Blob(
      [
        JSON.stringify({
          name: incomingData.data.name,
          description: incomingData.data.description,
          image: image_ipfs,
        }),
      ],
      {
        type: "application/json",
      }
    );
    const files = [new File([blob], "metadata.json")];

    formDataJson.append("data", files[0]);

    const optionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESTUARY}`,
      },
      body: formDataJson,
    };

    const rawMetadataResponse = await fetch(
      "https://upload.estuary.tech/content/add",
      optionsPost
    );
    const metadata = await rawMetadataResponse.json();

    metadata_url = "ipfs://" + metadata.cid;
    return metadata_url;
  }
}
