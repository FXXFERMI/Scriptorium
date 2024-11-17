"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "inlineStaticEnv", {
    enumerable: true,
    get: function() {
        return inlineStaticEnv;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _util = require("util");
const _glob = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/glob"));
const _defineenvplugin = require("../webpack/plugins/define-env-plugin");
const _asyncsema = require("next/dist/compiled/async-sema");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const glob = (0, _util.promisify)(_glob.default);
async function inlineStaticEnv({ distDir, config }) {
    const nextConfigEnv = (0, _defineenvplugin.getNextConfigEnv)(config);
    const staticEnv = {
        ...(0, _defineenvplugin.getNextPublicEnvironmentVariables)(),
        ...nextConfigEnv
    };
    const serverDir = _path.default.join(distDir, 'server');
    const serverChunks = await glob('**/*.js', {
        cwd: serverDir
    });
    const clientDir = _path.default.join(distDir, 'static');
    const clientChunks = await glob('**/*.js', {
        cwd: clientDir
    });
    const inlineSema = new _asyncsema.Sema(8);
    const nextConfigEnvKeys = Object.keys(nextConfigEnv).map((item)=>item.split('process.env.').pop());
    const builtRegEx = new RegExp(`[\\w]{1,}\\.env\\.(?:NEXT_PUBLIC_[\\w]{1,}${nextConfigEnvKeys.length ? '|' + nextConfigEnvKeys.join('|') : ''})`, 'g');
    for (const [parentDir, files] of [
        [
            serverDir,
            serverChunks
        ],
        [
            clientDir,
            clientChunks
        ]
    ]){
        await Promise.all(files.map(async (file)=>{
            await inlineSema.acquire();
            const filepath = _path.default.join(parentDir, file);
            const content = await _fs.default.promises.readFile(filepath, 'utf8');
            await _fs.default.promises.writeFile(filepath, content.replace(builtRegEx, (match)=>{
                let normalizedMatch = `process.env.${match.split('.').pop()}`;
                if (staticEnv[normalizedMatch]) {
                    return JSON.stringify(staticEnv[normalizedMatch]);
                }
                return match;
            }));
            inlineSema.release();
        }));
    }
}

//# sourceMappingURL=inline-static-env.js.map