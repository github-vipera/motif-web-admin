import { CommonSelectorsModule } from 'src/app/components/CommonsSelectorsModule';
import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { UtilitiesSectionComponent } from './components/utilities-section-component';
import { OTPUtilityComponent } from './components/tabs/otp/utilities-otp-tab-component';
import { NewOtpDialogComponent } from './components/tabs/otp/dialog/new-otp-dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    imports: [
        SecurityServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule,
        FontAwesomeModule,
        DialogModule,
        CommonSelectorsModule
    ],
    entryComponents: [
        UtilitiesSectionComponent
    ],
    declarations: [
        UtilitiesSectionComponent, OTPUtilityComponent, NewOtpDialogComponent
    ],
    exports: [ UtilitiesSectionComponent ],
    providers: [
    ]

})
export class UtilitiesSectionModule { }



