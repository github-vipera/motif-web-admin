import { WAThemeDesignerService } from './services/ThemeDesigner/WAThemeDesignerService';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  // ADD enableProdMode(); BEFORE BOOTSTRAP
  enableProdMode();
  window.console.log=function(){};
}

import { WebContentSectionModule } from './sections/WebContent/WebContentSectionModule';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { WebAdminModulesProvider } from './web-admin-modules-provider.module';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router'
import { WebConsoleComponent, AuthGuard, WebConsoleCoreModule } from 'web-console-core'
import { WebConsoleLoginComponent } from 'web-console-login'
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NGXLogger, NgxLoggerLevel, LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { WC_API_BASE_PATH, WC_OAUTH_BASE_PATH } from 'web-console-core'
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CustomRouteReuseStrategy } from './CustomRouteReuseStrategy'

// Motif Web Admin Modules
import { ConfigurationSectionModule } from './sections/Configuration/ConfigurationSectionModule'
import { OAuth2SectionModule } from './sections/OAuth2/OAuth2SectionModule';
import { SessionsSectionModule } from './sections/Sessions/SessionsSectionModule'
import { LicenseManagerSectionModule } from './sections/LicenseManagement/LicenseManagerSectionModule'
import { LogSectionModule } from './sections/Log/LogSectionModule'
import { ApplicationContentSectionModule } from './sections/ApplicationContent/ApplicationContentSectionModule'
import { PluginsSectionModule } from './sections/Plugins/PluginsSectionModule'
import { ServicesSectionModule } from './sections/Services/ServicesSectionModule'
import { AccessControlSectionModule } from './sections/AccessControl/AccessControlSectionModule'
import { UtilitiesSectionModule } from './sections/Utilities/UtilitiesSectionModule';
import { CountersAndThresholdsSectionModule } from './sections/CountersAndThresholds/CountersAndThresholdsSectionModule';
import { TopMenuComponentModule } from './components/TopMenu/TopMenuComponentModule';
import { WAThemeDesignerModule } from './services/ThemeDesigner/WAThemeDesignerModule';
//import { MemoryLeakSectionModule } from './sections/MemoryLeakTest/MemoryLeakSectionModule';



const LoggerModuleConfigured = LoggerModule.forRoot({ 
  level: (environment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG),
  serverLoggingUrl: '/api/logs', 
  serverLogLevel: NgxLoggerLevel.OFF 
});


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
      { enableTracing: false } // <-- debugging purposes only
    ),
    LoggerModuleConfigured,
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
    PluginsSectionModule,
    ServicesSectionModule,
    AccessControlSectionModule,
    LayoutModule,
    UtilitiesSectionModule,
    CountersAndThresholdsSectionModule,
    TopMenuComponentModule,
    WebContentSectionModule,
    WAThemeDesignerModule
    /*,MemoryLeakSectionModule*/
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

  constructor(private logger: NGXLogger, private themeEditorService: WAThemeDesignerService){
    this.logger.info('AppModule' , 'Starting application');
    this.logger.debug('AppModule' , 'Starting application DEBUG message');

    this.themeEditorService.show();
  }

}
