export interface blogType {
    bid: number;
    title: string;
    description: string;
    tags: Array<{name: string}>;
    Hidden: boolean;
    uid: number;
    user: {username: string, profile: {avatar: string, firstName: string, lastName: string}}
    codeTemplates: Array<{cid: number, title: string, explanation: string}>;
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
  }
  