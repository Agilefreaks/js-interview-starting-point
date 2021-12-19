import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { BASE_URL } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    LoggerModule.forRoot({
      level: BASE_URL ? NgxLoggerLevel.OFF : NgxLoggerLevel.LOG,
      serverLogLevel: NgxLoggerLevel.OFF
    }),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
