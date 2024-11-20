import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
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
import { useAccount } from "wagmi";

import { useOrbisContext } from "context";
import { PageSEO } from "@/components/SEO";
import TwoPersonsIcon from "@/components/Icons/TwoPersonsIcon";
import { dropzoneChildren } from "@/components/UploadForm";

const Upload = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  const { orbis } = useOrbisContext();
  const { address: senderAddress } = useAccount();
  const [user, setUser] = useState<IOrbisProfileDetails>();

  const [cover, setCover] = useState<File | undefined>();
  const [image, setImage] = useState<File | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      if (senderAddress) {
        const responseIsConnected = await orbis.isConnected();

        if (responseIsConnected === false) {
          const responseConnect = await orbis.connect_v2({
            chain: "ethereum",
            lit: false,
          });
          setUser(responseConnect.details);
        }
        if (responseIsConnected !== false) {
          setUser(responseIsConnected.details);
        }
      }
    };
    fetchData();
  }, [orbis, senderAddress]);

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
        username: username ?? user?.profile?.username ?? "",
        pfp: cidPfp ?? user?.profile?.pfp ?? "/Rectangle.png",
        cover: cidCover ?? user?.profile?.cover ?? "/background.png",
        description: description ?? user?.profile?.description ?? "",
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
      username: username ?? user?.profile?.username ?? "",
      description: description ?? user?.profile?.description ?? "",
      pfp: user?.profile?.pfp ?? "https://evm.pinsave.app/Rectangle.png",
      cover: user?.profile?.cover ?? "https://evm.pinsave.app/background.png",
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
    router.reload();
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
              src={user?.profile?.cover ?? "/background.png"}
              radius="xs"
              style={{
                height: "auto",
                borderRadius: "10px",
              }}
            >
              <Stack
                spacing="xs"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: 600,
                }}
              >
                <Image
                  height={200}
                  width={200}
                  src={user?.profile?.pfp ?? "/Rectangle.png"}
                  alt={user?.profile?.username ?? "user profile picture"}
                  style={{
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
                <Card
                  shadow="sm"
                  p="lg"
                  radius="lg"
                  withBorder
                  mx="auto"
                  style={{
                    maxWidth: 400,
                    maxHeight: 600,
                    width: "96%",
                  }}
                >
                  {!senderAddress && (
                    <Title order={3} mt="sm" mb="sm" align="center">
                      Connect Wallet to update your profile
                    </Title>
                  )}
                  <Title mx="auto" order={2} align="center">
                    {user?.profile?.username ?? ""}
                  </Title>
                  <Text mt={15} mx="auto" align="center">
                    {user?.profile?.description ?? ""}
                  </Text>
                  <Group mt={10} position="center">
                    <Group position="center" mt="md" mb="xs">
                      <TwoPersonsIcon />
                      <Text>Followers: {user?.count_followers ?? 0}</Text>
                      <Text>Following: {user?.count_following ?? 0}</Text>
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
                    </Group>
                  </Group>
                </Card>
              </Stack>
            </BackgroundImage>
          </Box>
          <Paper
            mt="xl"
            shadow="xl"
            radius="lg"
            sx={{ maxWidth: "900px", backgroundColor: "#82c7fc1d" }}
            mx="auto"
          >
            <Title order={1} align="center">
              Update Profile Data
            </Title>
            <TextInput
              mt="lg"
              size="md"
              label="Change Username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value as `0x${string}`)}
              mx="auto"
              style={{
                maxWidth: 400,
                textAlign: "center",
                WebkitBackgroundClip: "text",
              }}
              sx={{
                background: "green",
              }}
            />
            <TextInput
              mt="sm"
              size="md"
              label="Change Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mx="auto"
              style={{
                maxWidth: 400,
                textAlign: "center",
                WebkitBackgroundClip: "text",
              }}
              sx={{
                background: "green",
              }}
            />
            <Title
              mt="lg"
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
            {senderAddress && (
              <Center>
                <Button
                  mt="sm"
                  mb="sm"
                  size="md"
                  onClick={() => updateProfile()}
                >
                  Submit
                </Button>
              </Center>
            )}
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Upload;
