import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service';
import { LoggerModule } from 'ngx-logger';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { ToasterUtilsService } from './UI/toaster-utils-service';
import { ConfirmationDialogComponent } from './ConfirmationDialog/confirmation-dialog-component';
import { ErrorMessageBuilderService } from './Commons/error-message-builder-service';
import { NotificationCenter } from './Commons/notification-center';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { FileDropPanelComponent } from './UI/file-drop-panel-component';
import { DroppableModule } from '@ctrl/ngx-droppable';
import { AfterValueChangedDirective } from './UI/after-value-change-directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LocalesService } from './Commons/locales-service';
import { SessionService } from './Commons/session-service';

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
        ConfirmationDialogComponent, FileDropPanelComponent
    ],
    declarations: [
        ConfirmationDialogComponent,
        FileDropPanelComponent,
        AfterValueChangedDirective
    ],
    exports: [ 
        ConfirmationDialogComponent,
        FileDropPanelComponent,
        AfterValueChangedDirective
    ],
    providers: [
        ToasterUtilsService, ErrorMessageBuilderService, NotificationCenter, LocalesService, SessionService
    ]

  })
  export class CommonsUIModule { }



