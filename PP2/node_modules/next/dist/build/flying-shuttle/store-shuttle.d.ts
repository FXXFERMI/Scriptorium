import type { NextConfigComplete } from '../../server/config-shared';
export interface ShuttleManifest {
    nextVersion: string;
    config: Record<string, any>;
    gitSha?: string;
}
export declare function generateShuttleManifest(config: NextConfigComplete): string;
export declare function storeShuttle({ config, distDir, shuttleDir, }: {
    distDir: string;
    shuttleDir: string;
    config: NextConfigComplete;
}): Promise<void>;
