import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { DomainSelectorComboBoxComponent } from './UI/domain-selector-combobox-component';
import { ToasterUtilsService } from './UI/toaster-utils-service';
import { ConfirmationDialogComponent } from './ConfirmationDialog/confirmation-dialog-component';
import { ErrorMessageBuilderService } from './Commons/error-message-builder-service';
import { NotificationCenter } from './Commons/notification-center';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { FileDropPanelComponent } from './UI/file-drop-panel-component';
import { DroppableModule } from '@ctrl/ngx-droppable';
import { AfterValueChangedDirective } from './UI/after-value-change-directive';
import { LoadingOverlayComponent } from './Grid/loading-overlay/loading-overlay-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { DialogModule } from 'primeng/dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LocalesMappingService } from './Commons/locales-mapping-service';

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
        DroppableModule,
        FontAwesomeModule,
        LayoutModule
    ],
    entryComponents: [
        DomainSelectorComboBoxComponent, ConfirmationDialogComponent, FileDropPanelComponent
    ],
    declarations: [
        DomainSelectorComboBoxComponent,
        ConfirmationDialogComponent,
        FileDropPanelComponent,
        AfterValueChangedDirective,
        LoadingOverlayComponent
    ],
    exports: [ DomainSelectorComboBoxComponent,
        ConfirmationDialogComponent,
        FileDropPanelComponent,
        LoadingOverlayComponent,
        AfterValueChangedDirective],
    providers: [
        ToasterUtilsService, ErrorMessageBuilderService, NotificationCenter, LocalesMappingService
    ]

  })
  export class CommonsUIModule { }



