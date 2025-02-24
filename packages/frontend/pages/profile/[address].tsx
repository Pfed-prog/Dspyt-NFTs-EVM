import { useRouter } from "next/router";
import Image from "next/image";
import {
  BackgroundImage,
  Box,
  Card,
  Center,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useEnsName, useEnsAvatar, http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

import { PageSEO } from "@/components/SEO";
import TwoPersonsIcon from "@/components/Icons/TwoPersonsIcon";

function Post() {
  const router = useRouter();

  const { address } = router.query;
  const userAddress = address as `0x${string}` | undefined;

  const config = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET),
    },
  });

  const { data: ensName } = useEnsName({
    address: userAddress,
    chainId: 1,
    config,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? "",
    chainId: 1,
    config,
  });

  return (
    <div>
      <PageSEO
        title={`PinSave Profile Page ${address}`}
        description={`PinSave decentralized Profile Page ${address}`}
      />

      <Box sx={{ maxWidth: 1200, textAlign: "center" }} mx="auto">
        <BackgroundImage
          src={"/background.png"}
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
                src={ensAvatar ?? "/Rectangle.png"}
                alt={""}
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
                <Title order={2}>{""}</Title>
                <Title order={2}>{ensName ?? ""}</Title>
                <Text mx="auto">{""}</Text>

                <Center mt="md">
                  <TwoPersonsIcon />
                  <Text ml="xs">{`Followers: ${0}`}</Text>
                  <Text ml="xs">{`Following: ${0}`}</Text>
                </Center>
              </Card>
            </Stack>
          </Center>
        </BackgroundImage>
      </Box>
    </div>
  );
}

export default Post;
