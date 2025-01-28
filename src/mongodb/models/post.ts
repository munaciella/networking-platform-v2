import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { IUser } from '../../../types/user';
import { Comment, IComment, ICommentBase } from './comment';

export interface IPostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string;
}

export interface IPost extends IPostBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: ICommentBase): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  removePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
    likes: { type: [String] },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    throw new Error(
      `Failed to like post: ${error instanceof Error ? error.message : error}`
    );
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    throw new Error(
      `Failed to unlike post: ${error instanceof Error ? error.message : error}`
    );
  }
};

PostSchema.methods.removePost = async function () {
  try {
    await this.model('Post').deleteOne({ _id: this._id });
  } catch (error) {
    throw new Error(
      `Failed to remove post: ${error instanceof Error ? error.message : error}`
    );
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    const comment = await Comment.create(commentToAdd);
    this.comments.push(comment._id);
    await this.save();
  } catch (error) {
    throw new Error(
      `Failed to comment on post: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
    });
    return this.comments;
  } catch (error) {
    throw new Error(
      `Failed to get comments: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
      })
      .lean(); // Convert mongoose to plain JS object

    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: String(post._id),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: String(comment._id),
      })),
    }));
  } catch (error) {
    throw new Error(
      `Failed to get all posts: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>('Post', PostSchema);
