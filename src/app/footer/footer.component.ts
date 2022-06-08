import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { EtaContainerComponent } from '../eta-container/eta-container.component';
import { EtaComponent } from '../eta/eta.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // onClick(): void {
  //   EtaContainerComponent.addContainer();
  // }

}
