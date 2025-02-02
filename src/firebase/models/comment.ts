import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { IUser } from '../../../types/user';
import { db } from '@/firebase/db';

export interface ICommentBase {
  user: IUser;
  text: string;
}

export interface IComment extends ICommentBase {
  id: string; // Firestore document ID
  createdAt: Date;
  updatedAt: Date;
}

export async function createComment(postId: string, commentData: ICommentBase) {
  const commentRef = collection(db, 'posts', postId, 'comments');
  const commentDocRef = await addDoc(commentRef, {
    ...commentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return commentDocRef.id;
}

export async function deleteComment(postId: string, commentId: string) {
  const commentRef = doc(db, 'posts', postId, 'comments', commentId);
  await deleteDoc(commentRef);
}