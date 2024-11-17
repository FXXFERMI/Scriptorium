/* eslint-disable import/no-extraneous-dependencies */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    decryptActionBoundArgs: null,
    encryptActionBoundArgs: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    decryptActionBoundArgs: function() {
        return decryptActionBoundArgs;
    },
    encryptActionBoundArgs: function() {
        return encryptActionBoundArgs;
    }
});
require("server-only");
const _serveredge = require("react-server-dom-webpack/server.edge");
const _clientedge = require("react-server-dom-webpack/client.edge");
const _nodewebstreamshelper = require("../stream-utils/node-web-streams-helper");
const _encryptionutils = require("./encryption-utils");
const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
async function decodeActionBoundArg(actionId, arg) {
    const key = await (0, _encryptionutils.getActionEncryptionKey)();
    if (typeof key === 'undefined') {
        throw new Error(`Missing encryption key for Server Action. This is a bug in Next.js`);
    }
    // Get the iv (16 bytes) and the payload from the arg.
    const originalPayload = atob(arg);
    const ivValue = originalPayload.slice(0, 16);
    const payload = originalPayload.slice(16);
    const decrypted = textDecoder.decode(await (0, _encryptionutils.decrypt)(key, (0, _encryptionutils.stringToUint8Array)(ivValue), (0, _encryptionutils.stringToUint8Array)(payload)));
    if (!decrypted.startsWith(actionId)) {
        throw new Error('Invalid Server Action payload: failed to decrypt.');
    }
    return decrypted.slice(actionId.length);
}
async function encodeActionBoundArg(actionId, arg) {
    const key = await (0, _encryptionutils.getActionEncryptionKey)();
    if (key === undefined) {
        throw new Error(`Missing encryption key for Server Action. This is a bug in Next.js`);
    }
    // Get 16 random bytes as iv.
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const ivValue = (0, _encryptionutils.arrayBufferToString)(randomBytes.buffer);
    const encrypted = await (0, _encryptionutils.encrypt)(key, randomBytes, textEncoder.encode(actionId + arg));
    return btoa(ivValue + (0, _encryptionutils.arrayBufferToString)(encrypted));
}
async function encryptActionBoundArgs(actionId, args) {
    const { clientModules } = (0, _encryptionutils.getClientReferenceManifestForRsc)();
    // Using Flight to serialize the args into a string.
    const serialized = await (0, _nodewebstreamshelper.streamToString)((0, _serveredge.renderToReadableStream)(args, clientModules));
    // Encrypt the serialized string with the action id as the salt.
    // Add a prefix to later ensure that the payload is correctly decrypted, similar
    // to a checksum.
    const encrypted = await encodeActionBoundArg(actionId, serialized);
    return encrypted;
}
async function decryptActionBoundArgs(actionId, encrypted) {
    const { edgeRscModuleMapping, rscModuleMapping } = (0, _encryptionutils.getClientReferenceManifestForRsc)();
    // Decrypt the serialized string with the action id as the salt.
    const decrypted = await decodeActionBoundArg(actionId, await encrypted);
    // Using Flight to deserialize the args from the string.
    const deserialized = await (0, _clientedge.createFromReadableStream)(new ReadableStream({
        start (controller) {
            controller.enqueue(textEncoder.encode(decrypted));
            controller.close();
        }
    }), {
        serverConsumerManifest: {
            // moduleLoading must be null because we don't want to trigger preloads of ClientReferences
            // to be added to the current execution. Instead, we'll wait for any ClientReference
            // to be emitted which themselves will handle the preloading.
            moduleLoading: null,
            moduleMap: isEdgeRuntime ? edgeRscModuleMapping : rscModuleMapping,
            serverModuleMap: (0, _encryptionutils.getServerModuleMap)()
        }
    });
    return deserialized;
}

//# sourceMappingURL=encryption.js.map