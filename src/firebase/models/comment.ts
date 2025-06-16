// import {
//   collection,
//   addDoc,
//   doc,
//   deleteDoc,
//   serverTimestamp,
//   where,
//   query,
//   getDocs,
// } from 'firebase/firestore';
// import { IUser } from '../../../types/user';
// import { db } from '@/firebase/db';

// export interface ICommentBase {
//   user: IUser;
//   text: string;
// }

// export interface IComment extends ICommentBase {
//   id: string;
//   postId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Create a comment in the top-level "comments" collection
// export async function createComment(postId: string, commentData: ICommentBase) {
//   const commentsRef = collection(db, 'comments');
//   const commentDocRef = await addDoc(commentsRef, {
//     postId,
//     ...commentData,
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   });

//   return {
//     id: commentDocRef.id,
//     postId,
//     ...commentData,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };
// }

// export async function getAllComments() {
//   const commentsRef = collection(db, 'comments');
//   const querySnapshot = await getDocs(commentsRef);

//   const comments: IComment[] = querySnapshot.docs.map((doc) => {
//     const data = doc.data();

//     return {
//       id: doc.id,
//       postId: data.postId,
//       user: data.user,
//       text: data.text,
//       createdAt: data.createdAt.toDate(),
//       updatedAt: data.updatedAt.toDate(),
//     };
//   });

//   return comments;
// }

// // Fetch comments by user ID
// export async function getCommentsByUserId(userId: string) {
//   const commentsRef = collection(db, 'comments');
//   const q = query(commentsRef, where('userId', '==', userId));

//   const querySnapshot = await getDocs(q);

//   const comments: IComment[] = querySnapshot.docs.map((doc) => {
//     const data = doc.data();

//     return {
//       id: doc.id,
//       postId: data.postId,
//       user: data.user,
//       text: data.text,
//       createdAt: data.createdAt.toDate(),
//       updatedAt: data.updatedAt.toDate(),
//     };
//   });

//   return comments;
// }

// export async function getAllCommentsByPostId(postId: string) {
//   const commentsRef = collection(db, 'comments');
//   const q = query(commentsRef, where('postId', '==', postId));

//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       postId: data.postId,
//       user: data.user,
//       text: data.text,
//       createdAt: data.createdAt.toDate(),
//       updatedAt: data.updatedAt.toDate(),
//     };
//   });
// }

// // Delete a comment from the top-level "comments" collection
// export async function deleteComment(commentId: string) {
//   const commentRef = doc(db, 'comments', commentId);
//   await deleteDoc(commentRef);
// }

// // Function to delete all comments related to the post
// export async function deleteCommentsByPostId(postId: string) {
//   const commentsRef = collection(db, 'comments');
//   const q = query(commentsRef, where('postId', '==', postId));

//   // Get the comments for the given postId
//   const querySnapshot = await getDocs(q);

//   querySnapshot.forEach(async (docSnap) => {
//     // Delete each comment
//     const commentRef = doc(db, 'comments', docSnap.id);
//     await deleteDoc(commentRef);
//   });
// }


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
  // Return a provisional object (timestamps may still be pending)
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
