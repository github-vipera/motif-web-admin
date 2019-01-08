import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { UtilitiesSectionComponent } from './components/utilities-section-component';

@NgModule({
    imports: [
        SecurityServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule
    ],
    entryComponents:[
        UtilitiesSectionComponent
    ],
    declarations: [
        UtilitiesSectionComponent
    ],
    exports: [ UtilitiesSectionComponent ],
    providers: [
    ]

})
export class UtilitiesSectionModule { }



