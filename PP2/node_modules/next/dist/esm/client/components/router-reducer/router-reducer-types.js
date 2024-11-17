export const ACTION_REFRESH = 'refresh';
export const ACTION_NAVIGATE = 'navigate';
export const ACTION_RESTORE = 'restore';
export const ACTION_SERVER_PATCH = 'server-patch';
export const ACTION_PREFETCH = 'prefetch';
export const ACTION_HMR_REFRESH = 'hmr-refresh';
export const ACTION_SERVER_ACTION = 'server-action';
export var PrefetchKind;
(function(PrefetchKind) {
    PrefetchKind["AUTO"] = "auto";
    PrefetchKind["FULL"] = "full";
    PrefetchKind["TEMPORARY"] = "temporary";
})(PrefetchKind || (PrefetchKind = {}));
export var PrefetchCacheEntryStatus;
(function(PrefetchCacheEntryStatus) {
    PrefetchCacheEntryStatus["fresh"] = "fresh";
    PrefetchCacheEntryStatus["reusable"] = "reusable";
    PrefetchCacheEntryStatus["expired"] = "expired";
    PrefetchCacheEntryStatus["stale"] = "stale";
})(PrefetchCacheEntryStatus || (PrefetchCacheEntryStatus = {}));

//# sourceMappingURL=router-reducer-types.js.map