import {
  ActionIcon,
  Paper,
  SimpleGrid,
  Image,
  LoadingOverlay,
  Button,
  TextInput,
  Text,
  Group,
  Avatar,
  Switch,
} from "@mantine/core";
import React, { useState, useEffect } from "react";

import { ArrowLeft } from "tabler-icons-react";
import { useRouter } from "next/router";

import { usePost } from "@/hooks/api";
import { getCurrentChain } from "@/utils/chains";

import { Orbis } from "@orbisclub/orbis-sdk";

let orbis = new Orbis();

const PostPage = () => {
  const [user, setUser] = useState();
  const [reaction, setReaction] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);

  const router = useRouter();
  const currentChain = getCurrentChain(250);
  const { data: post, isLoading } = usePost(
    currentChain,
    router.query.id as string
  );

  const sendMessage = async function () {
    if (isEncrypted)
      await orbis.createPost(
        {
          body: newMessage,
          context:
            "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w",
          tags: [{ slug: router.query.id, title: router.query.id }],
        },
        {
          type: "custom",
          accessControlConditions: [
            {
              contractAddress: "0x3c046f8E210424317A5740CED78877ef0B3EFf4E",
              standardContractType: "ERC721",
              chain: "fantom",
              method: "balanceOf",
              parameters: [":userAddress"],
              returnValueTest: { comparator: ">=", value: "1" },
            },
          ],
        }
      );
    if (!isEncrypted)
      await orbis.createPost({
        body: newMessage,
        context:
          "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w",
        tags: [{ slug: router.query.id, title: router.query.id }],
      });
  };

  function timeConverter(UNIX_timestamp: number) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  const sendReaction = async function (id: string, reaction: string) {
    await orbis.react(id, reaction);
    setReaction(id + reaction);
  };

  const getMessage = async function (content: any) {
    if (content?.content?.body === "") {
      let res = await orbis.decryptPost(content.content);
      return res.result;
    }
    return content?.content?.body;
  };

  useEffect(() => {
    async function loadData() {
      let res = await orbis.isConnected();

      if (!router.isReady) return;

      if (res) {
        setUser(res);
      }

      if (!res) {
        let res = await orbis.connect();
        setUser(res);
      }

      let result = await orbis.getPosts({
        context:
          "kjzl6cwe1jw147hcck185xfdlrxq9zv0y0hoa6shzskqfnio56lhf8190yaei7w",
        tag: router.query.id,
      });

      const messagesData = await Promise.all(
        result.data.map(async (obj: object) => {
          return {
            ...obj,
            newData: await getMessage(obj),
          };
        })
      );

      setMessages(messagesData);
    }
    loadData();
  }, [router.isReady, router.query.id, newMessage, reaction]);

  return (
    <div>
      <LoadingOverlay visible={isLoading} />
      {post && (
        <>
          <ActionIcon
            onClick={() => router.back()}
            mb="md"
            color="teal"
            size="xl"
            radius="xl"
            variant="filled"
          >
            <ArrowLeft />
          </ActionIcon>
          <SimpleGrid
            breakpoints={[
              { minWidth: "md", cols: 2, spacing: "lg" },
              { maxWidth: "md", cols: 1, spacing: "md" },
            ]}
          >
            <Image
              height={550}
              fit="contain"
              src={post.image ?? "https://evm.pinsave.app/PinSaveCard.png"}
              alt={post.name}
            />

            <Paper shadow="sm" p="md" withBorder>
              <h2 style={{ marginBottom: "1.4rem" }}>{post.name}</h2>
              <Paper
                shadow="xs"
                withBorder
                px="xs"
                sx={{ backgroundColor: "#82c7fc1d" }}
              >
                <p>{post.description}</p>
              </Paper>
              <p style={{ fontSize: "small", color: "#0000008d" }}>
                Owned by:{" "}
                <a
                  style={{ color: "#198b6eb9" }}
                  href={`https://evm.pinsave.app/profile/${post.owner}`}
                >
                  {post.owner}
                </a>
              </p>
              {messages &&
                messages.map((message: any, i: number) => (
                  <Paper
                    key={i}
                    shadow="xs"
                    mt={4}
                    sx={{ backgroundColor: "#80c7fc1d" }}
                    withBorder
                    px="xl"
                  >
                    <Group spacing="xs">
                      <Avatar size={25} color="blue">
                        <Image
                          src={
                            message.creator_details.profile?.pfp ??
                            "https://evm.pinsave.app/PinSaveCard.png"
                          }
                          alt="profile"
                        />
                      </Avatar>
                      <Text mt={3}>
                        <a
                          href={`https://evm.pinsave.app/profile/${message.creator.substring(
                            message.creator.indexOf(":0x") + 1
                          )}`}
                          style={{ color: "#198b6eb9" }}
                        >
                          {message.creator_details.profile?.username ??
                            message.creator.substring(
                              message.creator.indexOf(":0x") + 1
                            )}
                        </a>
                        : {message.newData}
                      </Text>
                    </Group>
                    <Button
                      size="xs"
                      component="a"
                      radius="sm"
                      onClick={() => sendReaction(message.stream_id, "like")}
                    >
                      {message.count_likes} ❤️
                    </Button>
                    <Button
                      size="xs"
                      component="a"
                      radius="sm"
                      ml={4}
                      onClick={() => sendReaction(message.stream_id, "haha")}
                    >
                      {message.count_haha} 🤣
                    </Button>
                    <Button
                      size="xs"
                      component="a"
                      radius="sm"
                      ml={4}
                      onClick={() =>
                        sendReaction(message.stream_id, "downvote")
                      }
                    >
                      {message.count_downvotes} 👎
                    </Button>
                    <Text sx={{ float: "right" }}>
                      {timeConverter(message.timestamp)}
                    </Text>
                  </Paper>
                ))}

              <Group>
                <TextInput
                  my="lg"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  placeholder="Enter your message"
                  sx={{ maxWidth: "240px" }}
                />
                <Text>Only for PinSave holders:</Text>
                <Switch
                  onClick={() => setIsEncrypted((prevCheck) => !prevCheck)}
                />
              </Group>
              <Button component="a" radius="lg" onClick={() => sendMessage()}>
                Send Message
              </Button>
            </Paper>
          </SimpleGrid>
        </>
      )}
    </div>
  );
};

export default PostPage;
