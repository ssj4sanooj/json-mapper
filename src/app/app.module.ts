import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NodeService } from './nodeservice';

import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TreeModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent }

    ])
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [NodeService]
})

export class AppModule { }
