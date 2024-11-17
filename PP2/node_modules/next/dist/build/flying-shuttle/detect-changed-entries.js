"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    detectChangedEntries: null,
    hasShuttle: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    detectChangedEntries: function() {
        return detectChangedEntries;
    },
    hasShuttle: function() {
        return hasShuttle;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _child_process = require("child_process");
const _entries = require("../entries");
const _debug = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/debug"));
const _asyncsema = require("next/dist/compiled/async-sema");
const _storeshuttle = require("./store-shuttle");
const _builddiagnostics = require("../../diagnostics/build-diagnostics");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = (0, _debug.default)('next:build:flying-shuttle');
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1){
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}
let _hasShuttle = undefined;
async function hasShuttle(config, shuttleDir) {
    if (typeof _hasShuttle === 'boolean') {
        return _hasShuttle;
    }
    let foundShuttleManifest;
    async function pruneCache() {
        await _fs.default.promises.rm(shuttleDir, {
            force: true,
            recursive: true
        });
        await _fs.default.promises.mkdir(shuttleDir, {
            recursive: true
        });
    }
    try {
        foundShuttleManifest = JSON.parse(await _fs.default.promises.readFile(_path.default.join(shuttleDir, 'shuttle-manifest.json'), 'utf8'));
        _hasShuttle = true;
    } catch (err) {
        _hasShuttle = false;
        console.log(`Failed to read shuttle manifest`);
        // prune potentially corrupted cache
        await pruneCache();
        return _hasShuttle;
    }
    const currentShuttleManifest = JSON.parse((0, _storeshuttle.generateShuttleManifest)(config));
    if (currentShuttleManifest.nextVersion !== foundShuttleManifest.nextVersion) {
        // we don't allow using shuttle from differing Next.js version
        // as it could have internal changes
        console.log(`shuttle has differing Next.js version ${foundShuttleManifest.nextVersion} versus current ${currentShuttleManifest.nextVersion}, skipping.`);
        _hasShuttle = false;
    }
    if (!deepEqual(currentShuttleManifest.config, foundShuttleManifest.config)) {
        _hasShuttle = false;
        console.log(`Mismatching shuttle configs`, currentShuttleManifest.config, foundShuttleManifest.config);
    }
    if (_hasShuttle) {
        let currentGitSha = '';
        try {
            currentGitSha = (0, _child_process.execSync)('git rev-parse HEAD').toString().trim();
        } catch (_) {}
        await (0, _builddiagnostics.updateIncrementalBuildMetrics)({
            currentGitSha,
            shuttleGitSha: currentShuttleManifest.gitSha
        });
    } else {
        // prune mis-matching cache
        await pruneCache();
    }
    return _hasShuttle;
}
async function detectChangedEntries({ appPaths, pagesPaths, pageExtensions, distDir, shuttleDir, config }) {
    const changedEntries = {
        app: [],
        pages: []
    };
    const unchangedEntries = {
        app: [],
        pages: []
    };
    if (!await hasShuttle(config, shuttleDir)) {
        // no shuttle so consider everything changed
        console.log(`no shuttle. can't detect changes`);
        return {
            changed: {
                pages: pagesPaths || [],
                app: appPaths || []
            },
            unchanged: {
                pages: [],
                app: []
            }
        };
    }
    const hashCache = new Map();
    async function computeHash(p) {
        let hash = hashCache.get(p);
        if (hash) {
            return hash;
        }
        return new Promise((resolve, reject)=>{
            const hashInst = _crypto.default.createHash('sha1');
            const stream = _fs.default.createReadStream(p);
            stream.on('error', (err)=>reject(err));
            stream.on('data', (chunk)=>hashInst.update(chunk));
            stream.on('end', ()=>{
                const digest = hashInst.digest('hex');
                resolve(digest);
                hashCache.set(p, digest);
            });
        });
    }
    const hashSema = new _asyncsema.Sema(16);
    let globalEntryChanged = false;
    const changedDependencies = {};
    async function detectChange({ normalizedEntry, entry, type }) {
        const traceFile = _path.default.join(shuttleDir, 'server', type, `${normalizedEntry}.js.nft.json`);
        let changed = true;
        // we don't need to check any further entry's dependencies if
        // a global entry changed since that invalidates everything
        if (!globalEntryChanged) {
            try {
                const traceData = JSON.parse(await _fs.default.promises.readFile(traceFile, 'utf8'));
                if (traceData) {
                    let changedDependency = false;
                    await Promise.all(Object.keys(traceData.fileHashes).map(async (file)=>{
                        try {
                            if (changedDependency) return;
                            await hashSema.acquire();
                            const relativeTraceFile = _path.default.relative(_path.default.join(shuttleDir, 'server', type), traceFile);
                            const originalTraceFile = _path.default.join(distDir, 'server', type, relativeTraceFile);
                            const absoluteFile = _path.default.join(_path.default.dirname(originalTraceFile), file);
                            if (absoluteFile.startsWith(distDir)) {
                                return;
                            }
                            const prevHash = traceData.fileHashes[file];
                            const curHash = await computeHash(absoluteFile);
                            if (prevHash !== curHash) {
                                changedDependencies[normalizedEntry] = file;
                                debug('detected change on', {
                                    prevHash,
                                    curHash,
                                    file,
                                    entry: normalizedEntry
                                });
                                changedDependency = true;
                            }
                        } finally{
                            hashSema.release();
                        }
                    }));
                    if (!changedDependency) {
                        changed = false;
                    }
                } else {
                    console.error('missing trace data', traceFile, normalizedEntry);
                }
            } catch (err) {
                console.error(`Failed to detect change for ${entry} ${normalizedEntry}`, err);
            }
        }
        // we always rebuild global entries so we have a version
        // that matches the newest build/runtime
        const isGlobalEntry = /(_app|_document|_error)/.test(entry);
        if (changed || isGlobalEntry) {
            // if a global entry changed all entries are changed
            if (changed && !globalEntryChanged && isGlobalEntry) {
                console.log(`global entry ${entry} changed invalidating all entries`);
                globalEntryChanged = true;
                // move unchanged to changed
                changedEntries[type].push(...unchangedEntries[type]);
            }
            changedEntries[type].push(entry);
        } else {
            unchangedEntries[type].push(entry);
        }
    }
    // loop over entries and their dependency's hashes
    // to detect which changed
    for (const entry of pagesPaths || []){
        let normalizedEntry = (0, _entries.getPageFromPath)(entry, pageExtensions);
        if (normalizedEntry === '/') {
            normalizedEntry = '/index';
        }
        await detectChange({
            entry,
            normalizedEntry,
            type: 'pages'
        });
    }
    for (const entry of appPaths || []){
        let normalizedEntry = (0, _entries.getPageFromPath)(entry, pageExtensions);
        if (normalizedEntry === '/not-found') {
            normalizedEntry = '/_not-found/page';
        }
        await detectChange({
            entry,
            normalizedEntry,
            type: 'app'
        });
    }
    await (0, _builddiagnostics.updateIncrementalBuildMetrics)({
        changedDependencies
    });
    return {
        changed: changedEntries,
        unchanged: unchangedEntries
    };
}

//# sourceMappingURL=detect-changed-entries.js.map