import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtaResponse } from '../data/etaResponse';
import { Observable } from 'rxjs';

const BASE_URL: string = 'https://data.etabus.gov.hk/';
const ETA_END_ENPOINT: string = 'v1/transport/kmb/eta/';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.component.html',
  styleUrls: ['./eta.component.css']
})
export class EtaComponent implements OnInit {

  etaReponse : EtaResponse | undefined;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getETAResponse('A60AE774B09A5E44', '40', '1');
  }

  private getETAObservable(stopId: string, route: string, serviceType: string): Observable<EtaResponse> {
    return this.httpClient.get<EtaResponse>(`${BASE_URL}${ETA_END_ENPOINT}${stopId}/${route}/${serviceType}`);
  }

  getETAResponse(stopId: string, route: string, serviceType: string) {
    this.getETAObservable(stopId, route, serviceType).subscribe((data: EtaResponse) => this.etaReponse = {...data});
  }
}
