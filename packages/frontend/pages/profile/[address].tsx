import { useRouter } from "next/router";
import Image from "next/image";
import {
  BackgroundImage,
  Box,
  Card,
  Center,
  Group,
  Title,
  Text,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { mainnet, useEnsName, useEnsAvatar } from "wagmi";

import { PageSEO } from "@/components/SEO";
import TwoPersonsIcon from "@/components/Icons/TwoPersonsIcon";
import { useProfile } from "@/hooks/api";

function Post() {
  const router = useRouter();

  const { address } = router.query;
  const userAddress = address as `0x${string}` | undefined;

  const { data: ensName } = useEnsName({
    address: userAddress,
    chainId: mainnet.id,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  });

  const {
    data: profileQueried,
    isLoading,
    isFetched,
  } = useProfile(String(userAddress));

  return (
    <div>
      <PageSEO
        title={`Pin Save Profile Page ${address}`}
        description={`Pin Save decentralized Profile Page ${address}`}
      />
      {isFetched ? (
        <Box sx={{ maxWidth: 1200, textAlign: "center" }} mx="auto">
          <BackgroundImage
            src={profileQueried?.cover ?? "/background.png"}
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
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  height={600}
                  width={600}
                  src={profileQueried?.pfp ?? ensAvatar ?? "/Rectangle.png"}
                  alt={profileQueried?.username ?? ""}
                  unoptimized={true}
                  style={{
                    maxHeight: 800,
                    width: "80%",
                    height: "50%",
                    borderRadius: "10px",
                    marginTop: "10px",
                    marginLeft: "5px",
                    marginRight: "5px",
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
                    minWidth: 300,
                    maxHeight: 600,
                    width: "95%",
                  }}
                >
                  <Title order={2}>{profileQueried?.username ?? ""}</Title>
                  <Title order={2}>{ensName ?? ""}</Title>
                  <Text mx="auto">{profileQueried?.description ?? ""}</Text>

                  <Center mt="md">
                    <TwoPersonsIcon />
                    <Text ml="xs">
                      {`Followers: ${profileQueried?.followers ?? 0}`}
                    </Text>
                    <Text ml="xs">{`Following: ${
                      profileQueried?.following ?? 0
                    }`}</Text>
                  </Center>
                </Card>
              </Stack>
            </Center>
          </BackgroundImage>
        </Box>
      ) : (
        <LoadingOverlay visible={isLoading} />
      )}
    </div>
  );
}

export default Post;
