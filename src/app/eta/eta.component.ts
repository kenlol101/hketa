import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtaResponse } from '../data/eta.response';
import { filter, Observable, Observer, startWith, map } from 'rxjs';
import { ETA } from './eta'; 
import { UrlConfig } from './url.config';
import { RouteResponse, RouteResponseDetail } from '../data/route.reponse';
import { RouteStopResponse, RouteStopResponseDetail } from '../data/route.stop.response';
import { StopResponse } from '../data/stop.response';
import { EtaContainerComponent } from '../eta-container/eta-container.component';
import { AppComponent } from '../app.component';
import { ETAContainer } from '../eta-container/eta-container';
import { FormControl } from '@angular/forms';
import { Company } from '../data/company';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.component.html',
  styleUrls: ['./eta.component.css']
})
export class EtaComponent implements OnInit {
  companyList: Company[] = [
    {co: "CTB", name_en:"Citybus Limited", name_tc:"城巴有限公司", name_sc:"城巴有限公司"},
    {co: "NWFB", name_en:"New World First Bus Services Limited", name_tc:"新世界第一巴士服務有限公司", name_sc:"新世界第一巴士服务有限公司"},
    {co: "KMB", name_en:"The Kowloon Motor Bus", name_tc:"九龍巴士有限公司", name_sc:"九龙巴士有限公司"}
  ]

  routeList: RouteResponse | undefined;
  routeStopList: RouteStopResponse | undefined;
  stopList: Array<StopResponse> = [];
  
  matCtrl: FormControl;
  filterRouteList: Observable<RouteResponseDetail[]> = new Observable();
  
  model: ETA = new ETA();
  constructor(private httpClient: HttpClient) { this.matCtrl = new FormControl(); }

//#region Init
  ngOnInit(): void {
    this.getConfigUrl();
    this.filterRouteList = this.matCtrl.valueChanges
    .pipe(
      startWith(''), 
      map(val => this.filterRoute(val)) 
    )
  }
  filterRoute(val: any) : RouteResponseDetail[] {
    if (typeof(val) === "string") {
      return this.routeList 
        ? this.routeList.data.filter(
          data => data.dest_en.toLowerCase().indexOf(val.toLowerCase()) === 0
          || data.route.indexOf(val) === 0)
        : new Array<RouteResponseDetail>();
    }

    return new Array<RouteResponseDetail>();
  }

  getConfigUrl() {
    this.httpClient.get<UrlConfig>("assets/url.json").subscribe((data: UrlConfig) => AppComponent.urlConfig = {...data});
  }
//#endregion

//#region Route

  onCompanySelected(company: string) {
    // console.log("onCompanySelected", company);
    this.getRouteList(company);
  }

  getRouteList(company: string) {
    let url : string = '';
    if ("KMB" == company) {
      url = `${AppComponent.urlConfig?.kmb.routeUrl}`;
      this.httpClient.get<RouteResponse>(url).subscribe((data:RouteResponse) => {
        this.routeList = {...data};
        this.routeList.data.map(r => r.select_label = r.route + ' - ' + r.dest_en);
      });
    }
    else {
      url = `${AppComponent.urlConfig?.nwfb.routeUrl}${company}/`;
      this.httpClient.get<RouteResponse>(url).subscribe((data : RouteResponse) => {
        let tempData = data.data.map(x => Object.assign({}, x));
        this.routeList = {...data};
        this.routeList.data.map(r => r.bound = "O");
        
        tempData.map(function(r){
          let temp_dest_en = r.dest_en;
          let temp_dest_tc = r.dest_tc;
          let temp_dest_sc = r.dest_sc;

          r.dest_en = r.orig_en;
          r.dest_sc = r.orig_sc;
          r.dest_tc = r.orig_tc;

          r.orig_en = temp_dest_en;
          r.orig_sc = temp_dest_tc;
          r.orig_tc = temp_dest_sc;

          r.bound = "I";          
        });

        this.routeList.data.push(...tempData);

      });
    }
    // console.log("url: " + url);
    
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
    // console.log("getStopList route:" + route + ",bound: " + bound + ",service_type: " + service_type);
    let url : string = "KMB" == this.model.company ? `${AppComponent.urlConfig?.kmb.routeStopUrl}${route}/${bound}/${service_type}` 
              : `${AppComponent.urlConfig?.nwfb.routeStopUrl}${this.model.company}/${route}/${bound}`;
    
    // console.log("url: " + url);

    let routeStopObserver: Observer<RouteStopResponse> = {
      next: (data: RouteStopResponse) => this.routeStopList = {...data},
      error: (error: any) => {},
      complete: () => {

        if (this.routeStopList){
          this.routeStopList.data.sort((d1, d2) => d1.seq - d2.seq);

          for (var i = 0; i < this.routeStopList.data.length; i++) {
            var d : RouteStopResponseDetail = this.routeStopList.data[i];
            let stopUrl = "KMB" == this.model.company ? `${AppComponent.urlConfig?.kmb.stopUrl}${d.stop}` 
                          : `${AppComponent.urlConfig?.nwfb.stopUrl}${d.stop}`  ;
            // this.httpClient.get<StopResponse>(stopUrl).subscribe((data: StopResponse) => this.stopList?.push({...data}));

            this.httpClient.get<StopResponse>(stopUrl)
            .subscribe(
              (data: StopResponse) => {
                if (this.routeStopList){
                  var stop = this.routeStopList.data.find(d => d.stop == data.data.stop);
                  if (stop){
                    stop.stopName = data.data.name_en
                  }                  
                }                  
              });                     
          }
        }        
      }
    };

    this.httpClient.get<RouteStopResponse>(url).subscribe(routeStopObserver);    
  }
//#endregion

  onSubmit() {
    if (this.model.route != undefined){
      new EtaContainerComponent(this.httpClient).addContainer(
        { co: this.model.company,
          stopId: this.model.stop, 
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
  selectEvent(item?: RouteResponseDetail) {
    if (item != null) {
      this.model.route = item;
      this.onRouteSelected();
    }    
  }
  displayFn(item?: RouteResponseDetail): string {
    return item ? (item.route + " - " + item.dest_en) : "";
  }
//#endregion


}
