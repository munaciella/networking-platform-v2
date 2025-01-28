'use server'

import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "../types/user";

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
}