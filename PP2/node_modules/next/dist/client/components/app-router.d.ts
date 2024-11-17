import React from 'react';
import type { CacheNode } from '../../shared/lib/app-router-context.shared-runtime';
import { type ErrorComponent } from './error-boundary';
import type { AppRouterActionQueue } from '../../shared/lib/router/action-queue';
export declare function createEmptyCacheNode(): CacheNode;
export default function AppRouter({ actionQueue, globalErrorComponentAndStyles: [globalErrorComponent, globalErrorStyles], assetPrefix, }: {
    actionQueue: AppRouterActionQueue;
    globalErrorComponentAndStyles: [ErrorComponent, React.ReactNode | undefined];
    assetPrefix: string;
}): import("react/jsx-runtime").JSX.Element;
