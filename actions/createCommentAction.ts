"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { dbAdmin } from "@/firebase/admin";
import admin from "firebase-admin";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not authenticated");

  const text = formData.get("commentInput") as string;
  if (!text) throw new Error("Comment input is required");

  const commentData = {
    user: {
      userId:    user.id,
      userImage: user.imageUrl,
      firstName: user.firstName || "",
      lastName:  user.lastName || "",
    },
    text,
    postId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await dbAdmin.collection("comments").add(commentData);
    revalidatePath("/");
  } catch (e) {
    console.error("Error adding comment:", e);
    throw new Error("An error occurred while adding comment");
  }
}
