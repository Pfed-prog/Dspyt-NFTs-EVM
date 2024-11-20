import { Player } from "@livepeer/react";
import { Paper, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

import { IsNotMp4 } from "@/utils/media";
import type { Post } from "@/services/upload";

interface IMyProps {
  post: Post;
}

const PostCard: React.FC<IMyProps> = ({ post }) => {
  return (
    <Link href={`/optimism/posts/${post.token_id}`}>
      <Paper
        component="div"
        withBorder
        radius="lg"
        shadow="md"
        p="md"
        sx={{ cursor: "pointer" }}
      >
        {IsNotMp4(post.image) ? (
          <Image
            src={post.image}
            alt={post.name}
            height={200}
            width={200}
            sizes="200px"
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        ) : (
          <div
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              width: 200,
            }}
          >
            <Player
              src={post.image}
              muted={true}
              autoPlay
              loop
              controls={{
                autohide: 1000,
                defaultVolume: 0,
              }}
              autoUrlUpload={{
                fallback: true,
                ipfsGateway: "https://w3s.link",
              }}
              aspectRatio="1to1"
            />
          </div>
        )}
        <Text
          align="center"
          mt="sm"
          lineClamp={1}
          style={{
            width: 200,
          }}
        >
          {post.name}
        </Text>
      </Paper>
    </Link>
  );
};

export default PostCard;
