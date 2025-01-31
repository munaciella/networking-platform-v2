'use server'

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Comment } from "@/mongodb/models/comment";

export default async function deleteCommentAction(commentId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const comment = await Comment.findById(commentId).exec();

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user.userId !== user.id) {
    throw new Error("Comment does not belong to the user");
  }

  try {
    await Comment.deleteOne({ _id: commentId });
    revalidatePath("/");
  } catch {
    throw new Error("An error occurred while deleting the comment");
  }
}
