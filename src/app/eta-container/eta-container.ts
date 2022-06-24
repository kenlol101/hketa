import { EtaResponse } from "../data/eta.response";

export interface ETAContainer {
    stopId: string;
    route: string;
    serviceType: string;
    bound: string;

    response: EtaResponse;
}