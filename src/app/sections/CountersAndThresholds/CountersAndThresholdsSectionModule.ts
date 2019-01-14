import { ServiceCatalogSelectorModule } from './../../components/UI/selectors/service-catalog-selector/ServiceCatalogSelectorModule';
import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { CountersAndThresholdsSectionComponent } from './components/counters-and-thresholds-section-component';
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
        ServiceCatalogSelectorModule
    ],
    entryComponents: [
        CountersAndThresholdsSectionComponent
    ],
    declarations: [
        CountersAndThresholdsSectionComponent
    ],
    exports: [ CountersAndThresholdsSectionComponent ],
    providers: [
    ]

})
export class CountersAndThresholdsSectionModule { }



