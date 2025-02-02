import connectDB from "@/mongodb/db";
import { Comment, ICommentBase } from "@/firebase/models/comment";
import { Post } from "@/firebase/models/post";
import { NextResponse } from "next/server";
import { IUser } from "../../../../../../types/user";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    await connectDB();

    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "An error occurred while fetching comments" },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  user: IUser;
  text: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
    await connectDB();
  const { user, text }: AddCommentRequestBody = await request.json();
  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment: ICommentBase = {
      user,
      text,
    };

    await post.commentOnPost(comment);
    return NextResponse.json({ message: "Comment added successfully" });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while adding comment" },
      { status: 500 }
    );
  }
}

export interface DeleteCommentRequestBody {
  user: IUser;
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string; comment_id: string } }
) {
  await connectDB();
  const { user }: DeleteCommentRequestBody = await request.json();

  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await Comment.findById(params.comment_id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user.userId !== user.userId) {
      return NextResponse.json(
        { error: "Comment does not belong to the user" },
        { status: 403 }
      );
    }

    await Comment.deleteOne({ _id: params.comment_id });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while deleting the comment" },
      { status: 500 }
    );
  }
}