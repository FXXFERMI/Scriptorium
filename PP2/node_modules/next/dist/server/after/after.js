"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_after", {
    enumerable: true,
    get: function() {
        return unstable_after;
    }
});
const _workasyncstorageexternal = require("../app-render/work-async-storage.external");
function unstable_after(task) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (!workStore) {
        // TODO(after): the linked docs page talks about *dynamic* APIs, which unstable_after soon won't be anymore
        throw new Error('`unstable_after` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context');
    }
    const { afterContext } = workStore;
    if (!afterContext) {
        throw new Error('`unstable_after` must be explicitly enabled by setting `experimental.after: true` in your next.config.js.');
    }
    return afterContext.after(task);
}

//# sourceMappingURL=after.js.map