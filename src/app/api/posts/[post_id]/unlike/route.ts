import { db } from "@/firebase/db";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postRef = doc(db, "posts", params.post_id);
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });

    return NextResponse.json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json(
      { error: "An error occurred while unliking the post" },
      { status: 500 }
    );
  }
}