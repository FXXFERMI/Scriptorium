// Represent non Error shape unhandled promise rejections or console.error errors.
// Those errors will be captured and displayed in Error Overlay.
export function createUnhandledError(message) {
    const error = new Error(message);
    error.digest = 'NEXT_UNHANDLED_ERROR';
    return error;
}
export const isUnhandledConsoleOrRejection = (error)=>{
    return error && error.digest === 'NEXT_UNHANDLED_ERROR';
};

//# sourceMappingURL=console-error.js.map