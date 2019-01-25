import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LicenseManagementServiceModule } from '@wa-motif-open-api/license-management-service';
import { LicenseManagerSectionComponent } from './components/license-manager-section-component';
import { LicenseDetailsComponent } from './components/details/license-details-components';
import { LoggerModule } from 'ngx-logger';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { EditService } from '../../components/Grid/edit.service';
import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { UploadPanelModule } from 'src/app/components/UI/wc-upload-panel-component/UploadPanelModule';

@NgModule({
    imports: [
        LicenseManagementServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule,
        FontAwesomeModule,
        CommonsUIModule,
        UploadPanelModule
    ],
    entryComponents: [
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



