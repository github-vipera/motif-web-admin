import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { AuthAccessControlServiceModule } from '@wa-motif-open-api/auth-access-control-service'
import { AccessControlSectionComponent } from './components/access-control-section.component'
import { PlatformServiceModule } from '@wa-motif-open-api/platform-service'
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { GridContextMenuComponent } from './components/grid-context-menu.component';
import { UsersListComponent } from './components/users-list/users-list.component';

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
        AccessControlSectionComponent, GridContextMenuComponent, UsersListComponent
    ],
    exports: [ AccessControlSectionComponent ],
    providers: [ 
    ]
  })
  export class AccessControlSectionModule { }
  


