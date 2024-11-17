import { type NotFoundError } from './not-found';
import { type RedirectError } from './redirect';
/**
 * Returns true if the error is a navigation signal error. These errors are
 * thrown by user code to perform navigation operations and interrupt the React
 * render.
 */
export declare function isNextRouterError(error: unknown): error is RedirectError | NotFoundError;
