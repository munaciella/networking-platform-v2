"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { Input } from "./ui/input";
import createCommentAction from "../../actions/createCommentAction";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    if (!user?.id) {
      toast.error("You need to be signed in to comment!");
      return;
    }
  
    const commentText = formData.get("commentInput") as string;
  
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
  
    ref.current?.reset();
  
    const promise = createCommentAction(postId, formData);
  
    toast.promise(promise, {
      loading: "Adding comment...",
      success: "Comment added!",
      error: "Failed to create comment",
    });
  
    try {
      await promise;
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  const handleInputClick = () => {
    if (!user?.id) {
      toast.error("You need to be signed in to comment!");
    }
  };

  return (
    <form
      ref={ref}
      className="flex items-center space-x-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (user?.id) {
          handleCommentAction(new FormData(ref.current!));

        } else {
          toast.error("You need to be signed in to comment!");
        }
      }}
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl ?? ""} />
        <AvatarFallback>
          {user?.firstName?.charAt(0) ?? "?"}
          {user?.lastName?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <Input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
          onClick={handleInputClick}
        />
        <button type="submit" hidden>
          Comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;