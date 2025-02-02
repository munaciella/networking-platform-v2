'use server';

import { currentUser } from '@clerk/nextjs/server';
import { IUser } from '../types/user';
import { S3 } from 'aws-sdk'; 
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/db';

export async function createPostAction(data: { text: string, imageBase64?: string }) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const postInput = data.text;
  const imageBase64 = data.imageBase64;
  let image_url: string | null = null;

  if (!postInput) {
    throw new Error('You must provide a post input');
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
  };

  try {
    if (imageBase64?.trim()) {
      console.log('Uploading image to Cloudflare R2...');

      const s3 = new S3({
        endpoint: 'https://4b46c9ea0c0a2600df0ac627dd90a047.r2.cloudflarestorage.com', 
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY, 
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY, 
        region: 'auto', 
      });

      const timestamp = Date.now();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      // Convert Base64 to Buffer
      const base64Data = imageBase64.split(',')[1];  
      if (base64Data) {
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadParams = {
          Bucket: 'networking-platform-images', 
          Key: file_name,
          Body: buffer,
          ContentType: 'image/png',
        };

        await s3.upload(uploadParams).promise();
        image_url = `https://pub-8f5fd6db57a04cdaaa2c94011e2c3d5b.r2.dev/${file_name}`;
        console.log('Image uploaded successfully to Cloudflare R2:', image_url);
      }
    }

    // Save post to Firestore (only once)
    const postData = {
      user: userDB,
      text: postInput,
      imageUrl: image_url,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'posts'), postData);

  } catch (error) {
    console.log("Error creating post:", error);
    throw new Error(
      `Error creating post: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  revalidatePath('/');
}