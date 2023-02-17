import connectors from "@/utils/connectors.js";
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
import { useBooleanToggle } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
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
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

interface NavbarProps {
  links: { link: string; label: string }[];
}

export function Navbar({ links }: NavbarProps) {
  const connector = connectors["UAuth"][0];

  const { useIsActivating, useIsActive } = connectors["UAuth"][1];
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  console.log(isActive);

  const handleToggleConnect = () => {
    if (isActive) {
      if (connector?.deactivate) {
        void connector.deactivate();
      } else {
        void connector.resetState();
      }
      setConnectionStatus("Disconnected");
    } else if (!isActivating) {
      setConnectionStatus("Connecting...");

      // Activate the connector and update states
      connector.activate(1);

      setConnectionStatus("Connected");
    }
  };

  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes, cx } = useStyles();
  const router = useRouter();
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
    <Header height={HEADER_HEIGHT} mb={10} className={classes.root}>
      <Container className={classes.header}>
        <Link href="/">
          <Image
            src="/PinSaveL.png"
            alt="Pin Save EVM"
            width={140}
            height={35}
            className="block lg:hidden h-8 w-auto"
            priority
          />
        </Link>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group spacing={10}>
          <Button
            styles={{
              root: {
                backgroundColor: "#0D67FE",

                "&:hover": {
                  backgroundColor: "#0546B7",
                },
              },
            }}
            onClick={() => handleToggleConnect()}
          >
            {"Login with Unstoppable"}
          </Button>
          <ConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />
        </Group>

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
