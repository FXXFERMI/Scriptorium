"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    clearAllModuleContexts: null,
    clearModuleContext: null,
    getServerField: null,
    initialize: null,
    propagateServerField: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    clearAllModuleContexts: function() {
        return clearAllModuleContexts;
    },
    clearModuleContext: function() {
        return clearModuleContext;
    },
    getServerField: function() {
        return getServerField;
    },
    initialize: function() {
        return initialize;
    },
    propagateServerField: function() {
        return propagateServerField;
    }
});
const _next = /*#__PURE__*/ _interop_require_default(require("../next"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let initializations = {};
let sandboxContext;
if (process.env.NODE_ENV !== 'production') {
    sandboxContext = require('../web/sandbox/context');
}
function clearAllModuleContexts() {
    return sandboxContext == null ? void 0 : sandboxContext.clearAllModuleContexts();
}
function clearModuleContext(target) {
    return sandboxContext == null ? void 0 : sandboxContext.clearModuleContext(target);
}
async function getServerField(dir, field) {
    const initialization = await initializations[dir];
    if (!initialization) {
        throw new Error('Invariant cant propagate server field, no app initialized');
    }
    const { app } = initialization;
    let appField = app.server;
    return appField[field];
}
async function propagateServerField(dir, field, value) {
    const initialization = await initializations[dir];
    if (!initialization) {
        throw new Error('Invariant cant propagate server field, no app initialized');
    }
    const { app } = initialization;
    let appField = app.server;
    if (appField) {
        if (typeof appField[field] === 'function') {
            await appField[field].apply(app.server, Array.isArray(value) ? value : []);
        } else {
            appField[field] = value;
        }
    }
}
async function initializeImpl(opts) {
    const type = process.env.__NEXT_PRIVATE_RENDER_WORKER;
    if (type) {
        process.title = 'next-render-worker-' + type;
    }
    let requestHandler;
    let upgradeHandler;
    const app = (0, _next.default)({
        ...opts,
        hostname: opts.hostname || 'localhost',
        customServer: false,
        httpServer: opts.server,
        port: opts.port
    });
    requestHandler = app.getRequestHandler();
    upgradeHandler = app.getUpgradeHandler();
    await app.prepare(opts.serverFields);
    return {
        requestHandler,
        upgradeHandler,
        app
    };
}
async function initialize(opts) {
    // if we already setup the server return as we only need to do
    // this on first worker boot
    if (initializations[opts.dir]) {
        return initializations[opts.dir];
    }
    return initializations[opts.dir] = initializeImpl(opts);
}

//# sourceMappingURL=render-server.js.map