"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createLocalRequestContext: null,
    getBuiltinRequestContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createLocalRequestContext: function() {
        return createLocalRequestContext;
    },
    getBuiltinRequestContext: function() {
        return getBuiltinRequestContext;
    }
});
const _asynclocalstorage = require("../app-render/async-local-storage");
function getBuiltinRequestContext() {
    const _globalThis = globalThis;
    const ctx = _globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] ?? _globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL];
    return ctx == null ? void 0 : ctx.get();
}
/** This should be considered unstable until `unstable_after` is stablized. */ const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for('@next/request-context');
// TODO(after): this is a temporary workaround.
// Remove this when vercel builder is updated to provide '@next/request-context'.
const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for('@vercel/request-context');
function createLocalRequestContext() {
    const storage = (0, _asynclocalstorage.createAsyncLocalStorage)();
    return {
        get: ()=>storage.getStore(),
        run: (value, callback)=>storage.run(value, callback)
    };
}

//# sourceMappingURL=builtin-request-context.js.map