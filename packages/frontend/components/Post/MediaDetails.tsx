import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

import { Paper, Button, TextInput, Text, Title, Center } from "@mantine/core";

import type { IndividualPost } from "@/services/upload";
import { getContractInfo } from "@/utils/contracts";

interface IMyProps {
  post: IndividualPost;
}

const MediaDetails: React.FC<IMyProps> = ({ post }) => {
  const { address } = useAccount();
  const { address: contractAddress, abi } = getContractInfo();

  const [postReceiver, setPostReceiver] = useState<`0x${string}` | undefined>();

  const { writeContract } = useWriteContract();

  function handleTextareaChange(e: any) {
    setPostReceiver(e.target.value);
  }

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Title mb="1.4rem">{post.name}</Title>
      <Paper
        shadow="xs"
        withBorder
        px="xs"
        sx={{ backgroundColor: "#82c7fc1d" }}
      >
        <Text my={2}>{post.description}</Text>
      </Paper>

      <Text mt="xs" style={{ fontSize: "small", color: "#0000008d" }}>
        Author:{" "}
        <a style={{ color: "#198b6eb9" }} href={`/profile/${post.author}`}>
          {post.author.substring(
            post.author.indexOf(":0x") + 1,
            post.author.indexOf(":0x") + 8,
          ) +
            "..." +
            post.author.substring(35)}
        </a>
      </Text>

      <Text style={{ fontSize: "small", color: "#0000008d" }}>
        Owned by:{" "}
        <a style={{ color: "#198b6eb9" }} href={`/profile/${post.owner}`}>
          {post.owner.substring(
            post.owner.indexOf(":0x") + 1,
            post.owner.indexOf(":0x") + 8,
          ) +
            "..." +
            post.owner.substring(35)}
        </a>
      </Text>

      {address === post.owner && (
        <Center mt="xs" mb="xs">
          <TextInput
            name="reciever"
            value={postReceiver}
            onChange={handleTextareaChange}
            placeholder="Provide new address to your post"
          />
          <Button
            ml="xs"
            onClick={() => {
              writeContract({
                address: contractAddress,
                abi: abi,
                functionName: "transferFrom",
                args: [address, postReceiver, true, ""],
              });
            }}
          >
            Transfer
          </Button>
        </Center>
      )}
    </Paper>
  );
};

export default MediaDetails;
