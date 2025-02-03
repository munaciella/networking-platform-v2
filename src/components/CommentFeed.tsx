"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ReactTimeAgo from "react-time-ago";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import "@/lib/timeAgoSetup";
import deleteCommentAction from "../../actions/deleteCommentAction";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase/db";

interface Comment {
  id: string;
  user: {
    userId: string;
    userImage: string;
    firstName: string;
    lastName: string;
  };
  text: string;
  createdAt: Timestamp;
}

interface CommentFeedProps {
  postId: string;
  postAuthorId: string;
}

function CommentFeed({ postId, postAuthorId }: CommentFeedProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  const isPostAuthor = user?.id === postAuthorId;

  const hasToastFired = useRef(false);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "comments");

    const q = query(
      commentsRef,
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];

      setComments(fetchedComments);
      setLoading(false); // Stop loading once data is fetched
    });

    return () => unsubscribe();
  }, [postId]);

  const handleDeleteComment = async (commentId: string) => {
    try {
      const promise = deleteCommentAction(commentId);
      toast.promise(promise, {
        loading: "Deleting comment...",
        success: "Comment deleted!",
        error: "Failed to delete comment",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    if (!user?.id && !hasToastFired.current) {
      toast.error("You need to be signed in to view and comment!");
      hasToastFired.current = true;
    }
  }, [user?.id]);

  const handleCommentClick = () => {
    if (!user?.id) {
      return;
    }
  };

  if (!user?.id) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => {
          const isCommentAuthor = comment.user.userId === user?.id;

          return (
            <div key={comment.id} className="flex space-x-1">
              <Avatar>
                <AvatarImage src={comment.user.userImage ?? ""} />
                <AvatarFallback>
                  {comment.user.firstName?.charAt(0) ?? "?"}
                  {comment.user.lastName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]"
                onClick={handleCommentClick}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">
                      {comment.user.firstName} {comment.user.lastName}{" "}
                      {(isPostAuthor || isCommentAuthor) && (
                        <Badge className="ml-2" variant="outline">
                          {isPostAuthor ? "Author" : "You"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      @{comment.user.firstName}
                      {comment.user.lastName}-
                      {comment.user.userId.toString().slice(-4)}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 ml-2">
                    <ReactTimeAgo
                      date={comment.createdAt.toDate()} // Convert Firestore timestamp to Date
                      locale="en"
                    />
                  </p>
                </div>

                <p className="mt-3 text-sm">{comment.text}</p>

                {/* Show delete button only if the comment belongs to the current user */}
                {isCommentAuthor && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="mt-2 text-sm text-red-400 hover:text-red-600"
                  >
                    <Trash2Icon className="w-5 h-5 inline-block" />
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}

export default CommentFeed;