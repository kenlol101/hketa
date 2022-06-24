import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UrlConfig } from './eta/url.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Hong Kong Bus ETA App';
  static urlConfig: UrlConfig | undefined;
  static httpClient: HttpClient;

  static get config() {
    if (!AppComponent.urlConfig){
      this.httpClient.get<UrlConfig>("assets/url.json").subscribe((data: UrlConfig) => AppComponent.urlConfig = {...data});
    }  
    return AppComponent.urlConfig;
  }

}
