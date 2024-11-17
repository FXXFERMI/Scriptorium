// Polyfill for `Error.captureStackTrace` in browsers
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "captureStackTrace", {
    enumerable: true,
    get: function() {
        return captureStackTrace;
    }
});
function captureStackTrace(obj) {
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

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=capture-stack-trace.js.map