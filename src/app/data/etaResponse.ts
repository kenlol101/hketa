export interface EtaResponse {
    type: string;
    version: string;
    generated_timestamp: string;
    data: Array<EtaResponseDetail>;
}

export interface EtaResponseDetail {
    co: string;
    route: string;
    dir: string;
    service_type: string;
    seq: number;
    stop: string;    
    dest_tc: string;
    dest_sc: string;
    dest_en: string;
    eta_seq: number;
    eta: string;
    rmk_tc: string;
    rmk_sc: string;
    rmk_en: string;
    data_timestamp: string;
}