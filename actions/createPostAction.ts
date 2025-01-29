'use server'

import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../types/user";
import { Post } from "../src/mongodb/models/post";
import { AddPostRequestBody } from "@/app/api/posts/route";

export async function createPostAction(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;
    let imageUrl: string | undefined;

    if (!postInput) {
        throw new Error('You must provide a post input');
    }

    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
    }

    try {

    if (image.size > 0) {

        const body: AddPostRequestBody = {
            user: userDB,
            text: postInput,
            //imageUrl: image_Url,
        }
        await Post.create(body);
    } else {
        
        const body: AddPostRequestBody = {
            user: userDB,
            text: postInput,
        }

        await Post.create(body);
    }
} catch (error) {
    throw new Error(`Error creating post: ${error instanceof Error ? error.message : String(error)}`);
    
}
}