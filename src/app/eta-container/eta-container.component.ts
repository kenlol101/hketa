import { Component, OnInit } from '@angular/core';
import { ETA } from '../eta/eta';

@Component({
  selector: 'app-eta-container',
  templateUrl: './eta-container.component.html',
  styleUrls: ['./eta-container.component.css']
})
export class EtaContainerComponent implements OnInit {

  containerList: Array<ETA> = [];

  constructor() { }

  ngOnInit(): void {
  }

  addContainer(): void {
    this.containerList.push(new ETA());
  }

}
