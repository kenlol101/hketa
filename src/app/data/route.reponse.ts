export interface RouteResponse {
    type: string,
    version: string;
    generated_timestamp: any;
    data: Array<RouteResponseDetail>;
}

export interface RouteResponseDetail {
    co: string;
    route: string;
    bound: string;
    service_type: string;
    orig_en: string;
    orig_tc: string;
    orig_sc: string;
    dest_en: string;
    dest_tc: string;
    dest_sc: string;
    data_timestamp: any;
    select_label: string;
}