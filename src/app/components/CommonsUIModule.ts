import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { DomainSelectorComboBoxComponent } from './UI/domain-selector-combobox-component'
import { ToasterUtilsService } from './UI/toaster-utils-service'
import { ConfirmationDialogComponent } from './ConfirmationDialog/confirmation-dialog-component'
import { ErrorMessageBuilderService } from './Commons/error-message-builder-service'
import { NotificationCenter } from './Commons/notification-center'
import { NotificationModule } from '@progress/kendo-angular-notification';
import { FileDropPanelComponent } from './UI/file-drop-panel-component'
import { DroppableModule } from '@ctrl/ngx-droppable';
import { AfterValueChangedDirective } from './UI/after-value-change-directive'

@NgModule({
    imports: [
        DialogModule, 
        LogServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        NotificationModule,
        DroppableModule
    ],
    entryComponents:[
        DomainSelectorComboBoxComponent, ConfirmationDialogComponent, FileDropPanelComponent
    ],
    declarations: [
        DomainSelectorComboBoxComponent, ConfirmationDialogComponent, FileDropPanelComponent, AfterValueChangedDirective
    ],
    exports: [ DomainSelectorComboBoxComponent, ConfirmationDialogComponent, FileDropPanelComponent, AfterValueChangedDirective ],
    providers: [ 
        ToasterUtilsService, ErrorMessageBuilderService, NotificationCenter
    ]
    
  })
  export class CommonsUIModule { }
  


