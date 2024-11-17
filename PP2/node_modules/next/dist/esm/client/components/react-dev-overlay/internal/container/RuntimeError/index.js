import { _ as _tagged_template_literal_loose } from "@swc/helpers/_/_tagged_template_literal_loose";
function _templateObject() {
    const data = _tagged_template_literal_loose([
        "\n  [data-nextjs-call-stack-frame]:not(:last-child),\n  [data-nextjs-component-stack-frame]:not(:last-child) {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-data-runtime-error-copy-button],\n  [data-nextjs-data-runtime-error-copy-button]:focus:not(:focus-visible) {\n    position: relative;\n    margin-left: var(--size-gap);\n    padding: 0;\n    border: none;\n    background: none;\n    outline: none;\n  }\n  [data-nextjs-data-runtime-error-copy-button] > svg {\n    vertical-align: middle;\n  }\n  .nextjs-data-runtime-error-copy-button {\n    color: inherit;\n  }\n  .nextjs-data-runtime-error-copy-button--initial:hover {\n    cursor: pointer;\n  }\n  .nextjs-data-runtime-error-copy-button[aria-disabled='true'] {\n    opacity: 0.3;\n    cursor: not-allowed;\n  }\n  .nextjs-data-runtime-error-copy-button--error,\n  .nextjs-data-runtime-error-copy-button--error:hover {\n    color: var(--color-ansi-red);\n  }\n  .nextjs-data-runtime-error-copy-button--success {\n    color: var(--color-ansi-green);\n  }\n\n  [data-nextjs-call-stack-frame] > h3,\n  [data-nextjs-component-stack-frame] > h3 {\n    margin-top: 0;\n    margin-bottom: var(--size-gap);\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-font);\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {\n    color: #666;\n  }\n  [data-nextjs-call-stack-frame] > div,\n  [data-nextjs-component-stack-frame] > div {\n    display: flex;\n    align-items: center;\n    padding-left: calc(var(--size-gap) + var(--size-gap-half));\n    font-size: var(--size-font-small);\n    color: #999;\n  }\n  [data-nextjs-call-stack-frame] > div > svg,\n  [data-nextjs-component-stack-frame] > [role='link'] > svg {\n    width: auto;\n    height: var(--size-font-small);\n    margin-left: var(--size-gap);\n    flex-shrink: 0;\n    display: none;\n  }\n\n  [data-nextjs-call-stack-frame] > div[data-has-source],\n  [data-nextjs-component-stack-frame] > [role='link'] {\n    cursor: pointer;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source]:hover,\n  [data-nextjs-component-stack-frame] > [role='link']:hover {\n    text-decoration: underline dotted;\n  }\n  [data-nextjs-call-stack-frame] > div[data-has-source] > svg,\n  [data-nextjs-component-stack-frame] > [role='link'] > svg {\n    display: unset;\n  }\n\n  [data-nextjs-call-stack-framework-icon] {\n    margin-right: var(--size-gap);\n  }\n  [data-nextjs-call-stack-framework-icon='next'] > mask {\n    mask-type: alpha;\n  }\n  [data-nextjs-call-stack-framework-icon='react'] {\n    color: rgb(20, 158, 202);\n  }\n  [data-nextjs-collapsed-call-stack-details][open]\n    [data-nextjs-call-stack-chevron-icon] {\n    transform: rotate(90deg);\n  }\n  [data-nextjs-collapsed-call-stack-details] summary {\n    display: flex;\n    align-items: center;\n    margin-bottom: var(--size-gap);\n    list-style: none;\n  }\n  [data-nextjs-collapsed-call-stack-details] summary::-webkit-details-marker {\n    display: none;\n  }\n\n  [data-nextjs-collapsed-call-stack-details] h3 {\n    color: #666;\n  }\n  [data-nextjs-collapsed-call-stack-details] [data-nextjs-call-stack-frame] {\n    margin-bottom: var(--size-gap-double);\n  }\n\n  [data-nextjs-container-errors-pseudo-html] {\n    position: relative;\n  }\n  [data-nextjs-container-errors-pseudo-html-collapse] {\n    position: absolute;\n    left: 10px;\n    top: 10px;\n    color: inherit;\n    background: none;\n    border: none;\n    padding: 0;\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='add'] {\n    color: var(--color-ansi-green);\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='remove'] {\n    color: var(--color-ansi-red);\n  }\n  [data-nextjs-container-errors-pseudo-html--tag-error] {\n    color: var(--color-ansi-red);\n    font-weight: bold;\n  }\n  /* hide but text are still accessible in DOM */\n  [data-nextjs-container-errors-pseudo-html--hint] {\n    display: inline-block;\n    font-size: 0;\n  }\n  [data-nextjs-container-errors-pseudo-html--tag-adjacent='false'] {\n    color: var(--color-accents-1);\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { CodeFrame } from '../../components/CodeFrame';
import { noop as css } from '../../helpers/noop-template';
import { groupStackFramesByFramework } from '../../helpers/group-stack-frames-by-framework';
import { GroupedStackFrames } from './GroupedStackFrames';
export function RuntimeError(param) {
    let { error } = param;
    const { firstFrame, allLeadingFrames, allCallStackFrames } = React.useMemo(()=>{
        const filteredFrames = error.frames// Filter out nodejs internal frames since you can't do anything about them.
        // e.g. node:internal/timers shows up pretty often due to timers, but not helpful to users.
        // Only present the last line before nodejs internal trace.
        .filter((f)=>{
            var _f_sourceStackFrame_file;
            return !((_f_sourceStackFrame_file = f.sourceStackFrame.file) == null ? void 0 : _f_sourceStackFrame_file.startsWith('node:'));
        });
        const firstFirstPartyFrameIndex = filteredFrames.findIndex((entry)=>entry.expanded && Boolean(entry.originalCodeFrame) && Boolean(entry.originalStackFrame));
        var _filteredFrames_firstFirstPartyFrameIndex;
        return {
            firstFrame: (_filteredFrames_firstFirstPartyFrameIndex = filteredFrames[firstFirstPartyFrameIndex]) != null ? _filteredFrames_firstFirstPartyFrameIndex : null,
            allLeadingFrames: firstFirstPartyFrameIndex < 0 ? [] : filteredFrames.slice(0, firstFirstPartyFrameIndex),
            allCallStackFrames: filteredFrames.slice(firstFirstPartyFrameIndex + 1)
        };
    }, [
        error.frames
    ]);
    const { leadingFramesGroupedByFramework, stackFramesGroupedByFramework } = React.useMemo(()=>{
        const leadingFrames = allLeadingFrames.filter((f)=>f.expanded);
        return {
            stackFramesGroupedByFramework: groupStackFramesByFramework(allCallStackFrames),
            leadingFramesGroupedByFramework: groupStackFramesByFramework(leadingFrames)
        };
    }, [
        allCallStackFrames,
        allLeadingFrames
    ]);
    return /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            firstFrame ? /*#__PURE__*/ _jsxs(React.Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        children: "Source"
                    }),
                    /*#__PURE__*/ _jsx(GroupedStackFrames, {
                        groupedStackFrames: leadingFramesGroupedByFramework
                    }),
                    /*#__PURE__*/ _jsx(CodeFrame, {
                        stackFrame: firstFrame.originalStackFrame,
                        codeFrame: firstFrame.originalCodeFrame
                    })
                ]
            }) : undefined,
            stackFramesGroupedByFramework.length ? /*#__PURE__*/ _jsxs(React.Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        children: "Call Stack"
                    }),
                    /*#__PURE__*/ _jsx(GroupedStackFrames, {
                        groupedStackFrames: stackFramesGroupedByFramework
                    })
                ]
            }) : undefined
        ]
    });
}
export const styles = css(_templateObject());

//# sourceMappingURL=index.js.map