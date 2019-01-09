import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { UtilitiesSectionComponent } from './components/utilities-section-component';
import { OTPUtilityComponent } from './components/tabs/otp/utilities-otp-tab-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        SecurityServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule,
        FontAwesomeModule
    ],
    entryComponents: [
        UtilitiesSectionComponent
    ],
    declarations: [
        UtilitiesSectionComponent, OTPUtilityComponent
    ],
    exports: [ UtilitiesSectionComponent ],
    providers: [
    ]

})
export class UtilitiesSectionModule { }



