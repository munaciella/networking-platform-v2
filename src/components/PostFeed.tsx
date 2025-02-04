import { IPost } from "@/firebase/models/post";
import Post from "./Post";


async function PostFeed({ posts }: { posts: IPost[] }) {
  return (
    <div className="space-y-2 pb-20 px-1">
      {posts?.map((post) => (
        <Post key={post.id as React.Key} post={post} />
      ))}
    </div>
  );
}

export default PostFeed;