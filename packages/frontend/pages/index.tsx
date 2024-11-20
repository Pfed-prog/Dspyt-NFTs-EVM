import type { NextPage } from "next";
import { useRef, useCallback, useMemo } from "react";
import { Box, Center, Title, Loader } from "@mantine/core";

import type { Post } from "@/services/upload";
import PostCard from "@/components/Posts/PostCard";
import { PageSEO } from "@/components/SEO";
import { usePosts } from "@/hooks/api";

const Home: NextPage = () => {
  const {
    data: posts,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = usePosts("optimism");

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElement = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  const fetchedPosts = useMemo(() => {
    return posts?.pages.reduce((acc, page) => {
      return [...acc, ...page.items];
    }, []);
  }, [posts]);

  return (
    <div>
      <PageSEO />

      <Title order={1} className="fade-in-text">
        PinSave Home Page
      </Title>

      <Box
        mx="auto"
        mt={20}
        sx={{
          maxWidth: 1500,
          gap: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 5fr))",
          gridTemplateRows: "masonry",
        }}
      >
        {fetchedPosts &&
          fetchedPosts?.map((post: Post) => {
            return (
              <Center ref={lastElement} key={post.token_id}>
                <PostCard post={post} />
              </Center>
            );
          })}
      </Box>

      {isFetching && (
        <Center mt={24}>
          <Loader color="blue" />
        </Center>
      )}
    </div>
  );
};

export default Home;
