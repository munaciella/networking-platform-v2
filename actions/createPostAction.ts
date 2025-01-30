'use server';

import { currentUser } from '@clerk/nextjs/server';
import { IUser } from '../types/user';
import { Post } from '../src/mongodb/models/post';
import { AddPostRequestBody } from '@/app/api/posts/route';
import generateSASToken, { containerName } from '@/lib/generateSASToken';
import { BlobServiceClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const postInput = formData.get('postInput') as string;
  const image = formData.get('image') as File;
  let image_url: undefined | string;

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
    if (image.size > 0) {
      console.log('Uploading image to Azure Blob Storage...', image);

      const accountName = process.env.AZURE_STORAGE_NAME;
      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;
      console.log(
        'Image uploaded successfully to Azure Blob Storage:',
        image_url
      );

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };
      await Post.create(body);
    } else {
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }
  } catch (error) {
    throw new Error(
      `Error creating post: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  revalidatePath('/');
}
