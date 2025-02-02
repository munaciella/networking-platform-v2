import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { IUser } from '../../../types/user';
import { IComment } from './comment';
import { db } from '@/firebase/db';

export interface IPostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends IPostBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createPost(postData: IPostBase) {
  const postRef = collection(db, 'posts');
  const postDocRef = await addDoc(postRef, {
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return postDocRef.id;
}

export async function getAllPosts() {
  const postRef = collection(db, 'posts');
  const q = query(postRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const posts: IPost[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    
    //console.log('Document Data:', data);

    return {
      id: doc.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), 
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(), 
      user: data.user,
      text: data.text,
      imageUrl: data.imageUrl,
      comments: data.comments || [], 
      likes: data.likes || [],
    };
  });
  
  return posts;
}

export async function likePost(postId: string, userId: string) {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
  });
}

export async function unlikePost(postId: string, userId: string) {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
  });
}