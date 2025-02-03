import { db } from "@/firebase/db";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    const postRef = doc(db, "posts", params.post_id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = postSnap.data();
    return NextResponse.json(postData.likes || []);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}

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
      likes: arrayUnion(userId),
    });

    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 }
    );
  }
}