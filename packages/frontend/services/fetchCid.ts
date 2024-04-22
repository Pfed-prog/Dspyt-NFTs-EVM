import { parseCidDweb, parseCidNFTStorage } from "@/services/parseCid";

export type ObjectJsonMetadata = {
  name: string;
  description: string;
  image: string;
};

export async function fetchJson(resURL: string, resURL2: string) {
  let item;
  try {
    item = await fetch(resURL).then((x) => x.json());
  } catch {
    item = await fetch(resURL2).then((x) => x.json());
  }
  return item;
}

export async function fetchWorkingImageUrl(resURL1: string, resURL2: string) {
  const image: string = "https://pinsave.app/PinSaveCard.png";

  const res1: Response = await fetch(resURL1);
  const headersRes1: string | null = res1.headers.get("content-type");
  if (headersRes1 === "text/html") {
    const lastIndex = resURL1.lastIndexOf("/");
    const constPart = resURL1.substring(0, lastIndex);
    const toUpdatePart = resURL1.substring(lastIndex);
    const updatedPart = toUpdatePart.replace("#", "%23");
    const newResURL1 = constPart + updatedPart;
    const updatedRes1: Response = await fetch(newResURL1);
    const newHeadersRes1: string | null = res1.headers.get("content-type");
    console.log(newHeadersRes1);
    if (updatedRes1.status === 200) return newResURL1;
  }

  if (res1.status === 200) return resURL1;

  const res2: Response = await fetch(resURL2);
  if (res2.status === 200) return resURL2;
  return image;
}

export async function parseString(result: string) {
  if (result.charAt(0) === "i") {
    const resURL: string = parseCidNFTStorage(result);
    const resURL2: string = parseCidDweb(result);
    return [resURL, resURL2];
  }
  throw new Error("nothing fetched");
}

export async function fetchMetadata(
  cidMetadata: string
): Promise<ObjectJsonMetadata> {
  const [resURL, resURL2] = await parseString(cidMetadata);
  const objectJsonMetadata: ObjectJsonMetadata = await fetchJson(
    resURL,
    resURL2
  );
  return objectJsonMetadata;
}

export async function fetchImage(cidImage: string) {
  const [resURL, resURL2] = await parseString(cidImage);
  const linkImage: string = await fetchWorkingImageUrl(resURL, resURL2);
  return linkImage;
}

export async function fetchDecodedPost(cidMetadata: string) {
  try {
    const objectJsonMetadata: ObjectJsonMetadata =
      await fetchMetadata(cidMetadata);
    try {
      const decodedImage: string = await fetchImage(objectJsonMetadata.image);
      const output = {
        ...objectJsonMetadata,
        image: decodedImage,
      };
      return output;
    } catch (e) {
      console.log(e);
      return {
        ...objectJsonMetadata,
        image: "/fail.webp",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      name: "Failed",
      description: "F for Failure",
      image: "/fail.webp",
    };
  }
}
