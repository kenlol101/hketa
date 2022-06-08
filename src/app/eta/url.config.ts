export interface UrlConfig {
    kmb: UrlConfigDetail;
    nwfs: UrlConfigDetail;
}

export interface UrlConfigDetail {
    routeUrl: string;
    routeStopUrl: string;
    etaUrl: string;
    stopUrl: string;
}