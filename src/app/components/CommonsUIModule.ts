import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { DomainSelectorComboBoxComponent } from './UI/domain-selector-combobox-component'
import { ToasterUtilsService } from './UI/toaster-utils-service'
import { ConfirmationDialogComponent } from './ConfirmationDialog/confirmation-dialog-component'

@NgModule({
    imports: [
        DialogModule, 
        LogServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule
    ],
    entryComponents:[
        DomainSelectorComboBoxComponent, ConfirmationDialogComponent
    ],
    declarations: [
        DomainSelectorComboBoxComponent, ConfirmationDialogComponent
    ],
    exports: [ DomainSelectorComboBoxComponent, ConfirmationDialogComponent ],
    providers: [ 
        ToasterUtilsService
    ]
    
  })
  export class CommonsUIModule { }
  

