import { currentUser } from '@clerk/nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { IPost } from '@/firebase/models/post';
import { IComment } from '@/firebase/models/comment';

const UserInformation = async ({
  posts,
  comments = [],
}: {
  posts: IPost[];
  comments: IComment[];
}) => {
  const user = await currentUser();
  const userId = user?.id;


  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  // Filter posts by user ID
  const userPosts = posts?.filter((post) => post.user.userId === userId);

  // Filter comments by user ID
  const userComments = comments?.filter(
    (comment) => comment.user.userId === userId
  );

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
      <Avatar>
        {user?.id ? (
          <AvatarImage src={imageUrl} />
        ) : (
          <AvatarImage src="https://github.com/shadcn.png" />
        )}
        <AvatarFallback>
          {firstName?.charAt(0)}
          {lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {firstName} {lastName}
          </p>

          <p className="text-xs">
            @{firstName}
            {lastName}-{user?.id?.slice(-4)}
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-3">
          <p className="font-semibold">You are not signed in</p>
          <p className="text-xs font-medium">Sign in to post and view your posts</p>

          <Button asChild className="bg-[#0b63c4] text-white">
            <SignInButton>Sign in</SignInButton>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <hr className="w-full border-gray-200 my-5" />

        <div className="flex justify-between w-full px-4 text-sm">
          <p className="font-semibold text-gray-400">Posts</p>
          <p className="text-blue-400">{userPosts.length}</p>
        </div>

        <div className="flex justify-between w-full px-4 text-sm">
          <p className="font-semibold text-gray-400">Comments</p>
          <p className="text-blue-400">{userComments.length}</p>
        </div>
      </SignedIn>
    </div>
  );
};

export default UserInformation;
