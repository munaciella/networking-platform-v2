'use client';

import { useUser } from '@clerk/nextjs';
import { IPostDocument } from '@/mongodb/models/post';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ReactTimeAgo from 'react-time-ago';
import { Badge } from './ui/badge';

import '@/lib/timeAgoSetup';

function CommentFeed({ post }: { post: IPostDocument }) {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;

  return (
    <div className="mt-3 space-y-2">
      {post.comments?.map((comment) => (
        <div key={comment._id as string} className="flex space-x-1">
          <Avatar>
            <AvatarImage src={comment.user.userImage} />
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">
                  {comment.user.firstName} {comment.user.lastName}{' '}
                  {isAuthor && (
                    <Badge className="ml-2" variant="outline">
                      Author
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  @{comment.user.firstName}
                  {comment.user.firstName}-
                  {comment.user.userId.toString().slice(-4)}
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-1 ml-2">
                <ReactTimeAgo date={new Date(comment.createdAt)} locale="en" />
              </p>
            </div>

            <p className="mt-3 text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentFeed;
