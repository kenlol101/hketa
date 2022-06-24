import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtaResponse } from '../data/eta.response';
import { Observable, Observer } from 'rxjs';
import { ETA } from './eta'; 
import { UrlConfig } from './url.config';
import { RouteResponse, RouteResponseDetail } from '../data/route.reponse';
import { RouteStopResponse, RouteStopResponseDetail } from '../data/route.stop.response';
import { StopResponse } from '../data/stop.response';
import { EtaContainerComponent } from '../eta-container/eta-container.component';
import { AppComponent } from '../app.component';
import { ETAContainer } from '../eta-container/eta-container';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.component.html',
  styleUrls: ['./eta.component.css']
})
export class EtaComponent implements OnInit {
 
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
    this.httpClient.get<UrlConfig>("assets/url.json").subscribe((data: UrlConfig) => AppComponent.urlConfig = {...data});
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
      url = `${AppComponent.urlConfig?.kmb.routeUrl}`;
    }
    else if ("NWFS" == company) {
      url = `${AppComponent.urlConfig?.nwfs.routeUrl}`;
    }
    console.log("url: " + url);
    this.httpClient.get<RouteResponse>(url).subscribe((data:RouteResponse) => {
      this.routeList = {...data};
      this.routeList.data.map(r => r.select_label = r.route + ' - ' + r.dest_en);
    });
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
    let url : string = `${AppComponent.urlConfig?.kmb.routeStopUrl}${route}/${bound}/${service_type}`;
    
    console.log("url: " + url);

    let routeStopObserver: Observer<RouteStopResponse> = {
      next: (data: RouteStopResponse) => this.routeStopList = {...data},
      error: (error: any) => {},
      complete: () => {

        if (this.routeStopList){
          this.routeStopList.data.sort((d1, d2) => d1.seq - d2.seq);

          for (var i = 0; i < this.routeStopList.data.length; i++) {
            var d : RouteStopResponseDetail = this.routeStopList.data[i];
            let stopUrl = `${AppComponent.urlConfig?.kmb.stopUrl}${d.stop}`;
            // this.httpClient.get<StopResponse>(stopUrl).subscribe((data: StopResponse) => this.stopList?.push({...data}));

            this.httpClient.get<StopResponse>(stopUrl).subscribe(
              (data: StopResponse) => {
                let tempData = {...data};
                tempData.seq = d.seq;
                this.stopList.push(tempData);                
              },
              (error: any)=> {},
              ()=> {this.stopList.sort((s1, s2) => s1.seq - s2.seq)});                     
          }
        }        
      }
    };

    this.httpClient.get<RouteStopResponse>(url).subscribe(routeStopObserver);    
  }
//#endregion

  onSubmit() {
    console.log("Submitted: " + JSON.stringify(this.model.route));
    if (this.model.route != undefined){
      new EtaContainerComponent(this.httpClient).addContainer(
        { stopId: this.model.stop, 
          route: this.model.route.route,
          serviceType: this.model.route.service_type,
          bound: this.model.route.bound} as ETAContainer
      );
    }
  }

  get debug() {
    return JSON.stringify(this.model);
  }  

//#region AutoComplete
  keyword = 'select_label';
  selectEvent(item: any) {
    this.model.route = item;
    this.onRouteSelected();
  }
//#endregion


}
