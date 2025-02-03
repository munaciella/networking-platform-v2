"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

export default async function deleteCommentAction(commentId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);

  if (!commentSnap.exists()) {
    throw new Error("Comment not found");
  }

  const commentData = commentSnap.data();

  if (commentData.user.userId !== user.id) {
    throw new Error("Comment does not belong to the user");
  }

  try {
    await deleteDoc(commentRef);
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("An error occurred while deleting the comment");
  }
}