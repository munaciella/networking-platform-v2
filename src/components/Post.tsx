"use client";

import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IPostDocument } from "@/mongodb/models/post";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import ReactTimeAgo from "react-time-ago";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import deletePostAction from "../../actions/deletePostAction";
import PostOptions from "./PostOptions";

import "@/lib/timeAgoSetup";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();
const isAuthor = user?.id === post.user.userId;

  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          <Avatar>
            <AvatarImage src={post.user.userImage} />
            <AvatarFallback>
              {post.user.firstName?.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-between flex-1">
          <div>
            <div className="font-semibold">
              {post.user.firstName} {post.user.lastName}{" "}
              {isAuthor && (
                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user.lastName}-{post.user.userId.toString().slice(-4)}
            </p>

            <p className="text-xs text-gray-400">
              <ReactTimeAgo date={new Date(post.createdAt)} locale='en' />
            </p>
          </div>

          {isAuthor && (
            <Button
              variant="outline"
              onClick={() => {
                const promise = deletePostAction(post._id as string);
                toast.promise(promise, {
                  loading: "Deleting post...",
                  success: "Post deleted!",
                  error: "Error deleting post",
                });
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="px-4 pb-2 mt-2">{post.text}</p>

        {/* If image uploaded put it here... */}
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt="Post Image"
            width={500}
            height={500}
            className="w-full mx-auto"
          />
        )}
      </div>

      <PostOptions postId={post._id as string} post={post} />
    </div>
  );
}

export default Post;