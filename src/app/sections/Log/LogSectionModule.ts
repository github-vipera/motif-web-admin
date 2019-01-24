import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service';
import { LoggerModule } from 'ngx-logger';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { LogSectionComponent } from './components/log-section-component';
import { ClipboardModule } from 'ngx-clipboard';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonsUIModule } from '../../components/CommonsUIModule';

@NgModule({
    imports: [
        LogServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule,
        DateInputsModule,
        FontAwesomeModule,
        CommonsUIModule
    ],
    entryComponents: [
        LogSectionComponent
    ],
    declarations: [
        LogSectionComponent
    ],
    exports: [ LogSectionComponent ],
    providers: [
    ]

})
export class LogSectionModule { }



