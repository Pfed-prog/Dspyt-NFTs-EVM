import {
  Text,
  Paper,
  Title,
  TextInput,
  Textarea,
  Group,
  Button,
  Image,
  Center,
  MediaQuery,
  NativeSelect,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Upload, Replace } from "tabler-icons-react";
import {
  useAccount,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { zeroPadValue, hexlify, randomBytes } from "ethers";

import { UploadData } from "@/services/upload";
import { getContractInfo } from "@/utils/contracts";

export const dropzoneChildren = (image: File | undefined) => {
  if (image) {
    let link = URL.createObjectURL(image);
    return (
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        {image.type[0] === "i" ? (
          <Image
            src={link}
            alt="uploaded image"
            my="md"
            radius="lg"
            sx={{ maxWidth: "240px" }}
          />
        ) : (
          <ReactPlayer url={link} />
        )}
        <Group sx={{ color: "#3a3a3a79" }}>
          <MediaQuery
            query="(max-width:500px)"
            styles={{
              marginLeft: "auto",
              marginRight: "auto",
              maxHeight: "30px",
            }}
          >
            <Replace size={40} />
          </MediaQuery>
          <Text size="md" inline align="center">
            Click/Drag here to replace image
          </Text>
        </Group>
      </Group>
    );
  }
  return (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: "none" }}
    >
      <Upload size={80} />
      <div>
        <Text size="xl" inline>
          Drag image here or click to select an image
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          Image should not exceed 5mb
        </Text>
      </div>
    </Group>
  );
};

const UploadForm = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { address: contractAddress, abi } = getContractInfo(chain?.id);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [postReceiver, setPostReceiver] = useState<`0x${string}` | undefined>(
    address
  );

  const [randomBytes32, setRandomBytes32] = useState<string>(
    "0x000000000000000000000000000000000000000000000000000000000000000a"
  );

  // const [metadata, setMetadata] = useState<PostDataUpload[]>([]);

  const [isPostUpdated, setIsPostUpdated] = useState<boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [isPostLoaded, setIsPostLoaded] = useState<boolean>(false);

  const [response, setResponse] = useState<string>("");

  const [provider, setProvider] = useState<
    "NFT.Storage" | "NFTPort" | "Estuary"
  >("NFT.Storage");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "createPost",
    args: [postReceiver, response, randomBytes32],
  });

  const { data, write: writeMintPost } = useContractWrite(config);

  const [lastHash, setLastHash] = useState<string>("");

  async function savePostBeforeUpload(
    name: string,
    description: string,
    image?: File
  ) {
    if (description !== "" && name !== "" && image && postReceiver) {
      const cid = await UploadData({
        data: { name: name, description: description, image: image },
        provider: provider,
      });

      setResponse(cid);
      setRandomBytes32(zeroPadValue(hexlify(randomBytes(32)), 32));

      setImage(undefined);
      setName("");
      setDescription("");

      setIsPostLoading(true);
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (isPostLoading) {
      setIsPostUpdated(true);
      setIsPostLoading(false);

      console.log("Updated response:" + response);
    }

    if (data?.hash && data?.hash !== lastHash && isPostUpdated) {
      setLastHash(data.hash);
      setIsPostLoaded(true);
      setIsPostUpdated(false);
    }
  }, [isPostLoading, data, isPostLoaded, lastHash, response, isPostUpdated]);

  return (
    <Paper
      withBorder
      shadow="xl"
      p="xl"
      radius="lg"
      sx={{ maxWidth: "900px" }}
      mx="auto"
    >
      <Title
        order={1}
        my="lg"
        align="center"
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        sx={(theme) => ({
          background: theme.fn.radialGradient("green", "lime"),
        })}
      >
        Upload a new Post
      </Title>
      <TextInput
        required
        label="Title"
        placeholder="Post Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        my="lg"
        required
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        label="Description"
        placeholder="Describe your post here"
      />
      <Textarea
        my="lg"
        onChange={(e) =>
          setPostReceiver(e.target.value as `0x${string}` | undefined)
        }
        value={postReceiver}
        label="Post Receiver"
        placeholder="Enter Address You Want To Receive The NFT"
      />
      <Dropzone
        mt="md"
        onReject={(files) => console.log("rejected files", files)}
        onDrop={(files) => setImage(files[0])}
        maxSize={25000000}
        multiple={false}
        accept={[
          MIME_TYPES.png,
          MIME_TYPES.jpeg,
          MIME_TYPES.webp,
          MIME_TYPES.svg,
          MIME_TYPES.gif,
          MIME_TYPES.mp4,
        ]}
      >
        {() => dropzoneChildren(image)}
      </Dropzone>
      <Group position="center" sx={{ padding: 15 }}>
        {isPostLoading ? null : (
          <Button
            component="a"
            radius="lg"
            mt="md"
            onClick={async () =>
              await savePostBeforeUpload(name, description, image)
            }
          >
            Save Post
          </Button>
        )}
      </Group>
      <Group position="center" sx={{ padding: 15 }}>
        {isPostUpdated ? (
          <Button
            component="a"
            radius="lg"
            mt="md"
            onClick={() => writeMintPost?.()}
          >
            Upload Post
          </Button>
        ) : null}
      </Group>
      <Center>
        <NativeSelect
          placeholder="Pick IPFS Provider"
          value={provider}
          onChange={(event) =>
            setProvider(
              event.currentTarget.value as "NFT.Storage" | "NFTPort" | "Estuary"
            )
          }
          size="sm"
          data={["NFT.Storage", "NFTPort", "Estuary"]}
        />
      </Center>
    </Paper>
  );
};

export default UploadForm;
