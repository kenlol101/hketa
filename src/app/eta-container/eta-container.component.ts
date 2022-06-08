import { Component, OnInit } from '@angular/core';
import { EtaResponse } from '../data/eta.response';

@Component({
  selector: 'app-eta-container',
  templateUrl: './eta-container.component.html',
  styleUrls: ['./eta-container.component.css']
})
export class EtaContainerComponent implements OnInit {

  static containerList: Array<EtaResponse> = [];

  constructor() { }

  ngOnInit(): void {
  }

  static addContainer(item: EtaResponse): void {
    EtaContainerComponent.containerList.push(item);
  }

  get containerList(): Array<EtaResponse> {
    return EtaContainerComponent.containerList;
  }

  onClick(item: EtaResponse): void {
    EtaContainerComponent.containerList = EtaContainerComponent.containerList.filter(e => e !== item);
  }
}
