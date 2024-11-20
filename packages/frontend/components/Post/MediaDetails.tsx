import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import {
  Paper,
  Button,
  TextInput,
  Text,
  Group,
  Avatar,
  Title,
  Center,
  Stack,
} from "@mantine/core";
import { BiDislike } from "react-icons/bi";
import { FaLaughSquint } from "react-icons/fa";
import { Heart } from "tabler-icons-react";

import type { IndividualPost } from "@/services/upload";
import { useOrbisContext } from "context";
import { useMessages } from "@/hooks/api";
import { sendMessage, sendReaction } from "@/services/orbis";
import { timeConverter } from "@/utils/time";
import { getContractInfo } from "@/utils/contracts";

interface IMyProps {
  post: IndividualPost;
  orbisTag: string;
}

const MediaDetails: React.FC<IMyProps> = ({ post, orbisTag }) => {
  const { orbis } = useOrbisContext();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { address: contractAddress, abi } = getContractInfo(chain?.id);

  const [postReceiver, setPostReceiver] = useState<`0x${string}` | undefined>();

  const [newMessage, setNewMessage] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const {
    data: messagesQueried,
    isFetched,
    isLoading,
    refetch,
  } = useMessages(orbisTag, page);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "transfer",
    args: [address, postReceiver, post.tokenIdBytes, true, ""],
  });
  const { data, write: writeMintPost } = useContractWrite(config);

  useWaitForTransaction({
    hash: data?.hash,
    onSettled() {
      refetch();
    },
  });

  useEffect(() => {
    if (postReceiver) {
      writeMintPost?.();
      setPostReceiver(undefined);
    }
  }, [postReceiver, data]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const reciever = formData.get("reciever") as `0x${string}`;
    setPostReceiver(reciever);
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
            post.author.indexOf(":0x") + 8
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
            post.owner.indexOf(":0x") + 8
          ) +
            "..." +
            post.owner.substring(35)}
        </a>
      </Text>

      {address === post.owner && (
        <form onSubmit={submit}>
          <Center mt="xs" mb="xs">
            <TextInput
              name="reciever"
              value={postReceiver}
              placeholder="Provide new address to your post"
            />
            <Button ml="xs" type="submit">
              Transfer
            </Button>
          </Center>
        </form>
      )}

      {!messagesQueried && isLoading && (
        <Center mt="md">
          <Stack
            sx={{
              maxWidth: 700,
            }}
          >
            <Text>Loading...</Text>
          </Stack>
        </Center>
      )}

      {isFetched && (
        <div>
          {messagesQueried?.data.map((message: IOrbisPost) => (
            <Paper
              key={message.stream_id}
              shadow="xs"
              mt={4}
              sx={{ backgroundColor: "#80c7fc1d" }}
              withBorder
              px="xl"
            >
              <Group spacing="xs">
                <Avatar size={40} color="blue">
                  <Image
                    width={36}
                    height={30}
                    src={message.creator_details.profile?.pfp ?? "/Pin.png"}
                    alt="profile"
                    unoptimized={true}
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </Avatar>
                <Text mt={3}>
                  <a
                    href={`/profile/${message.creator.substring(
                      message.creator.indexOf(":0x") + 1
                    )}`}
                    style={{ color: "#198b6eb9", fontSize: "smaller" }}
                  >
                    {message.creator_details.profile?.username ??
                      message.creator.substring(
                        message.creator.indexOf(":0x") + 1,
                        message.creator.indexOf(":0x") + 8
                      ) + "..."}
                  </a>
                  :
                  {message.content.encryptedBody
                    ? " encrypted message"
                    : " " + message.content.body}
                </Text>
              </Group>
              <Group>
                <Button
                  color="red"
                  size="xs"
                  component="a"
                  radius="sm"
                  rightIcon={<Heart fill="white" />}
                  onClick={async () =>
                    await sendReaction(message.stream_id, "like", orbis).then(
                      () =>
                        setTimeout(() => {
                          refetch();
                        }, 1000)
                    )
                  }
                >
                  {message.count_likes}
                </Button>
                <Button
                  size="xs"
                  radius="sm"
                  rightIcon={<FaLaughSquint size={22} />}
                  ml={4}
                  onClick={async () =>
                    await sendReaction(message.stream_id, "haha", orbis).then(
                      () =>
                        setTimeout(() => {
                          refetch();
                        }, 1000)
                    )
                  }
                >
                  {message.count_haha}
                </Button>
                <Button
                  color="blue"
                  size="xs"
                  radius="sm"
                  ml={4}
                  rightIcon={<BiDislike size={22} />}
                  onClick={async () =>
                    await sendReaction(
                      message.stream_id,
                      "downvote",
                      orbis
                    ).then(() =>
                      setTimeout(() => {
                        refetch();
                      }, 1000)
                    )
                  }
                >
                  {message.count_downvotes}
                </Button>
                <Text sx={{ fontSize: "small" }}>
                  {timeConverter(message.timestamp)}
                </Text>
              </Group>
            </Paper>
          ))}

          <Text my={10}>Current Page: {page + 1}</Text>
          <Center>
            <Button
              onClick={() => {
                setPage((page) => page - 1);
                setTimeout(() => {
                  refetch();
                }, 1000);
              }}
              mx="auto"
              disabled={page === 0}
            >
              prev
            </Button>
            <Button
              onClick={() => {
                setPage((page) => page + 1);
                setTimeout(() => {
                  refetch();
                }, 1000);
              }}
              mx="auto"
              disabled={messagesQueried?.hasMoreMessages === false}
            >
              next
            </Button>
          </Center>
        </div>
      )}

      <Center>
        <TextInput
          my="lg"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          placeholder="Enter your message"
          sx={{ maxWidth: "240px" }}
        />
        {address ? (
          <Button
            ml="xs"
            radius="lg"
            onClick={async () =>
              (await sendMessage(orbis, newMessage, orbisTag).then(() =>
                setTimeout(() => {
                  refetch();
                }, 1000)
              )) && setNewMessage("")
            }
          >
            Send Message
          </Button>
        ) : (
          <Text sx={{ marginLeft: "20px" }}>
            Connect Wallet to send messages and reactions
          </Text>
        )}
      </Center>
    </Paper>
  );
};

export default MediaDetails;
