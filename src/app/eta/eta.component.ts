import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtaResponse } from '../data/eta.response';
import { Observable, Observer } from 'rxjs';
import { ETA } from './eta'; 
import { UrlConfig } from './url.config';
import { RouteResponse, RouteResponseDetail } from '../data/route.reponse';
import { SelectedAutocompleteItem } from 'ng-auto-complete';
import { RouteStopResponse, RouteStopResponseDetail } from '../data/route.stop.response';
import { StopList, StopResponse, StopResponseDetail } from '../data/stop.response';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.component.html',
  styleUrls: ['./eta.component.css']
})
export class EtaComponent implements OnInit {

  urlConfig: UrlConfig | undefined;
  
  routeList: RouteResponse | undefined;
  routeStopList: RouteStopResponse | undefined;
  stopList: Array<StopResponse> = [];

  model: ETA = new ETA();
  constructor(private httpClient: HttpClient) { }

//#region Init
  ngOnInit(): void {
    this.getConfigUrl();
  }
  getConfigUrl() {
    this.httpClient.get<UrlConfig>("assets/url.json").subscribe((data: UrlConfig) => this.urlConfig = {...data});
  }
//#endregion

//#region Route

  onCompanySelected(company: string) {
    console.log("onCompanySelected");
    this.getRouteList(company);
  }

  getRouteList(company: string) {
    console.log("getRouteList company:" + company);
    let url : string = '';
    if ("KMB" == company) {
      url = `${this.urlConfig?.kmb.routeUrl}`;
    }
    else if ("NWFS" == company) {
      url = `${this.urlConfig?.nwfs.routeUrl}`;
    }
    console.log("url: " + url);
    this.httpClient.get<RouteResponse>(url).subscribe((data:RouteResponse) => this.routeList = {...data});
  }
//#endregion

//#region Stop
  onRouteSelected() {
    if (this.model.route) {
      // Clear Previous Stop List
      this.stopList = [];

      var r : RouteResponseDetail = this.model.route;

      let bound = r.bound;
      if ("I" == bound) bound = "inbound";
      else if ("O" == bound) bound = "outbound";
      else console.log("Bound Type Unknown: " + bound);
      
      this.getStopList(r.route, bound, r.service_type);
    } else {
      console.log("Route is not selected.");
    }
  }

  getStopList(route: string, bound: string, service_type: string) {
    console.log("getStopList route:" + route + ",bound: " + bound + ",service_type: " + service_type);
    let url : string = `${this.urlConfig?.kmb.routeStopUrl}${route}/${bound}/${service_type}`;
    
    console.log("url: " + url);

    
    let routeStopObserver: Observer<RouteStopResponse> = {
      next: (data: RouteStopResponse) => this.routeStopList = {...data},
      error: (error: any) => {},
      complete: () => {
        if (this.routeStopList){
          for (var i = 0; i < this.routeStopList.data.length; i++) {
            var d : RouteStopResponseDetail = this.routeStopList.data[i];
            let stopUrl = `${this.urlConfig?.kmb.stopUrl}${d.stop}`;
            this.httpClient.get<StopResponse>(stopUrl).subscribe((data: StopResponse) => this.stopList?.push({...data}));
          }
        }        
      }
    };

    this.httpClient.get<RouteStopResponse>(url).subscribe(routeStopObserver);
  }
//#endregion

//#region ETA
  etaReponse : EtaResponse | undefined;

  private getETAObservable(stopId: string, route: string, serviceType: string): Observable<EtaResponse> {
    return this.httpClient.get<EtaResponse>(`${this.urlConfig?.kmb.etaUrl}${stopId}/${route}/${serviceType}`);
  }
  getETAResponse(stopId: string, route: string, serviceType: string) {
    this.getETAObservable(stopId, route, serviceType).subscribe(
      (data: EtaResponse) => {
        this.etaReponse = {...data};
      });
  }
//#endregion

  onSubmit() {
    console.log("Submitted: " + JSON.stringify(this.model.route));
    if (this.model.route != undefined)
      this.getETAResponse(this.model.stop, this.model.route.route, this.model.route.service_type);
  }  

  get debug() {
    return JSON.stringify(this.model);
  }  

  // TODO
  // onSelected(item: SelectedAutocompleteItem) {
  //   console.log(item.item.original);
  // }
}
