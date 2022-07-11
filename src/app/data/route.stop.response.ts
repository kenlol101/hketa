import { StopResponse } from "./stop.response";

export interface RouteStopResponse {
    type: string;
    version: string;
    generated_timestamp: any;
    data: Array<RouteStopResponseDetail>;
}

export interface RouteStopResponseDetail {
    co: string;
    route: string;
    bound: string;
    service_type: string;
    seq: number;
    stop: string;
    data_timestamp: any;

    stopName: string;
}