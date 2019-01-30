import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service';
import { LoggerModule } from 'ngx-logger';
import { WCUIKitCoreModule, WCUIKitDataModule, WCUIKitKendoProviderModule } from 'web-console-ui-kit';
import { WCToasterUtilsService } from './UI/wc-notification-center/wc-toaster-utils-service';
import { ConfirmationDialogComponent } from './ConfirmationDialog/confirmation-dialog-component';
import { WCErrorMessageBuilderService } from './UI/wc-notification-center/wc-error-message-builder-service';
import { WCNotificationCenter } from './UI/wc-notification-center/wc-notification-center';
import { NotificationModule } from '@progress/kendo-angular-notification';
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
        WCUIKitCoreModule,
        WCUIKitDataModule,
        WCUIKitKendoProviderModule,
        NotificationModule,
        FontAwesomeModule,
        LayoutModule
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    declarations: [
        ConfirmationDialogComponent
    ],
    exports: [ 
        ConfirmationDialogComponent
    ],
    providers: [
        WCToasterUtilsService, WCErrorMessageBuilderService, WCNotificationCenter, LocalesService, SessionService
    ]

  })
  export class CommonsUIModule { }



