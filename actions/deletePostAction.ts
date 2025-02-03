// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { doc, getDoc, deleteDoc } from "firebase/firestore";
// import { db } from "@/firebase/db";

// export default async function deletePostAction(postId: string) {
//   const user = await currentUser();

//   if (!user?.id) {
//     throw new Error("User not authenticated");
//   }

//   const postRef = doc(db, "posts", postId);
//   const postSnapshot = await getDoc(postRef);

//   if (!postSnapshot.exists()) {
//     throw new Error("Post not found");
//   }

//   const postData = postSnapshot.data();

//   if (postData?.user?.userId !== user.id) {
//     throw new Error("Post does not belong to the user");
//   }

//   try {
//     await deleteDoc(postRef);
//     revalidatePath("/"); // Refresh the feed after deleting
//   } catch (error) {
//     console.error("Delete post error:", error);
//     throw new Error("An error occurred while deleting the post");
//   }
// }


'use server';

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"; // Import from v3
import { db } from "@/firebase/db";
import { deleteCommentsByPostId } from "@/firebase/models/comment";

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
    // If there's an image, delete it from Cloudflare R2
    if (postData.imageUrl) {
      console.log("Deleting image from Cloudflare R2...");

      const s3 = new S3Client({
        endpoint: "https://4b46c9ea0c0a2600df0ac627dd90a047.r2.cloudflarestorage.com",
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
        },
        region: "auto",
      });

      // Extract the filename from the image URL
      const imageKey = postData.imageUrl.split("/").pop();

      if (imageKey) {
        const command = new DeleteObjectCommand({
          Bucket: "networking-platform-images",
          Key: imageKey,
        });

        await s3.send(command);

        console.log("Image deleted successfully:", imageKey);
      }
    }

    // Delete the post from Firestore
    await deleteDoc(postRef);

    // Delete all comments related to the post
    await deleteCommentsByPostId(postId);

    revalidatePath("/"); // Refresh the feed after deleting
  } catch (error) {
    console.error("Delete post error:", error);
    throw new Error("An error occurred while deleting the post");
  }
}