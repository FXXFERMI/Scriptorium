export interface codeTemplateType {
    cid: number;
    title: string;
    explanation: string;
    language: string;
    tags: Array<{name: string}>;
    uid: number;
    user: {username: string, profile: {avatar: string, firstName: string, lastName: string}}
    blogs: Array<{bid: number, title: string}>;
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
  }
  
  