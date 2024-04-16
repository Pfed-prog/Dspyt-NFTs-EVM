import { useRouter } from "next/router";
import Image from "next/image";
import { mainnet, useEnsName, useEnsAvatar } from "wagmi";
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

import { PageSEO } from "@/components/SEO";
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
  } = useProfile(String(address));
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
                  height: 400,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  height={600}
                  width={550}
                  src={profileQueried?.pfp ?? ensAvatar ?? "/Rectangle.png"}
                  alt={profileQueried?.username ?? ""}
                  unoptimized={true}
                  style={{
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
                    minHeight: 120,
                  }}
                >
                  <Center>
                    <Title order={2}>{profileQueried?.username ?? ""}</Title>
                    <Title order={2}>{ensName ?? ""}</Title>
                  </Center>
                  <Center mt={15}>
                    <Text mx="auto">{profileQueried?.description ?? ""}</Text>
                  </Center>
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
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0m-2 14v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2m1 -17.87a4 4 0 0 1 0 7.75m5 10.12v-2a4 4 0 0 0 -3 -3.85"></path>
                      </svg>
                      <Text> Followers: {profileQueried?.followers ?? 0} </Text>
                      <Text> Following: {profileQueried?.following ?? 0} </Text>
                    </Group>
                  </Group>
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
