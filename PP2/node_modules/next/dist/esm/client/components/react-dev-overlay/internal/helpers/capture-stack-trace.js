// Polyfill for `Error.captureStackTrace` in browsers
export function captureStackTrace(obj) {
    const container = new Error();
    Object.defineProperty(obj, 'stack', {
        configurable: true,
        get () {
            const { stack } = container;
            Object.defineProperty(this, 'stack', {
                value: stack
            });
            return stack;
        }
    });
}

//# sourceMappingURL=capture-stack-trace.js.map