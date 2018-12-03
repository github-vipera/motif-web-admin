import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { AppContentSectionComponent } from './components/appcontent-section-component'
import { ClipboardModule } from 'ngx-clipboard';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
    imports: [
        DialogModule, 
        LogServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule,
        DateInputsModule
    ],
    entryComponents:[
        AppContentSectionComponent
    ],
    declarations: [
        AppContentSectionComponent
    ],
    exports: [ AppContentSectionComponent ],
    providers: [ 
    ]
    
  })
  export class ApplicationContentSectionModule { }
  


