import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
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
import { timeConverter } from "@/utils/time";
import { sendMessage, sendReaction } from "@/services/orbis";
import { useMessages } from "@/hooks/api";
import { useOrbisContext } from "context";

const context =
  "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w";

interface IMyProps {
  post: IndividualPost;
  orbisTag: string;
}

const MediaDetails: React.FC<IMyProps> = ({ post, orbisTag }) => {
  const { orbis } = useOrbisContext();
  const { isConnected } = useAccount();
  const [newMessage, setNewMessage] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const {
    data: messagesQueried,
    isLoading,
    refetch,
  } = useMessages(orbisTag, page);
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
      <p style={{ fontSize: "small", color: "#0000008d" }}>
        Owned by:{" "}
        <a style={{ color: "#198b6eb9" }} href={`/profile/${post.owner}`}>
          {post.owner.substring(
            post.owner.indexOf(":0x") + 1,
            post.owner.indexOf(":0x") + 8
          ) +
            "..." +
            post.owner.substring(35)}
        </a>
      </p>

      {!messagesQueried && isLoading && (
        <Center>
          <Stack
            sx={{
              maxWidth: 700,
            }}
          >
            <Text>Loading...</Text>
          </Stack>
        </Center>
      )}

      {messagesQueried?.data.map((message: any, i: number) => (
        <Paper
          key={i}
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
                await sendReaction(message.stream_id, "like", orbis).then(() =>
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
              component="a"
              radius="sm"
              rightIcon={<FaLaughSquint size={22} />}
              ml={4}
              onClick={async () =>
                await sendReaction(message.stream_id, "haha", orbis).then(() =>
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
              component="a"
              radius="sm"
              ml={4}
              rightIcon={<BiDislike size={22} />}
              onClick={async () =>
                await sendReaction(message.stream_id, "downvote", orbis).then(
                  () =>
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
      <Text>Current Page: {page}</Text>
      <Center my={14}>
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
      <Group>
        <TextInput
          my="lg"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          placeholder="Enter your message"
          sx={{ maxWidth: "240px" }}
        />
      </Group>
      {isConnected ? (
        <Button
          component="a"
          radius="lg"
          onClick={async () =>
            (await sendMessage(context, orbis, newMessage, orbisTag).then(() =>
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
    </Paper>
  );
};

export default MediaDetails;
