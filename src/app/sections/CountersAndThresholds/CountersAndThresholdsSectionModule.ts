import { CounterInfoEditDialogComponent } from './components/dialogs/counter-info-edit-dialog-component/counter-info-edit-dialog-component';
import { ThresholdDetailsComponent } from './components/thresholds/details/threshold-details-component';
import { ThresholdsComponent } from './components/thresholds/thresholds-component';
import { GridEditorCommandsGroupModule } from './../../components/GridEditorCommandsGroupModule';
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
import { CounterInfoDetailsComponent } from './components/counter-infos/details/counter-info-details-component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
    imports: [
        CountersThresholdsServiceModule,
        InputSwitchModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule,
        FontAwesomeModule,
        DialogModule,
        ServiceCatalogSelectorModule,
        GridEditorCommandsGroupModule
    ],
    entryComponents: [
        CountersAndThresholdsSectionComponent
    ],
    declarations: [
        CountersAndThresholdsSectionComponent, 
        CounterInfosComponent, 
        CounterInfoDetailsComponent, 
        ThresholdDetailsComponent,
        CounterInfoEditDialogComponent,
        ThresholdsComponent
    ],
    exports: [ CountersAndThresholdsSectionComponent ],
    providers: [
    ]

})
export class CountersAndThresholdsSectionModule { }



