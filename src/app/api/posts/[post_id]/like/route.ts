import { dbAdmin } from "@/firebase/admin";
import admin from "firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    const snap = await dbAdmin
      .collection("posts")
      .doc(params.post_id)
      .get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const likes = snap.data()?.likes ?? [];
    return NextResponse.json(likes);
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
    await dbAdmin
      .collection("posts")
      .doc(params.post_id)
      .update({
        likes: admin.firestore.FieldValue.arrayUnion(userId),
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
