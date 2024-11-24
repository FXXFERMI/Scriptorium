export interface blogType {
    bid: number;
    title: string;
    description: string;
    tags: Array<{name: string}>;
    Hidden: boolean;
    uid: number;
    user: {username: string, profile: {avatar: string, firstName: string, lastName: string}}
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
  }
  