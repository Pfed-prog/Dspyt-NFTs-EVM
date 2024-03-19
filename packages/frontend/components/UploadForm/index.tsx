import {
  Text,
  Paper,
  Title,
  TextInput,
  Textarea,
  Group,
  Button,
  Image,
  MediaQuery,
  Center,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Upload, Replace } from "tabler-icons-react";
import { PublicKey, Field, Signature } from "o1js";
import {
  startBerkeleyClient,
  NFTMetadata,
  createInitNFTTxFromMap,
  createNFT,
  deserializeJsonToMerkleMap,
  getAppContract,
  getAppString,
  createTxOptions,
  setVercelNFT,
  setVercelMetadata,
  getTotalInitedLive,
} from "pin-mina";

import { setMinaAccount } from "@/hooks/minaWallet";
import { getVercelClient } from "@/services/vercelClient";
import { UploadData } from "@/services/upload";
import { fetcher } from "@/utils/fetcher";
import { useAddressContext } from "context";

interface CustomWindow extends Window {
  mina?: any;
}

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
          Image should not exceed 1 000 000 bytes
        </Text>
      </div>
    </Group>
  );
};

const UploadForm = () => {
  const { address, setAddress } = useAddressContext();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  //const [postReceiver, setPostReceiver] = useState<string | undefined>();
  const [hash, setHash] = useState<string | undefined>(undefined);

  const isDataCorrect =
    name !== "" && description !== "" && image !== undefined;

  async function savePostBeforeUpload(
    name: string,
    description: string,
    image: File
  ) {
    if (description !== "" && name !== "" && address) {
      startBerkeleyClient();
      const zkApp = getAppContract();
      const appId = getAppString();
      const totalInited = await getTotalInitedLive(zkApp);
      const pub = PublicKey.fromBase58(address);

      const client = getVercelClient();

      const cid = await UploadData(image);
      const nftMetadata: NFTMetadata = {
        name: name,
        description: description,
        id: Field(totalInited),
        cid: cid,
        owner: pub,
        isMinted: "0",
      };
      const nftHashed = createNFT(nftMetadata);

      const dataMap = await fetcher("/api/getMap");
      const map = deserializeJsonToMerkleMap(dataMap.map);

      const adminSignatureData = await fetch(`/api/init/`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: name,
          description: description,
          id: totalInited,
          cid: cid,
          owner: address,
        }),
      });
      const adminSignatureJSON = await adminSignatureData.json();
      const adminSignatureBase58 = adminSignatureJSON.adminSignatureBase58;
      const adminSignature = Signature.fromBase58(adminSignatureBase58);

      const compile = true;
      const txOptions = createTxOptions(pub);
      const tx = await createInitNFTTxFromMap(
        nftHashed,
        zkApp,
        map,
        adminSignature,
        compile,
        txOptions
      );
      const transactionJSON = tx.toJSON();

      const sendTransactionResult = await (
        window as CustomWindow
      ).mina?.sendTransaction({
        transaction: transactionJSON,
      });

      setHash(sendTransactionResult.hash);

      await setVercelNFT(appId, nftHashed, client);
      await setVercelMetadata(appId, nftMetadata, client);

      setImage(undefined);
      setName("");
      setDescription("");
      return true;
    }
    return false;
  }

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
      {/* <Textarea
        my="lg"
        onChange={(e) => setPostReceiver(e.target.value)}
        value={postReceiver}
        label="Post Receiver"
        placeholder="Enter Address You Want To Receive The NFT"
      /> */}
      <Dropzone
        mt="md"
        onReject={(files) => console.log("rejected files", files)}
        onDrop={(files) => setImage(files[0])}
        maxSize={1000000}
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
        {!address && (
          <Button
            component="a"
            radius="lg"
            mt="md"
            onClick={async () => setAddress(await setMinaAccount())}
          >
            Connect Wallet
          </Button>
        )}
        {isDataCorrect && address && (
          <Button
            component="a"
            radius="lg"
            mt="md"
            onClick={async () =>
              await savePostBeforeUpload(name, description, image)
            }
          >
            Mint Post
          </Button>
        )}
        {!isDataCorrect && address && (
          <Text component="a" mt="md">
            Upload Data
          </Text>
        )}
      </Group>
      {hash && (
        <Center>
          <a
            style={{ color: "#198b6eb9" }}
            href={`https://minascan.io/berkeley/tx/${hash}`}
          >
            hash
          </a>
        </Center>
      )}
    </Paper>
  );
};

export default UploadForm;
