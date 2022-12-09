export interface UrlConfig {
    kmb: UrlConfigDetail;
    nwfb: UrlConfigDetail;
}

export interface UrlConfigDetail {
    routeUrl: string;
    routeStopUrl: string;
    etaUrl: string;
    stopUrl: string;
}