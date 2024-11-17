import type { ErrorInfo } from 'react';
declare global {
    var __next_log_error__: undefined | ((err: unknown) => void);
}
type RSCErrorHandler = (err: unknown) => string | undefined;
type SSRErrorHandler = (err: unknown, errorInfo?: ErrorInfo) => string | undefined;
export type DigestedError = Error & {
    digest: string;
};
export declare function createFlightReactServerErrorHandler(dev: boolean, onReactServerRenderError: (err: DigestedError) => void): RSCErrorHandler;
export declare function createHTMLReactServerErrorHandler(dev: boolean, isNextExport: boolean, reactServerErrors: Map<string, DigestedError>, silenceLogger: boolean, onReactServerRenderError: undefined | ((err: DigestedError) => void)): RSCErrorHandler;
export declare function createHTMLErrorHandler(dev: boolean, isNextExport: boolean, reactServerErrors: Map<string, DigestedError>, allCapturedErrors: Array<unknown>, silenceLogger: boolean, onHTMLRenderSSRError: (err: DigestedError, errorInfo?: ErrorInfo) => void): SSRErrorHandler;
export declare function isUserLandError(err: any): boolean;
export {};
