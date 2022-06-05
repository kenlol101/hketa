import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  tabs: Map<string, string> = new Map([
    ['ETA', '/eta'],
  ]);

  constructor() { }

  ngOnInit(): void {
  }

  title: string = 'Hong Kong Bus ETA App';

}
