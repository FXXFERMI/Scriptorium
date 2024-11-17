import { isWebpackInternalResource, formatFrameSourceFile } from './webpack-module-path';
function getOriginalStackFrame(source, type, isAppDir, errorMessage) {
    var _source_file, _source_file1;
    async function _getOriginalStackFrame() {
        var /* collapsed */ _source_file, _body_originalStackFrame_file, _body_originalStackFrame, _body_originalStackFrame_file1, _body_originalStackFrame1;
        const params = new URLSearchParams();
        params.append('isServer', String(type === 'server'));
        params.append('isEdgeServer', String(type === 'edge-server'));
        params.append('isAppDirectory', String(isAppDir));
        params.append('errorMessage', errorMessage);
        for(const key in source){
            var _source_key;
            params.append(key, ((_source_key = source[key]) != null ? _source_key : '').toString());
        }
        const controller = new AbortController();
        const tm = setTimeout(()=>controller.abort(), 3000);
        const res = await self.fetch((process.env.__NEXT_ROUTER_BASEPATH || '') + "/__nextjs_original-stack-frame?" + params.toString(), {
            signal: controller.signal
        }).finally(()=>{
            clearTimeout(tm);
        });
        if (!res.ok || res.status === 204) {
            return Promise.reject(new Error(await res.text()));
        }
        const body = await res.json();
        var _ref;
        return {
            error: false,
            reason: null,
            external: false,
            expanded: !Boolean((_ref = ((_source_file = source.file) == null ? void 0 : _source_file.includes('node_modules')) || ((_body_originalStackFrame = body.originalStackFrame) == null ? void 0 : (_body_originalStackFrame_file = _body_originalStackFrame.file) == null ? void 0 : _body_originalStackFrame_file.includes('node_modules')) || ((_body_originalStackFrame1 = body.originalStackFrame) == null ? void 0 : (_body_originalStackFrame_file1 = _body_originalStackFrame1.file) == null ? void 0 : _body_originalStackFrame_file1.startsWith('[turbopack]/'))) != null ? _ref : true),
            sourceStackFrame: source,
            originalStackFrame: body.originalStackFrame,
            originalCodeFrame: body.originalCodeFrame || null,
            sourcePackage: body.sourcePackage
        };
    }
    if (source.file === '<anonymous>' || source.file === 'file://' || ((_source_file = source.file) == null ? void 0 : _source_file.match(/^node:/)) || ((_source_file1 = source.file) == null ? void 0 : _source_file1.match(/https?:\/\//))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null,
            sourcePackage: null
        });
    }
    return _getOriginalStackFrame().catch((err)=>{
        var _err_message, _ref;
        return {
            error: true,
            reason: (_ref = (_err_message = err == null ? void 0 : err.message) != null ? _err_message : err == null ? void 0 : err.toString()) != null ? _ref : 'Unknown Error',
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null,
            sourcePackage: null
        };
    });
}
export function getOriginalStackFrames(frames, type, isAppDir, errorMessage) {
    return Promise.all(frames.map((frame)=>getOriginalStackFrame(frame, type, isAppDir, errorMessage)));
}
export function getFrameSource(frame) {
    if (!frame.file) return '';
    const isWebpackFrame = isWebpackInternalResource(frame.file);
    let str = '';
    // Skip URL parsing for webpack internal file paths.
    if (isWebpackFrame) {
        str = formatFrameSourceFile(frame.file);
    } else {
        try {
            var _globalThis_location;
            const u = new URL(frame.file);
            let parsedPath = '';
            // Strip the origin for same-origin scripts.
            if (((_globalThis_location = globalThis.location) == null ? void 0 : _globalThis_location.origin) !== u.origin) {
                // URLs can be valid without an `origin`, so long as they have a
                // `protocol`. However, `origin` is preferred.
                if (u.origin === 'null') {
                    parsedPath += u.protocol;
                } else {
                    parsedPath += u.origin;
                }
            }
            // Strip query string information as it's typically too verbose to be
            // meaningful.
            parsedPath += u.pathname;
            str = formatFrameSourceFile(parsedPath);
        } catch (e) {
            str = formatFrameSourceFile(frame.file);
        }
    }
    if (!isWebpackInternalResource(frame.file) && frame.lineNumber != null) {
        // If the method name is replayed from server, e.g. Page [Server],
        // and it's formatted to empty string, recover it as <anonymous> to display it.
        if (!str && frame.methodName.endsWith(' [Server]')) {
            str = '<anonymous>';
        }
        if (str) {
            if (frame.column != null) {
                str += " (" + frame.lineNumber + ":" + frame.column + ")";
            } else {
                str += " (" + frame.lineNumber + ")";
            }
        }
    }
    return str;
}

//# sourceMappingURL=stack-frame.js.map