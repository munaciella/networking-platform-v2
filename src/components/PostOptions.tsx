import { useEffect, useState } from "react";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { IPost } from "@/firebase/models/post";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import CommentFeed from "./CommentFeed";
import CommentForm from "./CommentForm";
import { toast } from "sonner";

function PostOptions({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postId,
  post,
}: {
  postId: string;
  post: IPost;
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>(Array.isArray(post.likes) ? post.likes : []);

  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);

  const likeOrUnlikePost = async () => {
    if (!user?.id) {
      toast.error("You must be signed in to like or unlike a post");
      return;
    }

    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: { userId: string } = { userId: user.id };

    setLiked(!liked);
    setLikes(newLikes);

    const promise = fetch(
        `/api/posts/${String(post.id)}/${liked ? "unlike" : "like"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...body }),
        }
      ).then(async (response) => {
        if (!response.ok) {
          setLiked(originalLiked);
          setLikes(originalLikes);
          throw new Error("Failed to like or unlike post");
        }
  
        const fetchLikesResponse = await fetch(`/api/posts/${post.id}/like`);
        if (!fetchLikesResponse.ok) {
          setLiked(originalLiked);
          setLikes(originalLikes);
          throw new Error("Failed to fetch likes");
        }
  
        const newLikesData = await fetchLikesResponse.json();
  
        setLikes(newLikesData);
      });
  
      // Show toast using the promise
      toast.promise(promise, {
        loading: liked ? "Unliking post..." : "Liking post...",
        success: `Post ${liked ? "unliked" : "liked"}!`,
        error: `Failed to ${liked ? "unlike" : "like"} post`,
      });
    };
    
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {likes.length} likes
            </p>
          )}
        </div>

        <div>
          {post?.comments && post.comments.length > 0 && (
            <p
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="text-xs text-gray-500 cursor-pointer hover:underline"
            >
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>

      {/* Responsive Button Layout */}
      <div className="flex flex-wrap sm:flex-nowrap p-2 justify-between px-2 sm:p-0 border-t space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          variant="ghost"
          className="postButton w-full sm:w-auto text-sm mt-2 lg:mt-0 md:mt-0 xl:mt-0"
          onClick={likeOrUnlikePost}
        >
          {/* If user has liked the post, show filled thumbs up icon */}
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2] dark:text-gray-300 dark:fill-gray-300")}
          />
          Like
        </Button>

        <Button
          variant="ghost"
          className="postButton w-full sm:w-auto text-sm mt-0"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentsOpen && "text-gray-600 fill-gray-600"
            )}
          />
          Comment
        </Button>

        <Button variant="ghost" className="postButton w-full sm:w-auto text-sm mt-0">
          <Repeat2 className="mr-1" />
          Repost
        </Button>

        <Button variant="ghost" className="postButton w-full sm:w-auto text-sm mt-0">
          <Send className="mr-1" />
          Send
        </Button>
      </div>

      {isCommentsOpen && (
        <div className="p-4">
          <SignedIn>
            <CommentForm postId={String(post.id)} />
          </SignedIn>
          <CommentFeed postId={String(post.id)} postAuthorId={post.user.userId} />
        </div>
      )}
    </div>
  );
}

export default PostOptions;