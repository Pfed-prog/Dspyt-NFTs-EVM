import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  createStyles,
  Text,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Button,
} from "@mantine/core";
import { useBooleanToggle, useMediaQuery } from "@mantine/hooks";

import { useAddressContext } from "context";
import { setMinaAccount } from "@/hooks/minaWallet";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors[theme.primaryColor][9],
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.lime[2],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors.lime[1],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 9],
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors[theme.primaryColor][2],
    },
  },
}));

interface NavbarProps {
  readonly links: { link: string; label: string }[];
}

export function Navbar({ links }: NavbarProps) {
  const { address, setAddress } = useAddressContext();
  const [hasMounted, setHasMounted] = useState(false);
  const [shortAddress, setShortAddress] = useState<string | undefined>();
  useEffect(() => {
    setHasMounted(true);
    if (address) {
      setShortAddress(address.substring(0, 3) + "..." + address.slice(-3));
    }
  }, [address]);

  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const largeScreen = useMediaQuery("(min-width: 600px)");

  const iconLeftPath = largeScreen ? "/PinSaveL.png" : "/Pin.png";
  const iconWidth = largeScreen ? 140 : 30;
  const iconHeight = largeScreen ? 35 : 30;

  const items = links.map((link) => (
    <Link key={link.label} href={link.link} passHref>
      <Text
        className={cx(classes.link, {
          [classes.linkActive]: router.asPath === link.link,
        })}
      >
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <div>
      <Header height={80} mb={10} className={classes.root}>
        <Container className={classes.header}>
          <Link href="/">
            {hasMounted && (
              <Image
                src={iconLeftPath}
                alt="Pin Save EVM"
                width={iconWidth}
                height={iconHeight}
                priority
              />
            )}
          </Link>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Group spacing={5}>
            <Button
              variant="filled"
              size="md"
              radius="md"
              onClick={async () => setAddress(await setMinaAccount())}
            >
              {shortAddress || "Connect Wallet"}
            </Button>
            <Burger
              opened={opened}
              onClick={() => toggleOpened()}
              className={classes.burger}
              size="sm"
            />
          </Group>

          <Transition
            transition="pop-top-right"
            duration={200}
            mounted={opened}
          >
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Container>
      </Header>
    </div>
  );
}
