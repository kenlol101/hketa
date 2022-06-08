import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EtaComponent } from './eta/eta.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EtaContainerComponent } from './eta-container/eta-container.component';
import { NgAutoCompleteModule } from 'ng-auto-complete';

@NgModule({
  declarations: [
    AppComponent,
    EtaComponent,
    HeaderComponent,
    FooterComponent,
    EtaContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgAutoCompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
