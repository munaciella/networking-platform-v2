import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { IUser } from '../../../types/user';

export interface ICommentBase {
  user: IUser;
  text: string;
}

export interface IComment extends Document, ICommentBase {
  createdAt: Date;
  updatedAt: Date;
}

interface ICommentMethods {
  removeComment(): Promise<void>;
}

interface ICommentStatics {
  getAllComments(): Promise<ICommentDocument[]>;
}

export interface ICommentDocument extends IComment, ICommentMethods {}
interface ICommentModel extends ICommentStatics, Model<ICommentDocument> {}

const CommentSchema = new Schema<ICommentDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CommentSchema.methods.removeComment = async function () {
  try {
    console.log(`Deleting comment with ID: ${this._id}`);
    await this.model('Comment').deleteOne({ _id: this._id });
    console.log('Comment successfully deleted');
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error(
      `Failed to delete comment: ${error instanceof Error ? error.message : error}`
    );
  }
};

export const Comment =
  (models.Comment as ICommentModel) || 
  mongoose.model<ICommentDocument, ICommentModel>('Comment', CommentSchema);