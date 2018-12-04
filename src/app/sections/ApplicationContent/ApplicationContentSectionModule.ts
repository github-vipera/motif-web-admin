import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { AppContentSectionComponent } from './components/appcontent-section-component'
import { ClipboardModule } from 'ngx-clipboard';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ApplicationsTabComponent } from './components/tabs/applications/applications-appcontent-tab-component'
import { AssetsTabComponent } from './components/tabs/assets/assets-appcontent-tab-component'
import { AppContentServiceModule } from '@wa-motif-open-api/app-content-service'

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
        DateInputsModule,
        AppContentServiceModule
    ],
    entryComponents:[
        AppContentSectionComponent,ApplicationsTabComponent,AssetsTabComponent
    ],
    declarations: [
        AppContentSectionComponent,ApplicationsTabComponent,AssetsTabComponent
    ],
    exports: [ AppContentSectionComponent,ApplicationsTabComponent,AssetsTabComponent ],
    providers: [ 
    ]
    
  })
  export class ApplicationContentSectionModule { }
  


