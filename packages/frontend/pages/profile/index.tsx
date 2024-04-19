import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Center,
  Group,
  Paper,
  Title,
  Text,
  TextInput,
  Stack,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { showNotification, updateNotification } from "@mantine/notifications";
import { NFTStorage } from "nft.storage";

import { PageSEO } from "@/components/SEO";
import { dropzoneChildren } from "@/components/UploadForm";
import { useOrbisContext } from "context";

const Upload = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const [cover, setCover] = useState<File | undefined>();
  const [image, setImage] = useState<File | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const { isConnected, connector } = useAccount();
  const { orbis } = useOrbisContext();
  const [user, setUser] = useState<IOrbisProfile>();

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      if (isConnected) {
        let res = await orbis.isConnected();
        setUser(res);
      }
    };
    fetchData();
  }, [orbis, isConnected, connector]);

  async function updateProfile() {
    await orbis.isConnected();
    showNotification({
      id: "upload-post",
      loading: true,
      title: "Uploading Data",
      message: "Data will be loaded in a couple of seconds",
      autoClose: false,
      disallowClose: true,
    });

    if (image || cover) {
      let cidPfp, cidCover;

      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_TOKEN,
      });

      if (image) {
        cidPfp = await client.storeBlob(new Blob([image]));
        cidPfp = "https://" + cidPfp + ".ipfs.nftstorage.link";
      }

      if (cover) {
        cidCover = await client.storeBlob(new Blob([cover]));
        cidCover = "https://" + cidCover + ".ipfs.nftstorage.link";
      }

      await orbis.updateProfile({
        username: username ?? user?.details?.profile?.username ?? "",
        pfp: cidPfp ?? user?.details?.profile?.pfp ?? "/Rectangle.png",
        cover: cidCover ?? user?.details?.profile?.cover ?? "/background.png",
        description: description ?? user?.details?.profile?.description ?? "",
      });

      updateNotification({
        id: "upload-post",
        color: "teal",
        title: "Profile uploaded successfully!!",
        message: "File uploaded successfully ",
      });

      return;
    }

    await orbis.updateProfile({
      username: username ?? user?.details?.profile?.username ?? "",
      description: description ?? user?.details?.profile?.description ?? "",
      pfp:
        user?.details?.profile?.pfp ?? "https://evm.pinsave.app/Rectangle.png",
      cover:
        user?.details?.profile?.cover ??
        "https://evm.pinsave.app/background.png",
    });

    updateNotification({
      id: "upload-post",
      color: "teal",
      title: "Profile uploaded successfully!!",
      message: "",
    });
  }

  async function logout() {
    orbis.logout();
    router.push("/");
  }

  return (
    <div>
      <PageSEO
        title={`Pin Save Profile Page`}
        description={`Pin Save decentralized Profile Page`}
      />
      {hasMounted && (
        <div>
          <Box sx={{ maxWidth: 1200, textAlign: "center" }} mx="auto">
            <BackgroundImage
              src={user?.details?.profile?.cover ?? "/background.png"}
              radius="xs"
              style={{
                height: "auto",
                borderRadius: "10px",
              }}
            >
              <Center>
                <Stack
                  spacing="xs"
                  sx={{
                    height: 400,
                  }}
                >
                  <Center>
                    <Image
                      height={200}
                      width={200}
                      src={user?.details?.profile?.pfp ?? "/Rectangle.png"}
                      alt={
                        user?.details?.profile?.username ??
                        "user profile picture"
                      }
                      style={{
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  </Center>
                  <Card
                    shadow="sm"
                    p="lg"
                    radius="lg"
                    withBorder
                    mx="auto"
                    style={{
                      minWidth: 400,
                      minHeight: 200,
                    }}
                  >
                    <Title mx="auto" order={2} align="center">
                      {user?.details?.profile?.username ?? ""}
                    </Title>
                    <Text mt={15} mx="auto" align="center">
                      {user?.details?.profile?.description ?? ""}
                    </Text>
                    <Group mt={10} position="center">
                      <Group position="center" mt="md" mb="xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-users"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0m-2 14v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2m1 -17.87a4 4 0 0 1 0 7.75m5 10.12v-2a4 4 0 0 0 -3 -3.85" />
                        </svg>
                        <Text>
                          Followers: {user?.details?.count_followers ?? 0}
                        </Text>
                        <Text>
                          Following: {user?.details?.count_following ?? 0}
                        </Text>
                        {isConnected && (
                          <Button
                            my={2}
                            size="sm"
                            color="red"
                            onClick={() => logout()}
                            style={{
                              zIndex: 1,
                            }}
                          >
                            Log Out
                          </Button>
                        )}
                      </Group>
                    </Group>
                  </Card>
                </Stack>
              </Center>
            </BackgroundImage>
          </Box>
          <Paper
            shadow="xl"
            p="md"
            radius="lg"
            sx={{ maxWidth: "700px", backgroundColor: "#82c7fc1d" }}
            mx="auto"
          >
            <TextInput
              my={12}
              size="md"
              label="Change Username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value as `0x${string}`)}
              mx="auto"
              style={{
                width: 300,
                textAlign: "center",
                WebkitBackgroundClip: "text",
              }}
              sx={{
                background: "green",
              }}
            />
            <TextInput
              my={12}
              size="md"
              label="Change Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mx="auto"
              style={{
                width: 300,
                textAlign: "center",
                WebkitBackgroundClip: "text",
              }}
              sx={{
                background: "green",
              }}
            />
            <Title
              mt={20}
              order={2}
              align="center"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              sx={(theme) => ({
                background: theme.fn.radialGradient("green", "white"),
              })}
            >
              Upload PFP
            </Title>
            <Center>
              <Dropzone
                mt="md"
                ml="xl"
                mr="xl"
                onReject={(files) => console.log("rejected files", files)}
                onDrop={(files) => setImage(files[0])}
                maxSize={25000000}
                multiple={false}
                sx={{ maxWidth: 500, maxHeight: 500, marginBottom: "1rem" }}
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.webp,
                  MIME_TYPES.svg,
                  MIME_TYPES.gif,
                ]}
              >
                {() => dropzoneChildren(image)}
              </Dropzone>
            </Center>
            <Title
              mt={20}
              order={2}
              align="center"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              sx={(theme) => ({
                background: theme.fn.radialGradient("green", "white"),
              })}
            >
              Upload Cover
            </Title>
            <Center>
              <Dropzone
                mt="md"
                ml="xl"
                mr="xl"
                onReject={(files) => console.log("rejected files", files)}
                onDrop={(files) => setCover(files[0])}
                maxSize={25000000}
                multiple={false}
                sx={{ maxWidth: 500, maxHeight: 500, marginBottom: "3rem" }}
                accept={[
                  MIME_TYPES.png,
                  MIME_TYPES.jpeg,
                  MIME_TYPES.webp,
                  MIME_TYPES.svg,
                  MIME_TYPES.gif,
                ]}
              >
                {() => dropzoneChildren(cover)}
              </Dropzone>
            </Center>
            <Center>
              <Button
                my={12}
                mt={20}
                size="md"
                onClick={() => updateProfile()}
                mx="auto"
              >
                Submit
              </Button>
            </Center>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Upload;
