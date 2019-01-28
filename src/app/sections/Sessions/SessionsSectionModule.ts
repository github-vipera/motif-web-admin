import { CommonSelectorsModule } from 'src/app/components/CommonsSelectorsModule';
import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service';
import { SessionsSectionComponent } from './components/sessions-section-component';
import { LoggerModule } from 'ngx-logger';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule, WCGridModule } from 'web-console-ui-kit';
import { CommonsUIModule } from '../../components/CommonsUIModule';

@NgModule({
    imports: [
        SecurityServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule,
        CommonSelectorsModule,
        WCGridModule
    ],
    entryComponents:[
        SessionsSectionComponent
    ],
    declarations: [
        SessionsSectionComponent
    ],
    exports: [ SessionsSectionComponent ],
    providers: [
    ]

})
export class SessionsSectionModule { }



