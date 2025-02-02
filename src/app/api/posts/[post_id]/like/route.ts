import connectDB from "@/mongodb/db";
import { Post } from "@/firebase/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = post.likes;
    return NextResponse.json(likes);
  } catch {
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}

export interface LikePostRequestBody {
  userId: string;
}

export async function POST(
    request: Request,
    { params }: { params: { post_id: string } }
  ) {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await connectDB();
  
    try {
      const post = await Post.findById(params.post_id);
  
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      await post.likePost(userId);
  
      return NextResponse.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An error occurred while liking the post" },
        { status: 500 }
      );
    }
  }