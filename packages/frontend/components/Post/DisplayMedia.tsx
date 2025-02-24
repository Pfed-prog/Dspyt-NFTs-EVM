import { useMediaQuery } from "@mantine/hooks";
import { Center } from "@mantine/core";
import Image from "next/image";

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

interface IMyProps {
  post: IndividualPost;
}

const DisplayMedia: React.FC<IMyProps> = ({ post }) => {
  const xxlScreenWidth = useMediaQuery("(min-width: 2000px)");
  const xlScreenWidth = useMediaQuery("(min-width: 1500px)");
  const largeScreenWidth = useMediaQuery("(min-width: 1200px)");
  const mediumScreenWidth = useMediaQuery("(min-width: 700px)");
  const smallScreenWidth = useMediaQuery("(min-width: 500px)");
  const width = xxlScreenWidth
    ? 1000
    : xlScreenWidth
      ? 700
      : largeScreenWidth
        ? 600
        : mediumScreenWidth
          ? 500
          : smallScreenWidth
            ? 400
            : 300;
  const xlScreenHeight = useMediaQuery("(min-height: 1000px)");
  const largeScreenHeight = useMediaQuery("(min-height: 800px)");
  const mediumScreenHeight = useMediaQuery("(min-height: 600px)");
  const smallScreenHeight = useMediaQuery("(min-height: 400px)");

  const height = xlScreenHeight
    ? 850
    : largeScreenHeight
      ? 650
      : mediumScreenHeight
        ? 450
        : smallScreenHeight
          ? 325
          : 250;

  return (
    <Center>
      <Image
        height={height}
        width={width}
        src={post.image}
        alt={post.name}
        style={{
          height: "95%",
          borderRadius: "10px",
          maxHeight: height,
          maxWidth: width,
        }}
      />
    </Center>
  );
};

export default DisplayMedia;
