import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LicenseManagementServiceModule } from '@wa-motif-open-api/license-management-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LicenseManagerSectionComponent } from './components/license-manager-section-component'
import { LicenseDetailsComponent } from './components/details/license-details-components'
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { EditService } from '../../components/Grid/edit.service';
import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonsUIModule } from '../../components/CommonsUIModule'

@NgModule({
    imports: [
        DialogModule, 
        LicenseManagementServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule,
        FontAwesomeModule,
        CommonsUIModule
    ],
    entryComponents:[
        LicenseManagerSectionComponent
    ],
    declarations: [
        LicenseManagerSectionComponent, LicenseDetailsComponent
    ],
    exports: [ LicenseManagerSectionComponent ],
    providers: [ 
        EditService
    ]
    
  })
  export class LicenseManagerSectionModule { }
  


