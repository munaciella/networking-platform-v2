import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/db';

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    const postRef = doc(db, 'posts', params.post_id);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ id: postSnapshot.id, ...postSnapshot.data() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the post' },
      { status: 500 }
    );
  }
}

export interface DeletePostRequestBody {
  userId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const postRef = doc(db, 'posts', params.post_id);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postData = postSnapshot.data();

    // Assuming `userId` is part of the post data and checking ownership
    if (postData?.user?.userId !== userId) {
      return NextResponse.json(
        { error: 'Post does not belong to the user' },
        { status: 403 }
      );
    }

    // Delete the post from Firestore
    await deleteDoc(postRef);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the post' },
      { status: 500 }
    );
  }
}