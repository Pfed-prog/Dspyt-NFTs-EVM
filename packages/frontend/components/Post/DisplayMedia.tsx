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
  const xlScreen = useMediaQuery("(min-width: 2000px)");
  const largeScreen = useMediaQuery("(min-width: 700px)");
  const height = xlScreen ? 1200 : largeScreen ? 600 : 300;
  const width = xlScreen ? 800 : largeScreen ? 600 : 200;
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
            maxHeight: 500,
            maxWidth: 500,
          }}
        />
      ) : (
        <VideoPlayer {...post} />
      )}
    </Center>
  );
};

export default DisplayMedia;
