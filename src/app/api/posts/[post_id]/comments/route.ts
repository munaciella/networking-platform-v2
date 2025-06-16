import { db } from "@/firebase/db";
import { doc, getDoc, getDocs, collection, query, where, deleteDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { IUser } from "../../../../../../types/user";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("postId", "==", params.post_id));
    const commentsSnap = await getDocs(q);

    const comments = commentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(comments);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: "An error occurred while fetching comments", details: errorMessage },
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
  const { user, text }: AddCommentRequestBody = await request.json();

  try {
    const postRef = doc(db, "posts", params.post_id);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const commentRef = doc(collection(db, "comments"));

    await setDoc(commentRef, {
      postId: params.post_id,
      user,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: "An error occurred while adding a comment", details: errorMessage },
      { status: 500 }
    );
  }
}

export interface DeleteCommentRequestBody {
  user: IUser;
}

export async function DELETE(
  request: Request,
  { params }: { params: { comment_id: string } }
) {
  const { user }: DeleteCommentRequestBody = await request.json();

  try {
    const commentRef = doc(db, "comments", params.comment_id);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const commentData = commentSnap.data();

    if (commentData.user.userId !== user.userId) {
      return NextResponse.json(
        { error: "Comment does not belong to the user" },
        { status: 403 }
      );
    }

    await deleteDoc(commentRef);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: "An error occurred while deleting the comment", details: errorMessage },
      { status: 500 }
    );
  }
}