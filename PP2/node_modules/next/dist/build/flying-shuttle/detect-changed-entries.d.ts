import type { NextConfigComplete } from '../../server/config-shared';
export interface DetectedEntriesResult {
    app: string[];
    pages: string[];
}
export declare function hasShuttle(config: NextConfigComplete, shuttleDir: string): Promise<boolean>;
export declare function detectChangedEntries({ appPaths, pagesPaths, pageExtensions, distDir, shuttleDir, config, }: {
    appPaths?: string[];
    pagesPaths?: string[];
    pageExtensions: string[];
    distDir: string;
    shuttleDir: string;
    config: NextConfigComplete;
}): Promise<{
    changed: DetectedEntriesResult;
    unchanged: DetectedEntriesResult;
}>;
