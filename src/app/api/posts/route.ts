import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { IUser } from '../../../../types/user';
import { db } from '@/firebase/db';

export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { user, text, imageUrl }: AddPostRequestBody = await request.json();

    const postData = {
      user,
      text,
      imageUrl: imageUrl || null,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);

    return NextResponse.json({ message: 'Post created successfully', postId: docRef.id });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `An error occurred while creating the post: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all posts from Firestore, ordered by createdAt
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);

    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while fetching posts' },
      { status: 500 }
    );
  }
}