import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload {
   content: string;
   postId: string;
}

export interface IUpdateCommentPayloadByUser {
   content: string;
}
export interface IUpdateCommentPayloadByAdmin {
   status: CommentStatus;
}
