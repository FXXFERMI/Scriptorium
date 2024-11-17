type UnhandledError = Error & {
    digest: 'NEXT_UNHANDLED_ERROR';
};
export declare function createUnhandledError(message: string): UnhandledError;
export declare const isUnhandledConsoleOrRejection: (error: any) => error is UnhandledError;
export {};
