import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Box, Button, Center, Title, Loader } from "@mantine/core";

import type { Post } from "@/services/upload";
import PostCard from "@/components/Posts/PostCard";
import { PageSEO } from "@/components/SEO";
import { usePosts } from "@/hooks/api";

const Home: NextPage = () => {
  const {
    data: posts,
    isFetching: isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts("optimism");
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>();

  useEffect(() => {
    if (posts?.pages) {
      const items = posts?.pages;
      const result = Object.keys(items).map((key) => items[Number(key)].items);
      setFetchedPosts([...result.flat()]);
    }
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
        {fetchedPosts?.map((post: Post) => {
          return <PostCard post={post} key={post.token_id} />;
        })}
      </Box>

      {isLoading && (
        <Center mt={24}>
          <Loader color="blue" />
        </Center>
      )}

      {posts && posts.pages.length > 0 && (
        <Center my={14}>
          <Button
            mx="auto"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        </Center>
      )}
    </div>
  );
};

export default Home;
