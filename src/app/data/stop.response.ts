export interface StopResponse{
    type: string;
    version: string;
    generated_timestamp: any;
    data: StopResponseDetail;

    seq: number;
}

export interface StopResponseDetail {
    stop: string;
    name_tc: string;
    name_en: string;
    name_sc: string;
    lat: number;
    long: number;
    data_timestamp: any;    
}

export interface StopList {
    stop: string;
    name: string;
}