import { useMediaQuery } from "@mantine/hooks";
import { Center } from "@mantine/core";
import Image from "next/image";

import type { IndividualPost } from "@/services/upload";
import VideoPlayer from "@/components/Post/VideoPlayer";
import { IsNotMp4 } from "@/utils/media";

interface IMyProps {
  post: IndividualPost;
}

const DisplayMedia: React.FC<IMyProps> = ({ post }) => {
  const xlScreenWidth = useMediaQuery("(min-width: 2000px)");
  const largeScreenWidth = useMediaQuery("(min-width: 1200px)");
  const mediumScreenWidth = useMediaQuery("(min-width: 700px)");
  const smallScreenWidth = useMediaQuery("(min-width: 500px)");
  const width = xlScreenWidth
    ? 800
    : largeScreenWidth
    ? 600
    : mediumScreenWidth
    ? 500
    : smallScreenWidth
    ? 400
    : 300;
  const xlScreenHeight = useMediaQuery("(min-height: 1400px)");
  const largeScreenHeight = useMediaQuery("(min-height: 1200px)");
  const mediumScreenHeight = useMediaQuery("(min-height: 700px)");
  const smallScreenHeight = useMediaQuery("(min-height: 500px)");

  const height = xlScreenHeight
    ? 1200
    : largeScreenHeight
    ? 600
    : mediumScreenHeight
    ? 500
    : smallScreenHeight
    ? 400
    : 300;

  return (
    <Center>
      {IsNotMp4(post?.image) ? (
        <Image
          height={height}
          width={width}
          src={post.image}
          alt={post.name}
          style={{
            borderRadius: "10px",
            maxHeight: height,
            maxWidth: width,
          }}
        />
      ) : (
        <VideoPlayer {...post} />
      )}
    </Center>
  );
};

export default DisplayMedia;
