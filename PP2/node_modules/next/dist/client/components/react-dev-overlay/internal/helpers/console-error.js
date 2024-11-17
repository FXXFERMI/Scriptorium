// Represent non Error shape unhandled promise rejections or console.error errors.
// Those errors will be captured and displayed in Error Overlay.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createUnhandledError: null,
    isUnhandledConsoleOrRejection: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createUnhandledError: function() {
        return createUnhandledError;
    },
    isUnhandledConsoleOrRejection: function() {
        return isUnhandledConsoleOrRejection;
    }
});
function createUnhandledError(message) {
    const error = new Error(message);
    error.digest = 'NEXT_UNHANDLED_ERROR';
    return error;
}
const isUnhandledConsoleOrRejection = (error)=>{
    return error && error.digest === 'NEXT_UNHANDLED_ERROR';
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=console-error.js.map