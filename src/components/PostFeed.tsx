import { IPost } from "@/firebase/models/post";
import Post from "./Post";
import { SignedIn, SignedOut } from "@clerk/nextjs";

async function PostFeed({ posts }: { posts: IPost[] }) {
  return (
    <div className="space-y-2 pb-20 px-1">
      {/* Show posts if signed in */}
      <SignedIn>
        {posts?.map((post) => (
          <Post key={post.id as React.Key} post={post} />
        ))}
      </SignedIn>

      {/* Show message if signed out */}
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            You need to be signed in to view posts.
          </p>
        </div>
      </SignedOut>
    </div>
  );
}

export default PostFeed;