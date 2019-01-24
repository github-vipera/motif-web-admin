import { CommonsUIModule } from './../../../CommonsUIModule';
import { WebAdminCommonServicesModule } from './../../../../services/WebAdminCommonServicesModule';
import { LoggerModule } from 'ngx-logger';
import { NgModule } from '@angular/core';
import { ServiceCatalogSelectorComponent } from './service-catalog-selector-component'
import { TreeTableModule } from 'primeng/treetable';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { ServiceCatalogSelectorDialogComponent } from './service-catalog-selector-dialog';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    imports: [
      TreeTableModule,
      CommonsUIModule,
      LoggerModule,
      WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule,
      WebAdminCommonServicesModule,
      DialogModule
    ],
    entryComponents: [
    ],
    declarations: [
      ServiceCatalogSelectorComponent, ServiceCatalogSelectorDialogComponent
    ],
    exports: [ 
      ServiceCatalogSelectorComponent, ServiceCatalogSelectorDialogComponent
    ],
    providers: [
    ]

  })
  export class ServiceCatalogSelectorModule { }
