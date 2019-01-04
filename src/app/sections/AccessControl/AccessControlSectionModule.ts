import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { AuthAccessControlServiceModule } from '@wa-motif-open-api/auth-access-control-service'
import { AccessControlSectionComponent } from './components/access-control-section.component'
import { PlatformServiceModule } from '@wa-motif-open-api/platform-service'
import { CommonsUIModule } from '../../components/CommonsUIModule'

@NgModule({
    imports: [
        AuthAccessControlServiceModule, 
        PlatformServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule
    ],
    entryComponents:[
        AccessControlSectionComponent
    ],
    declarations: [
        AccessControlSectionComponent
    ],
    exports: [ AccessControlSectionComponent ],
    providers: [ 
    ]
  })
  export class AccessControlSectionModule { }
  


