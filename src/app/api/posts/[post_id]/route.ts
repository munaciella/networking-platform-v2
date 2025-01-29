import connectDB from '@/mongodb/db';
import { Post } from '@/mongodb/models/post';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
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

  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.user.userId !== userId) {
      return NextResponse.json(
        { error: 'Post does not belong to the user' },
        { status: 403 }
      );
    }

    await post.removePost();

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the post' },
      { status: 500 }
    );
  }
}
