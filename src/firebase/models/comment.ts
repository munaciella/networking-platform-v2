import type { IUser } from '../../../types/user';
import type { Timestamp } from '@/firebase/admin';
import { dbAdmin, serverTimestamp } from '@/firebase/admin';

export interface ICommentBase {
  user: IUser;
  text: string;
}

export interface IComment extends ICommentBase {
  id: string;
  postId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function createComment(
  postId: string,
  commentData: ICommentBase
): Promise<IComment> {
  const payload = {
    postId,
    ...commentData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await dbAdmin.collection('comments').add(payload);
  return {
    id: ref.id,
    postId,
    ...commentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getAllComments(): Promise<IComment[]> {
  const snap = await dbAdmin.collection('comments').get();
  return snap.docs.map(doc => {
    const data = doc.data();
    const c: IComment = {
      id:       doc.id,
      postId:   data.postId,
      user:     data.user,
      text:     data.text,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? null,
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? null,
    };
    return c;
  });
}

export async function getCommentsByUserId(userId: string): Promise<IComment[]> {
  const snap = await dbAdmin
    .collection('comments')
    .where('user.userId', '==', userId)
    .get();
  return snap.docs.map(doc => {
    const d = doc.data();
    return {
      id:        doc.id,
      postId:    d.postId,
      user:      d.user,
      text:      d.text,
      createdAt: (d.createdAt as Timestamp)?.toDate() ?? null,
      updatedAt: (d.updatedAt as Timestamp)?.toDate() ?? null,
    };
  });
}

export async function getAllCommentsByPostId(postId: string): Promise<IComment[]> {
  const snap = await dbAdmin
    .collection('comments')
    .where('postId', '==', postId)
    .orderBy('createdAt', 'asc')
    .get();
  return snap.docs.map(doc => {
    const d = doc.data();
    return {
      id:        doc.id,
      postId:    d.postId,
      user:      d.user,
      text:      d.text,
      createdAt: (d.createdAt as Timestamp)?.toDate() ?? null,
      updatedAt: (d.updatedAt as Timestamp)?.toDate() ?? null,
    };
  });
}

export async function deleteComment(commentId: string): Promise<void> {
  await dbAdmin.collection('comments').doc(commentId).delete();
}

export async function deleteCommentsByPostId(postId: string): Promise<void> {
  const snap = await dbAdmin
    .collection('comments')
    .where('postId', '==', postId)
    .get();
  const batch = dbAdmin.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}
