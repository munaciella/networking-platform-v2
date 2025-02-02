"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) {
    throw new Error("Post not found");
  }

  const postData = postSnapshot.data();

  if (postData?.user?.userId !== user.id) {
    throw new Error("Post does not belong to the user");
  }

  try {
    await deleteDoc(postRef);
    revalidatePath("/"); // Refresh the feed after deleting
  } catch (error) {
    console.error("Delete post error:", error);
    throw new Error("An error occurred while deleting the post");
  }
}