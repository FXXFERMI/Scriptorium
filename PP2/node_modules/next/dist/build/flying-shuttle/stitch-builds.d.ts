import type { Rewrite, Redirect } from '../../lib/load-custom-routes';
import type { PagesManifest } from '../webpack/plugins/pages-manifest-plugin';
import { type DetectedEntriesResult } from './detect-changed-entries';
import type { NextConfigComplete } from '../../server/config-shared';
export declare function stitchBuilds({ config, distDir, shuttleDir, buildId, rewrites, redirects, allowedErrorRate, encryptionKey, edgePreviewProps, }: {
    config: NextConfigComplete;
    buildId: string;
    distDir: string;
    shuttleDir: string;
    rewrites: {
        beforeFiles: Rewrite[];
        afterFiles: Rewrite[];
        fallback: Rewrite[];
    };
    redirects: Redirect[];
    allowedErrorRate?: number;
    encryptionKey: string;
    edgePreviewProps: Record<string, string>;
}, entries: {
    changed: DetectedEntriesResult;
    unchanged: DetectedEntriesResult;
    pageExtensions: string[];
}): Promise<{
    pagesManifest?: PagesManifest;
}>;
