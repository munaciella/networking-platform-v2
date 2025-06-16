// "use server";

// import { ICommentBase, createComment } from "@/firebase/models/comment";
// import { currentUser } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { IUser } from "../types/user";

// export default async function createCommentAction(
//   postId: string,
//   formData: FormData
// ) {
//   const user = await currentUser();

//   const commentInput = formData.get("commentInput") as string;

//   if (!postId) throw new Error("Post id is required");
//   if (!commentInput) throw new Error("Comment input is required");
//   if (!user?.id) throw new Error("User not authenticated");

//   const userDB: IUser = {
//     userId: user.id,
//     userImage: user.imageUrl,
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//   };

//   const comment: ICommentBase = {
//     user: userDB,
//     text: commentInput,
//   };

//   try {
//     await createComment(postId, comment);
//     revalidatePath("/");
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw new Error("An error occurred while adding comment");
//   }
// }


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
