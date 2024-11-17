"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findSourceMapURL", {
    enumerable: true,
    get: function() {
        return findSourceMapURL;
    }
});
const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
const pathname = "" + basePath + "/__nextjs_source-map";
const findSourceMapURL = process.env.NODE_ENV === 'development' ? function findSourceMapURL(filename) {
    if (filename === '') {
        return null;
    }
    const url = new URL(pathname, document.location.origin);
    url.searchParams.set('filename', filename.replace(new RegExp("^" + document.location.origin + basePath), ''));
    return url.href;
} : undefined;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-find-source-map-url.js.map