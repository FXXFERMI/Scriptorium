"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    generateShuttleManifest: null,
    storeShuttle: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    generateShuttleManifest: function() {
        return generateShuttleManifest;
    },
    storeShuttle: function() {
        return storeShuttle;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _child_process = require("child_process");
const _recursivecopy = require("../../lib/recursive-copy");
const _packagejson = require("next/package.json");
const _constants = require("../../shared/lib/constants");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function generateShuttleManifest(config) {
    let gitSha = '';
    try {
        gitSha = (0, _child_process.execSync)('git rev-parse HEAD').toString().trim();
    } catch (_) {}
    return JSON.stringify({
        gitSha,
        nextVersion: _packagejson.version,
        config: {
            i18n: config.i18n,
            basePath: config.basePath,
            sassOptions: config.sassOptions,
            trailingSlash: config.trailingSlash,
            experimental: {
                ppr: config.experimental.ppr,
                reactCompiler: config.experimental.reactCompiler
            }
        }
    });
}
async function storeShuttle({ config, distDir, shuttleDir }) {
    await _fs.default.promises.rm(shuttleDir, {
        force: true,
        recursive: true
    });
    await _fs.default.promises.mkdir(shuttleDir, {
        recursive: true
    });
    await _fs.default.promises.writeFile(_path.default.join(shuttleDir, 'shuttle-manifest.json'), generateShuttleManifest(config));
    // copy all server entries
    await (0, _recursivecopy.recursiveCopy)(_path.default.join(distDir, 'server'), _path.default.join(shuttleDir, 'server'), {
        filter (item) {
            return !item.match(/\.(rsc|meta|html)$/);
        }
    });
    const pagesManifest = JSON.parse(await _fs.default.promises.readFile(_path.default.join(shuttleDir, 'server', _constants.PAGES_MANIFEST), 'utf8'));
    // ensure manifest isn't modified to .html as it's before static gen
    for (const key of Object.keys(pagesManifest)){
        pagesManifest[key] = pagesManifest[key].replace(/\.html$/, '.js');
    }
    await _fs.default.promises.writeFile(_path.default.join(shuttleDir, 'server', _constants.PAGES_MANIFEST), JSON.stringify(pagesManifest));
    // copy static assets
    await (0, _recursivecopy.recursiveCopy)(_path.default.join(distDir, 'static'), _path.default.join(shuttleDir, 'static'));
    // copy manifests not nested in {distDir}/server/
    await _fs.default.promises.mkdir(_path.default.join(shuttleDir, 'manifests'), {
        recursive: true
    });
    for (const item of [
        _constants.BUILD_MANIFEST,
        _constants.ROUTES_MANIFEST,
        _constants.APP_BUILD_MANIFEST,
        _constants.REACT_LOADABLE_MANIFEST,
        _constants.APP_PATH_ROUTES_MANIFEST
    ]){
        const outputPath = _path.default.join(shuttleDir, 'manifests', item);
        await _fs.default.promises.mkdir(_path.default.dirname(outputPath), {
            recursive: true
        });
        await _fs.default.promises.copyFile(_path.default.join(distDir, item), outputPath);
    }
}

//# sourceMappingURL=store-shuttle.js.map