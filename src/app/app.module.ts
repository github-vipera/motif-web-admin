import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes } from '@angular/router'
import { WebConsoleComponent, AuthGuard, WebConsoleCoreModule } from 'web-console-core'
import { WebConsoleLoginComponent } from 'web-console-login'
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { environment } from '../environments/environment';
import { WC_API_BASE_PATH, WC_OAUTH_BASE_PATH } from 'web-console-core'
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

// Motif Web Admin Modules
import { ConfigurationSectionModule } from './sections/Configuration/ConfigurationSectionModule'
import { OAuth2SectionModule } from './sections/OAuth2/OAuth2SectionModule';
import { SessionsSectionModule } from './sections/Sessions/SessionsSectionModule'
import { LicenseManagerSectionModule } from './sections/LicenseManagement/LicenseManagerSectionModule'
import { LogSectionModule } from './sections/Log/LogSectionModule'
import { ApplicationContentSectionModule } from './sections/ApplicationContent/ApplicationContentSectionModule'
import { PluginsSectionModule } from './sections/Plugins/PluginsSectionModule'

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: WebConsoleLoginComponent },
  { path: 'dashboard', component: WebConsoleComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent
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
    WebConsoleCoreModule,
    DateInputsModule,
    ConfigurationSectionModule,
    OAuth2SectionModule,
    SessionsSectionModule,
    LicenseManagerSectionModule,
    LogSectionModule,
    ApplicationContentSectionModule,
    PluginsSectionModule
  ],
  providers: [ 
    { provide: WC_API_BASE_PATH, useValue: environment.API_BASE_PATH }, 
    { provide: WC_OAUTH_BASE_PATH, useValue: environment.OAUTH_BAS_PATH },
    WebAdminModulesProvider
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [
  ]
})
export class AppModule { 

  constructor(private logger: NGXLogger){
    this.logger.info("AppModule" ,"Starting application");
  }

}
