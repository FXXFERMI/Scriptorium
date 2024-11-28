export interface commentType{
    commentId: number;
    bid: number;
    uid: number;
    content: string;
    Hidden: boolean;
    user: {uid: number; username: string, profile: {avatar: string}}
    replies: {replyId: number; commentId: number; Hidden: boolean; content: string; replier: {uid: number; username: string, profile: {avatar: string}}}
    hasUpvoted: true,
    hasDownvoted: true,
}