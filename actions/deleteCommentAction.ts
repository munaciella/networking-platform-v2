"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { dbAdmin } from "@/firebase/admin";   // ← Admin SDK

export default async function deleteCommentAction(commentId: string) {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not authenticated");

  const ref = dbAdmin.collection("comments").doc(commentId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Comment not found");
  if (snap.data()?.user?.userId !== user.id) {
    throw new Error("Comment does not belong to the user");
  }

  try {
    await ref.delete();
    revalidatePath("/");
  } catch (e) {
    console.error("Error deleting comment:", e);
    throw new Error("An error occurred while deleting the comment");
  }
}
