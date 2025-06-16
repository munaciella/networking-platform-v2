"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { dbAdmin } from "@/firebase/admin";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();
  if (!user?.id) throw new Error("User not authenticated");

  const postRef = dbAdmin.collection("posts").doc(postId);
  const postSnap = await postRef.get();
  if (!postSnap.exists) throw new Error("Post not found");
  if (postSnap.data()?.user?.userId !== user.id) {
    throw new Error("Post does not belong to the user");
  }

  try {
    const imageUrl = postSnap.data()?.imageUrl;
    if (imageUrl) {
      const s3 = new S3Client({
       endpoint:   "https://4b46c9ea0c0a2600df0ac627dd90a047.r2.cloudflarestorage.com",
       region:     "auto",
       credentials: {
         accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY!,
         secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
       },
     });

     const key = imageUrl.split("/").pop()!;
      await s3.send(
        new DeleteObjectCommand({
          Bucket: "networking-platform-images",
          Key:    key,
        })
      );
    }

    const commentsQ = await dbAdmin
      .collection("comments")
      .where("postId", "==", postId)
      .get();
    const batch = dbAdmin.batch();
    commentsQ.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    await postRef.delete();

    revalidatePath("/");
  } catch (e) {
    console.error("Delete post error:", e);
    throw new Error("An error occurred while deleting the post");
  }
}
