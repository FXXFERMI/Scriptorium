import type { FlightRouterState } from '../../../server/app-render/types';
import { PrefetchKind } from './router-reducer-types';
import { type NormalizedFlightData } from '../../flight-data-helpers';
export interface FetchServerResponseOptions {
    readonly flightRouterState: FlightRouterState;
    readonly nextUrl: string | null;
    readonly buildId: string;
    readonly prefetchKind?: PrefetchKind;
    readonly isHmrRefresh?: boolean;
}
export type FetchServerResponseResult = {
    flightData: NormalizedFlightData[] | string;
    canonicalUrl: URL | undefined;
    couldBeIntercepted: boolean;
    prerendered: boolean;
    postponed: boolean;
    staleTime: number;
};
/**
 * Fetch the flight data for the provided url. Takes in the current router state
 * to decide what to render server-side.
 */
export declare function fetchServerResponse(url: URL, options: FetchServerResponseOptions): Promise<FetchServerResponseResult>;
