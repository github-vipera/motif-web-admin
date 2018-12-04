import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { DomainSelectorComboBoxComponent } from './UI/domain-selector-combobox-component'

@NgModule({
    imports: [
        DialogModule, 
        LogServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule
    ],
    entryComponents:[
        DomainSelectorComboBoxComponent
    ],
    declarations: [
        DomainSelectorComboBoxComponent
    ],
    exports: [ DomainSelectorComboBoxComponent ],
    providers: [ 
    ]
    
  })
  export class CommonsUIModule { }
  


