import { ServiceCatalogSelectorModule } from './../../components/UI/selectors/service-catalog-selector/ServiceCatalogSelectorModule';
import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { CountersAndThresholdsSectionComponent } from './components/counters-and-thresholds-section-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { CounterInfosComponent } from './components/counter-infos/counter-infos-component';
import { CountersThresholdsServiceModule } from '@wa-motif-open-api/counters-thresholds-service';

@NgModule({
    imports: [
        CountersThresholdsServiceModule,
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
        CountersAndThresholdsSectionComponent, CounterInfosComponent
    ],
    exports: [ CountersAndThresholdsSectionComponent ],
    providers: [
    ]

})
export class CountersAndThresholdsSectionModule { }



