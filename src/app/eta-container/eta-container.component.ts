import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { EtaResponse, EtaResponseDetail } from '../data/eta.response';
import { ETAContainer as EtaContainer } from './eta-container';

@Component({
  selector: 'app-eta-container',
  templateUrl: './eta-container.component.html',
  styleUrls: ['./eta-container.component.css']
})
export class EtaContainerComponent {

  displayedColumns: string[] = ['route', 'dest_en', 'eta', 'rmk_en'];
  static containerList: Array<EtaContainer> = [];

  constructor(private httpClient: HttpClient) { }

  addContainer(item: EtaContainer): void {    
    EtaContainerComponent.containerList.push(item);
    this.refreshContainer(item);
    setInterval(() => {
      this.refreshContainer(item);
    }, 30000);
  }

  get containerList(): Array<EtaContainer> {
    EtaContainerComponent.containerList.forEach(element => {
      element.response.data.sort((d1, d2) => d1.seq - d2.seq)
    });
    return EtaContainerComponent.containerList;
  }

  tableData(etaReponse: EtaResponse): DataSource<EtaResponseDetail> {
    return new MatTableDataSource(etaReponse.data);
  }

  refreshContainer(item: EtaContainer) {
    this.getETAResponse(item, (data: EtaResponse) => {
      item.response = {...data};            
    });
  }

  onClick(item: EtaContainer): void {
    EtaContainerComponent.containerList = EtaContainerComponent.containerList.filter(e => e !== item);
  }

//#region ETA
private getETAObservable(stopId: string, route: string, serviceType: string): Observable<EtaResponse> {
  return this.httpClient.get<EtaResponse>(`${AppComponent.config?.kmb.etaUrl}${stopId}/${route}/${serviceType}`);
}

getETAResponse(item: EtaContainer, callback: (data: EtaResponse) => void) {
  this.getETAObservable(item.stopId, item.route, item.serviceType).subscribe(
    (data: EtaResponse) => {
      // this.etaReponse = {...data};
      data.data = data.data.filter(d => d.route == item.route
        && d.service_type == item.serviceType
        && d.dir == item.bound);
      // EtaContainerComponent.addContainer({...data});
      callback(data);       
    });
}
//#endregion
}
