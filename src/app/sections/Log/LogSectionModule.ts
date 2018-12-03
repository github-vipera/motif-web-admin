import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { LogSectionComponent } from './components/log-section-component'
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
    imports: [
        DialogModule, 
        LogServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule
    ],
    entryComponents:[
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
  


