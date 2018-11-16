import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes } from '@angular/router'
import { WebConsoleComponent, AuthGuard, WebConsoleCoreModule } from 'web-console-core'
import { WebConsoleLoginComponent } from 'web-console-login'
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { environment } from '../environments/environment';
import { WC_API_BASE_PATH, WC_OAUTH_BASE_PATH } from 'web-console-core'
import { ConfigurationSectionComponent } from './sections/Configuration/configuration-section-component'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule } from 'web-console-ui-kit'
import { WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { ConfigurationServiceModule } from '@wa-motif-open-api/configuration-service'

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: WebConsoleLoginComponent },
  { path: 'dashboard', component: WebConsoleComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationSectionComponent
  ],
  imports: [
    BrowserModule,  
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF}),
    WebAdminModulesProvider, 
    ToolBarModule, 
    BrowserAnimationsModule, 
    GridModule,
    WebConsoleCoreModule,
    WebConsoleUIKitCoreModule,
    WebConsoleUIKitDataModule,
    WebConsoleUIKitKendoProviderModule,
    ConfigurationServiceModule
  ],
  providers: [ 
    { provide: WC_API_BASE_PATH, useValue: environment.API_BASE_PATH }, 
    { provide: WC_OAUTH_BASE_PATH, useValue: environment.OAUTH_BAS_PATH },
    WebAdminModulesProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfigurationSectionComponent
  ]
})
export class AppModule { 

  constructor(private logger: NGXLogger){
    this.logger.info("AppModule" ,"Starting application");
  }

}
